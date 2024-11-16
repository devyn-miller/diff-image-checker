// src/components/HeatmapLegend.js
import React from 'react';

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

export default HeatmapLegend;