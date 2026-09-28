import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Check, LayoutTemplate, Trash2, Target, ChevronDown, Table as TableIcon, Edit2 } from 'lucide-react';

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
  'Technical Competencies': [
    '5+ years relevant experience',
    'Distributed LLM Training',
    'PyTorch / Deep Learning',
    'System Design & Scalability',
    'Distributed Systems expertise',
    'Algorithmic Rigor'
  ],
  'Research & Qualifications': [
    'Published Research Track Record',
    'Paper Implementation',
    'Strong analytical skills',
    'Creative Thinking'
  ]
};

export default function SettingsScorecards({ setSettingsActiveNav }) {
  const navigate = useNavigate();

  const [editModes, setEditModes] = useState({
    categories: false,
    rounds: false,
    matrix: false
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
      stage: 'Screening',
      focusAttributes: ['Self-motivated', 'Clear Communication', 'Team player']
    },
    {
      id: 2,
      name: 'Technical & System Design',
      stage: 'Technical Round 1',
      focusAttributes: ['Distributed LLM Training', 'PyTorch Proficiency', 'System Design & Scalability']
    },
    {
      id: 3,
      name: 'Hiring Manager Review',
      stage: 'Final Evaluation',
      focusAttributes: ['Algorithmic Rigor', 'Paper Implementation', 'Disciplined']
    }
  ]);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newAttributeInputs, setNewAttributeInputs] = useState({});
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
    const newId = Date.now();
    setRounds([
      ...rounds,
      { id: newId, name: newRoundName.trim(), stage: 'Interview Round', focusAttributes: [] }
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
    <div className="flex flex-col animate-fade-in space-y-5">
      <div className="w-full flex-1 space-y-5">
        
        {/* Top: 2-Column Grid for Section 1 (Categories & Rubrics) & Section 2 (Interview Rounds) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          
          {/* Section 1: Categories & Attributes (Scorecard Rubrics) */}
          <div className="bg-white dark:bg-[#161c24] p-5 sm:p-6 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-7.5 h-7.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                  <LayoutTemplate size={15} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Scorecard Rubrics</h2>
                  <p className="text-[12px] text-gray-500">Define traits, technical competencies, and qualifications.</p>
                </div>
              </div>

              {editModes.categories ? (
                <button
                  onClick={() => setEditModes(prev => ({ ...prev, categories: false }))}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-xs text-[13px] font-bold cursor-pointer shrink-0"
                  title="Done"
                >
                  <Check size={12} className="text-white stroke-[2.5]" />
                  <span>Done</span>
                </button>
              ) : (
                <button
                  onClick={() => setEditModes(prev => ({ ...prev, categories: true }))}
                  className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                  title="Edit Rubrics"
                >
                  <Edit2 size={11} className="text-white" />
                </button>
              )}
            </div>

            <div className="space-y-3.5">
              {categories.map(cat => (
                <div key={cat.id} className="p-3.5 rounded-xl bg-gray-50/60 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{cat.name}</h4>
                      <span className="text-[12px] font-semibold text-gray-400">({cat.attributes.length})</span>
                    </div>
                    {editModes.categories && (
                      <button 
                        onClick={() => handleRemoveCategory(cat.id)}
                        className="p-1 text-gray-400 hover:text-[#FF5630] rounded transition-colors cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {cat.attributes.map((attr, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#161c24] border border-gray-200/80 dark:border-gray-700 text-[13px] font-semibold text-[#212b36] dark:text-white shadow-xs"
                      >
                        {attr}
                        {editModes.categories && (
                          <button 
                            onClick={() => handleRemoveAttribute(cat.id, attr)}
                            className="text-gray-400 hover:text-[#FF5630] transition-colors cursor-pointer"
                            title="Remove attribute"
                          >
                            <X size={11} />
                          </button>
                        )}
                      </span>
                    ))}
                    {cat.attributes.length === 0 && (
                      <span className="text-[12px] text-gray-400 italic">No attributes added yet.</span>
                    )}
                  </div>

                  {/* Add Attribute to Category */}
                  {editModes.categories && (
                    <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                      <input 
                        type="text" 
                        value={newAttributeInputs[cat.id] || ''}
                        onChange={(e) => setNewAttributeInputs(prev => ({ ...prev, [cat.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddAttribute(cat.id, newAttributeInputs[cat.id]); }}
                        placeholder="Add an attribute (press Enter)..."
                        className="flex-1 px-2.5 py-1 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                      />
                      <button 
                        onClick={() => handleAddAttribute(cat.id, newAttributeInputs[cat.id])}
                        className="px-2.5 py-1 bg-[#1890FF] text-white text-[13px] font-bold rounded-lg hover:bg-[#1890FF]/90 transition-colors cursor-pointer shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Add New Category */}
              {editModes.categories && (
                <div className="pt-1 flex gap-2">
                  <input 
                    type="text" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); }}
                    placeholder="New Category Name..."
                    className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] font-semibold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                  />
                  <button 
                    onClick={handleAddCategory}
                    className="px-3 py-1.5 bg-[#1890FF] text-white text-[13px] font-bold rounded-lg hover:bg-[#1890FF]/90 transition-colors flex items-center gap-1 shadow-sm cursor-pointer shrink-0"
                  >
                    <Plus size={13} /> Add Category
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Interview Focus Rounds */}
          <div className="bg-white dark:bg-[#161c24] p-5 sm:p-6 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-7.5 h-7.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-[#00A76F] flex items-center justify-center shrink-0">
                  <Target size={15} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Interview Rounds</h2>
                  <p className="text-[12px] text-gray-500">Configure interview stages and attribute assignments.</p>
                </div>
              </div>

              {editModes.rounds ? (
                <button
                  onClick={() => setEditModes(prev => ({ ...prev, rounds: false }))}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-xs text-[13px] font-bold cursor-pointer shrink-0"
                  title="Done"
                >
                  <Check size={12} className="text-white stroke-[2.5]" />
                  <span>Done</span>
                </button>
              ) : (
                <button
                  onClick={() => setEditModes(prev => ({ ...prev, rounds: true }))}
                  className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                  title="Edit Rounds"
                >
                  <Edit2 size={11} className="text-white" />
                </button>
              )}
            </div>

            <div className="space-y-3.5">
              {rounds.map((round, idx) => (
                <div key={round.id} className="p-3.5 rounded-xl bg-gray-50/60 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1890FF]/10 text-[#1890FF] text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white">{round.name}</h4>
                    </div>
                    {editModes.rounds && (
                      <button 
                        onClick={() => handleRemoveRound(round.id)}
                        className="p-1 text-gray-400 hover:text-[#FF5630] rounded transition-colors cursor-pointer"
                        title="Delete round"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {round.focusAttributes.map((attr, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#00A76F]/10 text-[#00A76F] border border-[#00A76F]/20 text-[12px] font-bold"
                      >
                        {attr}
                        {editModes.rounds && (
                          <button 
                            onClick={() => handleToggleFocusAttribute(round.id, attr)}
                            className="hover:text-red-500 transition-colors cursor-pointer"
                            title="Unassign"
                          >
                            <X size={10} />
                          </button>
                        )}
                      </span>
                    ))}
                    {round.focusAttributes.length === 0 && (
                      <span className="text-[12px] text-gray-400 italic">No focus attributes assigned. Use the table below to assign.</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Add New Round */}
              {editModes.rounds && (
                <div className="pt-1 flex gap-2">
                  <input 
                    type="text" 
                    value={newRoundName}
                    onChange={(e) => setNewRoundName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddRound(); }}
                    placeholder="New Interview Round Name..."
                    className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] font-semibold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                  />
                  <button 
                    onClick={handleAddRound}
                    className="px-3 py-1.5 bg-[#1890FF] text-white text-[13px] font-bold rounded-lg hover:bg-[#1890FF]/90 transition-colors flex items-center gap-1 shadow-sm cursor-pointer shrink-0"
                  >
                    <Plus size={13} /> Add Round
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Section 3: Focus Attributes Matrix Table with Checkboxes */}
        <div className="bg-white dark:bg-[#161c24] p-5 sm:p-6 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-7.5 h-7.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                <TableIcon size={15} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Focus Attributes per Interview Matrix</h2>
                <p className="text-[12px] text-gray-500">Ensure every critical attribute is evaluated across your interview rounds.</p>
              </div>
            </div>

            {editModes.matrix ? (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, matrix: false }))}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-xs text-[13px] font-bold cursor-pointer shrink-0"
                title="Done"
              >
                <Check size={12} className="text-white stroke-[2.5]" />
                <span>Done</span>
              </button>
            ) : (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, matrix: true }))}
                className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                title="Edit Matrix"
              >
                <Edit2 size={11} className="text-white" />
              </button>
            )}
          </div>

          {/* Interactive Checkbox Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200/80 dark:border-gray-800">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#1a222c] border-b border-gray-200 dark:border-gray-700 text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4 w-[38%] min-w-[240px]">
                    Evaluation Criteria
                  </th>
                  {rounds.map((round, idx) => (
                    <th key={round.id} className="py-3 px-4 border-l border-gray-200/80 dark:border-gray-700 text-center align-middle">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-[11px] font-semibold text-gray-400">Round {idx + 1}</span>
                          {editModes.matrix && (
                            <button
                              onClick={() => handleRemoveRound(round.id)}
                              className="text-gray-400 hover:text-[#FF5630] p-0.5 rounded transition-colors cursor-pointer"
                              title={`Delete ${round.name}`}
                            >
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>
                        <span className="font-bold text-[13px] text-[#212b36] dark:text-white text-center leading-snug">
                          {round.name}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-[13px]">
                {categories.map(category => (
                  <React.Fragment key={category.id}>
                    {/* Category Header Row */}
                    <tr className="bg-gray-100/60 dark:bg-gray-800/50 font-bold">
                      <td 
                        colSpan={rounds.length + 1} 
                        className="py-2.5 px-4 text-[#212b36] dark:text-white border-b border-gray-100 dark:border-gray-800"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ChevronDown size={14} className="text-gray-400" />
                            <span className="text-[13px] uppercase tracking-wider text-gray-700 dark:text-gray-300 font-bold">
                              {category.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-gray-200/80 dark:bg-gray-700 text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                              {category.attributes.length} items
                            </span>
                          </div>
                          {editModes.matrix && (
                            <button
                              onClick={() => handleRemoveCategory(category.id)}
                              className="text-gray-400 hover:text-[#FF5630] p-1 rounded transition-colors cursor-pointer"
                              title={`Delete ${category.name}`}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Attribute Rows */}
                    {category.attributes.map(attr => {
                      const roundsCovering = rounds.filter(r => r.focusAttributes.includes(attr)).length;
                      const isUncovered = roundsCovering === 0;

                      return (
                        <tr key={attr} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                          {/* Attribute Name & Coverage Badge */}
                          <td className="py-3 px-4 bg-white dark:bg-[#161c24] group-hover:bg-transparent transition-colors">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[13px] font-semibold text-[#212b36] dark:text-gray-200">
                                {attr}
                              </span>
                              {isUncovered ? (
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50 whitespace-nowrap">
                                  Unassigned
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#00A76F]/10 text-[#00A76F] border border-[#00A76F]/20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                  {roundsCovering} {roundsCovering === 1 ? 'Round' : 'Rounds'}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Round Checkbox Columns */}
                          {rounds.map(round => {
                            const isChecked = round.focusAttributes.includes(attr);
                            return (
                              <td 
                                key={round.id} 
                                onClick={() => {
                                  if (editModes.matrix) {
                                    handleToggleFocusAttribute(round.id, attr);
                                  }
                                }}
                                className={`py-3 px-4 border-l border-gray-100 dark:border-gray-800 text-center relative transition-colors select-none ${
                                  editModes.matrix 
                                    ? 'hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer' 
                                    : 'cursor-default'
                                }`}
                              >
                                <div className="flex items-center justify-center">
                                  <div 
                                    className={`w-3.5 h-3.5 rounded-[3.5px] flex items-center justify-center transition-all duration-150 border ${
                                      isChecked 
                                        ? 'bg-[#1890FF] border-[#1890FF] shadow-2xs' 
                                        : `bg-white dark:bg-[#161c24] border-gray-300 dark:border-gray-600 ${editModes.matrix ? 'hover:border-[#1890FF]/60' : 'opacity-60'}`
                                    }`}
                                  >
                                    <Check 
                                      size={9} 
                                      className={`text-white transition-transform ${
                                        isChecked ? 'opacity-100 scale-100 stroke-[3.5]' : 'opacity-0 scale-50'
                                      }`} 
                                    />
                                  </div>
                                </div>
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
                    <td colSpan={rounds.length + 1} className="py-8 text-center text-gray-400 text-[12px] italic">
                      Add categories and attributes above to build your interview focus matrix.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="w-full flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-12">
        <button 
          onClick={() => setSettingsActiveNav('Pipeline')}
          className="px-6 py-2.5 text-[13px] font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Previous: Back to Pipeline
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/dashboard/jobs')}
            className="px-6 py-3 text-[13px] text-gray-600 hover:text-[#212b36] dark:hover:text-white dark:text-gray-300 font-bold transition-colors cursor-pointer"
          >
            Save and Exit
          </button>
          <button 
            onClick={() => setSettingsActiveNav('Ranking Rules')}
            className="px-6 py-3 bg-[#1890FF] text-white rounded-xl text-[13px] font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
          >
            Save and Continue to 'Ranking Rules'
          </button>
        </div>
      </div>
    </div>
  );
}
