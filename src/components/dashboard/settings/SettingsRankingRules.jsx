import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, GripVertical, Plus, Trash2, Check, Edit2, Minus, 
  UploadCloud, FileText, Loader2, RefreshCw, Sparkles, ArrowRight 
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableRuleCard({ rule, idx, isEditing, onUpdate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: rule.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const weightValue = rule.weight !== undefined ? Number(rule.weight) : 1.0;

  const handleWeightDecrement = (e) => {
    e.stopPropagation();
    const nextVal = Math.max(0.0, parseFloat((weightValue - 0.1).toFixed(1)));
    onUpdate(rule.id, 'weight', nextVal);
  };

  const handleWeightIncrement = (e) => {
    e.stopPropagation();
    const nextVal = Math.min(2.0, parseFloat((weightValue + 0.1).toFixed(1)));
    onUpdate(rule.id, 'weight', nextVal);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`rounded-xl border transition-all ${
        isDragging 
          ? 'opacity-60 border-[#1890FF] bg-blue-50/20 dark:bg-blue-900/20 shadow-lg scale-[1.01] z-50' 
          : 'border-gray-200/80 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:border-gray-300 dark:hover:border-gray-700'
      } p-3 sm:p-3.5`}
    >
      {/* Same Line: Drag Handle (edit), Index Badge, Criterion Name, and Weight Multiplier */}
      <div className="flex items-center justify-between gap-3">
        
        {/* Left: Drag Handle, Number Badge, and Criterion Name */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isEditing && (
            <div 
              {...attributes} 
              {...listeners} 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing p-0.5 -ml-1 shrink-0" 
              title="Drag to reorder priority"
            >
              <GripVertical size={15} />
            </div>
          )}
          
          <span className="w-5 h-5 rounded-full bg-[#1890FF]/10 text-[#1890FF] text-[10.5px] font-bold flex items-center justify-center shrink-0">
            {idx + 1}
          </span>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input 
                type="text"
                value={rule.skill}
                onChange={(e) => onUpdate(rule.id, 'skill', e.target.value)}
                placeholder="Criterion Name..."
                className="w-full px-2.5 py-1 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
              />
            ) : (
              <h3 className="text-xs font-bold text-[#212b36] dark:text-white truncate">
                {rule.skill || 'Untitled Criterion'}
              </h3>
            )}
          </div>
        </div>

        {/* Right (Same Line): Weight Multiplier & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isEditing ? (
            <div className="flex items-center gap-1 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg p-0.5">
              <button 
                type="button"
                onClick={handleWeightDecrement}
                className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors cursor-pointer select-none"
                title="Decrease weight"
              >
                <Minus size={10} className="stroke-[3]" />
              </button>
              
              <span className="w-10 text-center text-[11px] font-black text-[#1890FF] select-none">
                {weightValue.toFixed(1)}x
              </span>

              <button 
                type="button"
                onClick={handleWeightIncrement}
                className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors cursor-pointer select-none"
                title="Increase weight"
              >
                <Plus size={10} className="stroke-[3]" />
              </button>
            </div>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#1890FF]/10 text-[#1890FF] border border-[#1890FF]/20 text-[11px] font-bold">
              {weightValue.toFixed(1)}x Weight
            </span>
          )}

          {isEditing && (
            <button 
              type="button"
              onClick={() => onDelete(rule.id)}
              className="p-1 text-gray-400 hover:text-[#FF5630] rounded transition-colors cursor-pointer shrink-0"
              title="Delete Criterion"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

      </div>

      {/* AI Evaluation Guidelines (Compact) */}
      <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/40 pl-7">
        {isEditing ? (
          <textarea 
            rows={2}
            value={rule.description}
            onChange={(e) => onUpdate(rule.id, 'description', e.target.value)}
            placeholder="AI evaluation instructions for this criterion..."
            className="w-full px-2.5 py-1.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF] resize-none"
          />
        ) : (
          <p className="text-[11.5px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
            {rule.description || <span className="italic text-gray-400">No custom guideline specified.</span>}
          </p>
        )}
      </div>

    </div>
  );
}

