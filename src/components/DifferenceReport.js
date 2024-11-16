import React, { useRef, useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import HeatmapLegend from './HeatmapLegend';

export default function DifferenceReport({ diffData, setSensitivity }) {
  const heatmapCanvasRef = useRef(null);
  const [showLogic, setShowLogic] = useState(false);
  const [currentSensitivity, setCurrentSensitivity] = useState(0); // Default sensitivity set to 0

  useEffect(() => {
    if (diffData && heatmapCanvasRef.current) {
      const canvas = heatmapCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const width = diffData.width;
      const height = diffData.height;
      
      canvas.width = width;
      canvas.height = height;
      
      const imageData = new ImageData(
        diffData.heatmapData,
        width,
        height
      );
      
      ctx.putImageData(imageData, 0, 0);
    }
  }, [diffData]);

  const handleDownloadReport = () => {
    const reportContent = `
      Image Comparison Report
      -----------------------
      Similarity: ${diffData.similarityPercentage}%
      Total Pixels: ${diffData.totalPixels}
      Similar Pixels: ${diffData.similarPixels}
      Different Pixels: ${diffData.totalPixels - diffData.similarPixels}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'image_comparison_report.txt');
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Difference Report</h2>
      <p>Similarity: {diffData.similarityPercentage}%</p>
      <p>Total Pixels: {diffData.totalPixels}</p>
      <p>Similar Pixels: {diffData.similarPixels}</p>
      <p>Different Pixels: {diffData.totalPixels - diffData.similarPixels}</p>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Color Difference Heatmap</h3>
        <canvas ref={heatmapCanvasRef} className="border" />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Sensitivity Adjustment</h3>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={currentSensitivity}
          onChange={(e) => {
            const newSensitivity = parseFloat(e.target.value); // Convert to float
            setCurrentSensitivity(newSensitivity);
            setSensitivity(newSensitivity); // Update sensitivity in parent
          }}
          className="w-full"
        />
        <p className="text-sm">Sensitivity: {currentSensitivity}</p>
      </div>

      <span
        onClick={() => setShowLogic(!showLogic)}
        className="text-blue-500 cursor-pointer underline mb-4"
      >
        {showLogic ? 'Hide Similarity Calculation Logic' : 'Click to Show Similarity Calculation Logic'}
      </span>
      
      {showLogic && (
        <div className="bg-gray-100 p-4 rounded shadow-md mb-4">
          <h3 className="text-lg font-semibold mb-2">Similarity Calculation Logic</h3>
          <p>
            The similarity percentage is calculated using a formula that adjusts for the differences between the two images based on a sensitivity parameter.
          </p>
          <p className="font-bold">
            Final Similarity = (Base Similarity × (1 - Sensitivity)) × 100
          </p>
          <p>Where Base Similarity is calculated as:</p>
          <p className="font-bold">
            Base Similarity = (Total Adjusted Similarity Score / Total Pixels)
          </p>
          <p>
            For each pixel pair, the adjusted similarity score is calculated as:
          </p>
          <p className="font-bold">
            Adjusted Similarity Score = (1 - (Color Difference / Max Color Difference)) × (1 - Sensitivity)
          </p>
          <p>
            The threshold for determining similar pixels uses the sensitivity:
          </p>
          <p className="font-bold">
            Pixel is Similar if: Adjusted Similarity Score ≥ (0.5 - Sensitivity)
          </p>
          <p>Where:</p>
          <ul className="list-disc list-inside">
            <li><strong>Color Difference:</strong> The Euclidean distance between RGB values: √((R₁-R₂)² + (G₁-G₂)² + (B₁-B₂)²)</li>
            <li><strong>Max Color Difference:</strong> The maximum possible distance between two colors in RGB space, approximately 441.67.</li>
            <li><strong>Sensitivity:</strong> Adjusts the threshold for determining similar pixels. A higher sensitivity means more pixels are likely to be considered different.</li>
          </ul>
          <p>
            The similarity score indicates how closely the two images match. When you swap the images, the calculation remains the same, but the context of which image is treated as the background and which as the foreground changes, potentially affecting the similarity score.
          </p>
        </div>
      )}
      
      <div className="mt-4">
        <button
          onClick={handleDownloadReport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download Report
        </button>
      </div>
    </div>
  );
}
