// Follow-Ups Data Store
// Manages persisted follow-ups and reminders across Jobs, Candidates, and Applications

const FOLLOWUPS_STORAGE_KEY = 'findneo_user_followups';

export const INITIAL_FOLLOWUPS = [
  { 
    id: 1, 
    relatedId: 'app-1',
    type: 'Application',
    title: 'Debrief initial screening result', 
    subject: 'Ananya Sharma (Senior AI Research Scientist)', 
    due: 'Tomorrow • 2:00 PM', 
    priority: 'Urgent', 
    isDone: false,
    path: '/dashboard/applications'
  },
  { 
    id: 2, 
    relatedId: 'app-2',
    type: 'Application',
    title: 'Compensation negotiation review', 
    subject: 'Rahul Verma (Principal Cloud Infrastructure Architect)', 
    due: 'Tomorrow • 11:00 AM', 
    priority: 'High', 
    isDone: false,
    path: '/dashboard/applications'
  },
  { 
    id: 3, 
    relatedId: 'app-3',
    type: 'Application',
    title: 'Screening round scheduling alignment', 
    subject: 'Sneha Patil (Frontend Developer)', 
    due: '28 Oct • 3:00 PM', 
    priority: 'Normal', 
    isDone: false,
    path: '/dashboard/applications'
  },
  { 
    id: 4, 
    relatedId: 'app-4',
    type: 'Application',
    title: 'Portfolio presentation feedback', 
    subject: 'Maya Chen (Product Design Lead)', 
    due: '29 Oct • 10:00 AM', 
    priority: 'High', 
    isDone: false,
    path: '/dashboard/applications'
  },
  { 
    id: 5, 
    relatedId: 'app-6',
    type: 'Application',
    title: 'Offer letter rollout check', 
    subject: 'Ankita Rao (Frontend Developer)', 
    due: 'Today • 5:00 PM', 
    priority: 'Urgent', 
    isDone: false,
    path: '/dashboard/applications'
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

export function isItemFollowed(type, relatedId) {
  const followups = getStoredFollowups();
  return followups.some(
    f => f.type === type && matchesId(f.relatedId, relatedId, type)
  );
}

export function isItemFollowedUp(type, relatedId) {
  return isItemFollowed(type, relatedId);
}

export function toggleFollowItem(item) {
  const followups = getStoredFollowups();
  const itemType = item.type || 'Candidate';
  const existingIndex = followups.findIndex(
    f => f.type === itemType && matchesId(f.relatedId, item.relatedId, itemType)
  );

  let updated;
  let isFollowedNow = false;

  if (existingIndex >= 0) {
    // Unfollow
    updated = followups.filter((_, idx) => idx !== existingIndex);
    isFollowedNow = false;
  } else {
    // Follow
    const newFollowup = {
      id: Date.now(),
      relatedId: item.relatedId,
      type: itemType,
      title: item.title || `Follow ${itemType}`,
      subject: item.subject || `${itemType}: ${item.title}`,
      due: 'All Activity Notifications Active',
      priority: 'Normal',
      isDone: false
    };
    updated = [newFollowup, ...followups];
    isFollowedNow = true;
  }

  saveStoredFollowups(updated);
  return { updated, isFollowed: isFollowedNow };
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
