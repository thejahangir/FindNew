import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Columns, GitBranch, ArrowRight, Settings, Plus, Zap, Settings2, Trash2, GripVertical, Mail, Calendar, FileCheck, CheckCircle2, Circle, AlertCircle, Clock, Check, Edit2 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SearchableSelect from '../../ui/SearchableSelect';

const SYSTEM_STAGES = [
  'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'
];

const getStageColor = (systemStage) => {
  switch (systemStage) {
    case 'Applied': return 'text-[#1890FF] bg-[#1890FF]/10 border-[#1890FF]/20';
    case 'Screening': return 'text-[#FFC107] bg-[#FFC107]/10 border-[#FFC107]/20';
    case 'Interview': return 'text-[#1890FF] bg-[#1890FF]/10 border-[#1890FF]/20';
    case 'Offer': return 'text-[#00A76F] bg-[#00A76F]/10 border-[#00A76F]/20';
    case 'Hired': return 'text-[#00A76F] bg-[#00A76F]/10 border-[#00A76F]/20';
    case 'Rejected': return 'text-[#FF5630] bg-[#FF5630]/10 border-[#FF5630]/20';
    default: return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};

const STAGE_CONFIGS = {
  'Applied': {
    notifications: [
      { id: 'sendEmail', icon: Mail, title: 'Send Confirmation Email', desc: 'Thank candidate for applying', active: true },
      { id: 'notifyTeam', icon: Zap, title: 'Notify Hiring Team', desc: 'Alert team of new application', active: true }
    ],
    requirements: [
      'Resume uploaded & parsed',
      'Knockout screening questions passed'
    ],
    guideline: 'Candidates in this stage should be reviewed within 24 hours to maintain engagement.'
  },
  'Screening': {
    notifications: [
      { id: 'sendEmail', icon: Mail, title: 'Send Assessment Link', desc: 'Email technical assessment link', active: true },
      { id: 'autoSchedule', icon: Calendar, title: 'Schedule Recruiter Screen', desc: 'Send calendar for 15-min call', active: false }
    ],
    requirements: [
      'Preliminary phone screen completed',
      'Basic skill evaluation passed'
    ],
    guideline: 'Keep screening calls brief (15-20 mins) to assess basic fit and communication skills.'
  },
  'Interview': {
    notifications: [
      { id: 'sendEmail', icon: Mail, title: 'Send Interview Details', desc: 'Send meeting link & agenda', active: true },
      { id: 'autoSchedule', icon: Calendar, title: 'Auto-Schedule Interview', desc: 'Send calendar invite to candidate', active: true }
    ],
    requirements: [
      'Technical evaluation scorecard submitted',
      'Cultural alignment verified'
    ],
    guideline: 'Scorecards should be filled out within 2 hours post-interview for accurate evaluation.'
  },
  'Offer': {
    notifications: [
      { id: 'sendEmail', icon: Mail, title: 'Send Offer Letter', desc: 'Email digital offer package', active: true },
      { id: 'notifyTeam', icon: Zap, title: 'Notify HR & Finance', desc: 'Alert finance team for approval', active: true }
    ],
    requirements: [
      'Compensation package approved',
      'Reference checks completed'
    ],
    guideline: 'Extend formal offers within 24 hours of decision to maximize acceptance rate.'
  },
  'Hired': {
    notifications: [
      { id: 'sendEmail', icon: Mail, title: 'Welcome Email', desc: 'Send day 1 instructions', active: true },
      { id: 'triggerOnboarding', icon: Zap, title: 'Trigger Onboarding Flow', desc: 'Initiate IT & HR setup', active: true }
    ],
    requirements: [
      'Signed contract received',
      'Start date confirmed'
    ],
    guideline: 'Ensure IT equipment is dispatched at least 3 business days before joining date.'
  },
  'Rejected': {
    notifications: [
      { id: 'sendEmail', icon: Mail, title: 'Send Rejection Email', desc: 'Polite personalized feedback', active: false }
    ],
    requirements: [
      'Rejection reason documented in audit log'
    ],
    guideline: 'Keep candidate in talent pool for future relevant opportunities.'
  }
};

function SortableStageItem({ stage, index, totalStages, updateStage, removeStage, isSelected, onSelect, isEditing }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stage.id });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 50 - index,
  };

  const isTerminal = stage.isTerminal;

  return (
    <div ref={setNodeRef} style={style} className="relative w-full group">
      {index !== totalStages - 1 && (
        <div className="absolute left-[24px] top-[48px] bottom-[-20px] w-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
      )}
      
      <div 
        onClick={() => onSelect(stage.id)}
        className={`relative z-10 flex flex-col bg-white dark:bg-[#161c24] rounded-xl border p-3.5 transition-all cursor-pointer ${
          isSelected 
            ? 'border-[#1890FF] shadow-sm ring-1 ring-[#1890FF]/30' 
            : 'border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        <div className="flex items-center gap-3">
          {isEditing && (
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1 shrink-0" onClick={e => e.stopPropagation()}>
              <GripVertical size={16} />
            </div>
          )}

          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${isSelected ? 'bg-[#1890FF] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input 
                type="text" 
                value={stage.customName}
                onClick={e => e.stopPropagation()}
                onChange={(e) => updateStage(index, 'customName', e.target.value)}
                className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] font-bold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
              />
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-bold text-[#212b36] dark:text-white truncate">{stage.customName}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getStageColor(stage.systemStage)}`}>
                  {stage.systemStage}
                </span>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-28" onClick={e => e.stopPropagation()}>
                <SearchableSelect 
                  options={SYSTEM_STAGES.map(sys => ({ label: sys, value: sys }))}
                  value={stage.systemStage}
                  onChange={(value) => updateStage(index, 'systemStage', value)}
                  showSearch={false}
                  size="xs"
                />
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeStage(index); }}
                className="p-1.5 text-gray-400 hover:text-[#FF5630] rounded-lg transition-colors cursor-pointer"
                title="Delete stage"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}

          {!isEditing && (
            <div className="shrink-0 text-gray-400">
              <ArrowRight size={14} className={isSelected ? 'text-[#1890FF] translate-x-0.5' : ''} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPipeline({ setSettingsActiveNav }) {
  const navigate = useNavigate();
  const [editModes, setEditModes] = useState({
    stages: false,
    stageDetails: false
  });

  const [stages, setStages] = useState([
    { id: '1', customName: 'Applied', systemStage: 'Applied', isTerminal: false },
    { id: '2', customName: 'Screening', systemStage: 'Screening', isTerminal: false },
    { id: '3', customName: 'Technical Interview', systemStage: 'Interview', isTerminal: false },
    { id: '4', customName: 'Offer Extended', systemStage: 'Offer', isTerminal: false },
    { id: '5', customName: 'Hired', systemStage: 'Hired', isTerminal: true },
    { id: '6', customName: 'Rejected', systemStage: 'Rejected', isTerminal: true }
  ]);

  const [selectedStageId, setSelectedStageId] = useState('1');

  const updateStage = (index, field, value) => {
    const newStages = [...stages];
    newStages[index] = { ...newStages[index], [field]: value };
    setStages(newStages);
  };

  const removeStage = (index) => {
    setStages(stages.filter((_, i) => i !== index));
    if (selectedStageId === stages[index].id) {
      setSelectedStageId(stages[0]?.id || null);
    }
  };

  const addStage = () => {
    const newId = (Math.max(...stages.map(s => parseInt(s.id) || 0), 0) + 1).toString();
    const newStage = { id: newId, customName: 'New Round', systemStage: 'Interview', isTerminal: false };
    setStages([...stages, newStage]);
    setSelectedStageId(newId);
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

  const selectedStage = stages.find(s => s.id === selectedStageId) || stages[0];
  const stageConfig = STAGE_CONFIGS[selectedStage?.systemStage] || STAGE_CONFIGS['Interview'];

  return (
    <div className="flex flex-col animate-fade-in">
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Card: Hiring Stages */}
        <div className="col-span-1 lg:col-span-5 bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all flex flex-col">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                <GitBranch size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Pipeline Stages</h2>
                <p className="text-xs text-gray-500">{stages.length} defined stages</p>
              </div>
            </div>

            {editModes.stages ? (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, stages: false }))}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-sm text-xs font-bold cursor-pointer shrink-0"
                title="Done"
              >
                <Check size={12} className="text-white stroke-[2.5]" />
                <span>Done</span>
              </button>
            ) : (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, stages: true }))}
                className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                title="Edit"
              >
                <Edit2 size={11} className="text-white" />
              </button>
            )}
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {stages.map((stage, idx) => (
                  <SortableStageItem 
                    key={stage.id}
                    stage={stage}
                    index={idx}
                    totalStages={stages.length}
                    updateStage={updateStage}
                    removeStage={removeStage}
                    isSelected={selectedStage?.id === stage.id}
                    onSelect={setSelectedStageId}
                    isEditing={editModes.stages}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {editModes.stages && (
            <button 
              onClick={addStage}
              className="mt-5 w-full py-2.5 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[#1890FF] rounded-xl text-xs font-bold text-gray-500 hover:text-[#1890FF] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={14} /> Add Stage
            </button>
          )}
        </div>

        {/* Right Card: Stage Details & Automations */}
        {selectedStage && (
          <div className="col-span-1 lg:col-span-7 bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all flex flex-col">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                  <Settings2 size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#212b36] dark:text-white">{selectedStage.customName}</h2>
                  <p className="text-xs text-gray-500">Automations & Stage Settings</p>
                </div>
              </div>

              {editModes.stageDetails ? (
                <button
                  onClick={() => setEditModes(prev => ({ ...prev, stageDetails: false }))}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-sm text-xs font-bold cursor-pointer shrink-0"
                  title="Done"
                >
                  <Check size={12} className="text-white stroke-[2.5]" />
                  <span>Done</span>
                </button>
              ) : (
                <button
                  onClick={() => setEditModes(prev => ({ ...prev, stageDetails: true }))}
                  className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                  title="Edit"
                >
                  <Edit2 size={11} className="text-white" />
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Automated Actions */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Automated Triggers</h4>
                <div className="space-y-2.5">
                  {stageConfig.notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div key={notif.id} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center">
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-[#212b36] dark:text-white">{notif.title}</p>
                            <p className="text-[11px] text-gray-400">{notif.desc}</p>
                          </div>
                        </div>
                        {editModes.stageDetails ? (
                          <input type="checkbox" defaultChecked={notif.active} className="w-4 h-4 accent-[#1890FF] cursor-pointer" />
                        ) : (
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${notif.active ? 'bg-[#00A76F]/10 text-[#00A76F]' : 'bg-gray-100 text-gray-400'}`}>
                            {notif.active ? 'Active' : 'Disabled'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stage Requirements */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Exit Requirements</h4>
                <div className="space-y-2">
                  {stageConfig.requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
                      <CheckCircle2 size={16} className="text-[#00A76F] shrink-0" />
                      <span className="text-[13px] text-[#454f5b] dark:text-gray-300 font-medium">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guidelines */}
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                <p className="text-xs text-[#1890FF] font-bold mb-1">Interviewer SLA & Guideline</p>
                <p className="text-[12px] text-gray-600 dark:text-gray-300 leading-relaxed">{stageConfig.guideline}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-12">
        <button 
          onClick={() => setSettingsActiveNav('Hiring Team')}
          className="px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Previous: Back to Hiring Team
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/dashboard/jobs')}
            className="px-6 py-3 text-gray-600 hover:text-[#212b36] dark:hover:text-white dark:text-gray-300 font-bold transition-colors cursor-pointer"
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
    </div>
  );
}
