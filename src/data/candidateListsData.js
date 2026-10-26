// Candidate Pool & Candidate Lists Shared Store
// Supports local storage persistence so lists created or modified in My List
// and Candidates pages stay synchronized.

export const CANDIDATES_POOL = [
  {
    id: 'cand-1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'Senior AI Research Scientist',
    department: 'Engineering',
    company: 'Anthropic Labs',
    experience: '7 yrs exp',
    location: 'Bangalore, India',
    score: '9.8/10',
    numericScore: 9.8,
    stage: 'Technical Interview',
    date: '2 days ago',
    updated: 'Just now',
    source: 'TechTalent Partners',
    agency: 'TechTalent Partners',
    noticePeriod: '30 Days',
    skills: ['PyTorch', 'Transformers', 'LLMs', 'Python', 'NLP'],
    status: 'Active'
  },
  {
    id: 'cand-2',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 98111 22334',
    role: 'Cloud Infrastructure Architect',
    department: 'Engineering',
    company: 'Databricks',
    experience: '8 yrs exp',
    location: 'San Francisco, CA',
    score: '9.6/10',
    numericScore: 9.6,
    stage: 'Culture Fit',
    date: '1 day ago',
    updated: '3 hours ago',
    source: 'LinkedIn Recruiter',
    agency: 'Direct Application',
    noticePeriod: 'Immediate',
    skills: ['AWS Cloud', 'Kubernetes', 'Terraform', 'CI/CD', 'Docker'],
    status: 'Active'
  },
  {
    id: 'cand-3',
    name: 'Sneha Patil',
    email: 'sneha.patil@example.com',
    phone: '+91 99200 44556',
    role: 'Frontend Developer',
    department: 'Engineering',
    company: 'TCS Innovation Lab',
    experience: '4 yrs exp',
    location: 'Pune, India',
    score: '9.2/10',
    numericScore: 9.2,
    stage: 'Screening',
    date: '5 hours ago',
    updated: '1 hour ago',
    source: 'Direct Careers',
    agency: 'Direct Application',
    noticePeriod: '15 Days',
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'Next.js'],
    status: 'Active'
  },
  {
    id: 'cand-4',
    name: 'Maya Chen',
    email: 'maya.chen@example.com',
    phone: '+1 415 555 0192',
    role: 'Product Design Lead',
    department: 'Design',
    company: 'Figma',
    experience: '7 yrs exp',
    location: 'San Francisco, CA',
    score: '9.4/10',
    numericScore: 9.4,
    stage: 'Technical Interview',
    date: '3 days ago',
    updated: 'Today',
    source: 'Vanguard Recruitment',
    agency: 'Vanguard Recruitment',
    noticePeriod: '30 Days',
    skills: ['Design Systems', 'Figma', 'UI/UX Design', 'Prototyping', 'User Research'],
    status: 'Active'
  },
  {
    id: 'cand-5',
    name: 'Arjun Kumar',
    email: 'arjun.kumar@example.com',
    phone: '+91 98444 33221',
    role: 'Data Engineer',
    department: 'Engineering',
    company: 'Snowflake',
    experience: '5 yrs exp',
    location: 'Bangalore, India',
    score: '8.8/10',
    numericScore: 8.8,
    stage: 'Reference Check',
    date: '4 days ago',
    updated: '1 day ago',
    source: 'Employee Referral',
    agency: 'Direct Application',
    noticePeriod: '30 Days',
    skills: ['Apache Spark', 'Python', 'PostgreSQL', 'Airflow', 'Kafka'],
    status: 'Active'
  },
  {
    id: 'cand-6',
    name: 'Ankita Rao',
    email: 'ankita.rao@example.com',
    phone: '+91 97333 11223',
    role: 'Frontend Developer',
    department: 'Engineering',
    company: 'Flipkart',
    experience: '3 yrs exp',
    location: 'Hyderabad, India',
    score: '8.6/10',
    numericScore: 8.6,
    stage: 'Offer',
    date: '1 day ago',
    updated: '2 hours ago',
    source: 'Elite Hiring Solutions',
    agency: 'Elite Hiring Solutions',
    noticePeriod: 'Immediate',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'Zustand', 'GraphQL'],
    status: 'Offer Pending'
  },
  {
    id: 'cand-7',
    name: 'Jordan Rivera',
    email: 'jordan.rivera@example.com',
    phone: '+1 650 555 0148',
    role: 'Product Design Lead',
    department: 'Design',
    company: 'Airbnb',
    experience: '5 yrs exp',
    location: 'New York, NY',
    score: '8.8/10',
    numericScore: 8.8,
    stage: 'Screening',
    date: '1 week ago',
    updated: '2 days ago',
    source: 'LinkedIn Recruiter',
    agency: 'Direct Application',
    noticePeriod: '30 Days',
    skills: ['B2B SaaS', 'Figma', 'User Testing', 'Wireframing'],
    status: 'Active'
  },
  {
    id: 'cand-8',
    name: 'Karan Mehra',
    email: 'karan.mehra@example.com',
    phone: '+91 98888 77665',
    role: 'DevOps Engineer',
    department: 'Engineering',
    company: 'Amazon AWS',
    experience: '6 yrs exp',
    location: 'Bangalore, India',
    score: '8.5/10',
    numericScore: 8.5,
    stage: 'Technical Interview',
    date: '1 day ago',
    updated: 'Today',
    source: 'TechTalent Partners',
    agency: 'TechTalent Partners',
    noticePeriod: '15 Days',
    skills: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'AWS', 'Prometheus'],
    status: 'Active'
  },
  {
    id: 'cand-9',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 91234 56789',
    role: 'Growth Marketing Manager',
    department: 'Marketing',
    company: 'Stripe',
    experience: '5 yrs exp',
    location: 'London, UK',
    score: '8.4/10',
    numericScore: 8.4,
    stage: 'Application Review',
    date: '5 hours ago',
    updated: '4 hours ago',
    source: 'Direct Careers',
    agency: 'Direct Application',
    noticePeriod: '30 Days',
    skills: ['Growth Loops', 'SEO/SEM', 'A/B Testing', 'Meta Ads', 'SQL'],
    status: 'Active'
  },
  {
    id: 'cand-10',
    name: 'Ravi Desai',
    email: 'ravi.desai@example.com',
    phone: '+91 94555 66778',
    role: 'Full Stack Engineer',
    department: 'Engineering',
    company: 'Infosys',
    experience: '5 yrs exp',
    location: 'Bangalore, India',
    score: '8.2/10',
    numericScore: 8.2,
    stage: 'Applied',
    date: '2 hours ago',
    updated: '30 mins ago',
    source: 'Global Recruiters Inc.',
    agency: 'Global Recruiters Inc.',
    noticePeriod: '30 Days',
    skills: ['Node.js', 'React', 'MongoDB', 'Express', 'TypeScript'],
    status: 'Active'
  },
  {
    id: 'cand-11',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@example.com',
    phone: '+91 98777 22110',
    role: 'Senior AI Research Scientist',
    department: 'Engineering',
    company: 'Google DeepMind',
    experience: '6 yrs exp',
    location: 'Bangalore, India',
    score: '9.5/10',
    numericScore: 9.5,
    stage: 'Culture Fit',
    date: '1 day ago',
    updated: '5 hours ago',
    source: 'Employee Referral',
    agency: 'Direct Application',
    noticePeriod: 'Immediate',
    skills: ['Deep Learning', 'PyTorch', 'Reinforcement Learning', 'JAX', 'C++'],
    status: 'Active'
  },
  {
    id: 'cand-12',
    name: 'David Chen',
    email: 'david.chen@example.com',
    phone: '+1 212 555 0184',
    role: 'VP of Marketing',
    department: 'Marketing',
    company: 'Uber',
    experience: '11 yrs exp',
    location: 'New York, NY',
    score: '9.1/10',
    numericScore: 9.1,
    stage: 'Offer',
    date: '3 days ago',
    updated: '1 day ago',
    source: 'Executive Sourcing',
    agency: 'Direct Application',
    noticePeriod: '60 Days',
    skills: ['Brand Strategy', 'Demand Gen', 'P&L Management', 'Global Teams'],
    status: 'Offer Pending'
  },
  {
    id: 'cand-13',
    name: 'Divya Singh',
    email: 'divya.singh@example.com',
    phone: '+91 99111 88223',
    role: 'Data Engineer',
    department: 'Engineering',
    company: 'Swiggy',
    experience: '4 yrs exp',
    location: 'Bangalore, India',
    score: '8.3/10',
    numericScore: 8.3,
    stage: 'Technical Interview',
    date: '3 days ago',
    updated: '2 days ago',
    source: 'LinkedIn Recruiter',
    agency: 'Direct Application',
    noticePeriod: '15 Days',
    skills: ['Python', 'SQL', 'Snowflake', 'dbt', 'Airflow'],
    status: 'Active'
  },
  {
    id: 'cand-14',
    name: 'Rohit Joshi',
    email: 'rohit.joshi@example.com',
    phone: '+91 98222 33445',
    role: 'Cloud Infrastructure Architect',
    department: 'Engineering',
    company: 'Microsoft',
    experience: '9 yrs exp',
    location: 'Seattle, WA',
    score: '8.9/10',
    numericScore: 8.9,
    stage: 'Hired',
    date: '1 week ago',
    updated: '3 days ago',
    source: 'NextGen Staffing',
    agency: 'NextGen Staffing',
    noticePeriod: 'Immediate',
    skills: ['Azure Cloud', 'Terraform', 'Kubernetes', 'Security', 'Enterprise Architecture'],
    status: 'Hired'
  },
  {
    id: 'cand-15',
    name: 'Varun Khanna',
    email: 'varun.khanna@example.com',
    phone: '+91 93333 44556',
    role: 'Frontend Developer',
    department: 'Engineering',
    company: 'Freelance / Startup',
    experience: '2 yrs exp',
    location: 'Remote',
    score: '7.8/10',
    numericScore: 7.8,
    stage: 'Applied',
    date: '2 days ago',
    updated: 'Today',
    source: 'Direct Careers',
    agency: 'Direct Application',
    noticePeriod: 'Immediate',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Tailwind'],
    status: 'Active'
  },
  {
    id: 'cand-16',
    name: 'Kavita Das',
    email: 'kavita.das@example.com',
    phone: '+91 97777 66554',
    role: 'Product Design Lead',
    department: 'Design',
    company: 'Razorpay',
    experience: '6 yrs exp',
    location: 'Bangalore, India',
    score: '8.7/10',
    numericScore: 8.7,
    stage: 'Reference Check',
    date: '2 weeks ago',
    updated: '4 days ago',
    source: 'Vanguard Recruitment',
    agency: 'Vanguard Recruitment',
    noticePeriod: '30 Days',
    skills: ['Fintech UX', 'Figma', 'Design Ops', 'User Journeys'],
    status: 'Active'
  },
  {
    id: 'cand-17',
    name: 'Vikram Malhotra',
    email: 'vikram.m@example.com',
    phone: '+91 98333 44556',
    role: 'DevOps Engineer',
    department: 'Engineering',
    company: 'Zomato',
    experience: '5 yrs exp',
    location: 'Bangalore, India',
    score: '8.1/10',
    numericScore: 8.1,
    stage: 'Technical Interview',
    date: '3 days ago',
    updated: 'Yesterday',
    source: 'Direct Careers',
    agency: 'Direct Application',
    noticePeriod: '30 Days',
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform'],
    status: 'On Hold'
  },
  {
    id: 'cand-18',
    name: 'Tanya Sengupta',
    email: 'tanya.s@example.com',
    phone: '+91 97111 22334',
    role: 'Frontend Developer',
    department: 'Engineering',
    company: 'Freshworks',
    experience: '2 yrs exp',
    location: 'Pune, India',
    score: '7.4/10',
    numericScore: 7.4,
    stage: 'Rejected',
    date: '4 days ago',
    updated: '2 days ago',
    source: 'Direct Careers',
    agency: 'Direct Application',
    noticePeriod: 'Immediate',
    skills: ['React', 'JavaScript', 'CSS', 'Redux'],
    status: 'Archived'
  }
];

