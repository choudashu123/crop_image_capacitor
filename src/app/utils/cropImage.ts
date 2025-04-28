import { Area } from 'react-easy-crop';
export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area
  ): Promise<string> {
    const image = new Image();
    image.src = imageSrc;
  
    await new Promise((resolve) => {
      image.onload = resolve;
    });
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
  
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
  
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
  
    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg', 0.9);
    });
  }