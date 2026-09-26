import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, X, Settings2, Minus, Trash2, CheckCircle2, Circle, Code2, FileText, PlusCircle, Edit2, Check } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function SettingsDescriptionSkills({ setSettingsActiveNav }) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialJobData = location.state?.jobData || {};
  const [isConfirmDraftModalOpen, setIsConfirmDraftModalOpen] = useState(false);

  // Cardwise edit modes
  const [editModes, setEditModes] = useState({
    description: false,
    skills: false
  });

  const [jobData, setJobData] = useState({
    jdText: initialJobData?.jdText || `<h3>About the Role</h3><p>We are seeking an exceptional Senior AI Research Scientist to join our advanced AI foundation team. You will lead groundbreaking work on large-scale multimodal models, reasoning engines, and agentic workflows.</p><h3>Key Responsibilities</h3><ul><li>Architect, train, and evaluate frontier-class multimodal deep learning models.</li><li>Collaborate with cross-functional teams to integrate AI models into high-impact products.</li><li>Publish cutting-edge research and represent the team at top conferences (NeurIPS, ICML, CVPR).</li></ul><h3>Qualifications</h3><ul><li>PhD or MS in Computer Science, AI, or equivalent practical experience.</li><li>3+ years of experience with PyTorch, distributed training (DeepSpeed, Megatron), and modern LLM architectures.</li><li>Strong publication track record or demonstrated history of shipping foundational AI systems.</li></ul>`,
    skills: initialJobData?.skills && initialJobData.skills.length > 0 
      ? initialJobData.skills.map(s => ({ ...s, isExpanded: false, source: 'jd' }))
      : [
          { name: 'PyTorch', years: '3', required: true, isExpanded: false, source: 'jd' },
          { name: 'Distributed LLM Training', years: '2', required: true, isExpanded: false, source: 'jd' },
          { name: 'Multimodal AI', years: '2', required: true, isExpanded: false, source: 'jd' },
          { name: 'Python', years: '4', required: true, isExpanded: false, source: 'jd' },
          { name: 'MLOps & Kubernetes', years: '1', required: false, isExpanded: false, source: 'manual' }
        ],
    isConfidential: initialJobData?.isConfidential || false
  });

  const handleInputChange = (field, value) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...jobData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    handleInputChange('skills', newSkills);
  };

  const addSkill = () => {
    handleInputChange('skills', [...jobData.skills, { name: '', years: '1', required: true, isExpanded: true, source: 'manual' }]);
  };

  const removeSkill = (index) => {
    let newSkills = jobData.skills.filter((_, i) => i !== index);
    handleInputChange('skills', newSkills);
  };

  return (
    <div className="flex flex-col animate-fade-in">
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Description Card */}
        <div className="col-span-1 lg:col-span-7 bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all flex flex-col">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center shrink-0">
                <FileText size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Job Description</h2>
                <p className="text-xs text-gray-500">Core responsibilities, qualifications, and overview.</p>
              </div>
            </div>
            {editModes.description ? (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, description: false }))}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-sm text-xs font-bold cursor-pointer shrink-0"
                title="Done"
              >
                <Check size={12} className="text-white stroke-[2.5]" />
                <span>Done</span>
              </button>
            ) : (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, description: true }))}
                className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                title="Edit"
              >
                <Edit2 size={11} className="text-white" />
              </button>
            )}
          </div>

          <div className="flex flex-col flex-1">
            {editModes.description ? (
              <div className="react-quill-container flex-1 mt-1">
                <ReactQuill 
                  theme="snow"
                  value={jobData.jdText}
                  onChange={(content) => handleInputChange('jdText', content)}
                  className="h-full min-h-[350px] lg:min-h-[480px]"
                  placeholder="Enter the full job description here..."
                />
              </div>
            ) : (
              <div 
                className="prose dark:prose-invert max-w-none text-[13px] text-[#454f5b] dark:text-gray-300 leading-relaxed py-2" 
                dangerouslySetInnerHTML={{ __html: jobData.jdText || '<p className="text-gray-400 italic">No description provided.</p>' }} 
              />
            )}
          </div>
        </div>

        {/* Skills Card */}
        <div className="col-span-1 lg:col-span-5 bg-white dark:bg-[#161c24] p-6 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all flex flex-col">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-[#00A76F] flex items-center justify-center shrink-0">
                <Code2 size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Required Skills</h2>
                <p className="text-xs text-gray-500">Key competencies & minimum experience.</p>
              </div>
            </div>
            {editModes.skills ? (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, skills: false }))}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1890FF] text-white hover:bg-[#0077e6] transition-all shadow-sm text-xs font-bold cursor-pointer shrink-0"
                title="Done"
              >
                <Check size={12} className="text-white stroke-[2.5]" />
                <span>Done</span>
              </button>
            ) : (
              <button
                onClick={() => setEditModes(prev => ({ ...prev, skills: true }))}
                className="w-6 h-6 rounded-full bg-[#1890FF] text-white flex items-center justify-center hover:bg-[#0077e6] transition-all shadow-xs cursor-pointer shrink-0"
                title="Edit"
              >
                <Edit2 size={11} className="text-white" />
              </button>
            )}
          </div>

          {editModes.skills ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">Skills List ({jobData.skills.length})</span>
                <button 
                  onClick={addSkill}
                  className="px-3 py-1.5 text-xs font-bold text-[#1890FF] bg-[#1890FF]/10 rounded-lg hover:bg-[#1890FF]/20 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Skill
                </button>
              </div>

              <div className="space-y-3">
                {jobData.skills.map((skill, index) => (
                  <div key={index} className="flex flex-col bg-gray-50 dark:bg-gray-800/40 rounded-xl p-3 border border-gray-200/70 dark:border-gray-700/60 gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <input 
                        type="text" 
                        value={skill.name}
                        onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                        placeholder="e.g. PyTorch, Distributed Training"
                        className="flex-1 px-3 py-1.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] font-semibold text-[#212b36] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1890FF]"
                      />
                      <button 
                        onClick={() => removeSkill(index)}
                        className="p-1.5 text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                        title="Remove skill"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-500">Min Exp:</span>
                        <div className="flex items-center bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-md p-0.5">
                          <button 
                            onClick={() => handleSkillChange(index, 'years', Math.max(0, Number(skill.years) - 1).toString())}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#212b36] dark:text-white">{skill.years}</span>
                          <button 
                            onClick={() => handleSkillChange(index, 'years', (Number(skill.years) + 1).toString())}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-[11px] font-medium text-gray-400">yrs</span>
                      </div>

                      <div className="flex items-center gap-1 bg-white dark:bg-[#161c24] p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
                        <button 
                          onClick={() => handleSkillChange(index, 'required', true)}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${skill.required ? 'bg-[#00A76F] text-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          Must Have
                        </button>
                        <button 
                          onClick={() => handleSkillChange(index, 'required', false)}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${!skill.required ? 'bg-[#1890FF] text-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          Nice to Have
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2.5">
                {jobData.skills.filter(s => s.name.trim()).map((skill, index) => (
                  <div 
                    key={index} 
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800"
                  >
                    <span className="text-[13px] font-semibold text-[#212b36] dark:text-white">{skill.name}</span>
                    <span className="text-[11px] text-gray-400 font-medium">• {skill.years} yrs</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${skill.required ? 'bg-[#00A76F]/10 text-[#00A76F]' : 'bg-[#1890FF]/10 text-[#1890FF]'}`}>
                      {skill.required ? 'Must Have' : 'Nice to Have'}
                    </span>
                  </div>
                ))}
                {jobData.skills.filter(s => s.name.trim()).length === 0 && (
                  <p className="text-[13px] text-gray-400 italic py-2">No skills configured.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-12">
        <button 
          onClick={() => setSettingsActiveNav('Overview')}
          className="px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Previous: Back to Overview
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/dashboard/jobs')}
            className="px-6 py-3 text-gray-600 hover:text-[#212b36] dark:hover:text-white dark:text-gray-300 font-bold transition-colors cursor-pointer"
          >
            Save and Exit
          </button>
          <button 
            onClick={() => setSettingsActiveNav('Hiring Team')}
            className="px-6 py-3 bg-[#1890FF] text-white rounded-xl font-bold hover:bg-[#1890FF]/90 transition-colors shadow-[0_8px_16px_rgba(24,144,255,0.24)] cursor-pointer"
          >
            Save and Continue to 'Hiring Team'
          </button>
        </div>
      </div>
    </div>
  );
}
