import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
 Star, GripVertical, Settings2, Plus, Info, X, ChevronDown, 
 ChevronRight, BrainCircuit, Lightbulb, GraduationCap, Briefcase, 
 User, CheckCircle2, Play, Trash2, Code, ArrowRight, FileText, Loader2, Edit3, Wand2, Zap
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ToggleSwitch = ({ checked, onChange }) => (
 <div 
 onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
 className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
 >
 <div className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${checked ? 'bg-[#00A76F]' : 'bg-gray-200 dark:bg-gray-700'}`}>
 <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? 'translate-x-4' : 'translate-x-0'}`}></div>
 </div>
 </div>
);

function SortableRuleItem({ rule, isSelected, onSelect, isModal }) {
 const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: rule.id });
 
 const style = {
 transform: CSS.Transform.toString(transform),
 transition,
 zIndex: isDragging ? 50 : 1,
 };

 const weightValue = rule.weight !== undefined ? Number(rule.weight) : 0;
 const weightPercentage = (weightValue / 2) * 100;

 return (
 <div 
 ref={setNodeRef} 
 style={style}
 onClick={() => onSelect(rule.id)}
 className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${isDragging ? 'opacity-50 border-[#1890FF] shadow-lg scale-[1.02] z-50 relative' : isSelected ? 'border-[#1890FF] bg-blue-50/50 dark:bg-[#1890FF]/10 shadow-sm' : 'border-gray-100 dark:border-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-[#161c24]'}`}
 >
 <div {...attributes} {...listeners} className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1 shrink-0" onClick={e => e.stopPropagation()}>
 <GripVertical size={18} />
 </div>
 
 <div className="flex-1 min-w-0">
 <h4 className={`${isModal ? 'text-[13px] font-semibold' : 'text-sm font-bold'} truncate ${isSelected ? 'text-[#1890FF]' : 'text-[#212b36] dark:text-white'}`}>
 {rule.skill || 'New Rule'}
 </h4>
 <div className="flex items-center gap-3 mt-1.5">
 <div className="h-1.5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
 <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, weightPercentage))}%`, backgroundColor: rule.color || '#1890FF' }}></div>
 </div>
 <p className="text-[11px] text-gray-500 font-bold">{weightValue.toFixed(1)}x Weight</p>
 </div>
 </div>

 <div className="shrink-0 flex items-center gap-3 pr-2">
 <span className={`${isModal ? 'text-[15px] font-bold' : 'text-lg font-black'}`} style={{ color: rule.color || '#1890FF' }}>{weightValue.toFixed(1)}</span>
 </div>
 </div>
 );
}

