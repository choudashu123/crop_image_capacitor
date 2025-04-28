'use client';

import React, { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getCroppedImg } from './utils/cropImage';
import { Button } from '../components/ui/button'; // assuming you installed shadcn correctly

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
      setCroppedImage(null);
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        if ((error as any).code === 'E_USER_CANCELED') {
          console.log("User canceled photo selection");
          return;
        }
      }
      console.error('Error picking image:', error);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;

      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  }, [imageSrc, croppedAreaPixels]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 space-y-6">
      <h1 className="text-3xl font-bold">Crop Image</h1>

      {!imageSrc ? (
        <Button onClick={selectImage}>
          Select Image
        </Button>
      ) : (
        <div className="flex flex-col items-center space-y-6 w-full max-w-2xl">
          <div className="relative w-full h-[400px] bg-muted rounded-md overflow-hidden">
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

          <div className="flex gap-4">
            <Button onClick={showCroppedImage}>
              Crop Image
            </Button>
            <Button variant="outline" onClick={selectImage}>
              Select Different Image
            </Button>
          </div>

          {croppedImage && (
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-2xl font-semibold">Cropped Result</h2>
              <img
                src={croppedImage}
                alt="Cropped"
                className="max-w-full max-h-72 rounded-md border"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
