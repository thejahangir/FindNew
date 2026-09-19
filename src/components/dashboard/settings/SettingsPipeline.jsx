import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Columns, GitBranch, ArrowRight, Settings, Plus, Zap, Settings2, Trash2, ArrowUp, ArrowDown, GripVertical, PenLine, Mail, Calendar, FileCheck, CheckCircle2, Circle, AlertCircle, Clock } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SearchableSelect from '../../ui/SearchableSelect';

const SYSTEM_STAGES = [
 'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'
];

const getStageColor = (systemStage) => {
 switch (systemStage) {
 case 'Applied': return 'from-[#1890FF] to-[#1890FF]/70 text-[#1890FF] bg-[#1890FF]/10';
 case 'Screening': return 'from-[#FFC107] to-[#FFC107]/70 text-[#FFC107] bg-[#FFC107]/10';
 case 'Interview': return 'from-[#8A2BE2] to-[#8A2BE2]/70 text-[#8A2BE2] bg-[#8A2BE2]/10';
 case 'Offer': return 'from-[#00A76F] to-[#00A76F]/70 text-[#00A76F] bg-[#00A76F]/10';
 case 'Hired': return 'from-[#00A76F] to-[#00A76F]/70 text-[#00A76F] bg-[#00A76F]/10';
 case 'Rejected': return 'from-[#FF5630] to-[#FF5630]/70 text-[#FF5630] bg-[#FF5630]/10';
 default: return 'from-[#637381] to-[#637381]/70 text-black bg-[#637381]/10';
 }
};