const RuleDetailsPanel = ({ rule, onUpdate, onDelete, onSave, isModal, isEditingSettings }) => {
 if (!rule) return null;

 return (
 <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-lg flex flex-col h-full sticky top-6 animate-fade-in">
 <div className="p-6 border-b border-gray-100 dark:border-gray-800/50">
 <h3 className={`${isModal ? 'text-base font-semibold' : 'text-xl font-bold'} text-[#212b36] dark:text-white`}>Rule Configuration</h3>
 <p className={`${isModal ? 'text-xs' : 'text-sm'} text-gray-500 mt-1`}>Adjust criteria weight and details.</p>
 </div>

 <div className="p-6 space-y-4 flex-1 overflow-y-auto">
 <div className="flex flex-col xl:flex-row gap-6">
 <div className="space-y-2 flex-1">
 <div className="flex items-center h-5">
 <label className={`text-xs ${isModal ? 'font-semibold' : 'font-bold'} text-gray-500`}>Skill / Criteria Name</label>
 </div>
 <input
 type="text"
 value={rule.skill}
 disabled={!isEditingSettings}
 onChange={(e) => onUpdate(rule.id, 'skill', e.target.value)}
 className={`w-full h-[46px] px-4 bg-gray-50 dark:bg-[#1a222c] border border-gray-200 dark:border-gray-700 rounded-xl ${isModal ? 'text-[13px] font-semibold' : 'text-sm font-bold'} text-[#212b36] dark:text-white focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] outline-none transition-all disabled:opacity-70`}
 placeholder="e.g. Python Proficiency"
 />
 </div>

 <div className="space-y-2 w-full xl:w-[340px] shrink-0">
 <div className="flex items-center justify-between h-5">
 <label className={`text-xs ${isModal ? 'font-semibold' : 'font-bold'} text-gray-500`}>Weight Multiplier (0.0 to 2.0)</label>
 <span className={`text-xs ${isModal ? 'font-semibold' : 'font-bold'} text-[#1890FF]`}>{(Number(rule.weight) || 0).toFixed(1)}x</span>
 </div>
 <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#1a222c] px-4 h-[46px] rounded-xl border border-gray-100 dark:border-gray-700/50">
 <div className="text-[11px] font-bold text-gray-400">0.0</div>
 <input
 type="range"
 min="0"
 max="2"
 step="0.1"
 value={rule.weight || 0}
 disabled={!isEditingSettings}
 onChange={(e) => onUpdate(rule.id, 'weight', Number(e.target.value))}
 className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#1890FF] disabled:opacity-70"
 />
 <div className="text-[11px] font-bold text-gray-400">2.0</div>
 
 <div className="w-16 relative ml-1">
 <input
 type="number"
 min="0"
 max="2"
 step="0.1"
 value={rule.weight === 0 && !rule.weight ? '' : rule.weight}
 disabled={!isEditingSettings}
 onChange={(e) => onUpdate(rule.id, 'weight', Number(e.target.value))}
 className="w-full px-2 h-7 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-center text-[#212b36] dark:text-white focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] outline-none transition-all pr-4 disabled:opacity-70"
 />
 <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-400 pointer-events-none">x</span>
 </div>
 </div>
 </div>
 </div>

 <div className="space-y-2">
 <label className={`text-xs ${isModal ? 'font-semibold' : 'font-bold'} text-gray-500`}>Evaluation Guidelines (Description)</label>
 <textarea
 value={rule.description}
 disabled={!isEditingSettings}
 onChange={(e) => onUpdate(rule.id, 'description', e.target.value)}
 className={`w-full min-h-[120px] px-4 py-3 bg-gray-50 dark:bg-[#1a222c] border border-gray-200 dark:border-gray-700 rounded-xl ${isModal ? 'text-[13px]' : 'text-sm'} text-[#212b36] dark:text-white focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] outline-none resize-none transition-all disabled:opacity-70`}
 placeholder="How should the AI evaluate this skill?"
 />
 </div>

 <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
 <Zap size={16} />
 </div>
 <div>
 <p className={`text-sm ${isModal ? 'font-semibold' : 'font-bold'} text-[#212b36] dark:text-white`}>Knockout Rule</p>
 <p className="text-xs text-gray-500">Auto-reject if score is 0 on this criteria</p>
 </div>
 </div>
 <div className={!isEditingSettings ? 'opacity-50 pointer-events-none' : ''}>
 <ToggleSwitch checked={rule.isKnockout || false} onChange={(val) => onUpdate(rule.id, 'isKnockout', val)} />
 </div>
 </div>
 </div>
 
 {/* Footer Actions */}
 {isEditingSettings && (
 <div className="p-4 border-t-2 border-gray-200 dark:border-gray-700/50 flex items-center justify-center gap-8 bg-gray-50/50 dark:bg-[#1a222c]/50 rounded-b-2xl mt-auto">
 <button 
 onClick={() => onDelete(rule.id)} 
 title="Delete Rule"
 className="p-3 text-[#FF5630] hover:bg-[#FF5630]/10 rounded-xl transition-colors cursor-pointer"
 >
 <Trash2 size={20} />
 </button>
 
 <div className="w-px h-8 bg-gray-200 dark:bg-gray-700/50"></div>
 
 <button 
 onClick={() => onSave()}
 title="Save Changes"
 className="p-3 text-[#00A76F] hover:bg-[#00A76F]/10 rounded-xl transition-colors cursor-pointer"
 >
 <CheckCircle2 size={20} />
 </button>
 </div>
 )}
 </div>
 );
};

