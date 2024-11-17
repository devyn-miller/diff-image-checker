// App.js
import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageComparison from './components/ImageComparison';
import DifferenceReport from './components/DifferenceReport';

export default function App() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [diffData, setDiffData] = useState(null);
  const [sensitivity, setSensitivity] = useState(0.5);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLogic, setShowLogic] = useState(false);

  return (
    <div className="flex flex-col min-h-screen items-center bg-gray-50">
      <header className="bg-blue-600 text-white p-4 text-center w-full">
        <h1 className="text-3xl font-bold">DiffPixel</h1>
        <button 
          onClick={() => setShowInstructions(!showInstructions)} 
          className="text-white underline mt-2"
        >
          Show Instructions
        </button>
      </header>

      {showInstructions && (
        <div className="bg-gray-100 p-4 m-4 rounded w-3/4">
          <h2 className="text-lg font-semibold">How to Use the Web App</h2>
          <ol className="list-decimal list-inside">
            <li>Upload your images (PNG or JPEG)</li>
            <li>Adjust sensitivity as needed</li>
            <li>Download the comparison report</li>
          </ol>
        </div>
      )}

      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl p-4">
        <ImageUploader setImage1={setImage1} setImage2={setImage2} />

        {image1 && image2 && (
          <>
            <ImageComparison 
              image1={image1} 
              image2={image2} 
              setDiffData={setDiffData} 
              sensitivity={sensitivity} 
            />
            {diffData && (
              <DifferenceReport 
                diffData={diffData} 
                setSensitivity={setSensitivity} 
              />
            )}
          </>
        )}



      </main>
    </div>
  );
}