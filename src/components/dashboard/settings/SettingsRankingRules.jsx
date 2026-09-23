import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, GripVertical, Settings2, Plus, Trash2, BrainCircuit, Check, Edit2, Zap } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableRuleItem({ rule, isSelected, onSelect, isEditing, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: rule.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const weightValue = rule.weight !== undefined ? Number(rule.weight) : 1;
  const weightPercentage = (weightValue / 2) * 100;

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      onClick={() => onSelect(rule.id)}
      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
        isDragging 
          ? 'opacity-50 border-[#1890FF] shadow-lg scale-[1.02] z-50' 
          : isSelected 
            ? 'border-[#1890FF] bg-blue-50/50 dark:bg-[#1890FF]/10 shadow-xs ring-1 ring-[#1890FF]/30' 
            : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-[#161c24]'
      }`}
    >
      {isEditing && (
        <div {...attributes} {...listeners} className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1 shrink-0" onClick={e => e.stopPropagation()}>
          <GripVertical size={16} />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h4 className={`text-[13px] font-bold truncate ${isSelected ? 'text-[#1890FF]' : 'text-[#212b36] dark:text-white'}`}>
          {rule.skill || 'New Criteria'}
        </h4>
        <div className="flex items-center gap-3 mt-1">
          <div className="h-1.5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, weightPercentage))}%`, backgroundColor: rule.color || '#1890FF' }}></div>
          </div>
          <p className="text-[10px] text-gray-500 font-bold">{weightValue.toFixed(1)}x Weight</p>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <span className="text-sm font-black" style={{ color: rule.color || '#1890FF' }}>{weightValue.toFixed(1)}</span>
        {isEditing && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(rule.id); }}
            className="p-1 text-gray-400 hover:text-[#FF5630] rounded transition-colors"
            title="Delete rule"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function SettingsRankingRules({ setSettingsActiveNav }) {
  const navigate = useNavigate();
  const [editModes, setEditModes] = useState({
    criteria: false,
    config: false
  });

  const [rules, setRules] = useState([
    { id: '1', skill: 'PyTorch & Deep Learning Foundations', weight: 1.8, color: '#1890FF', description: 'Candidates must possess foundational knowledge in distributed deep learning, loss formulations, and tensor manipulations.' },
    { id: '2', skill: 'Distributed LLM Training (DeepSpeed/Megatron)', weight: 1.6, color: '#00A76F', description: 'Proven hands-on experience scaling large model checkpoints across multi-node GPU clusters.' },
    { id: '3', skill: 'Multimodal Architectures & Vision-Language', weight: 1.4, color: '#8A2BE2', description: 'Expertise in cross-attention, visual encoders, tokenization strategies, and multimodal alignment.' },
    { id: '4', skill: 'Top-tier Research Publications (NeurIPS/ICML)', weight: 1.2, color: '#FFC107', description: 'Authorship in peer-reviewed machine learning venues demonstrates theoretical rigor.' },
    { id: '5', skill: 'System Design & High-Performance Serving', weight: 1.0, color: '#FF5630', description: 'Ability to deploy and optimize low-latency inference runtimes using vLLM or TensorRT.' }
  ]);

  const [selectedRuleId, setSelectedRuleId] = useState('1');

  const selectedRule = rules.find(r => r.id === selectedRuleId) || rules[0];

  const handleUpdateRule = (field, value) => {
    setRules(rules.map(r => r.id === selectedRuleId ? { ...r, [field]: value } : r));
  };

  const handleAddRule = () => {
    const newId = (Math.max(...rules.map(r => parseInt(r.id) || 0), 0) + 1).toString();
    const newRule = {
      id: newId,
      skill: 'New Evaluation Criterion',
      weight: 1.0,
      color: '#1890FF',
      description: 'Define evaluation parameters and key scoring criteria for this rule.'
    };
    setRules([...rules, newRule]);
    setSelectedRuleId(newId);
  };

  const handleDeleteRule = (id) => {
    const updated = rules.filter(r => r.id !== id);
    setRules(updated);
    if (selectedRuleId === id) {
      setSelectedRuleId(updated[0]?.id || null);
    }
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

  return (
    <div className="p-8 flex flex-col min-h-[calc(100vh-100px)] animate-fade-in">
      <div className="max-w-6xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Card: AI Ranking Criteria */}
        <div className="col-span-1 lg:col-span-5 bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                <BrainCircuit size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#212b36] dark:text-white">AI Ranking Rules</h2>
                <p className="text-xs text-gray-500">Weight multipliers & evaluation priority.</p>
              </div>
            </div>

            {editModes.criteria ? (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, criteria: false }))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-sm text-xs font-bold cursor-pointer shrink-0"
                title="Done"
              >
                <Check size={14} className="text-white stroke-[2.5]" />
                <span>Done</span>
              </button>
            ) : (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, criteria: true }))}
                className="w-8 h-8 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-sm cursor-pointer shrink-0"
                title="Edit"
              >
                <Edit2 size={14} className="text-white" />
              </button>
            )}
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={rules.map(r => r.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {rules.map((rule) => (
                  <SortableRuleItem 
                    key={rule.id}
                    rule={rule}
                    isSelected={selectedRule?.id === rule.id}
                    onSelect={setSelectedRuleId}
                    isEditing={editModes.criteria}
                    onDelete={handleDeleteRule}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {editModes.criteria && (
            <button 
              onClick={handleAddRule}
              className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[#1890FF] rounded-xl text-xs font-bold text-gray-500 hover:text-[#1890FF] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={14} /> Add Criterion
            </button>
          )}
        </div>

        {/* Right Card: Rule Configuration */}
        {selectedRule && (
          <div className="col-span-1 lg:col-span-7 bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-[#FFC107] flex items-center justify-center shrink-0">
                  <Star size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#212b36] dark:text-white">Rule Configuration</h2>
                  <p className="text-xs text-gray-500">Fine-tune weights and AI evaluation prompt criteria.</p>
                </div>
              </div>

              {editModes.config ? (
                <button
                  onClick={() => setEditModes(prev => ({ ...prev, config: false }))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-sm text-xs font-bold cursor-pointer shrink-0"
                  title="Done"
                >
                  <Check size={14} className="text-white stroke-[2.5]" />
                  <span>Done</span>
                </button>
              ) : (
                <button
                  onClick={() => setEditModes(prev => ({ ...prev, config: true }))}
                  className="w-8 h-8 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-sm cursor-pointer shrink-0"
                  title="Edit"
                >
                  <Edit2 size={14} className="text-white" />
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Criterion Name</label>
                {editModes.config ? (
                  <input 
                    type="text" 
                    value={selectedRule.skill}
                    onChange={(e) => handleUpdateRule('skill', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                  />
                ) : (
                  <div className="text-[14px] font-bold text-[#212b36] dark:text-white py-1">{selectedRule.skill}</div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-500">Weight Multiplier (0.0x - 2.0x)</label>
                  <span className="text-xs font-black text-[#1890FF]">{Number(selectedRule.weight || 1).toFixed(1)}x</span>
                </div>
                {editModes.config ? (
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-bold text-gray-400">0.0</span>
                    <input 
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={selectedRule.weight}
                      onChange={(e) => handleUpdateRule('weight', parseFloat(e.target.value))}
                      className="flex-1 accent-[#1890FF] cursor-pointer"
                    />
                    <span className="text-xs font-bold text-gray-400">2.0</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-1">
                    <div className="h-2 flex-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1890FF] rounded-full" style={{ width: `${(selectedRule.weight / 2) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{selectedRule.weight}x Impact</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">AI Evaluation Guidelines</label>
                {editModes.config ? (
                  <textarea 
                    rows="4"
                    value={selectedRule.description}
                    onChange={(e) => handleUpdateRule('description', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF] resize-y"
                    placeholder="Describe how the AI should score candidate resumes against this metric..."
                  />
                ) : (
                  <div className="text-[13px] text-[#454f5b] dark:text-gray-300 py-1 leading-relaxed bg-gray-50/50 dark:bg-gray-800/30 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                    {selectedRule.description || 'No custom guideline specified.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-12">
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
    </div>
  );
}
