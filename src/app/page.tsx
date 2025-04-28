'use client';

import React, { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getCroppedImg } from './utils/cropImage'; // You'll need to implement this

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const selectImage = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        source: CameraSource.Photos,
        resultType: CameraResultType.DataUrl,
      });
      setImageSrc(image.dataUrl || null);
      setCroppedImage(null); // Reset cropped image when selecting new one
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  }, [imageSrc, croppedAreaPixels]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Crop Image Example</h1>

      {!imageSrc ? (
        <button
          style={{ padding: '10px 20px', marginTop: 20 }}
          onClick={selectImage}
        >
          Select Image
        </button>
      ) : (
        <>
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '400px',
            background: '#333'
          }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          
          <div style={{ marginTop: 20 }}>
            <button onClick={showCroppedImage} style={{ marginRight: 10 }}>
              Crop Image
            </button>
            <button onClick={selectImage}>
              Select Different Image
            </button>
          </div>
          
          {croppedImage && (
            <div style={{ marginTop: 20 }}>
              <h2>Cropped Result</h2>
              <img 
                src={croppedImage} 
                alt="Cropped" 
                style={{ maxWidth: '100%', maxHeight: 300 }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}