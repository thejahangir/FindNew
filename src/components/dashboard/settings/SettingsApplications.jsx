import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
 Users, Search, Filter, MoreHorizontal, 
 Calendar, MapPin, Mail, Phone, 
 Settings2, Plus, GripVertical, X,
 ChevronDown, ChevronRight
} from 'lucide-react';
import { 
 DndContext, DragOverlay, pointerWithin, 
 KeyboardSensor, PointerSensor, useSensor, useSensors,
 useDroppable
} from '@dnd-kit/core';
import { 
 SortableContext, arrayMove, sortableKeyboardCoordinates, 
 rectSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SearchableSelect from '../../ui/SearchableSelect';

const PIPELINE_STAGES = [
 { id: 'applied', title: 'Applied' },
 { id: 'screening', title: 'Screening' },
 { id: 'interview', title: 'Interview' },
 { id: 'interview_l2', title: 'Interview L2' },
 { id: 'offer', title: 'Offer' },
 { id: 'hired', title: 'Hired' }
];

const INITIAL_CANDIDATES = [
 { id: 'c1', name: 'John Doe', stage: 'applied', score: 98, role: 'Software Engineer', date: '2 days ago', avatar: 'JD' },
 { id: 'c2', name: 'Jane Smith', stage: 'applied', score: 95, role: 'Software Engineer', date: '3 days ago', avatar: 'JS' },
 { id: 'c8', name: 'Alex Johnson', stage: 'applied', score: 92, role: 'Frontend Developer', date: '4 days ago', avatar: 'AJ' },
 { id: 'c9', name: 'Maria Garcia', stage: 'applied', score: 90, role: 'Backend Developer', date: '4 days ago', avatar: 'MG' },
 { id: 'c10', name: 'James Wilson', stage: 'applied', score: 88, role: 'Full Stack Engineer', date: '5 days ago', avatar: 'JW' },
 { id: 'c11', name: 'Linda Brown', stage: 'applied', score: 85, role: 'DevOps Engineer', date: '5 days ago', avatar: 'LB' },
 { id: 'c12', name: 'William Davis', stage: 'applied', score: 82, role: 'Software Engineer', date: '6 days ago', avatar: 'WD' },
 { id: 'c13', name: 'Emma Martinez', stage: 'applied', score: 80, role: 'UI Engineer', date: '6 days ago', avatar: 'EM' },
 { id: 'c14', name: 'Oliver Anderson', stage: 'applied', score: 79, role: 'Systems Engineer', date: '1 week ago', avatar: 'OA' },
 { id: 'c15', name: 'Sophia Taylor', stage: 'applied', score: 78, role: 'Software Engineer', date: '1 week ago', avatar: 'ST' },
 { id: 'c16', name: 'Daniel Miller', stage: 'applied', score: 77, role: 'QA Engineer', date: '1 week ago', avatar: 'DM' },
 { id: 'c17', name: 'Isabella Moore', stage: 'applied', score: 75, role: 'Product Manager', date: '1 week ago', avatar: 'IM' },
 { id: 'c18', name: 'Matthew Jackson', stage: 'applied', score: 74, role: 'Security Analyst', date: '2 weeks ago', avatar: 'MJ' },
 { id: 'c19', name: 'Chloe Martin', stage: 'applied', score: 73, role: 'Data Scientist', date: '2 weeks ago', avatar: 'CM' },
 { id: 'c20', name: 'Ethan Lee', stage: 'applied', score: 72, role: 'Data Engineer', date: '2 weeks ago', avatar: 'EL' },
 { id: 'c21', name: 'Mia Harris', stage: 'applied', score: 70, role: 'Mobile Developer', date: '3 weeks ago', avatar: 'MH' },
 { id: 'c22', name: 'Alexander Clark', stage: 'applied', score: 68, role: 'Software Engineer', date: '3 weeks ago', avatar: 'AC' },
 { id: 'c23', name: 'Amelia Lewis', stage: 'applied', score: 65, role: 'UX Designer', date: '3 weeks ago', avatar: 'AL' },
 { id: 'c24', name: 'Henry Robinson', stage: 'applied', score: 60, role: 'DevOps Engineer', date: '4 weeks ago', avatar: 'HR' },
 { id: 'c25', name: 'Charlotte Walker', stage: 'applied', score: 55, role: 'Software Engineer', date: '4 weeks ago', avatar: 'CW' },
 { id: 'c3', name: 'Michael Chen', stage: 'screening', score: 92, role: 'Software Engineer', date: '5 days ago', avatar: 'MC' },
 { id: 'c4', name: 'Sarah Jones', stage: 'interview', score: 88, role: 'Software Engineer', date: '1 week ago', avatar: 'SJ' },
 { id: 'c26', name: 'Jessica Parker', stage: 'interview', score: 87, role: 'Software Engineer', date: '1 week ago', avatar: 'JP' },
 { id: 'c27', name: 'Andrew Thomas', stage: 'interview', score: 86, role: 'Software Engineer', date: '1 week ago', avatar: 'AT' },
 { id: 'c28', name: 'Rachel Green', stage: 'interview', score: 84, role: 'Software Engineer', date: '2 weeks ago', avatar: 'RG' },
 { id: 'c29', name: 'Kevin White', stage: 'interview', score: 81, role: 'Software Engineer', date: '2 weeks ago', avatar: 'KW' },
 { id: 'c30', name: 'Brian Scott', stage: 'interview', score: 79, role: 'Software Engineer', date: '2 weeks ago', avatar: 'BS' },
 { id: 'c5', name: 'David Kim', stage: 'interview_l2', score: 94, role: 'Software Engineer', date: '2 weeks ago', avatar: 'DK' },
 { id: 'c6', name: 'Emily White', stage: 'offer', score: 96, role: 'Software Engineer', date: '3 weeks ago', avatar: 'EW' },
 { id: 'c7', name: 'Robert Lee', stage: 'hired', score: 99, role: 'Software Engineer', date: '1 month ago', avatar: 'RL' },
];

const SortableCandidateCard = ({ candidate, onMoveStage }) => {
 const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
 id: candidate.id,
 data: {
 type: 'Candidate',
 candidate,
 },
 });

 const style = {
 transform: transform ? CSS.Transform.toString(transform) : undefined,
 transition,
 opacity: isDragging ? 0.6 : 1, // Keep partially visible as a placeholder
 };

 return (
 <div
 ref={setNodeRef}
 style={style}
 {...attributes}
 {...listeners}
 className={`flex-1 basis-[calc(25%-1rem)] min-w-[250px] max-w-[calc(25%-0.75rem)] shrink-0 p-3 rounded-xl group relative transition-all hover:z-[60] focus-within:z-[60] ${
 isDragging 
 ? 'bg-[#1890FF]/5 border-2 border-dashed border-[#1890FF]/50 shadow-none grayscale-[50%]' 
 : 'bg-white dark:bg-[#212b36] border border-gray-200 dark:border-gray-700 shadow-[0_2px_12px_rgba(0,0,0,0.04)] cursor-grab active:cursor-grabbing hover:shadow-md'
 }`}
 >
 <div className="flex justify-between items-start mb-1.5">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1890FF] to-[#1890FF]/60 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
 {candidate.avatar}
 </div>
 <div>
 <h4 className="font-bold text-[#212b36] dark:text-white text-[13px] leading-tight line-clamp-1">{candidate.name}</h4>
 <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">{candidate.role}</p>
 </div>
 </div>
 <div className="flex flex-col items-end gap-1">
 <span className="text-[9px] font-semibold text-[#FF5630]">
 {candidate.score || 85}% Match
 </span>
 </div>
 </div>
 <div className="flex items-center justify-between text-[11px] text-black mt-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-800">
 <div className="flex items-center gap-1 font-medium">
 <Calendar size={12} className="text-[#1890FF]" />
 {candidate.date}
 </div>
 <div className="flex items-center">
 <div className="w-36 origin-right scale-[0.75]" onPointerDown={(e) => e.stopPropagation()}>
 <SearchableSelect 
 options={PIPELINE_STAGES.map(s => ({ value: s.id, label: s.title }))}
 value={candidate.stage}
 onChange={(val) => onMoveStage(candidate.id, val)}
 showSearch={false}
 size="sm"
 />
 </div>
 </div>
 </div>
 </div>
 );
};

