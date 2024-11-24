"use client";

import React, { useRef } from "react";
import Cropper from "react-easy-crop"; // Ensure you have the right cropper package
import getCroppedImg from "@/lib/cropImage";
import { Button } from "@/components/ui/button"; // Import your ShadCN Button component

interface ImageCropperProps {
  file: File;
  aspectRatio: number;
  onClose: () => void;
  onSubmit: (croppedImage: File) => void; // Pass cropped image back to the parent
}

const ImageCropper: React.FC<ImageCropperProps> = ({ file, aspectRatio, onClose, onSubmit }) => {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<any>(null);
  const [image, setImage] = React.useState<string | null>(null);

  // Load the image from file
  React.useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSubmit = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image!, croppedAreaPixels); // Implement this function to get the cropped image
      onSubmit(croppedImage); // Call the submit function passed from the parent
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md">
        {image && (
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        )}
        <div className="fixed bottom-24 right-40 left-40 flex gap-4 items-center justify-center space-x-2 mt-6">
          <Button variant="default" className="bg-red-300 px-6 py-2 text-lg hover:bg-gray-300" onClick={onClose}> {/* Cancel button */}
            Cancel
          </Button>
          <Button variant="default" className="bg-green-300 px-6 py-2 text-lg hover:bg-gray-300" onClick={handleSubmit}> {/* Save button */}
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
