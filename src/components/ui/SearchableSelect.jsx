import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function SearchableSelect({ 
 options = [], 
 value, 
 onChange, 
 placeholder = "Select an option...",
 searchPlaceholder = "Search...",
 hasError = false,
 showSearch = true,
 size = 'default'
}) {
 const [isOpen, setIsOpen] = useState(false);
 const [searchTerm, setSearchTerm] = useState('');
 const wrapperRef = useRef(null);

 // Handle click outside to close
 useEffect(() => {
 function handleClickOutside(event) {
 if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
 setIsOpen(false);
 }
 }
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 // Reset search when opened
 useEffect(() => {
 if (isOpen) setSearchTerm('');
 }, [isOpen]);

 const filteredOptions = options.filter(opt => 
 !showSearch || opt.label.toLowerCase().includes(searchTerm.toLowerCase())
 );

 const selectedOption = (options || []).find(opt => opt?.value === value);

 return (
 <div className="relative w-full" ref={wrapperRef}>
 {/* Select Trigger */}
 <div 
 onClick={() => setIsOpen(!isOpen)}
 className={`w-full ${size === 'xs' ? 'px-2 py-1' : size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-2.5'} bg-gray-50 dark:bg-gray-800/50 border ${size === 'xs' ? 'rounded-lg' : 'rounded-xl'} flex items-center justify-between cursor-pointer transition-all ${
 isOpen ? 'border-[#1890FF] ring-2 ring-[#1890FF]/20 bg-white dark:bg-[#161c24]' : (hasError ? 'border-[#FF5630] bg-red-50 dark:bg-[#FF5630]/10' : 'border-gray-200 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/50')
 }`}
 >
 <span className={`${size === 'xs' ? 'text-[11px]' : 'text-sm'} ${selectedOption ? 'text-[#212b36] dark:text-white font-medium' : 'text-gray-400 dark:text-gray-400'}`}>
 {selectedOption ? selectedOption.label : placeholder}
 </span>
 <span className={`text-gray-400 font-bold px-1 ${size === 'xs' ? 'text-[9px]' : 'text-xs'}`}>{isOpen ? '▲' : '▼'}</span>
 </div>

 {/* Dropdown Menu */}
 {isOpen && (
 <div className="absolute z-[110] w-full mt-2 bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800/50 rounded-xl shadow-2xl overflow-hidden animate-fade-in origin-top">
 
 {showSearch && (
 <div className="p-2 border-b border-gray-100 dark:border-gray-800/50">
 <div className="relative">
 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
 <input 
 autoFocus
 type="text" 
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 placeholder={searchPlaceholder}
 className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#1890FF]/20 outline-none text-[#212b36] dark:text-white"
 />
 </div>
 </div>
 )}

 {/* Options List */}
 <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
 {filteredOptions.length === 0 ? (
 <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
 No results found
 </div>
 ) : (
 filteredOptions.map((option) => (
 <div
 key={option.value}
 onClick={() => {
 onChange(option.value);
 setIsOpen(false);
 }}
 className={`${size === 'sm' ? 'px-2 py-1.5' : 'px-3 py-2'} rounded-lg cursor-pointer flex items-center justify-between group transition-colors ${
 value === option.value ? 'bg-[#1890FF]/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
 }`}
 >
 <div>
 <div className={`text-sm font-medium ${value === option.value ? 'text-[#1890FF]' : 'text-[#212b36] dark:text-white group-hover:text-[#1890FF]'}`}>
 {option.label}
 </div>
 {option.description && (
 <div className={`text-xs mt-0.5 ${value === option.value ? 'text-[#1890FF]/70' : 'text-black dark:text-gray-400'}`}>
 {option.description}
 </div>
 )}
 </div>
 {value === option.value && (
 <span className="text-[#1890FF] font-bold text-sm shrink-0">✓</span>
 )}
 </div>
 ))
 )}
 </div>
 </div>
 )}
 </div>
 );
}