const TerminalSwitch = ({ isTerminal, onChange }) => (
 <div 
 onClick={(e) => { e.stopPropagation(); onChange(!isTerminal); }}
 className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
 >
 <div className={`relative w-8 h-4 rounded-full transition-colors duration-300 ${isTerminal ? 'bg-[#FF5630]' : 'bg-gray-200 dark:bg-gray-700'}`}>
 <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ${isTerminal ? 'translate-x-4' : 'translate-x-0'}`}></div>
 </div>
 <span className={`text-[11px] font-semibold ${isTerminal ? 'text-[#FF5630]' : 'text-gray-400'}`}>
 {isTerminal ? 'Terminal' : 'Active'}
 </span>
 </div>
);

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

const STAGE_CONFIGS = {
 'Applied': {
 notifications: [
 { id: 'sendEmail', icon: Mail, title: 'Send Confirmation Email', desc: 'Thank candidate for applying', color: 'blue' },
 { id: 'notifyTeam', icon: Zap, title: 'Notify Hiring Team', desc: 'Alert team of new application', color: 'purple' }
 ],
 requirements: [
 { title: 'Resume Parsed', desc: 'Ensure resume is uploaded and parsed successfully.' },
 { title: 'Knockout Questions Passed', desc: 'Candidate must meet minimum requirements.' }
 ],
 guideline: 'Most candidates in this stage should be screened within 24 hours to maintain engagement.'
 },
 'Screening': {
 notifications: [
 { id: 'sendEmail', icon: Mail, title: 'Send Assessment Link', desc: 'Email technical assessment link', color: 'blue' },
 { id: 'autoSchedule', icon: Calendar, title: 'Schedule Recruiter Screen', desc: 'Send calendar for a 15-min call', color: 'purple' }
 ],
 requirements: [
 { title: 'Assessment Completed', desc: 'Wait for candidate to submit test.' }
 ],
 guideline: 'Keep screening calls brief (15-20 mins) to assess basic fit and communication skills.'
 },
 'Interview': {
 notifications: [
 { id: 'sendEmail', icon: Mail, title: 'Send Interview Details', desc: 'Send directions and agenda', color: 'blue' },
 { id: 'autoSchedule', icon: Calendar, title: 'Auto-Schedule Interview', desc: 'Send calendar link to candidate', color: 'purple' }
 ],
 requirements: [
 { title: 'Scorecard Completed', desc: 'Hiring managers must submit feedback scorecard.' },
 { title: 'Background Check Passed', desc: 'Wait for third-party background verification.' }
 ],
 guideline: 'Candidates typically spend 2-4 days in the Interview stage. Automated follow-ups prevent drop-off.'
 },
 'Offer': {
 notifications: [
 { id: 'sendEmail', icon: Mail, title: 'Send Offer Letter', desc: 'Email via Docusign integration', color: 'blue' },
 { id: 'notifyTeam', icon: Zap, title: 'Notify Finance', desc: 'Alert finance team for approval', color: 'purple' }
 ],
 requirements: [
 { title: 'Offer Accepted', desc: 'Candidate has signed the offer letter.' },
 { title: 'References Checked', desc: 'All reference checks completed successfully.' }
 ],
 guideline: 'Act fast! Offers should ideally be extended within 24 hours of the final interview.'
 },
 'Hired': {
 notifications: [
 { id: 'sendEmail', icon: Mail, title: 'Welcome Email', desc: 'Send first day instructions', color: 'blue' },
 { id: 'triggerOnboarding', icon: Zap, title: 'Trigger Onboarding', desc: 'Start IT and HR onboarding sequence', color: 'purple' }
 ],
 requirements: [
 { title: 'Start Date Confirmed', desc: 'Candidate has agreed to a start date.' }
 ],
 guideline: 'Keep the candidate warm before their start date with team intros and company swag.'
 },
 'Rejected': {
 notifications: [
 { id: 'sendEmail', icon: Mail, title: 'Send Rejection Email', desc: 'Send standard rejection template', color: 'blue' },
 { id: 'delayRejection', icon: Clock, title: 'Delay Notification', desc: 'Wait 24h before sending rejection', color: 'purple' }
 ],
 requirements: [
 { title: 'Rejection Reason Logged', desc: 'Please record a clear reason why the candidate was not selected.' }
 ],
 guideline: 'Always provide a polite rejection. Consider asking if they want to join a talent community.'
 },
};

const StageDetailsPanel = ({ stage, isEditing, onUpdateStage }) => {
 if (!stage) return null;
 const config = STAGE_CONFIGS[stage.systemStage] || STAGE_CONFIGS['Interview'];

 return (
 <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-lg flex flex-col h-full sticky top-6 animate-fade-in">
 <div className="p-6 border-b border-gray-100 dark:border-gray-800/50">
 <div className="flex items-center gap-3 mb-2">
 <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${getStageColor(stage.systemStage)}`}>
 {stage.systemStage}
 </div>
 {stage.isTerminal && (
 <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
 Terminal Stage
 </span>
 )}
 </div>
 <h3 className="text-2xl font-bold text-[#212b36] dark:text-white">
 {stage.customName}
 </h3>
 <p className="text-sm text-gray-500 mt-1">Configure actions and requirements for candidates entering this stage.</p>
 </div>

 <div className="p-6 space-y-8 flex-1 overflow-y-auto">
 {/* Automated Actions */}
 <section>
 <h4 className="text-[13px] font-bold text-gray-400 mb-4 flex items-center gap-2">
 <Zap size={14} className="text-[#FFC107]" /> Notifications
 </h4>
 <div className="space-y-3">
 {config.notifications.map((notif, idx) => {
 const Icon = notif.icon;
 const colorClasses = notif.color === 'blue' 
 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
 : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
 
 return (
 <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
 <div className="flex items-center gap-3">
 <div className={`w-8 h-8 rounded-full ${colorClasses} flex items-center justify-center`}>
 <Icon size={16} />
 </div>
 <div>
 <p className="text-sm font-semibold text-[#212b36] dark:text-white">{notif.title}</p>
 <p className="text-xs text-gray-500">{notif.desc}</p>
 </div>
 </div>
 <div className={!isEditing ? 'opacity-50 pointer-events-none' : ''}>
 <ToggleSwitch checked={stage[notif.id] || false} onChange={(val) => onUpdateStage(notif.id, val)} />
 </div>
 </div>
 );
 })}
 </div>
 </section>

 {/* Requirements */}
 <section>
 <h4 className="text-[13px] font-bold text-gray-400 mb-4 flex items-center gap-2">
 <FileCheck size={14} className="text-[#00A76F]" /> Requirements Before Moving
 </h4>
 <div className="space-y-3">
 {config.requirements.map((req, idx) => (
 <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
 {idx === 0 ? <CheckCircle2 size={18} className="text-[#00A76F] mt-0.5" /> : <Circle size={18} className="text-gray-400 mt-0.5" />}
 <div>
 <p className="text-sm font-semibold text-[#212b36] dark:text-white">{req.title}</p>
 <p className="text-xs text-gray-500 mt-1">{req.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </section>
 
 {/* Guidelines */}
 <section className="bg-[#1890FF]/5 rounded-xl p-4 border border-[#1890FF]/20 flex items-start gap-3">
 <AlertCircle size={18} className="text-[#1890FF] mt-0.5 shrink-0" />
 <div>
 <p className="text-sm font-semibold text-[#1890FF]">Stage Best Practices</p>
 <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
 {config.guideline}
 </p>
 </div>
 </section>
 </div>
 </div>
 );
};

const SortableStageItem = ({ stage, index, totalStages, getStageColor, updateStage, removeStage, isSelected, onSelect, SYSTEM_STAGES }) => {
 const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stage.id });
 
 const style = {
 transform: CSS.Translate.toString(transform),
 transition,
 zIndex: isDragging ? 100 : 50 - index,
 };

 const isTerminal = stage.isTerminal;

 return (
 <div ref={setNodeRef} style={style} className="relative w-full group/item">
 {/* Visual Connector Line (Top to Bottom) */}
 {index !== totalStages - 1 && (
 <div className="absolute left-[34px] top-[60px] bottom-[-30px] w-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
 )}
 
 <div 
 onClick={() => onSelect(stage.id)}
 className={`relative z-10 flex flex-col bg-white dark:bg-[#161c24] rounded-xl border ${isSelected ? 'border-[#1890FF] shadow-md' : isDragging ? 'border-[#1890FF] shadow-2xl scale-[1.02]' : isTerminal ? 'border-[#FF5630]/40 shadow-sm hover:border-[#FF5630]/60' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm'} transition-all duration-200 cursor-pointer`}
 >
 <div className="p-4 pl-3 pr-4 flex flex-col gap-3">
 {/* Header Row */}
 <div className="flex items-center gap-3">
 <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 touch-none shrink-0" onClick={e => e.stopPropagation()}>
 <GripVertical size={16} />
 </div>
 
 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-extrabold shrink-0 shadow-sm transition-colors ${isTerminal ? 'bg-[#FF5630]/10 text-[#FF5630] border border-[#FF5630]/20' : isSelected ? 'bg-[#1890FF] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
 {index + 1}
 </div>
 
 <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
 <input 
 type="text" 
 value={stage.customName}
 onClick={e => e.stopPropagation()}
 onChange={(e) => updateStage(index, 'customName', e.target.value)}
 className="bg-transparent text-[16px] font-semibold text-[#212b36] dark:text-white border-b border-dashed border-transparent hover:border-gray-300 dark:hover:border-gray-600 outline-none focus:border-solid focus:border-[#1890FF] focus:bg-blue-50/50 dark:focus:bg-blue-900/10 px-1 py-1 w-full transition-all truncate"
 placeholder="Stage Name"
 />
 <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity">
 <button 
 onClick={(e) => { e.stopPropagation(); removeStage(index); }}
 className="p-2 text-gray-400 hover:text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
 title="Delete Stage"
 >
 <Trash2 size={16} />
 </button>
 </div>
 </div>
 </div>
 
 {/* Mapping & Terminal Toggle Row */}
 <div className="flex items-center justify-between pl-16">
 <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
 <div className="w-[140px]">
 <SearchableSelect 
 options={SYSTEM_STAGES.map(sys => ({ label: sys, value: sys }))}
 value={stage.systemStage}
 onChange={(value) => updateStage(index, 'systemStage', value)}
 placeholder="Mapping..."
 showSearch={false}
 size="xs"
 />
 </div>
 </div>

 <TerminalSwitch isTerminal={isTerminal} onChange={(val) => updateStage(index, 'isTerminal', val)} />
 </div>
 </div>
 </div>
 </div>
 );
};

const ReadOnlyStageItem = ({ stage, index, totalStages, getStageColor, isSelected, onSelect }) => {
 const isTerminal = stage.isTerminal;
 const colorTheme = getStageColor(stage.systemStage);
 
 return (
 <div className="relative w-full group">
 {/* Visual Connector Line (Top to Bottom) */}
 {index !== totalStages - 1 && (
 <div className="absolute left-[24px] top-[50px] bottom-[-24px] w-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
 )}
 
 <div 
 onClick={() => onSelect(stage.id)}
 style={{ zIndex: 50 - index }} 
 className={`relative z-10 flex flex-col bg-white dark:bg-[#161c24] rounded-xl border ${isSelected ? 'border-[#1890FF] shadow-md' : isTerminal ? 'border-[#FF5630]/40 shadow-sm' : 'border-gray-200 dark:border-gray-700 shadow-sm hover:border-gray-300 dark:hover:border-gray-600'} transition-all hover:-translate-y-0.5 cursor-pointer`}
 >
 <div className="p-4 pl-4 pr-5 flex items-center justify-between gap-4">
 <div className="flex items-center gap-4 flex-1 min-w-0">
 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-extrabold shrink-0 shadow-sm transition-colors ${isTerminal ? 'bg-[#FF5630]/10 text-[#FF5630] border border-[#FF5630]/20' : isSelected ? 'bg-[#1890FF] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
 {index + 1}
 </div>
 
 <div className="flex flex-col flex-1 min-w-0">
 <h3 className="text-[16px] font-semibold text-[#212b36] dark:text-white leading-snug truncate">
 {stage.customName}
 </h3>
 <div className="flex items-center gap-2 mt-1">
 <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${colorTheme.split(' ')[2]} ${colorTheme.split(' ')[3]} border-current/20 shadow-sm bg-white dark:bg-[#161c24]`}>
 {stage.systemStage}
 </span>
 {isTerminal && (
 <span className="text-[11px] font-bold text-[#FF5630] ">
 Terminal
 </span>
 )}
 </div>
 </div>
 </div>
 
 <div className="shrink-0 text-gray-400">
 <ArrowRight size={18} className={`transition-transform ${isSelected ? 'translate-x-1 text-[#1890FF]' : 'group-hover:translate-x-1'}`} />
 </div>
 </div>
 </div>
 </div>
 );
};

export default function SettingsPipeline({ setSettingsActiveNav }) {
 const navigate = useNavigate();
 const location = useLocation();
 const [isEditingOrder, setIsEditingOrder] = useState(false);
 const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);
 
 const initialJobData = location.state?.jobData || {};
 const [isEditingSettings, setIsEditingSettings] = useState(initialJobData?.status !== 'Published');
 const [jobData, setJobData] = useState({ ...initialJobData });

 const [stages, setStages] = useState([
 { id: '1', customName: 'Applied', systemStage: 'Applied', isTerminal: false },
 { id: '2', customName: 'Screening', systemStage: 'Screening', isTerminal: false },
 { id: '3', customName: 'Technical Interview', systemStage: 'Interview', isTerminal: false },
 { id: '4', customName: 'Offer', systemStage: 'Offer', isTerminal: false },
 { id: '5', customName: 'Hired', systemStage: 'Hired', isTerminal: true },
 { id: '6', customName: 'Rejected', systemStage: 'Rejected', isTerminal: true }
 ]);

 const [selectedStageId, setSelectedStageId] = useState(stages[0]?.id);

 const handleJobDataChange = (field, value) => {
 setJobData(prev => ({ ...prev, [field]: value }));
 };

 const updateStage = (index, field, value) => {
 const newStages = [...stages];
 newStages[index] = { ...newStages[index], [field]: value };
 setStages(newStages);
 };

 const removeStage = (index) => {
 setStages(stages.filter((_, i) => i !== index));
 if (selectedStageId === stages[index].id) {
 setSelectedStageId(stages[0]?.id);
 }
 };

 const addStage = () => {
 const newId = (Math.max(...stages.map(s => parseInt(s.id) || 0), 0) + 1).toString();
 const newStage = { id: newId, customName: 'New Stage', systemStage: 'Screening', isTerminal: false };
 setStages([...stages, newStage]);
 setSelectedStageId(newId);
 if (!isEditingOrder) setIsEditingOrder(true);
 };

 const sensors = useSensors(
 useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
 );

 const handleDragEnd = (event) => {
 const { active, over } = event;
 if (over && active.id !== over.id) {
 setStages((items) => {
 const oldIndex = items.findIndex((item) => item.id === active.id);
 const newIndex = items.findIndex((item) => item.id === over.id);
 return arrayMove(items, oldIndex, newIndex);
 });
 }
 };

 if (!initialJobData) {
 return (
 <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
 <h2 className="text-2xl font-bold text-[#212b36] dark:text-white mb-2">No Job Selected</h2>
 <p className="text-black mb-6">Please create a job or select one to view its setup overview.</p>
 <button 
 onClick={() => navigate('/dashboard/jobs')}
 className="px-5 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-lg shadow-sm transition-colors cursor-pointer"
 >
 Back to Jobs
 </button>
 </div>
 );
 }

 const selectedStage = stages.find(s => s.id === selectedStageId) || stages[0];

 return (
 <div className="p-6 space-y-6 animate-fade-in flex flex-col min-h-[calc(100vh-100px)]">
 
 

 <div className="flex-1">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start">
 
 {/* Left Column: Vertical Pipeline */}
 <div className="col-span-1 lg:col-span-6 xl:col-span-5 bg-white dark:bg-[#161c24] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50 flex flex-col">
 <div className="flex items-center justify-between mb-8 sticky top-0 bg-white dark:bg-[#161c24] z-20 pb-2 border-b border-transparent">
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
 <GitBranch size={20} className="text-[#1890FF]" />
 Hiring Stages
 </h2>
 
 <div className="flex gap-2 items-center">
 <button
 onClick={() => setIsEditingSettings(prev => !prev)}
 className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-[#1890FF] transition-colors cursor-pointer"
 title={isEditingSettings ? "Save changes" : "Edit Pipeline"}
 >
 {isEditingSettings ? <Check size={16} className="text-[#00A76F]" /> : <Settings size={16} />}
 </button>

 {isEditingSettings && (
 !isEditingOrder ? (
 <button 
 onClick={() => setIsEditingOrder(true)}
 className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-[#1890FF] rounded-lg hover:bg-[#1890FF]/90 transition-colors shadow-sm cursor-pointer"
 >
 <Settings2 size={14} />
 Edit Order
 </button>
 ) : (
 <button 
 onClick={() => setIsEditingOrder(false)}
 className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#212b36] dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm cursor-pointer"
 >
 Done Editing
 </button>
 )
 )}
 </div>
 </div>

 <div className="relative pt-2 px-2 flex-1 pb-4">
 <div className="flex flex-col gap-6">
 {!isEditingOrder ? (
 stages.map((stage, index) => (
 <ReadOnlyStageItem
 key={stage.id}
 stage={stage}
 index={index}
 totalStages={stages.length}
 getStageColor={getStageColor}
 isSelected={selectedStageId === stage.id}
 onSelect={setSelectedStageId}
 />
 ))
 ) : (
 <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
 <SortableContext items={stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
 {stages.map((stage, index) => (
 <SortableStageItem
 key={stage.id}
 stage={stage}
 index={index}
 totalStages={stages.length}
 getStageColor={getStageColor}
 updateStage={updateStage}
 removeStage={removeStage}
 isSelected={selectedStageId === stage.id}
 onSelect={setSelectedStageId}
 SYSTEM_STAGES={SYSTEM_STAGES}
 />
 ))}
 </SortableContext>
 </DndContext>
 )}
 </div>

 <div className="mt-8 flex items-center justify-center pb-2">
 <button 
 onClick={addStage}
 disabled={!isEditingSettings}
 className={`px-5 py-2.5 bg-[#1890FF]/5 hover:bg-[#1890FF]/10 text-[#1890FF] rounded-xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer border border-[#1890FF]/20 border-dashed hover:border-[#1890FF]/40 w-full justify-center ${!isEditingSettings ? 'opacity-50 cursor-not-allowed' : ''}`}
 >
 <Plus size={16} /> Add New Stage
 </button>
 </div>
 </div>
 </div>

 {/* Right Column: Stage Details Panel */}
 <div className="col-span-1 lg:col-span-6 xl:col-span-7 h-full">
 <StageDetailsPanel 
 stage={selectedStage} 
 isEditing={isEditingSettings} 
 onUpdateStage={(field, value) => {
 const index = stages.findIndex(s => s.id === selectedStageId);
 if (index !== -1) updateStage(index, field, value);
 }}
 />
 </div>

 </div>
 </div>

 <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto shrink-0">
 <button 
 onClick={() => setSettingsActiveNav('Hiring Team')}
 className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Previous: Back to Hiring Team
 </button>
 <div className="flex items-center gap-4">
 <button 
 onClick={() => setIsConfirmDraftModalOpen(true)}
 className="px-6 py-3 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Save and Exit
 </button>
 <button 
 onClick={() => setSettingsActiveNav('Scorecards')}
 className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
 >
 Save and Continue to 'Scorecards'
 </button>
 </div>
 </div>
 
 {/* Draft Confirm Modal */}
 {isConfirmDraftModalOpen && (
 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-sm flex flex-col shadow-2xl animate-scale-up overflow-hidden">
 <div className="p-6 text-center space-y-4">
 <div className="w-16 h-16 bg-[#1890FF]/10 text-[#1890FF] rounded-full flex items-center justify-center mx-auto mb-2">
 <Settings2 size={32} />
 </div>
 <h3 className="text-xl font-bold text-[#212b36] dark:text-white">Save as Draft?</h3>
 <p className="text-sm text-black dark:text-gray-400">
 You can return and finish setting up this job pipeline later. Your current progress will be saved.
 </p>
 </div>
 <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 bg-gray-50 dark:bg-gray-800/50">
 <button 
 onClick={() => setIsConfirmDraftModalOpen(false)} 
 className="flex-1 px-4 py-2.5 text-sm font-bold text-black hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 rounded-xl transition-colors cursor-pointer"
 >
 Cancel
 </button>
 <button 
 onClick={() => {
 setIsConfirmDraftModalOpen(false);
 navigate('/dashboard/jobs');
 }}
 className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-xl shadow-sm transition-colors cursor-pointer"
 >
 Yes, Save & Close
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
