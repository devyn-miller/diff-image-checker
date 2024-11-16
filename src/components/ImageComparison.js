// components/ImageComparison.js
import React, { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export default function ImageComparison({ image1, image2, setDiffData }) {
  const canvasRef = useRef(null);
  const [similarity, setSimilarity] = useState(null);
  const [warning, setWarning] = useState('');

  useEffect(() => {
    const compareImages = async () => {
      const img1 = await loadImage(image1);
      const img2 = await loadImage(image2);

      let width = Math.min(img1.width, img2.width);
      let height = Math.min(img1.height, img2.height);

      if (img1.width !== img2.width || img1.height !== img2.height) {
        setWarning('Images have different dimensions. The larger image has been resized to match the smaller one.');
      }

      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img1, 0, 0, width, height);
      const imageData1 = ctx.getImageData(0, 0, width, height);

      ctx.drawImage(img2, 0, 0, width, height);
      const imageData2 = ctx.getImageData(0, 0, width, height);

      const { diffImageData, similarPixels, heatmapData } = compareImageData(imageData1, imageData2);

      ctx.putImageData(diffImageData, 0, 0);

      const totalPixels = width * height;
      const similarityPercentage = (similarPixels / totalPixels) * 100;
      setSimilarity(similarityPercentage.toFixed(2));

      setDiffData({ 
        diffImageUrl: canvas.toDataURL(),
        heatmapData,
        similarityPercentage: similarityPercentage.toFixed(2),
        totalPixels,
        similarPixels,
        width,
        height
      });
    };

    if (image1 && image2) {
      compareImages();
    }
  }, [image1, image2, setDiffData]);

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  };

  const compareImageData = (imageData1, imageData2) => {
    const width = imageData1.width;
    const height = imageData1.height;

    const diffImageData = new ImageData(new Uint8ClampedArray(width * height * 4), width, height);
    const heatmapDataArray = new Uint8ClampedArray(width * height * 4);
    let similarPixels = 0;
    const similarityThreshold = 50; // Adjust this threshold as needed

    for (let i = 0; i < imageData1.data.length; i += 4) {
      const r1 = imageData1.data[i];
      const g1 = imageData1.data[i + 1];
      const b1 = imageData1.data[i + 2];
      const r2 = imageData2.data[i];
      const g2 = imageData2.data[i + 1];
      const b2 = imageData2.data[i + 2];

      const colorDiff = Math.sqrt(
        Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
      );

      const pixelSimilarity = Math.max(0, 100 - (colorDiff / Math.sqrt(3) * 100));

      if (pixelSimilarity >= similarityThreshold) {
        similarPixels++;
        diffImageData.data[i] = r1;
        diffImageData.data[i + 1] = g1;
        diffImageData.data[i + 2] = b1;
        diffImageData.data[i + 3] = 255; // Fully opaque
        heatmapDataArray[i] = 0; // Green for similar pixels
        heatmapDataArray[i + 1] = 255; // Green
        heatmapDataArray[i + 2] = 0; // Green
        heatmapDataArray[i + 3] = 255; // Fully opaque
      } else {
        diffImageData.data[i] = 255; // Red for different pixels
        diffImageData.data[i + 1] = 0;
        diffImageData.data[i + 2] = 0;
        diffImageData.data[i + 3] = 128; // Semi-transparent
        const heatValue = Math.min(255, colorDiff);
        heatmapDataArray[i] = heatValue; // Blue for different pixels
        heatmapDataArray[i + 1] = 0; // No green
        heatmapDataArray[i + 2] = 255 - heatValue; // Blue gradient
        heatmapDataArray[i + 3] = 255; // Fully opaque
      }
    }

    return { 
      diffImageData, 
      similarPixels, 
      heatmapData: heatmapDataArray 
    };
  };

  const HeatmapLegend = () => {
    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Heatmap Legend</h3>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 border border-black mr-2"></div>
            <span>Similar Pixels</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 border border-black mr-2"></div>
            <span>Different Pixels</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 border border-black mr-2"></div>
            <span>Significantly Different Pixels</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Image Comparison</h2>
      {warning && <p className="text-yellow-600 mb-2">{warning}</p>}
      <div className="flex space-x-4 mb-4">
        <TransformWrapper>
          <TransformComponent>
            <img src={image1} alt="Image 1" className="max-w-md" />
          </TransformComponent>
        </TransformWrapper>
        <TransformWrapper>
          <TransformComponent>
            <img src={image2} alt="Image 2" className="max-w-md" />
          </TransformComponent>
        </TransformWrapper>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Difference Overlay</h3>
        <TransformWrapper>
          <TransformComponent>
            <canvas ref={canvasRef} className="border" />
          </TransformComponent>
        </TransformWrapper>
      </div>
      {similarity !== null && (
        <p className="text-lg">Similarity: {similarity}%</p>
      )}
      <HeatmapLegend />
    </div>
  );
}