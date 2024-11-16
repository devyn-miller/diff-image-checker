// App.js
import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageComparison from './components/ImageComparison';
import DifferenceReport from './components/DifferenceReport';

export default function App() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [diffData, setDiffData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-3xl font-bold">DiffPixel</h1>
        <button 
          onClick={toggleInstructions} 
          className="mt-2 text-sm underline"
        >
          {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
        </button>
      </header>
      {showInstructions && (
        <div className="bg-gray-100 p-4 rounded shadow-md mx-4 my-2">
          <h2 className="text-lg font-semibold">How to Use the Web App</h2>
          <ol className="list-decimal list-inside">
            <li>Click on the "Image 1" and "Image 2" buttons to upload your images (PNG or JPEG).</li>
            <li>Once both images are uploaded, the comparison will automatically start.</li>
            <li>View the similarity percentage and the difference overlay between the two images.</li>
            <li>You can download the comparison report by clicking the "Download Report" button.</li>
          </ol>
          <p className="mt-2 text-sm text-gray-600">Note: Ensure that the images are of similar dimensions for accurate comparison.</p>
        </div>
      )}
      <main className="flex-grow flex flex-col items-center justify-center">
        <ImageUploader setImage1={setImage1} setImage2={setImage2} />
        <ImageComparison image1={image1} image2={image2} setDiffData={setDiffData} />
        {diffData && <DifferenceReport diffData={diffData} />}
      </main>
      <footer className="bg-blue-600 text-white p-4 text-center">
        <p>&copy; {new Date().getFullYear()} DiffPixel. All rights reserved.</p>
      </footer>
    </div>
  );
}