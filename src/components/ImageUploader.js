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
    } else {
      alert('Please upload a PNG or JPEG image.');
    }
  };

  return (
    <div className="flex space-x-4 mb-4">
      <div>
        <label className="block mb-2">Image 1:</label>
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={(e) => handleImageUpload(e, setImage1)}
          className="border p-2"
        />
      </div>
      <div>
        <label className="block mb-2">Image 2:</label>
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={(e) => handleImageUpload(e, setImage2)}
          className="border p-2"
        />
      </div>
    </div>
  );
}