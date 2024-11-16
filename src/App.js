// App.js
import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageComparison from './components/ImageComparison';
import DifferenceReport from './components/DifferenceReport';

export default function App() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [diffData, setDiffData] = useState(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Image Comparison Tool</h1>
      <ImageUploader setImage1={setImage1} setImage2={setImage2} />
      {image1 && image2 && (
        <ImageComparison image1={image1} image2={image2} setDiffData={setDiffData} />
      )}
      {diffData && <DifferenceReport diffData={diffData} />}
    </div>
  );
}