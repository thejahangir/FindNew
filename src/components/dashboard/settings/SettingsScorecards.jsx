import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
 Plus, X, ChevronDown, Check, LayoutTemplate, 
 Trash2, GripVertical, FileCheck, Users, Target
} from 'lucide-react';

const SUGGESTED_ATTRIBUTES = {
 'Personality Traits': [
 'Self-motivated',
 'Team player',
 'Disciplined',
 'Communication Skills',
 'Adaptability',
 'Problem Solver',
 'Leadership',
 'Detail-oriented'
 ],
 'Qualifications': [
 '5+ years relevant experience',
 'B.S. in Computer Science',
 'Strong analytical skills',
 'Experience with Agile/Scrum',
 'Proficient in React & Node.js',
 'Cloud Architecture experience'
 ]
};

export default function SettingsScorecards({ setSettingsActiveNav }) {
 const navigate = () => {};
 const location = { state: null };
 
 
 const jobData = ({} /* mock */).jobData;

 // State for Categories and their Attributes
 const [categories, setCategories] = useState([
 {
 id: 1,
 name: 'Personality Traits',
 attributes: ['Self-motivated', 'Team player', 'Disciplined']
 },
 {
 id: 2,
 name: 'Qualifications',
 attributes: ['5+ years relevant experience', 'Strong analytical skills']
 }
 ]);

 // State for Interview Rounds (Focus Attributes)
 const [rounds, setRounds] = useState([
 {
 id: 1,
 name: 'HR Phone Screen',
 focusAttributes: ['Self-motivated', 'Communication Skills']
 },
 {
 id: 2,
 name: 'Technical Interview',
 focusAttributes: ['5+ years relevant experience', 'Strong analytical skills']
 },
 {
 id: 3,
 name: 'Culture Fit',
 focusAttributes: ['Team player', 'Disciplined']
 }
 ]);

 const [newCategoryName, setNewCategoryName] = useState('');
 const [newRoundName, setNewRoundName] = useState('');

 // Helper to get all currently defined attributes across all categories
 const allDefinedAttributes = categories.flatMap(cat => cat.attributes);

 // --- Category Handlers ---
 const handleAddCategory = () => {
 if (!newCategoryName.trim()) return;
 setCategories([
 ...categories,
 { id: Date.now(), name: newCategoryName.trim(), attributes: [] }
 ]);
 setNewCategoryName('');
 };

 const handleRemoveCategory = (catId) => {
 setCategories(categories.filter(c => c.id !== catId));
 };

 const handleAddAttribute = (catId, attribute) => {
 if (!attribute.trim()) return;
 setCategories(categories.map(cat => {
 if (cat.id === catId) {
 if (cat.attributes.includes(attribute.trim())) return cat; // Prevent duplicates
 return { ...cat, attributes: [...cat.attributes, attribute.trim()] };
 }
 return cat;
 }));
 };

 const handleRemoveAttribute = (catId, attributeToRemove) => {
 setCategories(categories.map(cat => {
 if (cat.id === catId) {
 return { ...cat, attributes: cat.attributes.filter(attr => attr !== attributeToRemove) };
 }
 return cat;
 }));
 };

 // --- Round Handlers ---
 const handleAddRound = () => {
 if (!newRoundName.trim()) return;
 setRounds([
 ...rounds,
 { id: Date.now(), name: newRoundName.trim(), focusAttributes: [] }
 ]);
 setNewRoundName('');
 };

 const handleRemoveRound = (roundId) => {
 setRounds(rounds.filter(r => r.id !== roundId));
 };

 const handleToggleFocusAttribute = (roundId, attribute) => {
 setRounds(rounds.map(round => {
 if (round.id === roundId) {
 const hasAttr = round.focusAttributes.includes(attribute);
 const newAttrs = hasAttr 
 ? round.focusAttributes.filter(a => a !== attribute)
 : [...round.focusAttributes, attribute];
 return { ...round, focusAttributes: newAttrs };
 }
 return round;
 }));
 };

 return (
 <div className="p-6 flex flex-col min-h-[calc(100vh-100px)] animate-fade-in font-sans">
 <div className="relative z-10 w-full mb-8">
 
 </div>

 <div className="flex-1 w-full space-y-12">
 
 {/* Section 1: Categories & Attributes */}
 <section>
 <div className="flex items-center gap-2 mb-6">
 <div className="w-8 h-8 rounded-lg bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center">
 <LayoutTemplate size={18} />
 </div>
 <div>
 <h2 className="text-xl font-bold text-[#212b36] dark:text-white">Categories & Attributes</h2>
 <p className="text-sm text-gray-500">Define the traits and qualifications to evaluate candidates on.</p>
 </div>
 </div>

 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
 {categories.map((category) => (
 <CategoryCard 
 key={category.id} 
 category={category} 
 onRemove={() => handleRemoveCategory(category.id)}
 onAddAttribute={(attr) => handleAddAttribute(category.id, attr)}
 onRemoveAttribute={(attr) => handleRemoveAttribute(category.id, attr)}
 />
 ))}

 {/* Add New Category */}
 <div className="bg-gray-50 dark:bg-[#161c24]/50 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 flex items-center gap-4 transition-colors focus-within:border-[#1890FF] focus-within:bg-white dark:focus-within:bg-[#161c24]">
 <input 
 type="text" 
 value={newCategoryName}
 onChange={(e) => setNewCategoryName(e.target.value)}
 onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
 placeholder="Enter a new category name (e.g. Technical Skills)" 
 className="flex-1 bg-transparent outline-none text-[#212b36] dark:text-white font-medium"
 />
 <button 
 onClick={handleAddCategory}
 disabled={!newCategoryName.trim()}
 className="px-4 py-2 bg-[#212b36] dark:bg-white text-white dark:text-[#212b36] rounded-xl font-bold text-sm disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
 >
 <Plus size={16} /> Add Category
 </button>
 </div>
 </div>
 </section>

 <hr className="border-gray-200 dark:border-gray-800" />

 {/* Section 2: Interview Plan (Focus Attributes Matrix) */}
 <section>
 <div className="flex items-center justify-between gap-4 mb-6">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-lg bg-[#00A76F]/10 text-[#00A76F] flex items-center justify-center">
 <Target size={18} />
 </div>
 <div>
 <h2 className="text-xl font-bold text-[#212b36] dark:text-white">Focus Attributes per Interview</h2>
 <p className="text-sm text-gray-500">Ensure every critical attribute is evaluated across your interview rounds.</p>
 </div>
 </div>
 

 </div>

 <div className="bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-x-auto custom-scrollbar relative">
 <table className="w-full text-left border-collapse min-w-[900px]">
 <thead>
 <tr>
 <th className="bg-gray-50 dark:bg-[#1a222c] border-b border-gray-200 dark:border-gray-700 p-5 font-bold text-[#212b36] dark:text-gray-300 w-80 min-w-[300px] sticky left-0 z-20 shadow-[1px_0_0_0_#e5e7eb] dark:shadow-[1px_0_0_0_#374151]">
 <span className="text-sm text-gray-500 font-semibold">Evaluation Criteria</span>
 </th>
 {rounds.map((round, idx) => (
 <th key={round.id} className="bg-gray-50 dark:bg-[#1a222c] border-b border-l border-gray-200 dark:border-gray-700 p-5 min-w-[200px] align-top relative group">
 <div className="flex flex-col gap-3">
 <div className="flex items-center justify-between">
 <span className="text-sm font-semibold text-gray-400">Round {idx + 1}</span>
 <button onClick={() => handleRemoveRound(round.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100 bg-white dark:bg-gray-800 rounded shadow-sm">
 <Trash2 size={14} />
 </button>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-md bg-[#00A76F]/10 text-[#00A76F] flex items-center justify-center shrink-0">
 <Users size={14} />
 </div>
 <span className="font-bold text-[#212b36] dark:text-white leading-tight">{round.name}</span>
 </div>
 </div>
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {categories.map(category => (
 <React.Fragment key={category.id}>
 {/* Category Header Row */}
 <tr>
 <td 
 colSpan={rounds.length + 1} 
 className="bg-gray-100/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 p-3 sticky left-0 z-10 shadow-[1px_0_0_0_#e5e7eb] dark:shadow-[1px_0_0_0_#374151]"
 >
 <div className="flex items-center gap-2 font-bold text-[#212b36] dark:text-white text-sm">
 <ChevronDown size={16} className="text-gray-400" />
 {category.name}
 <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-[10px] text-gray-600 dark:text-gray-300">
 {category.attributes.length} items
 </span>
 </div>
 </td>
 </tr>
 {/* Attribute Rows */}
 {category.attributes.map(attr => {
 const roundsCovering = rounds.filter(r => r.focusAttributes.includes(attr)).length;
 const isUncovered = roundsCovering === 0;

 return (
 <tr key={attr} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
 <td className="bg-white group-hover:bg-transparent dark:bg-[#161c24] border-b border-gray-100 dark:border-gray-800 p-4 sticky left-0 z-10 shadow-[1px_0_0_0_#e5e7eb] dark:shadow-[1px_0_0_0_#374151] transition-colors">
 <div className="flex items-center justify-between gap-4 pl-4 border-l-2 border-transparent group-hover:border-[#1890FF]">
 <span className="text-sm font-medium text-[#454f5b] dark:text-gray-300">{attr}</span>
 
 {/* HR Insight: Coverage Indicator */}
 {isUncovered ? (
 <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50 whitespace-nowrap" title="Warning: This attribute is not being evaluated in any round!">
 Unassigned
 </span>
 ) : (
 <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#00A76F]/10 text-[#00A76F] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
 {roundsCovering} {roundsCovering === 1 ? 'Round' : 'Rounds'}
 </span>
 )}
 </div>
 </td>
 {rounds.map(round => {
 const isChecked = round.focusAttributes.includes(attr);
 return (
 <td key={round.id} className="border-b border-l border-gray-100 dark:border-gray-800 p-0 text-center relative hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
 {/* Fully Clickable Cell */}
 <label className="absolute inset-0 flex items-center justify-center cursor-pointer w-full h-full group/cb">
 <input 
 type="checkbox" 
 className="sr-only peer"
 checked={isChecked}
 onChange={() => handleToggleFocusAttribute(round.id, attr)}
 />
 {/* Custom Styled Checkbox */}
 <div className="w-4 h-4 rounded-[4px] flex items-center justify-center transition-all duration-200 bg-white dark:bg-[#161c24] border-[1.5px] border-gray-300 dark:border-gray-600 group-hover/cb:border-[#1890FF]/50 peer-focus-visible:ring-2 peer-focus-visible:ring-[#1890FF] peer-checked:bg-[#1890FF] peer-checked:border-[#1890FF] peer-checked:shadow-sm peer-checked:shadow-[#1890FF]/30">
 <Check size={10} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity scale-50 peer-checked:scale-100" strokeWidth={3} />
 </div>
 </label>
 </td>
 );
 })}
 </tr>
 );
 })}
 </React.Fragment>
 ))}
 
 {allDefinedAttributes.length === 0 && (
 <tr>
 <td colSpan={rounds.length + 1} className="p-8 text-center text-gray-500">
 Add categories and attributes above to build your interview matrix.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </section>

 </div>

 {/* Footer Navigation */}
 <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-12 sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-20 pb-4">
 <button 
 onClick={() => setSettingsActiveNav('Pipeline')}
 className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Previous: Back to Pipeline
 </button>
 <div className="flex items-center gap-3">
 <button 
 onClick={() => navigate('/dashboard/jobs')}
 className="px-6 py-2.5 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Save and Exit
 </button>
 <button 
 onClick={() => setSettingsActiveNav('Ranking Rules')}
 className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
 >
 Save and Continue to 'Ranking Rules'
 </button>
 </div>
 </div>
 </div>
 );
}

// --- Subcomponents ---

function CategoryCard({ category, onRemove, onAddAttribute, onRemoveAttribute }) {
 const [inputValue, setInputValue] = useState('');
 const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 const containerRef = useRef(null);

 const suggestions = SUGGESTED_ATTRIBUTES[category.name] || [];
 const filteredSuggestions = suggestions.filter(s => 
 !category.attributes.includes(s) && 
 s.toLowerCase().includes(inputValue.toLowerCase())
 );

 useEffect(() => {
 function handleClickOutside(event) {
 if (containerRef.current && !containerRef.current.contains(event.target)) {
 setIsDropdownOpen(false);
 }
 }
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 const handleAdd = (val) => {
 onAddAttribute(val);
 setInputValue('');
 setIsDropdownOpen(false);
 };

 return (
 <div className="bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm relative group">
 <div className="flex items-start justify-between mb-4">
 <div className="flex items-center gap-3">
 <GripVertical size={20} className="text-gray-300 cursor-grab" />
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white">{category.name}</h3>
 <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs px-2 py-0.5 rounded-full font-bold">
 {category.attributes.length}
 </span>
 </div>
 <button 
 onClick={onRemove}
 className="text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
 title="Delete Category"
 >
 <Trash2 size={18} />
 </button>
 </div>

 <div className="pl-8">
 <div className="flex flex-wrap gap-2 mb-4">
 {category.attributes.map(attr => (
 <div key={attr} className="flex items-center gap-1.5 bg-[#1890FF]/10 text-[#1890FF] border border-[#1890FF]/20 px-3 py-1.5 rounded-lg text-sm font-semibold">
 {attr}
 <button 
 onClick={() => onRemoveAttribute(attr)}
 className="text-[#1890FF]/60 hover:text-[#1890FF] hover:bg-[#1890FF]/20 rounded-full p-0.5 transition-colors"
 >
 <X size={14} />
 </button>
 </div>
 ))}
 {category.attributes.length === 0 && (
 <span className="text-sm text-gray-400 italic">No attributes added yet.</span>
 )}
 </div>

 {/* Attribute Input & Suggestions */}
 <div className="relative max-w-md" ref={containerRef}>
 <div className="relative flex items-center">
 <input 
 type="text" 
 value={inputValue}
 onChange={(e) => {
 setInputValue(e.target.value);
 setIsDropdownOpen(true);
 }}
 onFocus={() => setIsDropdownOpen(true)}
 onKeyDown={(e) => {
 if (e.key === 'Enter' && inputValue.trim()) {
 handleAdd(inputValue);
 }
 }}
 placeholder="Type to add a custom attribute..."
 className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl text-sm outline-none focus:border-[#1890FF] transition-colors text-[#212b36] dark:text-white pr-24"
 />
 <button 
 onClick={() => { if(inputValue.trim()) handleAdd(inputValue); }}
 className="absolute right-2 text-xs font-bold bg-[#212b36] dark:bg-white text-white dark:text-[#212b36] px-3 py-1 rounded-lg hover:opacity-90 cursor-pointer"
 >
 Add
 </button>
 </div>

 {/* Suggestions Dropdown */}
 {isDropdownOpen && (filteredSuggestions.length > 0 || inputValue.trim()) && (
 <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-20">
 <div className="max-h-48 overflow-y-auto">
 {filteredSuggestions.map(suggestion => (
 <button 
 key={suggestion}
 onClick={() => handleAdd(suggestion)}
 className="w-full text-left px-4 py-2.5 text-sm text-[#212b36] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group cursor-pointer"
 >
 {suggestion}
 <Plus size={14} className="text-gray-400 group-hover:text-[#1890FF]" />
 </button>
 ))}
 {inputValue.trim() && !filteredSuggestions.includes(inputValue) && (
 <button 
 onClick={() => handleAdd(inputValue)}
 className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#1890FF] bg-[#1890FF]/5 hover:bg-[#1890FF]/10 transition-colors cursor-pointer border-t border-gray-100 dark:border-gray-700"
 >
 Add "{inputValue}" as custom attribute
 </button>
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}

function RoundCard({ round, allAttributes, onRemove, onToggleAttribute }) {
 const [isOpen, setIsOpen] = useState(false);
 const containerRef = useRef(null);

 useEffect(() => {
 function handleClickOutside(event) {
 if (containerRef.current && !containerRef.current.contains(event.target)) {
 setIsOpen(false);
 }
 }
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 return (
 <div className="bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm relative group flex flex-col h-full min-h-[200px]">
 <div className="flex items-start justify-between mb-4">
 <div>
 <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-1">{round.name}</h3>
 <p className="text-xs text-gray-500">{round.focusAttributes.length} Focus Attributes</p>
 </div>
 <button 
 onClick={onRemove}
 className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
 >
 <Trash2 size={16} />
 </button>
 </div>

 <div className="flex-1">
 {round.focusAttributes.length > 0 ? (
 <ul className="space-y-2 mb-6">
 {round.focusAttributes.map(attr => (
 <li key={attr} className="flex items-start gap-2 text-sm text-[#212b36] dark:text-gray-300">
 <Check size={16} className="text-[#00A76F] shrink-0 mt-0.5" />
 <span className="leading-tight">{attr}</span>
 </li>
 ))}
 </ul>
 ) : (
 <div className="flex flex-col items-center justify-center h-24 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 mb-6">
 <span className="text-sm text-gray-400">No focus attributes assigned</span>
 </div>
 )}
 </div>

 <div className="relative mt-auto" ref={containerRef}>
 <button 
 onClick={() => setIsOpen(!isOpen)}
 className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Assign Attributes
 <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
 </button>

 {isOpen && (
 <div className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-[#212b36] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto">
 <div className="p-2 text-xs font-bold text-gray-500 tracking-wider sticky top-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 z-10">
 Available Attributes
 </div>
 {allAttributes.length > 0 ? (
 allAttributes.map(attr => {
 const isSelected = round.focusAttributes.includes(attr);
 return (
 <button
 key={attr}
 onClick={() => onToggleAttribute(attr)}
 className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between cursor-pointer border-b border-gray-100 dark:border-gray-800/50 last:border-0"
 >
 <span className={`${isSelected ? 'text-[#00A76F] font-semibold' : 'text-[#212b36] dark:text-gray-300'}`}>
 {attr}
 </span>
 {isSelected && <Check size={16} className="text-[#00A76F]" />}
 </button>
 );
 })
 ) : (
 <div className="p-4 text-center text-sm text-gray-500">
 Define attributes in the categories above first.
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 );
}