export default function SettingsRankingRules({ setSettingsActiveNav, hideFooter = false, onCancel, onSave }) {
 const navigate = useNavigate();
 const location = useLocation();
 const initialJobData = location.state?.jobData || {};
 const [isEditingSettings, setIsEditingSettings] = useState(initialJobData?.status !== 'Published');
 const jobData = initialJobData;

 const [rules, setRules] = useState([]);
 const [isGenerated, setIsGenerated] = useState(false);
 const [isGenerating, setIsGenerating] = useState(false);
 const [deleteConfirmRuleId, setDeleteConfirmRuleId] = useState(null);
 const [selectedRuleId, setSelectedRuleId] = useState(null);

 const [threshold, setThreshold] = useState(80);
 
 const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
 const [toastMessage, setToastMessage] = useState(null);
 const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);

 const sensors = useSensors(
 useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
 );

 const isValid = isGenerated && rules.length > 0;

 useEffect(() => {
 if (toastMessage) {
 const timer = setTimeout(() => setToastMessage(null), 3000);
 return () => clearTimeout(timer);
 }
 }, [toastMessage]);

 const handleGenerate = () => {
 setIsGenerating(true);
 setTimeout(() => {
 const generatedRules = [
 { id: 1, skill: 'Deep Learning Experience', weight: 1.5, description: 'Must have extensive production experience with deep learning frameworks (PyTorch/TensorFlow) and model deployment.', color: '#1890FF' },
 { id: 2, skill: 'Python Proficiency', weight: 1.2, description: 'Advanced Python skills including async programming, memory management, and optimizing high-performance code.', color: '#00A76F' },
 { id: 3, skill: 'System Design', weight: 1.0, description: 'Ability to architect scalable machine learning infrastructure and data pipelines handling large-scale data.', color: '#FFAB00' },
 { id: 4, skill: 'Cloud Infrastructure', weight: 0.8, description: 'Familiarity with AWS/GCP, Docker, and Kubernetes for ML model serving and orchestration.', color: '#8E33FF' }
 ];
 setRules(generatedRules);
 setSelectedRuleId(generatedRules[0].id);
 setIsGenerated(true);
 setIsGenerating(false);
 }, 1500);
 };

 const handleDragEnd = (event) => {
 const { active, over } = event;
 if (active.id !== over.id) {
 setRules((items) => {
 const oldIndex = items.findIndex((i) => i.id === active.id);
 const newIndex = items.findIndex((i) => i.id === over.id);
 return arrayMove(items, oldIndex, newIndex);
 });
 }
 };

 const handleUpdateRule = (id, field, value) => {
 setRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
 };

 const handleAddRule = () => {
 const newId = Date.now();
 setRules(prev => [...prev, { id: newId, skill: 'New Rule', weight: 1.0, description: '', color: '#00A76F' }]);
 setSelectedRuleId(newId);
 };

 const confirmDelete = () => {
 if (deleteConfirmRuleId) {
 setRules(prev => prev.filter(r => r.id !== deleteConfirmRuleId));
 if (selectedRuleId === deleteConfirmRuleId) {
 setSelectedRuleId(null);
 }
 setDeleteConfirmRuleId(null);
 }
 };

 const handleSaveAndContinue = () => {
 if (!isValid) return;
 setSettingsActiveNav('Agencies');
 };

 if (!jobData) {
 return (
 <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
 <h2 className="text-2xl font-bold text-[#212b36] dark:text-white mb-2">No Job Selected</h2>
 <p className="text-black mb-6">Please create a job or select one to view its setup overview.</p>
 <button onClick={() => navigate('/dashboard/jobs')} className="px-5 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-lg shadow-sm transition-colors cursor-pointer">
 Back to Jobs
 </button>
 </div>
 );
 }

 const selectedRule = rules.find(r => r.id === selectedRuleId) || (rules.length > 0 ? rules[0] : null);

 return (
 <div className={`${!hideFooter ? 'p-6 space-y-6 min-h-[calc(100vh-100px)]' : 'p-1 h-full overflow-hidden'} animate-fade-in flex flex-col relative`}>
 <div className={`flex-1 flex flex-col ${!hideFooter ? 'space-y-4' : 'space-y-4 overflow-y-auto custom-scrollbar pr-2 pb-2'}`}>
 {!hideFooter && (
 <div className="flex justify-end gap-4 mb-2 px-2">
 <div className="flex items-center gap-3">
 {isGenerated && isEditingSettings && (
 <button 
 onClick={handleGenerate} 
 className="px-5 py-2.5 bg-[#1890FF] hover:bg-[#1890FF]/90 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm whitespace-nowrap"
 >
 <Wand2 size={16} />
 Regenerate from JD
 </button>
 )}
 <button
 onClick={() => setIsEditingSettings(prev => !prev)}
 className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-[#1890FF] transition-colors cursor-pointer"
 title={isEditingSettings ? "Save changes" : "Edit Rules"}
 >
 {isEditingSettings ? <Check size={18} className="text-[#00A76F]" /> : <Settings2 size={18} />}
 </button>
 </div>
 </div>
 )}

 <div className="relative flex-1 flex flex-col">
 {isGenerating && (
 <div className="absolute inset-0 bg-white/80 dark:bg-[#161c24]/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-fade-in rounded-2xl h-[500px]">
 <div className="w-16 h-16 bg-[#1890FF]/10 text-[#1890FF] rounded-full flex items-center justify-center mb-4">
 <Loader2 size={32} className="animate-spin" />
 </div>
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white">Generating Ranking Rules...</h3>
 <p className="text-sm text-gray-500 mt-2">Analyzing Job Description to extract key criteria</p>
 </div>
 )}

 {!isGenerated && !isGenerating ? (
 <div className="text-center py-20 border border-dashed border-gray-300 dark:border-gray-700 rounded-[20px] bg-gray-50/30 dark:bg-[#161c24]/30">
 <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] rounded-full flex items-center justify-center mx-auto mb-6">
 <FileText size={24} />
 </div>
 <h3 className="text-[16px] font-bold text-[#212b36] dark:text-white mb-2">No Rules Defined Yet</h3>
 <p className="text-[13px] text-gray-500 max-w-sm mx-auto mb-8">
 Automatically extract and suggest ranking rules based on your Job Description.
 </p>
 {isEditingSettings && (
 <button 
 onClick={handleGenerate} 
 className="px-6 py-3 bg-[#1890FF] hover:bg-[#1890FF]/90 text-white rounded-xl text-sm font-bold transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
 >
 <Wand2 size={18} /> Generate from JD
 </button>
 )}
 </div>
 ) : isGenerated && (
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start">
 
 {/* Left Column: Master List */}
 <div className="col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col">
 
 {/* Vertical Draggable List */}
 <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
 <SortableContext items={rules.map(r => r.id)} strategy={verticalListSortingStrategy}>
 <div className="space-y-3">
 {rules.map((rule) => (
 <SortableRuleItem 
 key={rule.id} 
 rule={rule} 
 isSelected={selectedRuleId === rule.id}
 onSelect={setSelectedRuleId}
 isModal={hideFooter}
 />
 ))}
 </div>
 </SortableContext>
 </DndContext>

 {isEditingSettings && (
 <div className="mt-6 flex items-center justify-center pb-2">
 <button 
 onClick={handleAddRule}
 className="px-5 py-2.5 bg-[#1890FF]/5 hover:bg-[#1890FF]/10 text-[#1890FF] rounded-xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer border border-[#1890FF]/20 border-dashed hover:border-[#1890FF]/40 w-full justify-center"
 >
 <Plus size={16} /> Add New Rule
 </button>
 </div>
 )}
 </div>
 
 {/* Right Column: Details Panel */}
 <div className="col-span-1 lg:col-span-6 xl:col-span-7 h-full">
 <RuleDetailsPanel 
 rule={selectedRule} 
 onUpdate={handleUpdateRule} 
 onDelete={(id) => setDeleteConfirmRuleId(id)}
 onSave={() => setToastMessage('Rule changes saved successfully.')}
 isModal={hideFooter}
 isEditingSettings={isEditingSettings}
 />
 </div>

 </div>
 )}
 </div>
 </div>

 {!hideFooter && (
 <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto bg-white/80 dark:bg-[#161c24]/80 backdrop-blur-md sticky bottom-0 z-20 pb-2">
 <button 
 onClick={() => setSettingsActiveNav('Scorecards')}
 className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Previous: Back to Scorecards
 </button>
 <div className="flex items-center gap-4">
 <button 
 onClick={() => setIsConfirmDraftModalOpen(true)}
 className="px-6 py-3 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Save and Exit
 </button>
 <div className="relative group/btn">
 <button 
 onClick={handleSaveAndContinue}
 disabled={!isValid}
 className={`px-6 py-3 text-white rounded-xl font-bold transition-colors shadow-sm cursor-pointer ${isValid ? 'bg-[#1890FF] hover:bg-[#1890FF]/90 shadow-[0_8px_16px_rgba(24,144,255,0.24)]' : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70'}`}
 >
 Save and Continue to 'Agencies'
 </button>
 {!isValid && (
 <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-gray-900 text-white text-[12px] px-3 py-2 rounded-lg pointer-events-none whitespace-nowrap z-30 shadow-xl after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900">
 {'Add at least one rule'}
 </div>
 )}
 </div>
 </div>
 </div>
 )}

 {hideFooter && onCancel && onSave && (
 <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100 dark:border-gray-800/50 shrink-0">
 <button onClick={onCancel} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#212b36] dark:text-white rounded-xl font-bold text-[13px] transition-colors cursor-pointer">
 Cancel
 </button>
 <div className="flex items-center gap-3">
 {isGenerated && (
 <button 
 onClick={handleGenerate} 
 className="px-5 py-2.5 bg-blue-50 dark:bg-[#1890FF]/10 text-[#1890FF] hover:bg-blue-100 dark:hover:bg-[#1890FF]/20 rounded-xl text-[13px] font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
 >
 <Wand2 size={16} />
 Regenerate from JD
 </button>
 )}
 <button onClick={onSave} className="px-5 py-2.5 bg-[#1890FF] hover:bg-[#1890FF]/90 text-white rounded-xl font-bold text-[13px] transition-colors cursor-pointer shadow-[#1890FF]/20">
 Save Rules
 </button>
 </div>
 </div>
 )}


 {/* Delete Confirmation Modal */}
 {deleteConfirmRuleId && (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
 <div className="bg-white dark:bg-[#161c24] p-7 rounded-3xl shadow-[0_24px_48px_rgba(0,0,0,0.2)] max-w-sm w-full mx-4 border border-gray-100 dark:border-gray-800 animate-scale-up">
 <div className="flex items-center justify-center gap-4 mb-4">
 <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-[#FF5630] rounded-full flex items-center justify-center shrink-0">
 <Trash2 size={24} />
 </div>
 <h3 className="text-[19px] font-bold text-[#212b36] dark:text-white">Delete Rule?</h3>
 </div>
 <p className="text-[14px] text-gray-500 mb-8 leading-relaxed text-center px-2">
 Are you sure you want to delete this rule? This action cannot be undone.
 </p>
 <div className="flex gap-4">
 <button onClick={() => setDeleteConfirmRuleId(null)} className="flex-1 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#212b36] dark:text-white rounded-xl font-bold text-sm transition-colors cursor-pointer">
 Cancel
 </button>
 <button onClick={confirmDelete} className="flex-1 px-5 py-2.5 bg-[#FF5630] hover:bg-[#FF5630]/90 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-sm shadow-[#FF5630]/20">
 Delete
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Confirm Draft Modal */}
 {isConfirmDraftModalOpen && (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-sm flex flex-col shadow-2xl animate-scale-up overflow-hidden">
 <div className="p-6 text-center space-y-4">
 <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] rounded-full flex items-center justify-center mx-auto mb-4">
 <Settings2 size={32} />
 </div>
 <h3 className="text-xl font-bold text-[#212b36] dark:text-white">Save as Draft?</h3>
 <p className="text-sm text-black dark:text-gray-400">
 Are you sure you want to save your progress as a draft and return to the Job List? You can resume editing later.
 </p>
 </div>
 <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex gap-3 bg-gray-50 dark:bg-gray-800/30">
 <button 
 onClick={() => setIsConfirmDraftModalOpen(false)} 
 className="flex-1 px-4 py-2.5 text-sm font-bold text-black hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 rounded-xl transition-colors cursor-pointer"
 >
 Cancel
 </button>
 <button 
 onClick={() => {
 setIsConfirmDraftModalOpen(false);
 setToastMessage('Ranking rules saved as draft.');
 setTimeout(() => navigate('/dashboard/jobs'), 1000);
 }}
 className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-xl shadow-sm transition-colors cursor-pointer"
 >
 Yes, Save & Close
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Toast Notification */}
 {toastMessage && (
 <div className="fixed top-6 right-6 z-[60] bg-white dark:bg-[#161c24] border border-[#00A76F]/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-4 flex items-center gap-4 animate-fade-in">
 <div className="w-8 h-8 rounded-full bg-[#00A76F]/10 flex items-center justify-center text-[#00A76F] shrink-0">
 <CheckCircle2 size={16} />
 </div>
 <div>
 <h4 className="text-sm font-bold text-[#212b36] dark:text-white">{toastMessage}</h4>
 </div>
 <button onClick={() => setToastMessage(null)} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
 <X size={16} />
 </button>
 </div>
 )}
 </div>
 );
}
