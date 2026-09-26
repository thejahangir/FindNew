import React, { useState, useEffect, useRef, useCallback } from 'react';

const getCurrencySymbol = (curr) => {
  if (!curr) return '₹';
  const c = String(curr).trim().toUpperCase();
  if (c === 'INR' || c === 'RS' || c === 'RUPEE' || c === 'RUPEES' || c === '₹') return '₹';
  if (c === 'USD' || c === '$') return '$';
  if (c === 'EUR' || c === '€') return '€';
  if (c === 'GBP' || c === '£') return '£';
  if (c === 'JPY' || c === '¥') return '¥';
  return curr;
};

export default function DualRangeSlider({ min, max, value, onChange, currency, disabled }) {
  const [minVal, setMinVal] = useState(value[0] || min);
  const [maxVal, setMaxVal] = useState(value[1] || max);
  const minValRef = useRef(minVal);
  const maxValRef = useRef(maxVal);
  const range = useRef(null);

  const symbol = getCurrencySymbol(currency);

  // Convert to percentage
  const getPercent = useCallback(
    (val) => Math.round(((val - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  return (
    <div className="relative w-full pt-6 pb-2">
      {/* Custom Slider Track and Inputs Container */}
      <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full z-10 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          step={1000}
          disabled={disabled}
          onChange={(event) => {
            const val = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(val);
            minValRef.current = val;
            onChange([val, maxVal]);
          }}
          className={`absolute w-full h-full left-0 outline-none appearance-none pointer-events-none top-1/2 -translate-y-1/2 ${minVal > maxVal - 50000 ? 'z-50' : 'z-30'}`}
          style={{ WebkitAppearance: 'none' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          step={1000}
          disabled={disabled}
          onChange={(event) => {
            const val = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(val);
            maxValRef.current = val;
            onChange([minVal, val]);
          }}
          className="absolute w-full h-full left-0 z-40 outline-none appearance-none pointer-events-none top-1/2 -translate-y-1/2"
          style={{ WebkitAppearance: 'none' }}
        />

        <div ref={range} className="absolute h-2 bg-[#1890FF] rounded-full z-20"></div>
        
        {/* Custom Thumbs */}
        <div 
          className="absolute w-5 h-5 bg-white border-2 border-[#1890FF] rounded-full z-30 top-1/2 -translate-y-1/2 -ml-2.5 shadow-md pointer-events-none"
          style={{ left: `${getPercent(minVal)}%` }}
        ></div>
        <div 
          className="absolute w-5 h-5 bg-white border-2 border-[#1890FF] rounded-full z-40 top-1/2 -translate-y-1/2 -ml-2.5 shadow-md pointer-events-none"
          style={{ left: `${getPercent(maxVal)}%` }}
        ></div>
      </div>
      
      {/* Values Display */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-xs font-bold text-[#212b36] dark:text-white bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-md border border-gray-100 dark:border-gray-800/50">
          <span className="text-gray-500 mr-1">Min:</span> {symbol} {minVal.toLocaleString()}
        </div>
        <div className="text-xs font-bold text-[#212b36] dark:text-white bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-md border border-gray-100 dark:border-gray-800/50">
          <span className="text-gray-500 mr-1">Max:</span> {symbol} {maxVal.toLocaleString()}
        </div>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          pointer-events: all;
          width: 40px;
          height: 40px;
          -webkit-appearance: none;
          opacity: 0;
          cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          pointer-events: all;
          width: 40px;
          height: 40px;
          opacity: 0;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
