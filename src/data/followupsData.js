// Follow-Ups Data Store
// Manages persisted follow-ups and reminders across Jobs, Candidates, and Applications

const FOLLOWUPS_STORAGE_KEY = 'findneo_user_followups';

export const INITIAL_FOLLOWUPS = [
  { 
    id: 1, 
    relatedId: 'cand-1',
    type: 'Candidate',
    title: 'Interviewer scorecard debrief', 
    subject: 'Ananya Sharma (Senior AI Research Scientist)', 
    due: 'Today • 5:00 PM', 
    priority: 'Urgent', 
    isDone: false 
  },
  { 
    id: 2, 
    relatedId: 'cand-2',
    type: 'Candidate',
    title: 'Compensation negotiation follow-up', 
    subject: 'Rahul Verma (Principal Cloud Infrastructure Architect)', 
    due: 'Tomorrow • 11:00 AM', 
    priority: 'High', 
    isDone: false 
  },
  { 
    id: 3, 
    relatedId: '1',
    type: 'Job',
    title: 'Pipeline review with hiring manager', 
    subject: 'Senior AI Research Scientist (Anthropic Labs)', 
    due: '27 Oct • 2:00 PM', 
    priority: 'Normal', 
    isDone: false 
  },
  { 
    id: 4, 
    relatedId: '6',
    type: 'Job',
    title: 'Review shortlisted DevOps resumes', 
    subject: 'DevOps Engineer (Amazon AWS)', 
    due: '28 Oct • 10:30 AM', 
    priority: 'High', 
    isDone: false 
  },
  { 
    id: 5, 
    relatedId: 'app-1',
    type: 'Application',
    title: 'Debrief initial screening result', 
    subject: 'Ananya Sharma (Senior AI Research Scientist)', 
    due: 'Tomorrow • 2:00 PM', 
    priority: 'Urgent', 
    isDone: false 
  },
  { 
    id: 6, 
    relatedId: 'app-3',
    type: 'Application',
    title: 'Screening round scheduling alignment', 
    subject: 'Sneha Patil (Frontend Developer)', 
    due: 'Tomorrow • 3:00 PM', 
    priority: 'Normal', 
    isDone: false 
  }
];

export function getStoredFollowups() {
  try {
    const raw = localStorage.getItem(FOLLOWUPS_STORAGE_KEY);
    if (!raw) {
      saveStoredFollowups(INITIAL_FOLLOWUPS);
      return INITIAL_FOLLOWUPS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FOLLOWUPS;
  } catch (e) {
    console.error('Failed to load follow-ups from localStorage', e);
    return INITIAL_FOLLOWUPS;
  }
}

export function saveStoredFollowups(followups) {
  try {
    localStorage.setItem(FOLLOWUPS_STORAGE_KEY, JSON.stringify(followups));
    window.dispatchEvent(new CustomEvent('followups-updated', { detail: followups }));
  } catch (e) {
    console.error('Failed to save follow-ups to localStorage', e);
  }
}

function matchesId(storedId, targetId, type) {
  const s = String(storedId);
  const t = String(targetId);
  if (s === t) return true;
  if (type === 'Job' && (s === `job-${t}` || t === `job-${s}`)) return true;
  if (type === 'Candidate' && (s === `cand-${t}` || t === `cand-${s}`)) return true;
  if (type === 'Application' && (s === `app-${t}` || t === `app-${s}`)) return true;
  return false;
}

export function isItemFollowedUp(type, relatedId) {
  const followups = getStoredFollowups();
  return followups.some(
    f => f.type === type && !f.isDone && matchesId(f.relatedId, relatedId, type)
  );
}

export function addFollowup(item) {
  const followups = getStoredFollowups();
  const newFollowup = {
    id: Date.now(),
    relatedId: item.relatedId,
    type: item.type || 'General',
    title: item.title || 'Follow up with candidate / job',
    subject: item.subject || 'Follow-up Task',
    due: item.due || 'Tomorrow • 10:00 AM',
    priority: item.priority || 'Normal',
    isDone: false
  };

  const updated = [newFollowup, ...followups];
  saveStoredFollowups(updated);
  return { updated, followup: newFollowup };
}

export function removeFollowupByItem(type, relatedId) {
  const followups = getStoredFollowups();
  const updated = followups.filter(
    f => !(f.type === type && matchesId(f.relatedId, relatedId, type))
  );
  saveStoredFollowups(updated);
  return updated;
}

export function toggleFollowupStatus(id) {
  const followups = getStoredFollowups();
  const updated = followups.map(f => f.id === id ? { ...f, isDone: !f.isDone } : f);
  saveStoredFollowups(updated);
  return updated;
}

export function deleteFollowup(id) {
  const followups = getStoredFollowups();
  const updated = followups.filter(f => f.id !== id);
  saveStoredFollowups(updated);
  return updated;
}
