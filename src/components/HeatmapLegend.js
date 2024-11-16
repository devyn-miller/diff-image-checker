// src/components/HeatmapLegend.js
import React from 'react';

const HeatmapLegend = () => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Heatmap Legend</h3>
      <div className="flex items-center mb-2">
        <div className="w-32 h-4 border border-black mr-2" style={{
          background: 'linear-gradient(to right, green, yellow, red)',
        }}></div>
        <span>Color Gradient</span>
      </div>
      <div className="flex space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 border border-black mr-2"></div>
          <span>Similar Pixels</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 border border-black mr-2"></div>
          <span>Moderately Different Pixels</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 border border-black mr-2"></div>
          <span>Significantly Different Pixels</span>
        </div>
      </div>
    </div>
  );
};

export default HeatmapLegend;