export default function SettingsRankingRules({ setSettingsActiveNav, hideFooter, onCancel, onSave }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // For a new job, initially no rules and no uploaded JD
  const [rules, setRules] = useState([]);
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'text'

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileInfo = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`
      };
      setJdFile(fileInfo);
      generateRulesFromJd(file.name);
    }
  };

  const handleUseSampleJd = () => {
    setJdFile({ name: 'Senior_ML_Engineer_JD.pdf', size: '245 KB' });
    generateRulesFromJd('Senior_ML_Engineer_JD.pdf');
  };

  const generateRulesFromJd = (fileName = 'Job_Description.pdf') => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = [
        { 
          id: '1', 
          skill: 'PyTorch & Deep Learning Foundations', 
          weight: 1.8, 
          description: 'Candidates must possess foundational knowledge in distributed deep learning, loss formulations, and tensor manipulations.' 
        },
        { 
          id: '2', 
          skill: 'Distributed LLM Training (DeepSpeed/Megatron)', 
          weight: 1.6, 
          description: 'Proven hands-on experience scaling large model checkpoints across multi-node GPU clusters.' 
        },
        { 
          id: '3', 
          skill: 'Multimodal Architectures & Vision-Language', 
          weight: 1.4, 
          description: 'Expertise in cross-attention, visual encoders, tokenization strategies, and multimodal alignment.' 
        },
        { 
          id: '4', 
          skill: 'Top-tier Research Publications (NeurIPS/ICML)', 
          weight: 1.2, 
          description: 'Authorship in peer-reviewed machine learning venues demonstrates theoretical rigor and innovation track record.' 
        },
        { 
          id: '5', 
          skill: 'System Design & High-Performance Serving', 
          weight: 1.0, 
          description: 'Ability to deploy and optimize low-latency inference runtimes using vLLM or TensorRT.' 
        }
      ];
      setRules(generated);
      setIsGenerating(false);
    }, 1400);
  };

  const handleUpdateRule = (id, field, value) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleAddRule = () => {
    const newId = Date.now().toString();
    const newRule = {
      id: newId,
      skill: 'New Evaluation Criterion',
      weight: 1.0,
      description: 'Define evaluation parameters and key scoring criteria for this rule.'
    };
    setRules([...rules, newRule]);
    setIsEditing(true);
  };

  const handleDeleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setRules((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const hasRules = rules.length > 0;

  return (
    <div className="flex flex-col animate-fade-in space-y-6">
      <div className="w-full flex-1">
        
        {/* Main Ranking Rules Section Card */}
        <div className="bg-white dark:bg-[#161c24] p-5 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all relative">
          
          {/* AI Generating Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-white/90 dark:bg-[#161c24]/90 backdrop-blur-xs z-30 flex flex-col items-center justify-center rounded-2xl animate-fade-in p-6">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] rounded-xl flex items-center justify-center mb-3 shadow-sm">
                <Loader2 size={24} className="animate-spin text-[#1890FF]" />
              </div>
              <h3 className="text-sm font-bold text-[#212b36] dark:text-white">Parsing Job Description...</h3>
              <p className="text-xs text-gray-500 mt-1">Extracting core competencies and generating weighted evaluation rules.</p>
            </div>
          )}

          {/* Section Header */}
          <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-gray-100 dark:border-gray-800/50 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-7.5 h-7.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                <BrainCircuit size={15} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">AI Ranking Rules</h2>
                <p className="text-[11.5px] text-gray-500">
                  Criteria prioritization, weight multipliers, and AI evaluation instructions arranged vertically by precedence.
                </p>
              </div>
            </div>

            {/* Header Action Buttons (Only shown once rules are generated) */}
            {hasRules && (
              <div className="flex items-center gap-2">
                
                {/* Re-upload / Change JD */}
                <button
                  onClick={() => document.getElementById('change-jd-upload')?.click()}
                  className="px-2.5 py-1 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Upload a different Job Description"
                >
                  <input 
                    id="change-jd-upload" 
                    type="file" 
                    accept=".pdf,.docx,.txt" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                  />
                  <UploadCloud size={13} className="text-[#1890FF]" />
                  <span className="hidden sm:inline">Upload New JD</span>
                </button>

                {/* Add Criterion Button */}
                <button 
                  onClick={handleAddRule}
                  className="px-2.5 py-1 bg-[#1890FF]/10 text-[#1890FF] hover:bg-[#1890FF]/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} /> Add Criterion
                </button>

                {/* Edit / Done Toggle Button */}
                {isEditing ? (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-xs text-[11px] font-bold cursor-pointer shrink-0"
                    title="Done"
                  >
                    <Check size={11} className="text-white stroke-[2.5]" />
                    <span>Done</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                    title="Edit Ranking Rules"
                  >
                    <Edit2 size={11} className="text-white" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* INITIAL STATE (NO RULES YET): Clean Job Description Upload Dropzone */}
          {!hasRules && !isGenerating && (
            <div className="py-6 px-4">
              <div className="max-w-xl mx-auto text-center">
                
                {/* Upload Card / Dropzone */}
                <div 
                  onClick={() => document.getElementById('initial-jd-upload')?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#1890FF] dark:hover:border-[#1890FF] rounded-2xl p-8 text-center cursor-pointer bg-gray-50/60 dark:bg-gray-800/30 hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-all group"
                >
                  <input 
                    id="initial-jd-upload" 
                    type="file" 
                    accept=".pdf,.docx,.txt" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                  />
                  
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] flex items-center justify-center mx-auto mb-3.5 group-hover:scale-108 transition-transform shadow-xs">
                    <UploadCloud size={24} />
                  </div>
                  
                  <h4 className="text-sm font-bold text-[#212b36] dark:text-white mb-1">
                    Upload Job Description to Generate Rules
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-sm mx-auto leading-relaxed">
                    Upload your job description document (PDF, DOCX, or TXT) and AI will automatically extract key evaluation criteria and weights.
                  </p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1890FF] text-white text-xs font-bold hover:bg-[#0077e6] transition-all shadow-xs">
                    <Sparkles size={13} />
                    Browse & Upload File
                  </div>
                </div>

                {/* Quick Action alternatives */}
                <div className="mt-4 flex items-center justify-center gap-3 text-xs">
                  <button
                    onClick={handleUseSampleJd}
                    className="text-gray-500 dark:text-gray-400 hover:text-[#1890FF] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Use Sample JD (Senior ML Engineer)</span>
                    <ArrowRight size={12} />
                  </button>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <button
                    onClick={handleAddRule}
                    className="text-gray-500 dark:text-gray-400 hover:text-[#1890FF] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Create Manually without JD</span>
                    <Plus size={12} />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* GENERATED STATE: Active JD Banner + Nested Vertical List of Compact Rule Cards */}
          {hasRules && (
            <>
              {/* Active Job Description Source Banner */}
              {jdFile && (
                <div className="mb-3 px-3 py-2 rounded-xl bg-blue-50/40 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={13} className="text-[#1890FF] shrink-0" />
                    <span className="font-bold text-[#212b36] dark:text-white truncate">Source JD: {jdFile.name}</span>
                    <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">({jdFile.size})</span>
                  </div>
                  <button
                    onClick={() => generateRulesFromJd(jdFile.name)}
                    className="text-[11px] font-bold text-[#1890FF] hover:text-[#0077e6] flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                    title="Re-extract rules from current JD"
                  >
                    <RefreshCw size={11} /> Re-extract
                  </button>
                </div>
              )}

              {/* Nested Vertical List of Compact Rule Cards */}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={rules.map(r => r.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2.5">
                    {rules.map((rule, idx) => (
                      <SortableRuleCard 
                        key={rule.id}
                        rule={rule}
                        idx={idx}
                        isEditing={isEditing}
                        onUpdate={handleUpdateRule}
                        onDelete={handleDeleteRule}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </>
          )}

        </div>

      </div>

      {/* Bottom Navigation */}
      {!hideFooter && (
        <div className="w-full flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-12">
          <button 
            onClick={() => setSettingsActiveNav('Scorecards')}
            className="px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Previous: Back to Scorecards
          </button>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/dashboard/jobs')}
              className="px-6 py-3 text-gray-600 hover:text-[#212b36] dark:hover:text-white dark:text-gray-300 font-bold transition-colors cursor-pointer"
            >
              Save and Exit
            </button>
            <button 
              onClick={() => setSettingsActiveNav('Agencies')}
              className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
            >
              Save and Continue to 'Agencies'
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
