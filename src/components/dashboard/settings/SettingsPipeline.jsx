import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  GitBranch, ArrowRight, Plus, Zap, Trash2, GripVertical, 
  Mail, Calendar, CheckCircle2, ChevronDown, Check, Edit2, 
  Layers, ShieldCheck, Clock
} from 'lucide-react';
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

const NOTIF_ICONS = {
  sendEmail: Mail,
  notifyTeam: Zap,
  autoSchedule: Calendar,
  triggerOnboarding: Zap
};

const DEFAULT_STAGE_CONFIGS = {
  'Applied': {
    notifications: [
      { id: 'sendEmail', title: 'Send Confirmation Email', desc: 'Thank candidate for applying', active: true },
      { id: 'notifyTeam', title: 'Notify Hiring Team', desc: 'Alert team of new application', active: true }
    ],
    requirements: [
      'Resume uploaded & parsed',
      'Knockout screening questions passed'
    ],
    guideline: 'Candidates in this stage should be reviewed within 24 hours to maintain engagement.',
    sla: '24 Hours'
  },
  'Screening': {
    notifications: [
      { id: 'sendEmail', title: 'Send Assessment Link', desc: 'Email technical assessment link', active: true },
      { id: 'autoSchedule', title: 'Schedule Recruiter Screen', desc: 'Send calendar for 15-min call', active: false }
    ],
    requirements: [
      'Preliminary phone screen completed',
      'Basic skill evaluation passed'
    ],
    guideline: 'Keep screening calls brief (15-20 mins) to assess basic fit and communication skills.',
    sla: '48 Hours'
  },
  'Interview': {
    notifications: [
      { id: 'sendEmail', title: 'Send Interview Details', desc: 'Send meeting link & agenda', active: true },
      { id: 'autoSchedule', title: 'Auto-Schedule Interview', desc: 'Send calendar invite to candidate', active: true }
    ],
    requirements: [
      'Technical evaluation scorecard submitted',
      'Cultural alignment verified'
    ],
    guideline: 'Scorecards should be filled out within 2 hours post-interview for accurate evaluation.',
    sla: '3 Days'
  },
  'Offer': {
    notifications: [
      { id: 'sendEmail', title: 'Send Offer Letter', desc: 'Email digital offer package', active: true },
      { id: 'notifyTeam', title: 'Notify HR & Finance', desc: 'Alert finance team for approval', active: true }
    ],
    requirements: [
      'Compensation package approved',
      'Reference checks completed'
    ],
    guideline: 'Extend formal offers within 24 hours of decision to maximize acceptance rate.',
    sla: '24 Hours'
  },
  'Hired': {
    notifications: [
      { id: 'sendEmail', title: 'Welcome Email', desc: 'Send day 1 instructions', active: true },
      { id: 'triggerOnboarding', title: 'Trigger Onboarding Flow', desc: 'Initiate IT & HR setup', active: true }
    ],
    requirements: [
      'Signed contract received',
      'Start date confirmed'
    ],
    guideline: 'Ensure IT equipment is dispatched at least 3 business days before joining date.',
    sla: 'Immediate'
  },
  'Rejected': {
    notifications: [
      { id: 'sendEmail', title: 'Send Rejection Email', desc: 'Polite personalized feedback', active: false }
    ],
    requirements: [
      'Rejection reason documented in audit log'
    ],
    guideline: 'Keep candidate in talent pool for future relevant opportunities.',
    sla: '48 Hours'
  }
};

const getInitialConfig = (systemStage) => {
  const base = DEFAULT_STAGE_CONFIGS[systemStage] || DEFAULT_STAGE_CONFIGS['Interview'];
  return {
    ...base,
    notifications: base.notifications.map(n => ({ ...n })),
    requirements: [...base.requirements]
  };
};

