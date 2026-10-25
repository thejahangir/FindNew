import React from 'react';
import { Check } from 'lucide-react';

export default function CustomCheckbox({
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  size = 'md', // 'sm' (16px), 'md' (18px)
  className = '',
  id,
  name,
  'aria-label': ariaLabel,
  title,
}) {
  const isSm = size === 'sm';
  const boxSize = isSm ? 'w-4 h-4 rounded-[4px]' : 'w-[18px] h-[18px] rounded-[5px]';
  const iconSize = isSm ? 10 : 12;

  const handleClick = (e) => {
    e.stopPropagation();
    if (disabled || !onChange) return;
    const nextVal = !checked;
    const syntheticEvent = {
      ...e,
      target: { ...e.target, checked: nextVal, id, name },
      currentTarget: { ...e.currentTarget, checked: nextVal, id, name },
      checked: nextVal,
      stopPropagation: () => e.stopPropagation(),
      preventDefault: () => e.preventDefault(),
    };
    onChange(syntheticEvent);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <button
      type="button"
      role="checkbox"
      id={id}
      name={name}
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`inline-flex items-center justify-center shrink-0 select-none p-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1890FF]/40 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-[#161c24] ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`flex items-center justify-center ${boxSize} border-[1.5px] transition-all duration-150 ${
          checked || indeterminate
            ? 'bg-[#1890FF] border-[#1890FF] shadow-xs shadow-[#1890FF]/30 text-white scale-100'
            : 'bg-white dark:bg-[#161c24] border-gray-300 dark:border-gray-600 hover:border-[#1890FF] dark:hover:border-[#1890FF] hover:bg-gray-50/50 dark:hover:bg-gray-800/50 shadow-2xs'
        }`}
      >
        {checked && !indeterminate && (
          <Check size={iconSize} strokeWidth={3.2} className="text-white transform transition-transform duration-100 scale-100" />
        )}
        {indeterminate && (
          <span className={`block ${isSm ? 'w-2' : 'w-2.5'} h-[2px] rounded-full bg-white transform transition-transform duration-100 scale-100`} />
        )}
      </span>
    </button>
  );
}