export const INITIAL_LISTS = [
  {
    id: 'list-1',
    name: 'Shortlisted Talent (Q4)',
    description: 'High-priority vetted engineering finalist pool for Q4 expansion and key projects.',
    category: 'Engineering',
    tags: ['Engineering', 'Q4 Hires', 'Top Priority'],
    color: '#1890FF',
    candidateIds: ['cand-1', 'cand-2', 'cand-4', 'cand-11'],
    createdAt: 'Oct 15, 2026',
    updatedAt: 'Just now'
  },
  {
    id: 'list-2',
    name: 'Senior Tech Leads Pipeline',
    description: 'Candidates qualified for cloud infrastructure, distributed systems & tech leadership.',
    category: 'Leadership',
    tags: ['Architecture', 'Leadership', 'Cloud'],
    color: '#8E33FF',
    candidateIds: ['cand-2', 'cand-8', 'cand-14'],
    createdAt: 'Oct 18, 2026',
    updatedAt: 'Yesterday'
  },
  {
    id: 'list-3',
    name: 'Design System Specialists',
    description: 'Product designers and frontend engineers with proven design systems and UX prototyping mastery.',
    category: 'Design & UX',
    tags: ['UI/UX', 'Design Systems', 'Figma'],
    color: '#FFAB00',
    candidateIds: ['cand-3', 'cand-4', 'cand-7', 'cand-16'],
    createdAt: 'Oct 20, 2026',
    updatedAt: '2 days ago'
  },
  {
    id: 'list-4',
    name: 'Immediate Available Bench',
    description: 'Vetted candidates with Immediate or <= 15 days notice period ready for fast-track offers.',
    category: 'Fast-Track',
    tags: ['Immediate', 'Fast-Track', '15 Days'],
    color: '#00A76F',
    candidateIds: ['cand-2', 'cand-3', 'cand-6', 'cand-11'],
    createdAt: 'Oct 21, 2026',
    updatedAt: '3 hours ago'
  },
  {
    id: 'list-5',
    name: 'Future Leadership Pool',
    description: 'Executive, VP, and strategic leadership candidates for future quarterly expansions.',
    category: 'Executive',
    tags: ['Executive', 'Strategy', 'VP Level'],
    color: '#FF5630',
    candidateIds: ['cand-1', 'cand-12'],
    createdAt: 'Oct 22, 2026',
    updatedAt: 'Today'
  }
];

