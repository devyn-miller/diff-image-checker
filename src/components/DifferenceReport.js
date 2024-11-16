// components/DifferenceReport.js
import React, { useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';

export default function DifferenceReport({ diffData }) {
  const heatmapCanvasRef = useRef(null);

  useEffect(() => {
    if (diffData && heatmapCanvasRef.current) {
      const canvas = heatmapCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const width = diffData.width;
      const height = diffData.height;
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Create ImageData with correct dimensions
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
      <button
        onClick={handleDownloadReport}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Download Report
      </button>
    </div>
  );
}