// Simplified copy of the card just for the drag overlay
const CandidateCardOverlay = ({ candidate }) => {
 return (
 <div className="w-[320px] bg-white dark:bg-[#212b36] p-4 rounded-xl border-2 border-[#1890FF] shadow-2xl opacity-90 rotate-2 scale-105 cursor-grabbing relative z-50">
 <div className="flex justify-between items-start mb-3">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1890FF] to-[#1890FF]/60 text-white flex items-center justify-center font-bold text-sm shadow-sm">
 {candidate.avatar}
 </div>
 <div>
 <h4 className="font-bold text-[#212b36] dark:text-white text-sm">{candidate.name}</h4>
 <p className="text-xs text-black">{candidate.role}</p>
 </div>
 </div>
 </div>
 <div className="flex items-center justify-between text-xs text-black mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
 <div className="flex items-center gap-1.5 font-medium">
 <Calendar size={12} className="text-[#1890FF]" />
 {candidate.date}
 </div>
 </div>
 </div>
 );
};

const PipelineSwimlane = ({ stage, candidates, onMoveStage, onOpenHiddenCandidates }) => {
 const [isExpanded, setIsExpanded] = useState(stage.id === 'applied' || stage.title === 'Applied');
 const { setNodeRef } = useDroppable({
 id: stage.id,
 data: {
 type: 'Column',
 stage,
 },
 });

 const sortedCandidates = [...candidates].sort((a, b) => (b.score || 0) - (a.score || 0));
 const topCandidates = sortedCandidates.slice(0, 4);
 const hiddenCount = sortedCandidates.length - 4;

 return (
 <div ref={setNodeRef} className="flex flex-col w-full bg-gray-50/80 dark:bg-[#161c24]/80 rounded-2xl border border-gray-200 dark:border-gray-800/80 overflow-visible shrink-0 relative hover:z-[50] focus-within:z-[50] transition-all duration-300">
 <div className={`px-4 py-3 border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between bg-white/50 dark:bg-[#212b36]/50 transition-all ${isExpanded ? 'border-b rounded-t-2xl' : 'rounded-2xl'}`}>
 <div 
 className="flex items-center gap-2 cursor-pointer select-none group"
 onClick={() => setIsExpanded(!isExpanded)}
 >
 <div className="flex items-center justify-center w-6 h-6 rounded-md transition-colors bg-[#1890FF]/10 text-[#1890FF]">
 <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? '' : '-rotate-90'}`} />
 </div>
 <h3 className="font-bold text-[#212b36] dark:text-white">{stage.title}</h3>
 <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
 {candidates.length}
 </span>
 </div>
 
 {hiddenCount > 0 && (
 <div 
 onClick={(e) => { e.stopPropagation(); onOpenHiddenCandidates(stage.title, sortedCandidates.slice(4)); }}
 className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" title={`There are ${hiddenCount} more candidates with lower match scores.`}>
 <div className="flex -space-x-1.5">
 {sortedCandidates.slice(4, 7).map((hc, idx) => (
 <div key={hc.id} className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center font-bold text-[9px] shadow-sm ring-2 ring-white dark:ring-[#161c24] relative" style={{ zIndex: 10 - idx }}>
 {hc.avatar}
 </div>
 ))}
 </div>
 <span className="text-[10px] font-bold text-[#1890FF] bg-[#1890FF]/10 border border-[#1890FF]/20 px-1.5 py-0.5 rounded-full">+{hiddenCount}</span>
 </div>
 )}
 </div>

 <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
 <div className="overflow-hidden">
 <div className={`px-4 pt-3 pb-2 ${candidates.length === 0 ? 'min-h-[120px] flex items-center justify-center' : 'min-h-[135px]'}`}>
 <SortableContext items={candidates.map(c => c.id)} strategy={rectSortingStrategy}>
 <div className="flex flex-row flex-wrap gap-4 w-full h-full relative">
 {candidates.length > 0 ? (
 topCandidates.map((candidate) => (
 <SortableCandidateCard key={candidate.id} candidate={candidate} onMoveStage={onMoveStage} />
 ))
 ) : (
 <div className="w-full h-full min-h-[80px] flex items-center justify-center text-sm font-bold text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700/50 rounded-xl bg-white/30 dark:bg-[#212b36]/30">
 No candidates in this stage right now
 </div>
 )}
 </div>
 </SortableContext>
 </div>
 </div>
 </div>
 </div>
 );
};

export default function SettingsApplications() {
 const navigate = () => {};
 const location = { state: null };
 const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);
 const [hiddenCandidatesModal, setHiddenCandidatesModal] = useState({ isOpen: false, stageTitle: '', candidates: [] });
 const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
 const [activeId, setActiveId] = useState(null);
 const [searchQuery, setSearchQuery] = useState('');

 const filteredCandidates = candidates.filter(c => 
 c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
 c.role.toLowerCase().includes(searchQuery.toLowerCase())
 );

 const moveCandidate = (candidateId, newStageId) => {
 setCandidates(prev => prev.map(c => 
 c.id === candidateId ? { ...c, stage: newStageId } : c
 ));
 };
 
 
 
 const initialJobData = {};
 const [jobData, setJobData] = useState({ ...initialJobData });

 const handleJobDataChange = (field, value) => {
 setJobData(prev => ({ ...prev, [field]: value }));
 };

 const sensors = useSensors(
 useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
 );

 const handleDragStart = (event) => {
 setActiveId(event.active.id);
 };

 const handleDragOver = (event) => {
 const { active, over } = event;
 if (!over) return;

 const activeId = active.id;
 const overId = over.id;

 if (activeId === overId) return;

 const isActiveCandidate = active.data.current?.type === 'Candidate';
 const isOverCandidate = over.data.current?.type === 'Candidate';
 const isOverColumn = over.data.current?.type === 'Column';

 if (!isActiveCandidate) return;

 if (isActiveCandidate && isOverCandidate) {
 setCandidates((candidates) => {
 const activeIndex = candidates.findIndex((c) => c.id === activeId);
 const overIndex = candidates.findIndex((c) => c.id === overId);
 
 if (candidates[activeIndex].stage !== candidates[overIndex].stage) {
 const newCandidates = [...candidates];
 newCandidates[activeIndex].stage = candidates[overIndex].stage;
 return arrayMove(newCandidates, activeIndex, overIndex);
 }
 
 return arrayMove(candidates, activeIndex, overIndex);
 });
 }

 if (isActiveCandidate && isOverColumn) {
 setCandidates((candidates) => {
 const activeIndex = candidates.findIndex((c) => c.id === activeId);
 
 if (candidates[activeIndex].stage !== overId) {
 const newCandidates = [...candidates];
 newCandidates[activeIndex].stage = overId;
 return arrayMove(newCandidates, activeIndex, newCandidates.length - 1);
 }
 return candidates;
 });
 }
 };

 const handleDragEnd = (event) => {
 setActiveId(null);
 };

 const activeCandidate = activeId ? candidates.find((c) => c.id === activeId) : null;

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

 return (
 <div className="p-6 space-y-6 animate-fade-in flex flex-col min-h-[calc(100vh-100px)]">
 
 

 <div className="flex-1 flex flex-col bg-white dark:bg-[#161c24] p-4 sm:p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800/50 overflow-hidden">
 
 <div className="flex items-center justify-between mb-6 shrink-0">
 <div className="flex items-center gap-4">
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
 <Users size={20} className="text-[#1890FF]" />
 Pipeline Overview
 </h2>
 </div>
 <div className="flex items-center gap-3">
 <div className="relative">
 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
 <input 
 type="text" 
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search candidates..." 
 className="pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-[#212b36] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1890FF]/50 transition-shadow w-48 sm:w-64 text-[#212b36] dark:text-white"
 />
 </div>
 </div>
 </div>

 {/* Pipeline Swimlanes Scrolling Container */}
 <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2">
 <div className="flex flex-col gap-6 h-full pb-4">
 <DndContext
 sensors={sensors}
 collisionDetection={pointerWithin}
 onDragStart={handleDragStart}
 onDragOver={handleDragOver}
 onDragEnd={handleDragEnd}
 >
 {PIPELINE_STAGES.map((stage) => (
 <PipelineSwimlane 
 key={stage.id} 
 stage={stage} 
 candidates={filteredCandidates.filter(c => c.stage === stage.id)} 
 onMoveStage={moveCandidate}
 onOpenHiddenCandidates={(stageTitle, hiddenCandidates) => setHiddenCandidatesModal({ isOpen: true, stageTitle, candidates: hiddenCandidates })}
 />
 ))}

 <DragOverlay>
 {activeCandidate ? <CandidateCardOverlay candidate={activeCandidate} /> : null}
 </DragOverlay>
 </DndContext>
 </div>
 </div>
 </div>

 <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto shrink-0">
 <button 
 onClick={() => navigate('/dashboard/job-setup/pipeline', { state: { jobData } })}
 className="px-6 py-2.5 text-sm font-bold text-black bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Previous: Back to Pipeline
 </button>
 <div className="flex items-center gap-4">
 <button 
 onClick={() => setIsConfirmDraftModalOpen(true)}
 className="px-6 py-3 text-sm font-bold text-[#212b36] dark:text-white bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
 >
 Save and Exit
 </button>
 <button 
 onClick={() => navigate('/dashboard/job-setup/scorecards', { state: { jobData } })}
 className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
 >
 Save and Continue to 'Scorecards'
 </button>
 </div>
 </div>
 
 {/* Confirm Draft Modal */}
 {isConfirmDraftModalOpen && createPortal(
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
 if (typeof setToastMessage !== 'undefined') {
 setToastMessage('Saved as draft.');
 }
 setTimeout(() => {
 if (typeof navigate !== 'undefined') {
 navigate('/dashboard/jobs');
 } else {
 window.location.href = '/dashboard/jobs';
 }
 }, 1000);
 }}
 className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-xl shadow-sm transition-colors cursor-pointer"
 >
 Yes, Save & Close
 </button>
 </div>
 </div>
 </div>,
 document.body
 )}

 {/* Hidden Candidates Modal */}
 {hiddenCandidatesModal.isOpen && createPortal(
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fade-in">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-lg flex flex-col shadow-2xl animate-scale-up overflow-hidden max-h-[80vh]">
 <div className="p-6 border-b border-gray-100 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
 <h3 className="text-lg font-bold text-[#212b36] dark:text-white flex items-center gap-2">
 <Users size={18} className="text-[#1890FF]" />
 Hidden Candidates - {hiddenCandidatesModal.stageTitle}
 </h3>
 <button 
 onClick={() => setHiddenCandidatesModal({ isOpen: false, stageTitle: '', candidates: [] })}
 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
 >
 <X size={20} />
 </button>
 </div>
 <div className="p-4 overflow-y-auto flex flex-col gap-3">
 {hiddenCandidatesModal.candidates.map(candidate => (
 <div key={candidate.id} className="flex items-center justify-between p-4 bg-white dark:bg-[#212b36] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1890FF] to-[#1890FF]/60 flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-[#e6f4ff] dark:ring-[#161c24]">
 {candidate.avatar}
 </div>
 <div>
 <h4 className="font-bold text-[#212b36] dark:text-white text-sm">{candidate.name}</h4>
 <p className="text-xs text-black font-medium mt-0.5">{candidate.role}</p>
 </div>
 </div>
 <div className="flex flex-col items-end">
 <span className="text-[11px] font-semibold text-[#FF5630]">
 {candidate.score || 85}% Match
 </span>
 <div className="mt-2 w-48">
 <SearchableSelect 
 options={PIPELINE_STAGES.map(s => ({ 
 value: s.id, 
 label: s.id === candidate.stage ? s.title : `Move to ${s.title}`,
 disabled: s.id === candidate.stage
 }))}
 value={candidate.stage}
 onChange={(val) => {
 moveCandidate(candidate.id, val);
 setHiddenCandidatesModal(prev => ({
 ...prev,
 candidates: prev.candidates.filter(c => c.id !== candidate.id)
 }));
 }}
 showSearch={false}
 size="sm"
 />
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>,
 document.body
 )}
 </div>
 );
}
