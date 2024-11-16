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
        <h1 className="text-3xl font-bold">Image Comparison Tool</h1>
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
      <main className="flex-grow container mx-auto p-4">
        <ImageUploader setImage1={setImage1} setImage2={setImage2} />
        {isLoading && <p className="text-center">Loading...</p>}
        {image1 && image2 && (
          <ImageComparison 
            image1={image1} 
            image2={image2} 
            setDiffData={setDiffData} 
            setIsLoading={setIsLoading} 
          />
        )}
        {diffData && <DifferenceReport diffData={diffData} />}
      </main>
      <footer className="mt-12 py-8 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h3 className="text-xl font-semibold text-gray-800">Created by Devyn Miller</h3>
            <p className="text-gray-600">Thank you for your support!</p>
            <div className="flex space-x-6">
              <a 
                href="https://www.linkedin.com/in/devyn-c-miller/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://devyn-miller.github.io/profile-/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="Portfolio Website"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Devyn Miller. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}