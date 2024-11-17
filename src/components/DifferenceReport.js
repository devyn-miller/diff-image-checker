import React, { useRef, useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export default function DifferenceReport({ diffData, setSensitivity }) {
  const heatmapCanvasRef = useRef(null);
  const [currentSensitivity, setCurrentSensitivity] = useState(0.5);
  const [showLogic, setShowLogic] = useState(false);

  useEffect(() => {
    if (diffData && heatmapCanvasRef.current) {
      const canvas = heatmapCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const width = diffData.width;
      const height = diffData.height;
      
      canvas.width = width;
      canvas.height = height;
      
      const imageData = new ImageData(diffData.heatmapData, width, height);
      ctx.putImageData(imageData, 0, 0);
    }
  }, [diffData]);

  const handleDownloadReport = () => {
    const reportContent = generateReportContent();
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'image_comparison_report.txt');
  };

  const handleCopyReport = () => {
    const reportContent = generateReportContent();
    navigator.clipboard.writeText(reportContent).then(() => {
      alert('Report copied to clipboard!');
    });
  };

  const generateReportContent = () => {
    return `
      Image Comparison Report
      -----------------------
      Similarity: ${diffData.similarityPercentage}%
      Total Pixels: ${diffData.totalPixels}
      Similar Pixels: ${diffData.similarPixels}
      Different Pixels: ${diffData.totalPixels - diffData.similarPixels}
      Sensitivity Level: ${currentSensitivity}
      
      -----------------------
      Created with DiffPixel
      © Devyn Miller 2024
    `;
  };

  const updateSensitivity = (newSensitivity) => {
    setCurrentSensitivity(newSensitivity);
    setSensitivity(newSensitivity);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Difference Overlay</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Metrics</h3>
            <p>Similarity: {diffData.similarityPercentage}%</p>
            <p>Total Pixels: {diffData.totalPixels}</p>
            <p>Similar Pixels: {diffData.similarPixels}</p>
            <p>Different Pixels: {diffData.totalPixels - diffData.similarPixels}</p>
            <div>
              <h3 className="text-lg font-semibold mb-2">Sensitivity Adjustment</h3>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={currentSensitivity}
                onChange={(e) => updateSensitivity(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-sm">Sensitivity: {currentSensitivity}</p>
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="flex justify-center">
              <div className="relative w-full">
                <TransformWrapper initialScale={1} minScale={0.5} maxScale={4}>
                  <TransformComponent>
                    <canvas ref={heatmapCanvasRef} className="border w-full" />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownloadReport}
        className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700"
      >
        Download Report
      </button>

      <button
        onClick={handleCopyReport}
        className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700"
      >
        Copy Report
      </button>

      <button
        onClick={() => setShowLogic(!showLogic)}
        className="text-blue-500 underline"
      >
        {showLogic ? 'Hide Similarity Calculation Logic' : 'Click to Show Similarity Calculation Logic'}
      </button>

      {showLogic && (
        <div className="bg-gray-100 p-4 rounded w-3/4">
          <h3 className="text-lg font-semibold mb-2">Similarity Calculation Logic</h3>
          <p>
            The similarity percentage is calculated using a formula that adjusts for the differences between the two images based on a sensitivity parameter.
          </p>
          <h4 className="font-bold">Final Similarity</h4>
          <p>Final Similarity = (Base Similarity × (1 - Sensitivity)) × 100</p>
          
          <h4 className="font-bold">Base Similarity</h4>
          <p>Base Similarity = (Total Adjusted Similarity Score / Total Pixels)</p>
          
          <p>For each pixel pair, the adjusted similarity score is calculated as:</p>
          <h4 className="font-bold">Adjusted Similarity Score</h4>
          <p>Adjusted Similarity Score = (1 - (Color Difference / Max Color Difference)) × (1 - Sensitivity)</p>
          
          <h4 className="font-bold">Threshold for Similar Pixels</h4>
          <p>Pixel is Similar if: Adjusted Similarity Score ≥ (0.5 - Sensitivity)</p>
          
          <h4 className="font-bold">Definitions</h4>
          <ul className="list-disc list-inside">
            <li><strong>Color Difference:</strong> The Euclidean distance between RGB values: 
              <br />
              <code>√((R₁ - R₂)² + (G₁ - G₂)² + (B₁ - B₂)²)</code>
            </li>
            <li><strong>Max Color Difference:</strong> The maximum possible distance between two colors in RGB space, approximately 441.67.</li>
            <li><strong>Sensitivity:</strong> Adjusts the threshold for determining similar pixels. A higher sensitivity means more pixels are likely to be considered different.</li>
          </ul>
          
          <p>
            The similarity score indicates how closely the two images match. When you swap the images, the calculation remains the same, but the context of which image is treated as the background and which as the foreground changes, potentially affecting the similarity score.
          </p>
        </div>
      )}
    </div>
  );
}
