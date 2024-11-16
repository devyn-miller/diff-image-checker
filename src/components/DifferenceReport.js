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
            The similarity percentage is calculated using the following formula:
          </p>
          <p className="font-bold">
            Similarity Percentage = (Total Similarity Score / Total Pixels) * 100
          </p>
          <p>
            Each pixel pair is assigned a similarity score between 0 and 1 based on the sensitivity setting:
          </p>
          <p className="font-bold">
            Similarity Score = 1 - (Color Difference / Maximum Color Difference)
          </p>
          <p>
            The threshold for determining similar pixels is adjusted by the sensitivity:
          </p>
          <p className="font-bold">
            If Similarity Score >= (0.5 - Sensitivity)
          </p>
          <p>Where:</p>
          <ul className="list-disc list-inside">
            <li><strong>Color Difference:</strong> Calculated using the Euclidean distance between the RGB values of the two pixels.</li>
            <li><strong>Maximum Color Difference:</strong> The maximum possible distance between two colors in RGB space, approximately 441.67.</li>
            <li><strong>Sensitivity:</strong> Adjusts the threshold for determining similar pixels. Higher sensitivity means more pixels are more likely to be considered different.</li>
          </ul>
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