function SortableAccordionStageItem({ 
  stage, 
  index, 
  totalStages, 
  updateStage, 
  removeStage, 
  isExpanded, 
  onToggle, 
  onToggleNotification,
  isEditing 
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stage.id });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 50 - index,
  };

  const stageConfig = stage.config || DEFAULT_STAGE_CONFIGS[stage.systemStage] || DEFAULT_STAGE_CONFIGS['Interview'];
  const activeTriggersCount = (stageConfig.notifications || []).filter(n => n.active).length;

  return (
    <div ref={setNodeRef} style={style} className="w-full">
      <div 
        className={`bg-white dark:bg-[#161c24] rounded-xl border transition-all overflow-hidden ${
          isDragging
            ? 'opacity-60 border-[#1890FF] shadow-lg scale-[1.01]'
            : isExpanded
              ? 'border-[#1890FF]/60 shadow-xs ring-1 ring-[#1890FF]/20'
              : 'border-gray-200/90 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
        }`}
      >
        {/* Horizontal Accordion Header (Compact) */}
        <div 
          onClick={onToggle}
          className={`flex items-center justify-between gap-3 px-3.5 py-2.5 sm:px-4 sm:py-2.5 cursor-pointer select-none transition-colors ${
            isExpanded 
              ? 'bg-blue-50/30 dark:bg-[#1890FF]/5 border-b border-gray-100 dark:border-gray-800/60' 
              : 'hover:bg-gray-50/70 dark:hover:bg-gray-800/30'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {isEditing && (
              <div 
                {...attributes} 
                {...listeners} 
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-0.5 shrink-0 -ml-1" 
                onClick={e => e.stopPropagation()}
                title="Drag to reorder stage"
              >
                <GripVertical size={14} />
              </div>
            )}

            {/* Step Number */}
            <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
              isExpanded 
                ? 'bg-[#1890FF] text-white shadow-xs' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}>
              {index + 1}
            </div>

            {/* Stage Title & Input */}
            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
              {isEditing ? (
                <input 
                  type="text" 
                  value={stage.customName}
                  onClick={e => e.stopPropagation()}
                  onChange={(e) => updateStage(index, 'customName', e.target.value)}
                  className="px-2.5 py-1 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF] max-w-xs"
                />
              ) : (
                <h3 className="text-[13px] font-bold text-[#212b36] dark:text-white truncate">
                  {stage.customName}
                </h3>
              )}

              {/* System Mapping Badge */}
              <span className={`text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border w-fit ${getStageColor(stage.systemStage)}`}>
                {stage.systemStage}
              </span>
            </div>
          </div>

          {/* Quick Summary Chips (Horizontal) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
              <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/60 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-800">
                <Zap size={11} className="text-[#1890FF]" />
                {activeTriggersCount} {activeTriggersCount === 1 ? 'Trigger' : 'Triggers'}
              </span>
              <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/60 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-800">
                <CheckCircle2 size={11} className="text-[#00A76F]" />
                {(stageConfig.requirements || []).length} Exit Rules
              </span>
              <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/60 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-800">
                <Clock size={11} className="text-[#FFC107]" />
                SLA: {stageConfig.sla}
              </span>
            </div>

            {isEditing && (
              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                <div className="w-26">
                  <SearchableSelect 
                    options={SYSTEM_STAGES.map(sys => ({ label: sys, value: sys }))}
                    value={stage.systemStage}
                    onChange={(value) => updateStage(index, 'systemStage', value)}
                    showSearch={false}
                    size="xs"
                  />
                </div>
                {totalStages > 2 && (
                  <button 
                    onClick={() => removeStage(index)}
                    className="p-1 text-gray-400 hover:text-[#FF5630] rounded-lg transition-colors cursor-pointer"
                    title="Delete stage"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Accordion Expand Icon */}
            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-gray-400 transition-all ${isExpanded ? 'rotate-180 text-[#1890FF] bg-blue-50/80 dark:bg-[#1890FF]/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* Accordion Expanded Body (Compact) */}
        {isExpanded && (
          <div className="p-4 sm:p-4.5 bg-white dark:bg-[#161c24] space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4.5 items-start">
              
              {/* Left Column: Automated Actions */}
              <div className="lg:col-span-6 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap size={13} className="text-[#1890FF]" /> Automated Triggers
                  </h4>
                  <span className="text-[10.5px] font-bold text-gray-400">{activeTriggersCount} Active</span>
                </div>

                <div className="space-y-2">
                  {(stageConfig.notifications || []).map((notif) => {
                    const Icon = NOTIF_ICONS[notif.id] || Zap;
                    return (
                      <div 
                        key={notif.id} 
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50/60 dark:bg-gray-800/30 border border-gray-200/60 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2.5">
                          <div className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                            <Icon size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12.5px] font-bold text-[#212b36] dark:text-white truncate">{notif.title}</p>
                            <p className="text-[10.5px] text-gray-400 truncate">{notif.desc}</p>
                          </div>
                        </div>

                        {/* Standard Platform Compact Mini Toggle Switch */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[9px] font-bold uppercase tracking-wider select-none ${notif.active ? 'text-[#1890FF]' : 'text-gray-400'}`}>
                            {notif.active ? 'Active' : 'Off'}
                          </span>
                          <div
                            role="switch"
                            aria-checked={notif.active}
                            onClick={() => onToggleNotification(stage.id, notif.id)}
                            className={`relative inline-flex w-7 h-4 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer select-none p-0.5 shadow-inner ${
                              notif.active ? 'bg-[#1890FF]' : 'bg-gray-300 dark:bg-gray-700'
                            }`}
                          >
                            <div 
                              className={`w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-xs ${
                                notif.active ? 'translate-x-3' : 'translate-x-0'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Exit Requirements & Guidelines */}
              <div className="lg:col-span-6 space-y-3">
                <div>
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <ShieldCheck size={13} className="text-[#00A76F]" /> Exit Requirements
                  </h4>
                  <div className="space-y-1.5">
                    {(stageConfig.requirements || []).map((req, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50/60 dark:bg-gray-800/30 border border-gray-200/60 dark:border-gray-800">
                        <CheckCircle2 size={14} className="text-[#00A76F] shrink-0" />
                        <span className="text-[12px] text-[#454f5b] dark:text-gray-300 font-medium">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interviewer SLA & Guideline Callout */}
                <div className="px-3 py-2 rounded-lg bg-blue-50/40 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 flex items-start gap-2">
                  <Clock size={14} className="text-[#1890FF] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-[#1890FF] font-bold mb-0.5">SLA Guideline ({stageConfig.sla})</p>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">{stageConfig.guideline}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPipeline({ setSettingsActiveNav }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [stages, setStages] = useState([
    { 
      id: '1', 
      customName: 'Applied', 
      systemStage: 'Applied', 
      isTerminal: false,
      config: getInitialConfig('Applied')
    },
    { 
      id: '2', 
      customName: 'Screening', 
      systemStage: 'Screening', 
      isTerminal: false,
      config: getInitialConfig('Screening')
    },
    { 
      id: '3', 
      customName: 'Technical Interview', 
      systemStage: 'Interview', 
      isTerminal: false,
      config: getInitialConfig('Interview')
    },
    { 
      id: '4', 
      customName: 'Offer Extended', 
      systemStage: 'Offer', 
      isTerminal: false,
      config: getInitialConfig('Offer')
    },
    { 
      id: '5', 
      customName: 'Hired', 
      systemStage: 'Hired', 
      isTerminal: true,
      config: getInitialConfig('Hired')
    },
    { 
      id: '6', 
      customName: 'Rejected', 
      systemStage: 'Rejected', 
      isTerminal: true,
      config: getInitialConfig('Rejected')
    }
  ]);

  // Track expanded accordion items
  const [expandedIds, setExpandedIds] = useState(['1']);

  const toggleAccordion = (id) => {
    setExpandedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const expandAll = () => setExpandedIds(stages.map(s => s.id));
  const collapseAll = () => setExpandedIds([]);

  const updateStage = (index, field, value) => {
    const newStages = [...stages];
    if (field === 'systemStage') {
      newStages[index] = { 
        ...newStages[index], 
        [field]: value,
        config: getInitialConfig(value)
      };
    } else {
      newStages[index] = { ...newStages[index], [field]: value };
    }
    setStages(newStages);
  };

  const toggleNotification = (stageId, notifId) => {
    setStages(prevStages => 
      prevStages.map(stage => {
        if (stage.id !== stageId) return stage;
        const currentConfig = stage.config || getInitialConfig(stage.systemStage);
        const updatedNotifs = currentConfig.notifications.map(n => 
          n.id === notifId ? { ...n, active: !n.active } : n
        );
        return {
          ...stage,
          config: {
            ...currentConfig,
            notifications: updatedNotifs
          }
        };
      })
    );
  };

  const removeStage = (index) => {
    const removedId = stages[index]?.id;
    setStages(stages.filter((_, i) => i !== index));
    setExpandedIds(prev => prev.filter(id => id !== removedId));
  };

  const addStage = () => {
    const newId = (Math.max(...stages.map(s => parseInt(s.id) || 0), 0) + 1).toString();
    const newStage = { 
      id: newId, 
      customName: 'New Round', 
      systemStage: 'Interview', 
      isTerminal: false,
      config: getInitialConfig('Interview')
    };
    setStages([...stages, newStage]);
    setExpandedIds(prev => [...prev, newId]);
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

  return (
    <div className="flex flex-col animate-fade-in space-y-6">
      <div className="w-full flex-1">
        
        {/* Main Pipeline Card */}
        <div className="bg-white dark:bg-[#161c24] p-5 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all">
          
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-7.5 h-7.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                <GitBranch size={15} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Recruitment Pipeline Stages</h2>
                <p className="text-[11.5px] text-gray-500">Configure hiring stages, automated candidate notifications, and stage progression rules.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-500">
                <button 
                  onClick={expandAll}
                  className="hover:text-[#1890FF] transition-colors cursor-pointer"
                >
                  Expand All
                </button>
                <span>•</span>
                <button 
                  onClick={collapseAll}
                  className="hover:text-[#1890FF] transition-colors cursor-pointer"
                >
                  Collapse All
                </button>
              </div>

              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={addStage}
                    className="px-2.5 py-1 bg-[#1890FF]/10 text-[#1890FF] hover:bg-[#1890FF]/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Add Stage
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-xs text-[11px] font-bold cursor-pointer shrink-0"
                    title="Done"
                  >
                    <Check size={11} className="text-white stroke-[2.5]" />
                    <span>Done</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                  title="Edit Pipeline"
                >
                  <Edit2 size={11} className="text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Top Visual Horizontal Stepper Track (Compact) */}
          <div className="mb-4 p-2.5 bg-gray-50/70 dark:bg-gray-800/40 rounded-xl border border-gray-200/60 dark:border-gray-800 overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-1.5 min-w-max">
              {stages.map((stage, idx) => {
                const isExpanded = expandedIds.includes(stage.id);
                return (
                  <React.Fragment key={stage.id}>
                    <button
                      onClick={() => toggleAccordion(stage.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11.5px] font-bold transition-all cursor-pointer ${
                        isExpanded 
                          ? 'bg-[#1890FF] text-white shadow-xs' 
                          : 'bg-white dark:bg-[#161c24] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#1890FF]/50'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9.5px] font-black ${
                        isExpanded ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <span>{stage.customName}</span>
                    </button>
                    {idx < stages.length - 1 && (
                      <ArrowRight size={12} className="text-gray-400 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Horizontal Accordion Stage Items List (Compact Spacing) */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2.5">
                {stages.map((stage, idx) => (
                  <SortableAccordionStageItem 
                    key={stage.id}
                    stage={stage}
                    index={idx}
                    totalStages={stages.length}
                    updateStage={updateStage}
                    removeStage={removeStage}
                    isExpanded={expandedIds.includes(stage.id)}
                    onToggle={() => toggleAccordion(stage.id)}
                    onToggleNotification={toggleNotification}
                    isEditing={isEditing}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {isEditing && (
            <button 
              onClick={addStage}
              className="mt-4 w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[#1890FF] rounded-xl text-xs font-bold text-gray-500 hover:text-[#1890FF] transition-all flex items-center justify-center gap-2 cursor-pointer bg-gray-50/40 dark:bg-gray-800/20"
            >
              <Plus size={15} /> Add New Pipeline Stage
            </button>
          )}

        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-12">
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
