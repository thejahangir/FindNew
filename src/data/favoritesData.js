// Favorites Data Store
// Manages persisted favorites across Jobs, Candidates, and Applications

const FAVORITES_STORAGE_KEY = 'findneo_user_favorites';

export const INITIAL_FAVORITES = [
  { 
    id: 'fav-job-1', 
    relatedId: '1',
    title: 'Senior AI Research Scientist', 
    type: 'Job', 
    meta: 'Engineering • Bangalore, India', 
    path: '/dashboard/jobs',
    tag: 'Open'
  },
  { 
    id: 'fav-job-5', 
    relatedId: '5',
    title: 'Frontend Developer', 
    type: 'Job', 
    meta: 'Engineering • Remote', 
    path: '/dashboard/jobs',
    tag: 'Open'
  },
  { 
    id: 'fav-cand-1', 
    relatedId: 'cand-1',
    title: 'Ananya Sharma', 
    type: 'Candidate', 
    meta: '9.8 AI Match • Senior AI Research Scientist', 
    path: '/dashboard/candidates',
    tag: 'Technical Interview'
  },
  { 
    id: 'fav-cand-2', 
    relatedId: 'cand-2',
    title: 'Rahul Verma', 
    type: 'Candidate', 
    meta: '9.4 AI Match • Principal Cloud Architect', 
    path: '/dashboard/candidates',
    tag: 'Shortlisted'
  },
  { 
    id: 'fav-app-1', 
    relatedId: 'app-1',
    title: 'Ananya Sharma - Senior AI Research Scientist', 
    type: 'Application', 
    meta: 'Screening Passed • Applied 24 Oct 2026', 
    path: '/dashboard/applications',
    tag: 'Active'
  },
  { 
    id: 'fav-app-2', 
    relatedId: 'app-2',
    title: 'Rohan Gupta - Product Design Lead', 
    type: 'Application', 
    meta: 'Interview Stage • Applied 22 Oct 2026', 
    path: '/dashboard/applications',
    tag: 'In Review'
  }
];

export function getStoredFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      saveStoredFavorites(INITIAL_FAVORITES);
      return INITIAL_FAVORITES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FAVORITES;
  } catch (e) {
    console.error('Failed to load favorites from localStorage', e);
    return INITIAL_FAVORITES;
  }
}

export function saveStoredFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    window.dispatchEvent(new CustomEvent('favorites-updated', { detail: favorites }));
  } catch (e) {
    console.error('Failed to save favorites to localStorage', e);
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

export function isItemFavorited(type, relatedId) {
  const favorites = getStoredFavorites();
  return favorites.some(f => f.type === type && matchesId(f.relatedId, relatedId, type));
}

export function toggleFavorite(item) {
  const favorites = getStoredFavorites();
  const itemType = item.type || item.category || 'Job';
  const existingIndex = favorites.findIndex(
    f => f.type === itemType && matchesId(f.relatedId, item.relatedId, itemType)
  );

  let updated;
  let isFavoritedNow = false;

  if (existingIndex >= 0) {
    // Remove from favorites
    updated = favorites.filter((_, idx) => idx !== existingIndex);
    isFavoritedNow = false;
  } else {
    // Add to favorites
    const newFav = {
      id: `fav-${itemType.toLowerCase()}-${item.relatedId}-${Date.now()}`,
      relatedId: item.relatedId,
      title: item.title,
      type: itemType,
      meta: item.meta || '',
      path: item.path || (itemType === 'Job' ? '/dashboard/jobs' : itemType === 'Candidate' ? '/dashboard/candidates' : '/dashboard/applications'),
      tag: item.tag || 'Saved'
    };
    updated = [newFav, ...favorites];
    isFavoritedNow = true;
  }

  saveStoredFavorites(updated);
  return { updated, isFavorited: isFavoritedNow };
}