const STORAGE_KEY = 'findneo_recruiter_candidate_lists';

export function getStoredLists() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return INITIAL_LISTS;
}

export function saveStoredLists(lists) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('candidate-lists-updated', { detail: lists }));
    }
  } catch {
    // ignore
  }
}

export function addCandidatesToList(listId, candidateIds) {
  const currentLists = getStoredLists();
  const updatedLists = currentLists.map(list => {
    if (list.id === listId) {
      const existing = new Set(list.candidateIds || []);
      candidateIds.forEach(id => existing.add(id));
      return {
        ...list,
        candidateIds: Array.from(existing),
        updatedAt: 'Just now'
      };
    }
    return list;
  });
  saveStoredLists(updatedLists);
  return updatedLists;
}

export function moveCandidatesToList(targetListId, candidateIds) {
  const currentLists = getStoredLists();
  const updatedLists = currentLists.map(list => {
    if (list.id === targetListId) {
      const existing = new Set(list.candidateIds || []);
      candidateIds.forEach(id => existing.add(id));
      return {
        ...list,
        candidateIds: Array.from(existing),
        updatedAt: 'Just now'
      };
    } else {
      return {
        ...list,
        candidateIds: (list.candidateIds || []).filter(id => !candidateIds.includes(id)),
        updatedAt: 'Just now'
      };
    }
  });
  saveStoredLists(updatedLists);
  return updatedLists;
}
