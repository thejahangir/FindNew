import React, { useEffect, useRef, useState } from 'react';
import { Building2, Check, Mail, Send, UserX, X } from 'lucide-react';

const getInitials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();

const AI_SCREENING_GAPS = [
 'Limited exposure to AI research and adjacent scientific fields, which would require additional onboarding.',
 'Minor gaps in enterprise-scale delivery and formal people management.',
 'Domain depth is lighter than required for a Senior AI Research Scientist mandate.',
 'Hands-on research publications and model-training ownership are not evident from the profile.',
];

export const buildAiScreeningFeedback = (candidate) => {
 const seed = Number(candidate.id) || candidate.name?.length || 0;
 const gap = AI_SCREENING_GAPS[seed % AI_SCREENING_GAPS.length];
 return `AI screening for ${candidate.name} (${candidate.score} match)\n\nWe will not be moving this profile forward for Senior AI Research Scientist.\n\nKey finding: ${gap}\n\nPlease share closer matches with stronger AI/ML research experience against the JD.`;
};

export default function RejectAgencyModal({ open, candidates = [], onClose, onSent }) {
 const [cards, setCards] = useState([]);
 const [errors, setErrors] = useState({});
 const [success, setSuccess] = useState(null);
 const wasOpen = useRef(false);

 useEffect(() => {
 if (open && !wasOpen.current) {
 setCards(candidates.map(c => ({
 id: c.id,
 name: c.name,
 score: c.score,
 agency: c.agency,
 agencyEmail: c.agencyEmail,
 feedback: c.feedback || buildAiScreeningFeedback(c)
 })));
 setErrors({});
 }
 wasOpen.current = open;
 }, [open, candidates]);

 useEffect(() => {
 if (!success) return;
 const t = setTimeout(() => setSuccess(null), 4000);
 return () => clearTimeout(t);
 }, [success]);

 if (!open && !success) return null;

 const updateFeedback = (id, feedback) => {
 setCards(prev => prev.map(card => card.id === id ? { ...card, feedback } : card));
 if (feedback.trim()) setErrors(prev => ({ ...prev, [id]: false }));
 };

 const applyFeedbackToAll = (sourceId) => {
 const source = cards.find(card => card.id === sourceId);
 if (!source?.feedback.trim()) return;
 setCards(prev => prev.map(card => ({ ...card, feedback: source.feedback })));
 setErrors({});
 };

 const handleSend = () => {
 const nextErrors = {};
 cards.forEach(card => {
 if (!card.feedback.trim()) nextErrors[card.id] = true;
 });
 setErrors(nextErrors);
 if (Object.keys(nextErrors).length) return;

 const agencyCount = new Set(cards.map(card => card.agency)).size;
 setSuccess({ profiles: cards.length, agencies: agencyCount });
 onSent?.(cards);
 onClose?.();
 };

 return (
 <>
 {open && (
 <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
 <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800/50 shrink-0">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-xl bg-[#FF5630]/10 text-[#FF5630] flex items-center justify-center shrink-0">
 <UserX size={18} />
 </div>
 <div>
 <h2 className="text-base font-bold text-[#212b36] dark:text-white">
 {cards.length > 1 ? (
 <>
 Reject <span className="inline-flex items-center justify-center min-w-[1.4rem] px-1.5 mx-0.5 rounded-md bg-[#1890FF]/10 text-[#1890FF]">{cards.length}</span> Profiles & Notify Agencies
 </>
 ) : 'Reject Profile & Notify Agency'}
 </h2>
 <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
 {cards.length > 1 ? 'Send feedback to each sourcing agency' : 'Send feedback to the sourcing agency'}
 </p>
 </div>
 </div>
 <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer p-1" aria-label="Close">
 <X size={20} />
 </button>
 </div>

 <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
 {cards.map((card, index) => (
 <div
 key={card.id}
 className={`rounded-xl border p-4 transition-colors ${errors[card.id] ? 'border-[#FF5630] bg-[#FF5630]/5' : 'border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20'}`}
 >
 <div className="flex items-start justify-between gap-3 mb-3">
 <div className="flex items-center gap-3 min-w-0">
 <div className="w-9 h-9 rounded-full bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center text-[11px] font-bold shrink-0">
 {getInitials(card.name)}
 </div>
 <div className="min-w-0">
 <p className="text-[11px] font-bold text-gray-400 ">Candidate name</p>
 <h3 className="text-sm font-bold text-[#212b36] dark:text-white truncate">{card.name}</h3>
 <p className="text-[11px] font-bold text-[#00A76F]">{card.score} match</p>
 </div>
 </div>
 <span className="text-[11px] font-bold text-gray-400 bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800 px-2 py-0.5 rounded-md shrink-0">
 {index + 1} of {cards.length}
 </span>
 </div>

 <div className="flex items-start gap-2.5 mb-3 px-3 py-2.5 rounded-lg bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800/50">
 <Building2 size={14} className="text-[#1890FF] mt-0.5 shrink-0" />
 <div className="min-w-0">
 <p className="text-[11px] font-bold text-gray-400 ">Agency</p>
 <p className="text-[13px] font-bold text-[#212b36] dark:text-white truncate">{card.agency}</p>
 <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5 truncate">
 <Mail size={11} className="shrink-0" /> {card.agencyEmail}
 </p>
 </div>
 </div>

 <div>
 <div className="flex items-center justify-between mb-1.5">
 <label className={`text-[11px] font-bold ${errors[card.id] ? 'text-[#FF5630]' : 'text-gray-400'}`}>Feedback</label>
 {cards.length > 1 && (
 <button
 type="button"
 onClick={() => applyFeedbackToAll(card.id)}
 className="text-[11px] font-bold text-[#1890FF] hover:underline cursor-pointer"
 >
 Use for all
 </button>
 )}
 </div>
 <p className="text-[11px] text-gray-400 mb-1.5">Prefilled from AI screening. Edit or add anything you want to send.</p>
 <textarea
 rows={5}
 value={card.feedback}
 onChange={(e) => updateFeedback(card.id, e.target.value)}
 placeholder="Edit AI screening feedback or add your own note for the agency..."
 className={`w-full px-3 py-2.5 bg-white dark:bg-[#161c24] border rounded-lg text-[12px] text-[#637381] dark:text-gray-400 focus:outline-none focus:ring-2 resize-none transition-colors ${
 errors[card.id]
 ? 'border-[#FF5630] focus:ring-[#FF5630]/20'
 : 'border-gray-200 dark:border-gray-700/50 focus:ring-[#1890FF]/20 focus:border-[#1890FF]'
 }`}
 />
 {errors[card.id] && (
 <p className="text-[11px] text-[#FF5630] font-medium mt-1">Add feedback before sending this email.</p>
 )}
 </div>
 </div>
 ))}
 </div>

 <div className={`flex items-center gap-3 p-5 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50/80 dark:bg-[#161c24] shrink-0 ${cards.length > 1 ? 'justify-between' : 'justify-end'}`}>
 {cards.length > 1 && (
 <p className="text-[12px] text-gray-500 font-medium hidden sm:block">
 {cards.length} emails will send together.
 </p>
 )}
 <div className="flex items-center gap-3 ml-auto">
 <button
 type="button"
 onClick={onClose}
 className="px-5 py-2.5 text-sm font-bold text-black dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
 >
 Cancel
 </button>
 <button
 type="button"
 onClick={handleSend}
 className="px-5 py-2.5 text-sm font-bold text-white bg-[#FF5630] hover:bg-[#FF5630]/90 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-2"
 >
 <Send size={15} />
 Send {cards.length > 1 ? `${cards.length} emails` : 'email'}
 </button>
 </div>
 </div>
 </div>
 </div>
 )}

 {success && (
 <div className="fixed bottom-6 right-6 z-[120] bg-[#212b36] text-white px-5 py-3.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3 animate-fade-in border border-gray-700">
 <div className="w-6 h-6 bg-[#00A76F]/20 text-[#00A76F] rounded-full flex items-center justify-center shrink-0">
 <Check size={14} strokeWidth={3} />
 </div>
 <div className="font-medium text-sm">
 Rejection {success.profiles === 1 ? 'email' : `${success.profiles} emails`} sent to {success.agencies === 1 ? 'the agency' : `${success.agencies} agencies`}.
 </div>
 </div>
 )}
 </>
 );
}
