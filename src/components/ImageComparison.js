// components/ImageComparison.js
import React, { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import HeatmapLegend from './HeatmapLegend';

export default function ImageComparison({ image1, image2, setDiffData, sensitivity }) {
  const canvasRef = useRef(null);
  const [similarity, setSimilarity] = useState(null);
  const [warning, setWarning] = useState('');
  const [isSwapped, setIsSwapped] = useState(false);

  useEffect(() => {
    const compareImages = async () => {
      const img1 = await loadImage(isSwapped ? image2 : image1);
      const img2 = await loadImage(isSwapped ? image1 : image2);

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

      const { diffImageData, similarPixels, heatmapData, similarityPercentage } = compareImageData(imageData1, imageData2, sensitivity);

      ctx.putImageData(diffImageData, 0, 0);
      setSimilarity(similarityPercentage);

      setDiffData({ 
        diffImageUrl: canvas.toDataURL(),
        heatmapData,
        similarityPercentage,
        totalPixels: width * height,
        similarPixels,
        width,
        height
      });
    };

    if (image1 && image2) {
      compareImages();
    }
  }, [image1, image2, sensitivity, setDiffData, isSwapped]);

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  };

  const compareImageData = (imageData1, imageData2, sensitivity) => {
    const width = imageData1.width;
    const height = imageData1.height;
    const diffImageData = new ImageData(new Uint8ClampedArray(width * height * 4), width, height);
    const heatmapDataArray = new Uint8ClampedArray(width * height * 4);
    let similarPixels = 0;
    let totalAdjustedSimilarityScore = 0;

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

      const maxColorDiff = Math.sqrt(3 * Math.pow(255, 2));
      const baseSimilarityScore = 1 - (colorDiff / maxColorDiff);
      const adjustedSimilarityScore = baseSimilarityScore * (1 - sensitivity);

      const threshold = 0.5 - sensitivity;

      if (adjustedSimilarityScore >= threshold) {
        similarPixels++;
        diffImageData.data[i] = r1;
        diffImageData.data[i + 1] = g1;
        diffImageData.data[i + 2] = b1;
        diffImageData.data[i + 3] = 255;

        const greenIntensity = Math.floor(255 * (adjustedSimilarityScore - threshold) / (1 - threshold));
        const redIntensity = Math.floor(255 * (1 - adjustedSimilarityScore));
        heatmapDataArray[i] = redIntensity;
        heatmapDataArray[i + 1] = greenIntensity;
        heatmapDataArray[i + 2] = 0;
        heatmapDataArray[i + 3] = 255;
      } else {
        diffImageData.data[i] = 255;
        diffImageData.data[i + 1] = 0;
        diffImageData.data[i + 2] = 0;
        diffImageData.data[i + 3] = 128;

        heatmapDataArray[i] = 255;
        heatmapDataArray[i + 1] = 0;
        heatmapDataArray[i + 2] = 0;
        heatmapDataArray[i + 3] = 255;
      }
      totalAdjustedSimilarityScore += adjustedSimilarityScore;
    }

    const similarityPercentage = (totalAdjustedSimilarityScore / (width * height)) * 100;

    return {
      diffImageData,
      similarPixels,
      heatmapData: heatmapDataArray,
      similarityPercentage: similarityPercentage >= 100 ? 100 : similarityPercentage.toFixed(2)
    };
  };

  const handleSwapImages = () => {
    setIsSwapped(!isSwapped);
  };

  return (
    <div className="relative mb-4">
      <h2 className="text-xl font-bold mb-2">Image Comparison</h2>
      {warning && <p className="text-yellow-600 mb-2">{warning}</p>}
      {image1 && image2 ? (
        <div className="flex space-x-4 mb-4">
          <div className="relative">
            <TransformWrapper minScale={1} maxScale={3}>
              <TransformComponent>
                <img src={isSwapped ? image2 : image1} alt="Image 1" className="max-w-xs" />
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div className="relative">
            <TransformWrapper minScale={1} maxScale={3}>
              <TransformComponent>
                <img src={isSwapped ? image1 : image2} alt="Image 2" className="max-w-xs" />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Please upload both images to compare.</p>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Difference Overlay</h3>
        <div className="relative">
          <TransformWrapper initialScale={1} minScale={0.5} maxScale={4} doubleClick={{ disabled: true }}>
            <TransformComponent>
              <canvas ref={canvasRef} className="border" />
            </TransformComponent>
          </TransformWrapper>
        </div>
      </div>
      {similarity !== null && (
        <p className="text-lg">Similarity: {similarity}%</p>
      )}
      <HeatmapLegend />
    </div>
  );
}