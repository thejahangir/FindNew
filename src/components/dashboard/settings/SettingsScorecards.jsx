import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, X, ChevronDown, Check, LayoutTemplate, Trash2, GripVertical, FileCheck, Users, Target, Edit2 } from 'lucide-react';

const SUGGESTED_ATTRIBUTES = {
  'Personality Traits': [
    'Self-motivated',
    'Team player',
    'Disciplined',
    'Communication Skills',
    'Adaptability',
    'Problem Solver',
    'Leadership'
  ],
  'Qualifications': [
    '5+ years relevant experience',
    'Strong analytical skills',
    'Experience with PyTorch / Deep Learning',
    'Distributed Systems expertise',
    'Published Research Track Record'
  ]
};

export default function SettingsScorecards({ setSettingsActiveNav }) {
  const navigate = useNavigate();
  const [editModes, setEditModes] = useState({
    categories: false,
    rounds: false
  });

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Personality Traits',
      attributes: ['Self-motivated', 'Team player', 'Disciplined', 'Clear Communication']
    },
    {
      id: 2,
      name: 'Technical Competencies',
      attributes: ['Distributed LLM Training', 'PyTorch Proficiency', 'System Design & Scalability']
    },
    {
      id: 3,
      name: 'Research & Problem Solving',
      attributes: ['Algorithmic Rigor', 'Paper Implementation', 'Creative Thinking']
    }
  ]);

  const [rounds, setRounds] = useState([
    {
      id: 1,
      name: 'HR / Recruiter Screen',
      focusAttributes: ['Self-motivated', 'Clear Communication']
    },
    {
      id: 2,
      name: 'Technical & System Design',
      focusAttributes: ['Distributed LLM Training', 'PyTorch Proficiency', 'System Design & Scalability']
    },
    {
      id: 3,
      name: 'Hiring Manager & Research Review',
      focusAttributes: ['Algorithmic Rigor', 'Paper Implementation', 'Team player']
    }
  ]);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newAttributeInputs, setNewAttributeInputs] = useState({});
  const [newRoundName, setNewRoundName] = useState('');

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
    if (!attribute || !attribute.trim()) return;
    setCategories(categories.map(cat => {
      if (cat.id === catId) {
        if (cat.attributes.includes(attribute.trim())) return cat;
        return { ...cat, attributes: [...cat.attributes, attribute.trim()] };
      }
      return cat;
    }));
    setNewAttributeInputs(prev => ({ ...prev, [catId]: '' }));
  };

  const handleRemoveAttribute = (catId, attr) => {
    setCategories(categories.map(cat => {
      if (cat.id === catId) {
        return { ...cat, attributes: cat.attributes.filter(a => a !== attr) };
      }
      return cat;
    }));
  };

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

  const handleToggleRoundAttribute = (roundId, attr) => {
    setRounds(rounds.map(r => {
      if (r.id === roundId) {
        const hasAttr = r.focusAttributes.includes(attr);
        return {
          ...r,
          focusAttributes: hasAttr 
            ? r.focusAttributes.filter(a => a !== attr)
            : [...r.focusAttributes, attr]
        };
      }
      return r;
    }));
  };

  const allAttributes = Array.from(new Set(categories.flatMap(c => c.attributes)));

  return (
    <div className="flex flex-col animate-fade-in">
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Card: Categories & Attributes */}
        <div className="col-span-1 lg:col-span-6 bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all flex flex-col">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                <LayoutTemplate size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Scorecard Rubrics</h2>
                <p className="text-xs text-gray-500">Evaluation categories and criteria.</p>
              </div>
            </div>

            {editModes.categories ? (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, categories: false }))}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-sm text-xs font-bold cursor-pointer shrink-0"
                title="Done"
              >
                <Check size={12} className="text-white stroke-[2.5]" />
                <span>Done</span>
              </button>
            ) : (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, categories: true }))}
                className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                title="Edit"
              >
                <Edit2 size={11} className="text-white" />
              </button>
            )}
          </div>

          <div className="space-y-5">
            {categories.map(cat => (
              <div key={cat.id} className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white">{cat.name}</h4>
                  {editModes.categories && (
                    <button 
                      onClick={() => handleRemoveCategory(cat.id)}
                      className="p-1 text-gray-400 hover:text-[#FF5630] rounded transition-colors"
                      title="Delete category"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {cat.attributes.map((attr, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 text-xs font-semibold text-[#212b36] dark:text-white shadow-xs"
                    >
                      {attr}
                      {editModes.categories && (
                        <button 
                          onClick={() => handleRemoveAttribute(cat.id, attr)}
                          className="text-gray-400 hover:text-[#FF5630] transition-colors"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </span>
                  ))}
                  {cat.attributes.length === 0 && (
                    <span className="text-xs text-gray-400 italic">No attributes added yet.</span>
                  )}
                </div>

                {editModes.categories && (
                  <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 flex gap-2">
                    <input 
                      type="text" 
                      value={newAttributeInputs[cat.id] || ''}
                      onChange={(e) => setNewAttributeInputs(prev => ({ ...prev, [cat.id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddAttribute(cat.id, newAttributeInputs[cat.id]); }}
                      placeholder="Add an attribute..."
                      className="flex-1 px-3 py-1 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                    />
                    <button 
                      onClick={() => handleAddAttribute(cat.id, newAttributeInputs[cat.id])}
                      className="px-3 py-1 bg-[#1890FF] text-white text-xs font-bold rounded-lg hover:bg-[#1890FF]/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            ))}

            {editModes.categories && (
              <div className="pt-2 flex gap-2">
                <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New Category Name..."
                  className="flex-1 px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                />
                <button 
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-[#1890FF] text-white text-xs font-bold rounded-xl hover:bg-[#1890FF]/90 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
                >
                  <Plus size={14} /> Add Category
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Interview Rounds Mapping */}
        <div className="col-span-1 lg:col-span-6 bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all flex flex-col">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-[#00A76F] flex items-center justify-center shrink-0">
                <Target size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Interview Focus Rounds</h2>
                <p className="text-xs text-gray-500">Mapping rubrics to specific interview stages.</p>
              </div>
            </div>

            {editModes.rounds ? (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, rounds: false }))}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-sm text-xs font-bold cursor-pointer shrink-0"
                title="Done"
              >
                <Check size={12} className="text-white stroke-[2.5]" />
                <span>Done</span>
              </button>
            ) : (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, rounds: true }))}
                className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                title="Edit"
              >
                <Edit2 size={11} className="text-white" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {rounds.map((round, idx) => (
              <div key={round.id} className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1890FF]/10 text-[#1890FF] text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white">{round.name}</h4>
                  </div>
                  {editModes.rounds && (
                    <button 
                      onClick={() => handleRemoveRound(round.id)}
                      className="p-1 text-gray-400 hover:text-[#FF5630] rounded transition-colors"
                      title="Delete round"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {editModes.rounds ? (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-gray-400">Select focus attributes for this round:</p>
                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 bg-white dark:bg-[#161c24] rounded-lg border border-gray-200 dark:border-gray-700">
                      {allAttributes.map((attr, i) => {
                        const isSelected = round.focusAttributes.includes(attr);
                        return (
                          <button
                            key={i}
                            onClick={() => handleToggleRoundAttribute(round.id, attr)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-[#00A76F] text-white' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{attr}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {round.focusAttributes.map((attr, i) => (
                      <span 
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#00A76F]/10 text-[#00A76F] border border-[#00A76F]/20 text-[11px] font-bold"
                      >
                        {attr}
                      </span>
                    ))}
                    {round.focusAttributes.length === 0 && (
                      <span className="text-xs text-gray-400 italic">No focus attributes assigned.</span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {editModes.rounds && (
              <div className="pt-2 flex gap-2">
                <input 
                  type="text" 
                  value={newRoundName}
                  onChange={(e) => setNewRoundName(e.target.value)}
                  placeholder="New Interview Round..."
                  className="flex-1 px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                />
                <button 
                  onClick={handleAddRound}
                  className="px-4 py-2 bg-[#1890FF] text-white text-xs font-bold rounded-xl hover:bg-[#1890FF]/90 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
                >
                  <Plus size={14} /> Add Round
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-12">
        <button 
          onClick={() => setSettingsActiveNav('Pipeline')}
          className="px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Previous: Back to Pipeline
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/dashboard/jobs')}
            className="px-6 py-3 text-gray-600 hover:text-[#212b36] dark:hover:text-white dark:text-gray-300 font-bold transition-colors cursor-pointer"
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
