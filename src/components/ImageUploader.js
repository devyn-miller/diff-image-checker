// components/ImageUploader.js
import React from 'react';

export default function ImageUploader({ setImage1, setImage2 }) {
  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8 mb-4">
      <div>
        <h2 className="text-xl mb-2">Image 1:</h2>
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={(e) => handleImageUpload(e, setImage1)}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <h2 className="text-xl mb-2">Image 2:</h2>
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={(e) => handleImageUpload(e, setImage2)}
          className="border p-2 w-full"
        />
      </div>
    </div>
  );
}