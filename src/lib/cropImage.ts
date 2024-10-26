export default function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // Draw the image on the canvas
      ctx!.drawImage(
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

      // Now, create a Blob from the canvas
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], "cropped-image.png", { type: "image/png" }));
        } else {
          reject(new Error("Failed to create cropped image blob"));
        }
      }, "image/png");
    };

    image.onerror = () => {
      reject(new Error("Failed to load the image"));
    };
  });
}
