import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  Video,
  FolderOpen,
  Sparkles,
  Calendar,
  ExternalLink,
  Bot,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  User,
  ArrowRight,
  Lightbulb,
  Target,
  ChevronDown,
  ChevronUp,
  FileText,
  Code2,
  Download,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Users,
  Save,
  Award,
  Edit3,
  Lock,
  Star,
  CheckCircle,
  ArrowRightLeft,
  Cpu,
  X
} from 'lucide-react';
import { useChatbot } from '../contexts/ChatbotContext';
import FeedScorecardModal from '../components/dashboard/FeedScorecardModal';

const TABS = ['Interview Prep', 'Job Description', 'Resume', 'Scorecard', 'Feed Scorecard'];

const getInitials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();

const MOCK_SCORECARDS = [
  {
    id: 'sc-1',
    interviewer: 'Amit Sharma',
    stage: 'Technical Interview',
    date: '10 Mar 2026',
    score: '9.4/10',
    recommendation: 'Strong Hire',
    takeaways: 'Strong technical foundation. Cleared the system design and distributed locking questions with ease.',
    notes: 'I asked about handling race conditions in distributed systems. Candidate mapped out a robust distributed lock mechanism using Redis. We discussed edge cases like clock drift and network partitions. The candidate also correctly identified potential bottlenecks in the API gateway layer and proposed an elegant rate-limiting strategy using token buckets. Overall, highly impressed with their depth of knowledge and practical experience in scaling systems.',
    softSkills: 8.8,
    hardSkills: 9.8,
    cultureFit: 9.2,
    categories: [
      {
        name: 'Personality Traits',
        attributes: [
          { name: 'Self-motivated & Ownership', rating: 'Strong Yes' },
          { name: 'Team Player & Empathy', rating: 'Yes' },
          { name: 'Clear Communication', rating: 'Yes' },
          { name: 'Disciplined & Adaptable', rating: 'Strong Yes' },
        ]
      },
      {
        name: 'Technical Competencies',
        attributes: [
          { name: 'Distributed Systems Architecture', rating: 'Strong Yes' },
          { name: 'React & Node Ecosystems', rating: 'Strong Yes' },
          { name: 'System Design & Concurrency', rating: 'Strong Yes' },
          { name: 'API Design & Scalability', rating: 'Strong Yes' },
        ]
      },
      {
        name: 'Research & Problem Solving',
        attributes: [
          { name: 'Algorithmic Rigor & Optimization', rating: 'Strong Yes' },
          { name: 'Product Strategy & Tradeoffs', rating: 'Yes' },
          { name: 'Creative Problem Solving', rating: 'Strong Yes' },
          { name: 'Analytical Thinking', rating: 'Strong Yes' },
        ]
      }
    ]
  },
  {
    id: 'sc-2',
    interviewer: 'Priya Patel',
    stage: 'Culture Fit',
    date: '12 Mar 2026',
    score: '8.4/10',
    recommendation: 'Leaning Yes',
    takeaways: 'Great alignment with our core values. Shows high ownership, good communication, and bias for action.',
    notes: 'Candidate discussed their experience leading a cross-functional team under a tight deadline. Exhibited strong empathy and pragmatism. They gave a great example of resolving a conflict between engineering and product by relying on data-driven metrics rather than opinions. Would fit well into our culture with quick onboarding.',
    softSkills: 8.8,
    hardSkills: 8.2,
    cultureFit: 8.6,
    categories: [
      {
        name: 'Personality Traits',
        attributes: [
          { name: 'Self-motivated & Ownership', rating: 'Strong Yes' },
          { name: 'Team Player & Empathy', rating: 'Strong Yes' },
          { name: 'Clear Communication', rating: 'Strong Yes' },
          { name: 'Disciplined & Adaptable', rating: 'Yes' },
        ]
      },
      {
        name: 'Technical Competencies',
        attributes: [
          { name: 'Distributed Systems Architecture', rating: 'Unassessed' },
          { name: 'React & Node Ecosystems', rating: 'Yes' },
          { name: 'System Design & Concurrency', rating: 'Yes' },
          { name: 'API Design & Scalability', rating: 'Unassessed' },
        ]
      },
      {
        name: 'Research & Problem Solving',
        attributes: [
          { name: 'Algorithmic Rigor & Optimization', rating: 'Unassessed' },
          { name: 'Product Strategy & Tradeoffs', rating: 'Yes' },
          { name: 'Creative Problem Solving', rating: 'Yes' },
          { name: 'Analytical Thinking', rating: 'Yes' },
        ]
      }
    ]
  },
  {
    id: 'sc-3',
    interviewer: 'David Chen',
    stage: 'Product Sense',
    date: '14 Mar 2026',
    score: '6.2/10',
    recommendation: 'Leaning No',
    takeaways: 'Good overall grasp of product lifecycle but struggled to prioritize features under resource constraints.',
    notes: 'Asked about launching a hypothetical feature in an emerging market. Candidate identified key user pain points but over-indexed on engineering complexity rather than time-to-market. Their initial instinct was to over-engineer rather than iterate through MVPs. Will require heavy guidance on product tradeoffs.',
    softSkills: 6.8,
    hardSkills: 7.2,
    cultureFit: 6.5,
    categories: [
      {
        name: 'Personality Traits',
        attributes: [
          { name: 'Self-motivated & Ownership', rating: 'Yes' },
          { name: 'Team Player & Empathy', rating: 'No' },
          { name: 'Clear Communication', rating: 'Yes' },
          { name: 'Disciplined & Adaptable', rating: 'Yes' },
        ]
      },
      {
        name: 'Technical Competencies',
        attributes: [
          { name: 'Distributed Systems Architecture', rating: 'Yes' },
          { name: 'React & Node Ecosystems', rating: 'Yes' },
          { name: 'System Design & Concurrency', rating: 'No' },
          { name: 'API Design & Scalability', rating: 'Yes' },
        ]
      },
      {
        name: 'Research & Problem Solving',
        attributes: [
          { name: 'Algorithmic Rigor & Optimization', rating: 'Yes' },
          { name: 'Product Strategy & Tradeoffs', rating: 'No' },
          { name: 'Creative Problem Solving', rating: 'No' },
          { name: 'Analytical Thinking', rating: 'Yes' },
        ]
      }
    ]
  },
  {
    id: 'sc-4',
    interviewer: 'Sarah Jenkins',
    stage: 'Executive Review',
    date: '15 Mar 2026',
    score: '4.8/10',
    recommendation: 'Strong Reject',
    takeaways: 'Did not meet the senior leadership bar. Lacked clarity on multi-year technical vision and executive communication.',
    notes: 'Discussed long-term technical roadmap and leading organizational transformations. Candidate was unable to articulate a structured framework for managing technical debt vs business velocity. Struggled with high-level stakeholder alignment and showed defensiveness when questioned on past project setbacks.',
    softSkills: 4.8,
    hardSkills: 5.4,
    cultureFit: 4.2,
    categories: [
      {
        name: 'Personality Traits',
        attributes: [
          { name: 'Self-motivated & Ownership', rating: 'Strong No' },
          { name: 'Team Player & Empathy', rating: 'Strong No' },
          { name: 'Clear Communication', rating: 'Strong No' },
          { name: 'Disciplined & Adaptable', rating: 'Strong No' },
        ]
      },
      {
        name: 'Technical Competencies',
        attributes: [
          { name: 'Distributed Systems Architecture', rating: 'Strong No' },
          { name: 'React & Node Ecosystems', rating: 'Strong No' },
          { name: 'System Design & Concurrency', rating: 'Strong No' },
          { name: 'API Design & Scalability', rating: 'Unassessed' },
        ]
      },
      {
        name: 'Research & Problem Solving',
        attributes: [
          { name: 'Algorithmic Rigor & Optimization', rating: 'Strong No' },
          { name: 'Product Strategy & Tradeoffs', rating: 'Strong No' },
          { name: 'Creative Problem Solving', rating: 'Strong No' },
          { name: 'Analytical Thinking', rating: 'Strong No' },
        ]
      }
    ]
  }
];

MOCK_SCORECARDS.forEach(sc => {
  sc.attributes = sc.categories.flatMap(c => c.attributes.map(a => ({ ...a, category: c.name })));
});

const getAggregatedAttributeRating = (categoryName, attrName) => {
  const ratings = MOCK_SCORECARDS
    .map(sc => sc.categories?.find(c => c.name === categoryName)?.attributes?.find(a => a.name === attrName)?.rating)
    .filter(Boolean);
  
  if (ratings.length === 0) return 'Unassessed';
  
  const weights = { 'strong yes': 4, 'yes': 3, 'no': 2, 'strong no': 1, 'unassessed': 0 };
  const validWeights = ratings.map(r => weights[r.toLowerCase()] ?? 0);
  const avg = validWeights.reduce((a, b) => a + b, 0) / validWeights.length;
  
  if (avg >= 3.4) return 'Strong Yes';
  if (avg >= 2.4) return 'Yes';
  if (avg >= 1.4) return 'No';
  if (avg >= 0.5) return 'Strong No';
  return 'Unassessed';
};

const getScorecardsSummaryData = () => {
  const attributeMap = {};

  MOCK_SCORECARDS.forEach(sc => {
    (sc.categories || []).forEach(cat => {
      (cat.attributes || []).forEach(attr => {
        const key = `${cat.name}___${attr.name}`;
        if (!attributeMap[key]) {
          attributeMap[key] = {
            name: attr.name,
            category: cat.name,
            ratings: []
          };
        }
        attributeMap[key].ratings.push({
          interviewer: sc.interviewer,
          stage: sc.stage,
          rating: attr.rating
        });
      });
    });
  });

  const consensus = [];
  const discrepancies = [];

  const ratingWeight = { 'strong yes': 4, 'yes': 3, 'no': 2, 'strong no': 1 };

  Object.values(attributeMap).forEach(item => {
    const assessedRatings = item.ratings.filter(r => r.rating && r.rating.toLowerCase() !== 'unassessed');
    if (assessedRatings.length === 0) return;

    const weights = assessedRatings.map(r => ratingWeight[r.rating.toLowerCase()] || 2);
    const minW = Math.min(...weights);
    const maxW = Math.max(...weights);
    const diff = maxW - minW;

    if (diff >= 2) {
      discrepancies.push(item);
    } else {
      consensus.push(item);
    }
  });

  const getTopDiverse = (list, limit = 3) => {
    const categoriesSeen = new Set();
    const result = [];
    for (const item of list) {
      if (!categoriesSeen.has(item.category) && result.length < limit) {
        result.push(item);
        categoriesSeen.add(item.category);
      }
    }
    for (const item of list) {
      if (result.length >= limit) break;
      if (!result.includes(item)) {
        result.push(item);
      }
    }
    return result;
  };

  return { 
    consensus: getTopDiverse(consensus, 3), 
    discrepancies: getTopDiverse(discrepancies, 3) 
  };
};

const SCORECARD_SUMMARY_ATTRIBUTES = [
  { name: 'Self-motivated & Ownership', category: 'Personality Traits' },
  { name: 'Clear Communication', category: 'Personality Traits' },
  { name: 'React & Node Ecosystems', category: 'Technical Competencies' },
  { name: 'System Design & Concurrency', category: 'Technical Competencies' },
  { name: 'Product Strategy & Tradeoffs', category: 'Research & Problem Solving' },
  { name: 'Creative Problem Solving', category: 'Research & Problem Solving' },
];

const getRatingAvatarStyle = (rating) => {
  switch (rating?.toLowerCase()) {
    case 'strong yes':
    case 'advanced':
      return {
        bg: 'bg-[#00A76F]',
        text: 'text-white',
        border: 'border-2 border-white dark:border-[#161c24]',
        label: 'Strong Yes',
      };
    case 'yes':
    case 'competent':
      return {
        bg: 'bg-[#1890FF]',
        text: 'text-white',
        border: 'border-2 border-white dark:border-[#161c24]',
        label: 'Yes',
      };
    case 'no':
      return {
        bg: 'bg-[#FFAB00]',
        text: 'text-white',
        border: 'border-2 border-white dark:border-[#161c24]',
        label: 'No',
      };
    case 'strong no':
    case 'beginner':
      return {
        bg: 'bg-[#FF5630]',
        text: 'text-white',
        border: 'border-2 border-white dark:border-[#161c24]',
        label: 'Strong No',
      };
    case 'unassessed':
    case 'insufficient data':
    case 'unassessed / insufficient data':
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-400 dark:text-gray-500',
        border: 'border-2 border-dashed border-gray-300 dark:border-gray-600',
        label: 'Unassessed',
      };
  }
};

const renderRatingCircle = (rating, size = "w-3.5 h-3.5") => {
  switch (rating?.toLowerCase()) {
    case 'strong yes':
    case 'advanced':
      return <span title="Strong Yes" className={`inline-block shrink-0 ${size} rounded-full bg-[#00A76F] shadow-xs`} />;
    case 'yes':
    case 'competent':
      return <span title="Yes" className={`inline-block shrink-0 ${size} rounded-full bg-[#1890FF] shadow-xs`} />;
    case 'no':
      return <span title="No" className={`inline-block shrink-0 ${size} rounded-full bg-[#FFAB00] shadow-xs`} />;
    case 'strong no':
    case 'beginner':
      return <span title="Strong No" className={`inline-block shrink-0 ${size} rounded-full bg-[#FF5630] shadow-xs`} />;
    case 'unassessed':
    case 'insufficient data':
    case 'unassessed / insufficient data':
    default:
      return <span title="Unassessed / Insufficient Data" className={`inline-block shrink-0 ${size} rounded-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500 shadow-xs`} />;
  }
};

const getRatingLabel = (rating) => {
  switch (rating?.toLowerCase()) {
    case 'strong yes':
    case 'advanced':
      return { label: 'Strong Yes', text: 'text-[#00A76F]' };
    case 'yes':
    case 'competent':
      return { label: 'Yes', text: 'text-[#1890FF]' };
    case 'no':
      return { label: 'No', text: 'text-[#FFAB00]' };
    case 'strong no':
    case 'beginner':
      return { label: 'Strong No', text: 'text-[#FF5630]' };
    case 'unassessed':
    case 'insufficient data':
    case 'unassessed / insufficient data':
    default:
      return { label: 'Unassessed', text: 'text-gray-400' };
  }
};

const getRecBadge = (recommendation) => {
  switch (recommendation) {
    case 'Strong Hire':
    case 'Strong Yes':
      return { 
        label: 'Strong Hire', 
        emoji: '🌟', 
        bg: 'bg-[#00A76F]/10 dark:bg-[#00A76F]/20', 
        border: 'border-[#00A76F]/30', 
        text: 'text-[#00A76F]', 
        dot: 'bg-[#00A76F]', 
        borderNode: 'border-[#00A76F]' 
      };
    case 'Leaning Yes':
    case 'Yes':
    case 'Hire':
      return { 
        label: 'Leaning Yes', 
        emoji: '👍', 
        bg: 'bg-[#1890FF]/10 dark:bg-[#1890FF]/20', 
        border: 'border-[#1890FF]/30', 
        text: 'text-[#1890FF]', 
        dot: 'bg-[#1890FF]', 
        borderNode: 'border-[#1890FF]' 
      };
    case 'Leaning No':
    case 'Mixed':
      return { 
        label: 'Leaning No', 
        emoji: '👎', 
        bg: 'bg-[#FFAB00]/10 dark:bg-[#FFAB00]/20', 
        border: 'border-[#FFAB00]/30', 
        text: 'text-[#FFAB00]', 
        dot: 'bg-[#FFAB00]', 
        borderNode: 'border-[#FFAB00]' 
      };
    case 'Strong Reject':
    case 'Strong No':
    case 'No':
    case 'No Hire':
    case 'Strong No Hire':
      return { 
        label: 'Strong Reject', 
        emoji: '⛔', 
        bg: 'bg-[#FF5630]/10 dark:bg-[#FF5630]/20', 
        border: 'border-[#FF5630]/30', 
        text: 'text-[#FF5630]', 
        dot: 'bg-[#FF5630]', 
        borderNode: 'border-[#FF5630]' 
      };
    default:
      return { 
        label: recommendation || 'Leaning Yes', 
        emoji: '👍', 
        bg: 'bg-[#1890FF]/10 dark:bg-[#1890FF]/20', 
        border: 'border-[#1890FF]/30', 
        text: 'text-[#1890FF]', 
        dot: 'bg-[#1890FF]', 
        borderNode: 'border-[#1890FF]' 
      };
  }
};

const SAMPLE_RESUME_URL = `${import.meta.env.BASE_URL}resumes/sample-resume.pdf`;

const SCORECARD_CATEGORIES = [
  {
    name: 'Personality Traits',
    attributes: [
      { name: 'Self-motivated & Ownership' },
      { name: 'Team Player & Empathy' },
      { name: 'Clear Communication' },
      { name: 'Disciplined & Adaptable' },
    ]
  },
  {
    name: 'Technical Competencies',
    attributes: [
      { name: 'Distributed Systems Architecture' },
      { name: 'System Design & Concurrency' },
      { name: 'API Design & Scalability' },
      { name: 'Java & Kafka Ecosystem' },
    ]
  },
  {
    name: 'Research & Problem Solving',
    attributes: [
      { name: 'Algorithmic Rigor & Optimization' },
      { name: 'Product Strategy & Tradeoffs' },
      { name: 'Creative Problem Solving' },
      { name: 'Analytical Thinking' },
    ]
  }
];

const SCORECARD_RECOMMENDATIONS = [
  {
    id: 'Strong Hire',
    label: 'Strong Hire',
    emoji: '🌟',
    badgeText: 'text-[#00A76F]',
    badgeBg: 'bg-[#00A76F]/10 dark:bg-[#00A76F]/20',
    border: 'border-[#00A76F]/30',
    hoverBorder: 'hover:border-[#00A76F]',
    activeRing: 'ring-2 ring-[#00A76F] bg-[#00A76F]/5 border-[#00A76F]',
    description: 'Candidate exceeds bar across high-signal requirements. Highly recommended for offer.'
  },
  {
    id: 'Leaning Yes',
    label: 'Leaning Yes',
    emoji: '👍',
    badgeText: 'text-[#1890FF]',
    badgeBg: 'bg-[#1890FF]/10 dark:bg-[#1890FF]/20',
    border: 'border-[#1890FF]/30',
    hoverBorder: 'hover:border-[#1890FF]',
    activeRing: 'ring-2 ring-[#1890FF] bg-[#1890FF]/5 border-[#1890FF]',
    description: 'Candidate meets bar with strong fundamentals and clear positive hiring potential.'
  },
  {
    id: 'Leaning No',
    label: 'Leaning No',
    emoji: '👎',
    badgeText: 'text-[#FFAB00]',
    badgeBg: 'bg-[#FFAB00]/10 dark:bg-[#FFAB00]/20',
    border: 'border-[#FFAB00]/30',
    hoverBorder: 'hover:border-[#FFAB00]',
    activeRing: 'ring-2 ring-[#FFAB00] bg-[#FFAB00]/5 border-[#FFAB00]',
    description: 'Candidate showed notable gaps in core competencies or concerns needing resolution.'
  },
  {
    id: 'Strong Reject',
    label: 'Strong Reject',
    emoji: '⛔',
    badgeText: 'text-[#FF5630]',
    badgeBg: 'bg-[#FF5630]/10 dark:bg-[#FF5630]/20',
    border: 'border-[#FF5630]/30',
    hoverBorder: 'hover:border-[#FF5630]',
    activeRing: 'ring-2 ring-[#FF5630] bg-[#FF5630]/5 border-[#FF5630]',
    description: 'Candidate does not meet minimum technical depth or role requirements.'
  }
];

const RATING_OPTIONS = [
  {
    id: 'Strong Yes',
    label: 'Strong Yes',
    colorClass: 'bg-[#00A76F]',
    activeRing: 'ring-2 ring-[#00A76F] ring-offset-2 ring-offset-white dark:ring-offset-[#161c24]'
  },
  {
    id: 'Yes',
    label: 'Yes',
    colorClass: 'bg-[#1890FF]',
    activeRing: 'ring-2 ring-[#1890FF] ring-offset-2 ring-offset-white dark:ring-offset-[#161c24]'
  },
  {
    id: 'No',
    label: 'No',
    colorClass: 'bg-[#FFAB00]',
    activeRing: 'ring-2 ring-[#FFAB00] ring-offset-2 ring-offset-white dark:ring-offset-[#161c24]'
  },
  {
    id: 'Strong No',
    label: 'Strong No',
    colorClass: 'bg-[#FF5630]',
    activeRing: 'ring-2 ring-[#FF5630] ring-offset-2 ring-offset-white dark:ring-offset-[#161c24]'
  }
];

const CANDIDATE_APPLICATION_DETAILS = {
  name: 'Neha Sharma',
  email: 'neha.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Bangalore, KA',
  timeZone: 'IST (UTC +5:30)',
  totalExp: '8 Years',
  relevantExp: '5.5 Years',
  currentCompany: 'Quillpay',
  currentTitle: 'Backend Lead',
  primarySkills: ['Java', 'Kafka', 'Spring Boot', 'PostgreSQL', 'Redis Distributed Locks', 'Event Sourcing'],
  noticePeriod: '30 Days',
  availableFrom: 'Oct 01, 2026',
  workMode: 'Hybrid',
  currentCTC: '₹45,00,000',
  expectedCTC: '₹60,00,000',
  experienceTimeline: [
    { title: 'Backend Lead', company: 'Quillpay', period: '2022 - Present', isCurrent: true },
    { title: 'Senior SDE', company: 'Razorpay', period: '2019 - 2022', isCurrent: false },
    { title: 'Software Engineer', company: 'Flipkart', period: '2016 - 2019', isCurrent: false }
  ],
  education: {
    degree: 'B.Tech in Computer Science',
    institution: 'IIT Bombay (2012 - 2016)',
    certification: 'AWS Certified Solutions Architect (Professional)'
  },
  profiles: {
    linkedin: 'linkedin.com/in/nehasharma',
    github: 'github.com/nehasharma',
    portfolio: 'nehasharma.dev'
  }
};

// MOCK DATA FOR PREVIOUS ROUNDS
const PREVIOUS_ROUNDS_FEEDBACK = [
  {
    id: 'round-1',
    roundName: 'Round 1: Technical & Coding',
    date: '23 Sep 2026',
    duration: '45 mins',
    interviewers: [
      { name: 'Vikram Nair', role: 'Staff Engineer', avatar: 'VN', recommendation: 'Strong Hire', score: '8.5/10' }
    ],
    overallRecommendation: 'Strong Hire',
    summary: 'Demonstrated exceptional core Java memory management and clean API design. Wrote clean idempotent webhook handlers effortlessly.',
    strengths: [
      'Deep understanding of multi-threading and thread-safety mechanisms in high-concurrency JVM.',
      'Designed a graceful degradation pattern for batch transaction retries under 15 minutes.'
    ],
    areasToProbe: [
      'Check how she handles data reconciliation lag when read-replicas desynchronize in distributed Postgres.'
    ]
  },
  {
    id: 'round-hm',
    roundName: 'Round 2: Hiring Manager Fit',
    date: '26 Sep 2026',
    duration: '50 mins',
    interviewers: [
      { name: 'Karthik Rao', role: 'Engineering Director', avatar: 'KR', recommendation: 'Leaning Yes', score: '7.5/10' }
    ],
    overallRecommendation: 'Leaning Yes',
    summary: 'Great cultural fit, strong leadership demeanor. Has led 5 engineers effectively through major platform migrations.',
    strengths: [
      'Transparent about technical debt tradeoffs.',
      'High ownership mentality; managed cross-functional dependencies across finance & security.'
    ],
    areasToProbe: [
      'Ensure she clarifies personal contribution vs team consensus in large architectural choices.'
    ]
  }
];

const JOB_DESCRIPTION_DATA = {
  title: 'Senior Backend Engineer',
  department: 'Core Ledger & Payments',
  location: 'Bangalore, India (Hybrid)',
  employmentType: 'Full-time',
  experience: '6 - 9 Years',
  aboutRole: 'We are seeking an exceptional Senior Backend Engineer to join our Core Ledger & Payments architecture team. You will lead the design, scaling, and fault tolerance of our distributed financial ledger, high-throughput event processing pipelines, and mission-critical payment settlement engines.',
  responsibilities: [
    'Architect, scale, and optimize distributed event-driven systems using Java, Spring Boot, and Apache Kafka.',
    'Design zero-loss idempotency protocols and multi-region database partitioning strategies in PostgreSQL.',
    'Ensure sub-50ms p99 latency across concurrent ledger balancing transactions under high lock contention.',
    'Collaborate with SRE, DevOps, and Security teams to maintain 99.999% platform availability and automated disaster recovery.',
    'Mentor intermediate engineers and conduct comprehensive design reviews to elevate architectural rigor across the engineering organization.'
  ],
  qualifications: [
    '7+ years of experience engineering high-scale distributed backend systems in Java/JVM or Go.',
    'Deep expertise in Apache Kafka event streaming, consumer group partitioning, and exactly-once processing semantics.',
    'Proven track record managing PostgreSQL database concurrency, distributed locking (Redis), and transaction isolation levels.',
    'Strong grasp of distributed systems tradeoffs (CAP theorem, event sourcing, CQRS, consensus protocols).',
    'Demonstrated experience handling financial transaction ledgers or audit-grade distributed records is a major plus.'
  ],
  skills: [
    { name: 'Java / JVM', years: '5', required: true },
    { name: 'Apache Kafka', years: '4', required: true },
    { name: 'Distributed Systems', years: '4', required: true },
    { name: 'Spring Boot', years: '4', required: true },
    { name: 'PostgreSQL & Partitioning', years: '4', required: true },
    { name: 'Redis Distributed Locks', years: '3', required: true },
    { name: 'Event Sourcing & CQRS', years: '2', required: false },
    { name: 'Kubernetes & Docker', years: '3', required: false },
    { name: 'AWS Cloud Infrastructure', years: '3', required: false }
  ]
};

const getRecommendationBadge = (recommendation) => {
  switch (recommendation) {
    case 'Strong Hire':
    case 'Strong Yes':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#00A76F]/10 dark:bg-[#00A76F]/20 text-[#00A76F] border border-[#00A76F]/30">
          <span className="text-xs">🌟</span>
          <span>Strong Hire</span>
        </span>
      );
    case 'Leaning Yes':
    case 'Yes':
    case 'Hire':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#1890FF]/10 dark:bg-[#1890FF]/20 text-[#1890FF] border border-[#1890FF]/30">
          <span className="text-xs">👍</span>
          <span>Leaning Yes</span>
        </span>
      );
    case 'Leaning No':
    case 'Mixed':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFAB00]/10 dark:bg-[#FFAB00]/20 text-[#FFAB00] border border-[#FFAB00]/30">
          <span className="text-xs">👎</span>
          <span>Leaning No</span>
        </span>
      );
    case 'Strong Reject':
    case 'Strong No':
    case 'No Hire':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF5630]/10 dark:bg-[#FF5630]/20 text-[#FF5630] border border-[#FF5630]/30">
          <span className="text-xs">⛔</span>
          <span>Strong Reject</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#1890FF]/10 dark:bg-[#1890FF]/20 text-[#1890FF] border border-[#1890FF]/30">
          <span className="text-xs">👍</span>
          <span>{recommendation || 'Leaning Yes'}</span>
        </span>
      );
  }
};

export default function InterviewKitsPage() {
  const navigate = useNavigate();
  const { setIsChatbotCollapsed, setChatbotWidth, setMessages } = useChatbot();
  const [activeTab, setActiveTab] = useState('Interview Prep');

  // Countdown timer state (calculating time to scheduled interview: 1 Oct 2026, 15:00 IST)
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 28, seconds: 45 });
  const [copiedQuestionId, setCopiedQuestionId] = useState(null);

  // Scorecard State (State 1: Scoring Mode)
  const [scorecardSubmitted, setScorecardSubmitted] = useState(false);
  const [scorecardFeedback, setScorecardFeedback] = useState(
    `Neha demonstrated stellar depth in distributed systems architecture and distributed lock mechanics. She walked through a practical ledger implementation using Redis Redlock and explained how to guard against clock drifts and network partitions.

Key Strengths:
• Deep knowledge of Kafka consumer group rebalances and idempotent producers.
• Pragmatic approach to handling database replica lag during write bursts.
• Clear, confident communication with strong architectural articulation.`
  );
  const [isFeedbackFocused, setIsFeedbackFocused] = useState(false);
  const [noteForOthers, setNoteForOthers] = useState(
    `Solid on high-level architecture and ledger design. In Round 3 (Executive / Bar Raiser), recommend probing her experience managing cross-geo stakeholder alignment and scaling engineering teams through rapid growth.`
  );
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);
  const [isNoteSaved, setIsNoteSaved] = useState(true);

  // Private Note State (Visible only to specific users/roles)
  const [privateNote, setPrivateNote] = useState(
    `Candidate indicated competing offer discussions with Atlassian concluding in 10 days. If extending an offer, comp expectations are ₹60L but she prioritizes technical ownership of the ledger architecture over absolute base salary.`
  );
  const [privateNoteVisibility, setPrivateNoteVisibility] = useState('Hiring Manager');
  const [isPrivateNoteExpanded, setIsPrivateNoteExpanded] = useState(false);
  const [isPrivateNoteSaved, setIsPrivateNoteSaved] = useState(true);
  const [activeNoteTab, setActiveNoteTab] = useState('handover'); // 'handover' | 'private'
  const [selectedRecommendation, setSelectedRecommendation] = useState('Strong Hire');
  const [saveToast, setSaveToast] = useState(null);
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  const [attributeRatings, setAttributeRatings] = useState({
    'Self-motivated & Ownership': 'Strong Yes',
    'Team Player & Empathy': 'Yes',
    'Clear Communication': 'Strong Yes',
    'Disciplined & Adaptable': 'Yes',
    'Distributed Systems Architecture': 'Strong Yes',
    'System Design & Concurrency': 'Strong Yes',
    'API Design & Scalability': 'Strong Yes',
    'Java & Kafka Ecosystem': 'Strong Yes',
    'Algorithmic Rigor & Optimization': 'Strong Yes',
    'Product Strategy & Tradeoffs': 'Yes',
    'Creative Problem Solving': 'Strong Yes',
    'Analytical Thinking': 'Strong Yes',
  });

  // Scorecard (Candidate Profile replica) State
  const [scorecardSubTab, setScorecardSubTab] = useState('Detailed Scorecards');
  const [openScorecards, setOpenScorecards] = useState(['sc-1']);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [inspectorData, setInspectorData] = useState(null);

  const openInspectorDrawer = (interviewerName, attributeName) => {
    const scorecard = MOCK_SCORECARDS.find(sc => sc.interviewer === interviewerName);
    if (!scorecard) return;
    setInspectorData({
      scorecard,
      focusedAttributeName: attributeName,
    });
  };

  const closeInspectorDrawer = () => {
    setInspectorData(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && inspectorData) {
        closeInspectorDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectorData]);

  const handleFormatText = (prefix, suffix = '') => {
    const textarea = document.getElementById('scorecard-rich-textarea');
    if (!textarea) {
      setScorecardFeedback(prev => prev + `${prefix}text${suffix}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'text';
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = before + prefix + selected + suffix + after;
    setScorecardFeedback(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  // Interactive countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionId(id);
    setTimeout(() => setCopiedQuestionId(null), 2000);
  };

  // OPEN FINDNEO AI CHATBOT WITH INTERVIEW DOSSIER POPULATED
  const handleAskTrinity = () => {
    setIsChatbotCollapsed(false);
    setChatbotWidth(prev => Math.max(prev, 460));

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: 'Prepare interview brief for Neha Kulkarni — Technical Round 2: System Architecture'
    };

    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      type: 'interview-prep',
      candidateName: 'Neha Kulkarni',
      roundName: 'Technical Round 2: System Architecture',
      duration: '60 Mins',
      whyThisRoundExists: "Neha passed screening and coding with high marks. Our payments ledger processes 50M daily transactions (3x Quillpay's volume). This round evaluates her ability to build zero-downtime, strictly serialized financial ledgers under extreme concurrent load.",
      signalsToExtract: [
        { title: 'Idempotency Guarantees', detail: 'Structuring idempotency keys across API gateways, Redis, and DB tables.' },
        { title: 'Lock Contention & Race Conditions', detail: 'Managing hot wallet balances without deadlocks under 10k+ req/sec.' },
        { title: 'Kafka Partition Ordering', detail: 'Partition keys, consumer rebalancing storms, and poison pill DLQs.' },
        { title: 'Direct Ownership', detail: 'Distinguishing her personal contributions from team consensus.' }
      ],
      shapeOfHour: [
        { time: '00–05m', title: 'Intro & Scope', desc: 'Set expectations and review role scope.' },
        { time: '05–30m', title: 'Quillpay Ledger Deep Dive', desc: 'Data flow from payment webhook to consumer settlement worker.' },
        { time: '30–50m', title: 'Scenario Stress Testing', desc: 'Out-of-order Kafka events and PostgreSQL replica lag.' },
        { time: '50–60m', title: 'Candidate Q&A', desc: 'Engineering culture and system architecture questions.' }
      ],
      questions: [
        'In your Quillpay ledger migration, what specific steps did you take when read-replicas were 200ms behind during high traffic spikes?',
        'If a consumer crashes mid-transaction after reading from Kafka but before committing to Postgres, how do you prevent duplicated ledger records upon recovery?',
        'Which design decision in the payout platform was solely yours, and what tradeoff did you make that you would do differently today?'
      ]
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 relative animate-fade-in font-sans">
      {/* TOP BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] font-bold text-gray-500 dark:text-gray-400">
        <button onClick={() => navigate('/dashboard/jobs')} className="hover:text-[#1890FF] transition-colors cursor-pointer">
          Interviews
        </button>
        <ChevronRight size={14} className="text-gray-400 shrink-0" />
        <button onClick={() => navigate('/dashboard/agencies')} className="hover:text-[#1890FF] transition-colors cursor-pointer">
          Senior Backend Engineer
        </button>
        <ChevronRight size={14} className="text-gray-400 shrink-0" />
        <span className="text-[#212b36] dark:text-white">Neha Kulkarni</span>
      </nav>

      {/* CANDIDATE HEADER CARD */}
      <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            {/* Candidate Name, Pronouns & Highlighted Interview Round */}
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl font-black text-[#212b36] dark:text-white truncate tracking-tight leading-none">
                Neha Kulkarni
              </h1>
              <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
                He/Him
              </span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#00A76F]/10 text-[#00A76F] inline-flex items-center gap-1.5 border border-[#00A76F]/20">
                <Video size={13} className="text-[#00A76F]" />
                Interview: Technical Round 2 · 1 Oct 2026, 15:00–16:00 IST
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {/* Line 1: Core Contact */}
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5 text-[#212b36] dark:text-gray-300">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-[13px] font-bold">neha.kulkarni@example.com</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#212b36] dark:text-gray-300">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-[13px] font-bold">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#212b36] dark:text-gray-300">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="text-[13px] font-bold">
                    Pune <span className="text-gray-400 font-medium ml-1">• IST (UTC+5:30)</span>
                  </span>
                </div>
              </div>

              {/* Line 2: Professional & Logistics */}
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5 text-[#212b36] dark:text-gray-300">
                  <Briefcase size={14} className="text-gray-400" />
                  <span className="text-[13px] font-bold">
                    Backend Lead <span className="text-gray-500 font-medium">at Quillpay (8 yrs exp)</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#212b36] dark:text-gray-300">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-[13px] font-bold">Applied 18 Sep 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STANDALONE TABS ROW */}
      <div className="flex flex-wrap items-center gap-6 border-b border-gray-200 dark:border-gray-800 pb-0">
        {TABS.map((tab) => {
          const isFeedTab = tab === 'Feed Scorecard';
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                if (isFeedTab) {
                  setIsFeedModalOpen(true);
                } else {
                  setActiveTab(tab);
                }
              }}
              className={`pb-2.5 text-[13px] font-bold transition-all duration-200 whitespace-nowrap relative cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-0 select-none ${
                isActive && !isFeedTab
                  ? 'text-[#1890FF] dark:text-[#1890FF]'
                  : 'text-gray-600 hover:text-[#212b36] dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <span>{tab}</span>
              {isFeedTab && (
                <Lock size={12} className="shrink-0 text-gray-500 dark:text-gray-400" />
              )}
              {isActive && !isFeedTab && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#1890FF] rounded-t-full shadow-xs transition-all duration-200"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREA */}
      {activeTab === 'Interview Prep' ? (
        <div className="space-y-6 animate-fade-in">
          
          {/* ========================================================= */}
          {/* CARD 1: INTERVIEW DETAILS & LIVE COUNTDOWN */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 shadow-sm space-y-4">
            {/* Header with Round Title & Countdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-[#212b36] dark:text-white flex items-center gap-2">
                    <Video size={16} className="text-gray-500 dark:text-gray-400" />
                    Technical Round 2: System Architecture
                  </h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] border border-blue-200/60 dark:border-blue-800/40">
                    60 Mins
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Deep-dive assessment focusing on distributed ledger scalability, asynchronous messaging with Kafka, and high-throughput thread concurrency.
                </p>
              </div>

              {/* Countdown ticker pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 shrink-0 self-start sm:self-auto shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5630] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5630]"></span>
                </span>
                <Clock size={15} className="text-[#FF5630]" />
                <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Starts in:</span>
                <span className="text-xs font-bold text-red-600 dark:text-red-400 font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {/* Date & Time */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5">
                  <Calendar size={15} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Schedule</div>
                  <div className="text-xs font-bold text-[#212b36] dark:text-white mt-0.5">1 Oct 2026</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">15:00 – 16:00 IST</div>
                </div>
              </div>

              {/* Format & Link */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5">
                  <Video size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Location / Format</div>
                  <div className="text-xs font-bold text-[#212b36] dark:text-white mt-0.5 truncate">Online (MS Teams)</div>
                  <a
                    href="#join"
                    onClick={(e) => { e.preventDefault(); alert('Connecting to Microsoft Teams Meeting Room...'); }}
                    className="text-[11px] font-bold text-[#1890FF] hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>Join Meeting</span>
                    <ExternalLink size={10} className="text-[#1890FF]" />
                  </a>
                </div>
              </div>

              {/* Primary Evaluator */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5">
                  <User size={15} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Interviewer</div>
                  <div className="text-xs font-bold text-[#212b36] dark:text-white mt-0.5">Jahangir Alam (You)</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">Principal Architect</div>
                </div>
              </div>

              {/* Target Candidate */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5">
                  <Target size={15} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Target Role</div>
                  <div className="text-xs font-bold text-[#212b36] dark:text-white mt-0.5">Senior Backend Engineer</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">Core Ledger & Payments</div>
                </div>
              </div>
            </div>
          </div>


          {/* ========================================================= */}
          {/* CANDIDATE AT-A-GLANCE (PRE-INTERVIEW RESUME SUMMARY)      */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 shadow-sm space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] shrink-0">
                  <User size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-[#212b36] dark:text-white">
                      Candidate Snapshot · At a Glance
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00A76F] border border-emerald-200/60 dark:border-emerald-800/40">
                      <span>⭐</span>
                      <span>Top Company Alum</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Essential resume & profile intelligence synthesized for the interviewer without switching tabs.
                  </p>
                </div>
              </div>

              {/* Quick shortcut to full resume */}
              <button
                type="button"
                onClick={() => setActiveTab('Resume')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 text-xs font-semibold text-[#1890FF] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                title="Open PDF Resume Tab"
              >
                <FileText size={13} />
                <span>View Full Resume</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* 4 Compact Intelligence Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Tile 1: Experience & Tenure Stability */}
              <div className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Briefcase size={14} className="text-[#1890FF]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Experience & Tenure</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/20 text-[#00A76F] border border-emerald-200/50 dark:border-emerald-800/30">
                    Job Stability
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-[#212b36] dark:text-white">8.0 Yrs</span>
                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Total · 5.5 Yrs Relevant</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Current: <strong className="text-[#212b36] dark:text-gray-200 font-semibold">Backend Lead</strong> at Quillpay
                  </p>
                </div>

                {/* Career Tenure Timeline */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-[#454f5b] dark:text-gray-300">Quillpay (2y) · Razorpay (3y) · Flipkart (3y)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 size={11} className="shrink-0 text-[#00A76F]" />
                    <span>Avg tenure 2.7 yrs / company (Stable)</span>
                  </div>
                </div>
              </div>

              {/* Tile 2: Notable Companies & Education Background */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50/50 via-gray-50/70 to-gray-50/50 dark:from-amber-950/15 dark:via-gray-800/30 dark:to-gray-800/20 border border-amber-200/50 dark:border-amber-800/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Award size={14} className="text-[#FFAB00]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">Notable Companies & Education</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100/70 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-300/50 dark:border-amber-700/40">
                    Big Tech / Unicorn
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-gray-800 text-[#212b36] dark:text-white border border-gray-200 dark:border-gray-700 shadow-2xs">
                      Flipkart (Walmart)
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-gray-800 text-[#212b36] dark:text-white border border-gray-200 dark:border-gray-700 shadow-2xs">
                      Razorpay
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1 leading-tight">
                    Proven experience working at top companies (MAANG / Flipkart / Razorpay) with large-scale systems.
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-200/40 dark:border-amber-900/30 space-y-1">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Education: <strong className="text-[#212b36] dark:text-gray-200 font-semibold">IIT Bombay</strong> (B.Tech CS · 2016)
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Certification: <strong className="text-[#212b36] dark:text-gray-200 font-semibold">AWS Certified Solutions Architect</strong> (Professional)
                  </p>
                </div>
              </div>

              {/* Tile 3: Skill & Requirement Match */}
              <div className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Target size={14} className="text-[#00A76F]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Skills Match</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/20 text-[#00A76F] border border-emerald-200/50 dark:border-emerald-800/30">
                    8 of 9 Matched
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-[#00A76F]">High Match</span>
                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">for Target Role</span>
                  </div>

                  {/* Matched skill chips */}
                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    {['Java', 'Kafka', 'Postgres', 'Redis', 'Spring'].map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white dark:bg-gray-800 text-[#00A76F] border border-emerald-200/70 dark:border-emerald-800/50 shadow-2xs"
                      >
                        <Check size={9} className="stroke-[3]" />
                        <span>{s}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom line: Gap to probe */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 dark:text-gray-400">Skill to Probe:</span>
                  <span className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFAB00] shrink-0" />
                    AWS Cloud Infra
                  </span>
                </div>
              </div>

              {/* Tile 4: Location, Relocation & Availability */}
              <div className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <MapPin size={14} className="text-[#1890FF]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Location & Mobility</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] border border-blue-200/50 dark:border-blue-800/30">
                    Local Match
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#212b36] dark:text-white flex items-center gap-1">
                    <span>Bangalore, KA</span>
                    <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400 font-semibold">(Job Location Match)</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Prefers: <span className="font-semibold text-gray-700 dark:text-gray-300">Bangalore (Hybrid)</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800/60 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Willing to Relocate:</span>
                    <span className="font-bold text-[#00A76F] flex items-center gap-0.5">
                      <CheckCircle2 size={11} /> Yes (Open)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-500 dark:text-gray-400">Notice Period:</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">30 Days (Serving)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row with "Ask Trinity" CTA */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Bot size={15} className="text-gray-500 dark:text-gray-400" />
                <span>Trinity AI prepared a customized round dossier synthesizing Neha's background & past feedback.</span>
              </div>

              {/* CTA AT BOTTOM RIGHT: ASK TRINITY */}
              <button
                type="button"
                onClick={handleAskTrinity}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1890FF] hover:bg-[#1890FF]/90 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <Sparkles size={14} />
                <span>Ask Trinity</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>


          {/* ========================================================= */}
          {/* CARD 2: INTERVIEW FOCUS AREAS */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 shadow-sm space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white flex items-center gap-2">
                  <Target size={16} className="text-gray-500 dark:text-gray-400" />
                  Interview Focus Areas
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Key competencies and targeted probing guidelines for this evaluation.
                </p>
              </div>
            </div>

            {/* 1. SKILLS TO ASSESS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#212b36] dark:text-gray-100 uppercase tracking-wider">
                  Skills to Assess
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">8 target skills</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  'Java / JVM',
                  'Spring Boot',
                  'Kafka',
                  'Event Sourcing',
                  'PostgreSQL Partitioning',
                  'Redis Distributed Locks',
                  'Concurrency & Thread Safety',
                  'Idempotent API Design'
                ].map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. AREAS TO COVER */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-[#212b36] dark:text-gray-100 uppercase tracking-wider">
                Areas to Cover
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    num: '01',
                    title: 'Distributed Ledger & Event Sourcing',
                    desc: 'Event schema versioning, consumer partition rebalancing, and exactly-once processing guarantees.'
                  },
                  {
                    num: '02',
                    title: 'Concurrency & Lock Contention',
                    desc: 'Thread safety in JVM, Redis distributed locks with TTL, and handling hot account balances.'
                  },
                  {
                    num: '03',
                    title: 'Architectural Tradeoffs & Ownership',
                    desc: 'Real-world system design tradeoffs, production outage remediation, and scaling decisions.'
                  }
                ].map((area) => (
                  <div
                    key={area.num}
                    className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-700/60 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {area.num}
                      </span>
                      <h3 className="text-xs font-bold text-[#212b36] dark:text-white leading-snug">
                        {area.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      {area.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. SUGGESTED PROBING QUESTIONS */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#212b36] dark:text-gray-100 uppercase tracking-wider">
                  Suggested Probing Questions
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Click icon to copy</span>
              </div>
              <div className="space-y-2">
                {[
                  {
                    id: 'q-1',
                    category: 'Replication Lag',
                    question: 'In your Quillpay ledger migration, what specific steps did you take when read-replicas were 200ms behind during high traffic spikes?'
                  },
                  {
                    id: 'q-2',
                    category: 'Kafka Fault Tolerance',
                    question: 'If a consumer crashes mid-transaction after reading from Kafka but before committing to Postgres, how do you prevent duplicated ledger records upon recovery?'
                  },
                  {
                    id: 'q-3',
                    category: 'Architectural Ownership',
                    question: 'Which design decision in the payout platform was solely yours, and what tradeoff did you make that you would do differently today?'
                  }
                ].map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-700/60 flex items-start justify-between gap-3 group hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#212b36] dark:text-gray-200 font-medium italic leading-relaxed">
                        "{item.question}"
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(item.question, item.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-[#1890FF] transition-colors cursor-pointer shrink-0 mt-0.5"
                      title="Copy question"
                    >
                      {copiedQuestionId === item.id ? (
                        <Check size={14} className="text-[#00A76F]" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* ========================================================= */}
          {/* CARD 3: NOTES & COMMENTS FROM PREVIOUS INTERVIEWERS */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-[#212b36] dark:text-white flex items-center gap-2">
                    <MessageSquare size={16} className="text-gray-500 dark:text-gray-400" />
                    Previous Round Feedback
                  </h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-[#00A76F]">
                    2 Prior Rounds Completed
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Synthesized feedback and specific follow-up flags passed over to your session.
                </p>
              </div>
            </div>

            {/* Previous Rounds Timeline Cards */}
            <div className="space-y-3.5">
              {PREVIOUS_ROUNDS_FEEDBACK.map((round) => (
                <div
                  key={round.id}
                  className="rounded-xl border border-gray-200/70 dark:border-gray-700/80 bg-gray-50/50 dark:bg-[#1a222d] p-4 space-y-3"
                >
                  {/* Round Header & Interviewer Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-gray-200/60 dark:border-gray-700/60">
                    <div>
                      <h3 className="text-sm font-bold text-[#212b36] dark:text-white">
                        {round.roundName}
                      </h3>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        Conducted on {round.date} • {round.duration}
                      </div>
                    </div>

                    {/* Interviewers pill chips */}
                    <div className="flex flex-wrap items-center gap-2">
                      {round.interviewers.map((evaluator) => (
                        <div
                          key={evaluator.name}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#121820] border border-gray-200 dark:border-gray-700 shadow-2xs"
                        >
                          <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold flex items-center justify-center">
                            {evaluator.avatar}
                          </div>
                          <span className="text-xs font-bold text-[#212b36] dark:text-gray-200">
                            {evaluator.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">({evaluator.role})</span>
                          {evaluator.recommendation && (
                            <>
                              <span className="text-gray-300 dark:text-gray-700">•</span>
                              <span className="text-[10px] font-bold flex items-center gap-0.5">
                                <span>{evaluator.recommendation === 'Strong Hire' ? '🌟' : '👍'}</span>
                                <span className={evaluator.recommendation === 'Strong Hire' ? 'text-[#00A76F]' : 'text-[#1890FF]'}>
                                  {evaluator.recommendation}
                                </span>
                              </span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                    <strong className="text-[#212b36] dark:text-white font-semibold">Takeaway: </strong>
                    {round.summary}
                  </div>

                  {/* Strengths & Actionable probe items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Strengths */}
                    <div className="p-3 rounded-lg bg-white dark:bg-[#141b24] border border-gray-200/80 dark:border-gray-800 space-y-1.5">
                      <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 size={13} />
                        <span>Key Strengths Observed</span>
                      </div>
                      <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300 list-disc list-inside">
                        {round.strengths.map((st, i) => (
                          <li key={i} className="leading-snug">{st}</li>
                        ))}
                      </ul>
                    </div>

                    {/* What to probe next */}
                    <div className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-1.5">
                      <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <AlertCircle size={13} />
                        <span>Flags Handed Over For Round 2</span>
                      </div>
                      <ul className="space-y-1 text-xs text-amber-900 dark:text-amber-300/90 list-disc list-inside">
                        {round.areasToProbe.map((ap, i) => (
                          <li key={i} className="leading-snug">{ap}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'Job Description' ? (
        /* ========================================================= */
        /* TAB 2: JOB DESCRIPTION CONTENT */
        /* ========================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          
          {/* LEFT CARD: JOB DESCRIPTION */}
          <div className="lg:col-span-7 bg-white dark:bg-[#161c24] p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                <FileText size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Job Description</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Core responsibilities, qualifications, and role overview.</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              {/* Role Header Info Grid */}
              <div className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider block">Role Title</span>
                  <span className="text-xs font-bold text-[#212b36] dark:text-white mt-0.5 block">{JOB_DESCRIPTION_DATA.title}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider block">Department</span>
                  <span className="text-xs font-semibold text-[#212b36] dark:text-gray-200 mt-0.5 block">{JOB_DESCRIPTION_DATA.department}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider block">Experience</span>
                  <span className="text-xs font-semibold text-[#212b36] dark:text-gray-200 mt-0.5 block">{JOB_DESCRIPTION_DATA.experience}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider block">Workplace</span>
                  <span className="text-xs font-semibold text-[#212b36] dark:text-gray-200 mt-0.5 block">{JOB_DESCRIPTION_DATA.location}</span>
                </div>
              </div>

              {/* About the Role */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-[#212b36] dark:text-white uppercase tracking-wider">About the Role</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{JOB_DESCRIPTION_DATA.aboutRole}</p>
              </div>

              {/* Key Responsibilities */}
              <div className="space-y-1.5 pt-1">
                <h3 className="text-xs font-bold text-[#212b36] dark:text-white uppercase tracking-wider">Key Responsibilities</h3>
                <ul className="space-y-1.5 text-gray-600 dark:text-gray-300 list-disc list-inside">
                  {JOB_DESCRIPTION_DATA.responsibilities.map((resp, i) => (
                    <li key={i} className="leading-relaxed">{resp}</li>
                  ))}
                </ul>
              </div>

              {/* Qualifications */}
              <div className="space-y-1.5 pt-1">
                <h3 className="text-xs font-bold text-[#212b36] dark:text-white uppercase tracking-wider">Qualifications & Prerequisites</h3>
                <ul className="space-y-1.5 text-gray-600 dark:text-gray-300 list-disc list-inside">
                  {JOB_DESCRIPTION_DATA.qualifications.map((qual, i) => (
                    <li key={i} className="leading-relaxed">{qual}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: REQUIRED SKILLS */}
          <div className="lg:col-span-5 bg-white dark:bg-[#161c24] p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                  <Code2 size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Required Skills</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Key competencies & minimum experience.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">


              <div className="flex flex-wrap gap-2.5 pt-1">
                {JOB_DESCRIPTION_DATA.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800"
                  >
                    <span className="text-[13px] font-semibold text-[#212b36] dark:text-white">{skill.name}</span>
                    <span className="text-[12px] text-gray-400 font-medium">• {skill.years} yrs</span>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${skill.required ? 'bg-[#00A76F]/10 text-[#00A76F]' : 'bg-[#1890FF]/10 text-[#1890FF]'}`}>
                      {skill.required ? 'Must Have' : 'Nice to Have'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'Resume' ? (
        /* ========================================================= */
        /* TAB 3: RESUME TAB CONTENT */
        /* ========================================================= */
        <div className="flex flex-col xl:flex-row gap-5 items-stretch animate-fade-in">
          
          {/* FIRST CARD: LEFT CARD - APPLICANT DETAILS (w-[380px] shrink-0) */}
          <div className="w-full xl:w-[380px] shrink-0 bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 flex flex-col gap-4 shadow-sm">
            <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Applicant Details</h2>
            </div>

            {/* Candidate Info */}
            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50 p-3">
              <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700/50">Candidate Info</h3>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Name</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right break-words">{CANDIDATE_APPLICATION_DETAILS.name}</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Email</p>
                  <p className="text-[13px] font-semibold text-[#1890FF] text-right break-all">{CANDIDATE_APPLICATION_DETAILS.email}</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Phone</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.phone}</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Location</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.location}</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Time Zone</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.timeZone}</p>
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50 p-3">
              <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700/50">Professional Summary</h3>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Total Exp.</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.totalExp}</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Relevant Exp.</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.relevantExp}</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Current Company</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.currentCompany}</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Current Title</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.currentTitle}</p>
                </div>
              </div>
            </div>

            {/* Skills & Expertise */}
            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50 p-3">
              <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700/50">Skills & Expertise</h3>
              <div className="flex justify-between items-start gap-4">
                <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Primary Skills</p>
                <div className="flex flex-wrap gap-1.5 justify-end max-w-[200px]">
                  {CANDIDATE_APPLICATION_DETAILS.primarySkills.map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 text-[#212b36] dark:text-gray-300 rounded text-[11px] font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability & Logistics */}
            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50 p-3">
              <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700/50">Availability & Logistics</h3>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Notice Period</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.noticePeriod}</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Available From</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.availableFrom}</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Work Mode</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.workMode}</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Current CTC</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.currentCTC}</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Expected CTC</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.expectedCTC}</p>
                </div>
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50 p-3">
              <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700/50">Experience</h3>
              <div className="flex justify-between items-start gap-4">
                <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Timeline</p>
                <div className="flex flex-col gap-3 w-full max-w-[200px]">
                  {CANDIDATE_APPLICATION_DETAILS.experienceTimeline.map((exp, i) => (
                    <div key={i} className="flex flex-col relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 text-left">
                      <span className={`absolute -left-[5px] top-[5px] w-2 h-2 rounded-full ${exp.isCurrent ? 'bg-[#1890FF]' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                      <p className="text-[12px] font-semibold text-[#212b36] dark:text-gray-300 leading-tight mb-0.5">{exp.title}</p>
                      <p className="text-[11px] text-gray-500">{exp.company} • {exp.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50 p-3">
              <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700/50">Education</h3>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Degree</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.education.degree}</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Institution</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.education.institution}</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[12px] text-gray-700 dark:text-gray-400 font-medium shrink-0 mt-0.5">Certification</p>
                  <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-300 text-right">{CANDIDATE_APPLICATION_DETAILS.education.certification}</p>
                </div>
              </div>
            </div>

            {/* Profiles */}
            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50 p-3">
              <h3 className="text-sm font-bold text-[#212b36] dark:text-white mb-2 pb-2 border-b border-gray-200 dark:border-gray-700/50">Profiles</h3>
              <div className="flex flex-col gap-2">
                <a href={`https://${CANDIDATE_APPLICATION_DETAILS.profiles.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13px] leading-relaxed font-semibold text-[#1890FF] hover:underline">
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  <span className="truncate">{CANDIDATE_APPLICATION_DETAILS.profiles.linkedin}</span>
                </a>
                <a href={`https://${CANDIDATE_APPLICATION_DETAILS.profiles.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13px] leading-relaxed font-semibold text-[#1890FF] hover:underline">
                  <svg className="w-3.5 h-3.5 fill-current text-black dark:text-white shrink-0" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  <span className="truncate">{CANDIDATE_APPLICATION_DETAILS.profiles.github}</span>
                </a>
                <a href={`https://${CANDIDATE_APPLICATION_DETAILS.profiles.portfolio}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13px] leading-relaxed font-semibold text-[#1890FF] hover:underline">
                  <svg className="w-3.5 h-3.5 fill-current text-gray-500 dark:text-gray-400 shrink-0" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.849 19h-1.604l-2.094-5.783v5.783h-1.536v-8.898h2.091l1.83 5.093 1.831-5.093h2.091v8.898h-1.535v-5.783l-2.074 5.783zm7.849-5.116h-4v1.547h4v1.464h-4v2.105h-1.535v-8.898h5.535v1.464h-4v2.318h4v-8.898h1.535v8.898h-1.535z"/></svg>
                  <span className="truncate">{CANDIDATE_APPLICATION_DETAILS.profiles.portfolio}</span>
                </a>
              </div>
            </div>
          </div>

          {/* SECOND CARD: RIGHT CARD - RESUME VIEWER */}
          <div className="flex-1 min-w-[400px] border border-gray-200/80 dark:border-gray-800/60 rounded-2xl bg-white dark:bg-[#161c24] shadow-sm flex flex-col self-stretch relative overflow-hidden">
            <div className="h-[52px] px-4 border-b border-gray-100 dark:border-gray-800/50 bg-white dark:bg-[#161c24] flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-[#212b36] dark:text-white">Resume Viewer</h3>
            </div>

            <div className="h-full flex flex-col min-h-0 flex-1 animate-fade-in">
              <div className="shrink-0 bg-white dark:bg-[#161c24] px-4 py-2.5 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={16} className="text-[#1890FF] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#212b36] dark:text-white truncate">
                      Neha_Sharma_Resume.pdf
                    </p>
                    <p className="text-[13px] leading-relaxed text-gray-400">PDF resume</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={SAMPLE_RESUME_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-gray-400 hover:text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg transition-colors cursor-pointer"
                    title="Open in new tab"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <a
                    href={SAMPLE_RESUME_URL}
                    download="Neha_Sharma_Resume.pdf"
                    className="p-2 text-gray-400 hover:text-[#1890FF] hover:bg-[#1890FF]/10 rounded-lg transition-colors cursor-pointer"
                    title="Download resume"
                  >
                    <Download size={16} />
                  </a>
                </div>
              </div>
              <div className="flex-1 w-full h-full bg-[#525659]">
                <iframe
                  title="Neha Sharma resume"
                  src={`${SAMPLE_RESUME_URL}#toolbar=1&navpanes=0`}
                  className="w-full h-full border-0 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'Feed Scorecard' || activeTab === 'Feed Content' ? (
        <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/80 p-8 text-center space-y-4 shadow-sm animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] flex items-center justify-center mx-auto">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#212b36] dark:text-white">
              Feed Scorecard
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
              Evaluation feedback and scorecard submission is accessible in an interactive modal popup so you can complete evaluations from any section of the application.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsFeedModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1890FF] hover:bg-[#0077e6] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <FileText size={14} />
            <span>Open Feed Scorecard Modal</span>
          </button>
        </div>
      ) : activeTab === 'Scorecard' ? (
        /* ========================================================= */
        /* TAB 5: SCORECARD (REPLICATED FROM CANDIDATE PROFILE)      */
        /* ========================================================= */
        <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 sm:p-6 shadow-sm space-y-6 animate-fade-in">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1890FF] shrink-0">
                <FileText size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#212b36] dark:text-white">
                  Scorecard & Evaluations
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Multi-stage candidate evaluations, interviewer recommendations, and competency ratings.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFeedModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1890FF] hover:bg-[#1890FF]/90 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <FileText size={13} />
              <span>Feed Scorecard</span>
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50/70 dark:bg-gray-800/40 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-2 hover:border-[#1890FF]/40 transition-colors min-h-[120px] h-full">
              <div className="flex justify-between items-start">
                <h3 className="text-[11px] font-bold text-[#212b36] dark:text-white flex items-center gap-2 uppercase">
                  <Bot size={14} className="text-[#00A76F]" /> AI Screening
                </h3>
                <span className="bg-[#00A76F]/10 text-[#00A76F] px-2 py-0.5 rounded text-[11px] font-bold">9.8/10</span>
              </div>
              <p className="text-[13px] leading-relaxed text-gray-500 mt-1">
                Excellent alignment on technical stack. Profile demonstrates high agency.
              </p>
            </div>
            
            <div className="bg-gray-50/70 dark:bg-gray-800/40 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-2 hover:border-[#1890FF]/40 transition-colors min-h-[120px] h-full">
              <div className="flex justify-between items-start">
                <h3 className="text-[11px] font-bold text-[#212b36] dark:text-white flex items-center gap-2 uppercase">
                  <Cpu size={14} className="text-[#00A76F]" /> AI Interview
                </h3>
                <span className="bg-[#00A76F]/10 text-[#00A76F] px-2 py-0.5 rounded text-[11px] font-bold">8.5/10</span>
              </div>
              <p className="text-[13px] leading-relaxed text-gray-500 mt-1">
                Clear communication. Handled ambiguity well but hesitated on some behavioral prompts.
              </p>
            </div>

            <div className="bg-gray-50/70 dark:bg-gray-800/40 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700/80 flex flex-col items-center justify-center text-center gap-1.5 hover:bg-gray-100/70 dark:hover:bg-gray-800/60 transition-colors group min-h-[120px] h-full">
              <h3 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 uppercase">
                <User size={14} /> Human Interviews
              </h3>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-200/50 dark:bg-gray-700/50 px-2.5 py-0.5 rounded-full mb-1">
                Yet to be done
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                <button 
                  onClick={() => setSaveToast('Opening scheduler...')} 
                  className="text-[11px] font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 shadow-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Calendar size={12} /> Schedule Now
                </button>
                <button 
                  onClick={() => setIsFeedModalOpen(true)} 
                  className="text-[11px] font-bold text-[#1890FF] bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 shadow-2xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <FileText size={12} /> Feed Scorecard
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Sub-tabs header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-0 mt-6 mb-5">
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => setScorecardSubTab('Detailed Scorecards')}
                  className={`pb-3 text-[13px] font-bold relative cursor-pointer transition-colors flex items-center gap-2 ${
                    scorecardSubTab === 'Detailed Scorecards'
                      ? 'text-[#1890FF]'
                      : 'text-gray-500 hover:text-[#212b36] dark:hover:text-white'
                  }`}
                >
                  <FileText size={16} className={scorecardSubTab === 'Detailed Scorecards' ? 'text-[#1890FF]' : 'text-gray-400'} />
                  <span>Detailed Scorecards</span>
                  {scorecardSubTab === 'Detailed Scorecards' && (
                    <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#1890FF] rounded-full" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setScorecardSubTab('Consolidated Scorecard Analysis')}
                  className={`pb-3 text-[13px] font-bold relative cursor-pointer transition-colors flex items-center gap-2 ${
                    scorecardSubTab === 'Consolidated Scorecard Analysis'
                      ? 'text-[#1890FF]'
                      : 'text-gray-500 hover:text-[#212b36] dark:hover:text-white'
                  }`}
                >
                  <Sparkles size={16} className={scorecardSubTab === 'Consolidated Scorecard Analysis' ? 'text-[#1890FF]' : 'text-gray-400'} />
                  <span>Consolidated Scorecard Analysis</span>
                  {scorecardSubTab === 'Consolidated Scorecard Analysis' && (
                    <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#1890FF] rounded-full" />
                  )}
                </button>
              </div>

              {scorecardSubTab === 'Detailed Scorecards' && (
                <button 
                  onClick={() => setOpenScorecards(openScorecards.length > 0 ? [] : MOCK_SCORECARDS.map(s => s.id))}
                  className="text-[12px] font-bold text-[#1890FF] hover:bg-[#1890FF]/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-[#1890FF]/20 bg-[#1890FF]/5 shrink-0 self-start sm:self-auto mb-2"
                >
                  {openScorecards.length > 0 ? 'Collapse All' : 'Expand All'}
                </button>
              )}
            </div>

            {scorecardSubTab === 'Detailed Scorecards' ? (
              <div className="space-y-4">
                {MOCK_SCORECARDS.map(scorecard => {
                  const isOpen = openScorecards.includes(scorecard.id);
                  return (
                    <div 
                      id={`scorecard-card-${scorecard.id}`}
                      key={scorecard.id} 
                      className="bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 shadow-2xs overflow-hidden transition-colors hover:border-[#1890FF]/30"
                    >
                      <button 
                        onClick={() => setOpenScorecards(prev => isOpen ? prev.filter(id => id !== scorecard.id) : [...prev, scorecard.id])}
                        className={`w-full flex items-center justify-between p-5 cursor-pointer transition-colors ${isOpen ? 'bg-gray-50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800/50' : 'hover:bg-gray-50 dark:hover:bg-gray-800/20'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[12px] font-bold text-[#212b36] dark:text-white">
                            {getInitials(scorecard.interviewer)}
                          </div>
                          <div className="text-left">
                            <h4 className="text-[13px] font-bold text-[#212b36] dark:text-white">{scorecard.interviewer}</h4>
                            <p className="text-[13px] leading-relaxed text-gray-500 mt-0.5">{scorecard.stage} • {scorecard.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                           {(() => {
                             const recStyle = getRecBadge(scorecard.recommendation);
                             return (
                               <div className="text-right hidden sm:block">
                                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Recommendation</div>
                                 <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold border ${recStyle.bg} ${recStyle.text} ${recStyle.border}`}>
                                   <span>{recStyle.emoji}</span>
                                   <span>{recStyle.label}</span>
                                 </div>
                               </div>
                             );
                           })()}
                           <ChevronDown size={18} className={`text-[#1890FF] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                        <div className="overflow-hidden">
                          <div className="p-6 space-y-8">
                            
                            {/* Top Row: Key Takeaways (80%) & Core Metrics (20%) */}
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
                              <div className="lg:col-span-4 flex flex-col">
                                <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Key Takeaways</h5>
                                <div className="bg-gradient-to-br from-[#1890FF]/10 to-transparent border border-[#1890FF]/20 rounded-xl p-4 relative overflow-hidden flex-1 flex items-center">
                                  <div className="absolute top-0 right-0 p-3 opacity-10"><FileText size={40} className="text-[#1890FF]" /></div>
                                  <p className="text-[13px] text-[#212b36] dark:text-gray-200 font-semibold leading-relaxed relative z-10 italic">
                                    "{scorecard.takeaways}"
                                  </p>
                                </div>
                              </div>
                              <div className="lg:col-span-1 flex flex-col justify-between">
                                <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Core Metrics</h5>
                                <div className="grid gap-2 flex-1">
                                  {[
                                    { label: 'Hard Skills', value: scorecard.hardSkills },
                                    { label: 'Soft Skills', value: scorecard.softSkills },
                                    { label: 'Culture Fit', value: scorecard.cultureFit || 8.0 }
                                  ].map(metric => {
                                    const isHigh = metric.value >= 8.0;
                                    const isMed = metric.value >= 5.0 && metric.value < 8.0;
                                    const colorText = isHigh ? 'text-[#00A76F]' : isMed ? 'text-[#FFC107]' : 'text-[#FF5630]';
                                    return (
                                      <div key={metric.label} className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 transition-colors hover:border-gray-200 dark:hover:border-gray-700">
                                        <span className="text-[12px] font-bold text-[#212b36] dark:text-gray-300">{metric.label}</span>
                                        <span className={`text-[14px] font-black ${colorText}`}>{Number(metric.value).toFixed(1)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Interviewer Notes (Full Width 100%) */}
                            <div className="w-full bg-gray-50/70 dark:bg-gray-800/30 rounded-xl p-4 border border-gray-100 dark:border-gray-800/60">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText size={14} className="text-[#1890FF]" />
                                <h5 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Interviewer Notes</h5>
                              </div>
                              <p className="text-[13px] text-[#454f5b] dark:text-gray-300 leading-relaxed w-full">
                                {expandedNotes[scorecard.id] || scorecard.notes.length <= 250 
                                  ? scorecard.notes 
                                  : `${scorecard.notes.slice(0, 250).trim()}...`}
                                {scorecard.notes.length > 250 && (
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setExpandedNotes(prev => ({...prev, [scorecard.id]: !prev[scorecard.id]})) }}
                                    className="ml-2 font-bold text-[#1890FF] hover:underline cursor-pointer focus:outline-none inline-flex"
                                  >
                                    {expandedNotes[scorecard.id] ? 'Read Less' : 'Read More'}
                                  </button>
                                )}
                              </p>
                            </div>

                            {/* Detailed Attributes (Categorized) */}
                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-8">
                              <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Detailed Attributes Evaluated</h5>
                              <div className="space-y-4">
                                {(scorecard.categories || []).map(cat => (
                                  <div key={cat.name} className="bg-gray-50/50 dark:bg-gray-800/20 rounded-xl p-3.5 border border-gray-100/80 dark:border-gray-800">
                                    <h6 className="text-[11px] font-bold uppercase tracking-wider text-[#1890FF] mb-2.5 flex items-center justify-between">
                                      <span>{cat.name}</span>
                                      <span className="text-[10px] text-gray-400 font-normal">({cat.attributes.length} attributes)</span>
                                    </h6>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                      {cat.attributes.map((attr, idx) => {
                                        return (
                                          <div 
                                            key={idx} 
                                            className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300"
                                          >
                                            <span className="text-[12px] font-medium text-[#454f5b] dark:text-gray-300 pr-2 truncate" title={attr.name}>{attr.name}</span>
                                            <div className="shrink-0 flex items-center justify-center">
                                              {renderRatingCircle(attr.rating, "w-3.5 h-3.5")}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Rating Scale Legend */}
                              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50/40 dark:bg-gray-800/20 p-2.5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700/60">
                                <span className="font-bold text-gray-400 uppercase tracking-wider">Legend:</span>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500 shrink-0" />
                                    <span>Unassessed</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5630] shrink-0" />
                                    <span>Strong No</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFAB00] shrink-0" />
                                    <span>No</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#1890FF] shrink-0" />
                                    <span>Yes</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#00A76F] shrink-0" />
                                    <span>Strong Yes</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {/* AI Summary */}
                <div className="rounded-2xl border border-[#1890FF]/25 bg-gradient-to-br from-[#1890FF]/5 via-purple-500/5 to-transparent p-5 sm:p-6 shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1890FF]/15 text-[#1890FF] flex items-center justify-center shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#212b36] dark:text-white">AI Summary</h3>
                        <span className="text-[10px] font-bold text-[#1890FF] bg-[#1890FF]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Synthesis</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed text-[#454f5b] dark:text-gray-300">
                    The evaluation panel demonstrates strong consensus on core technical capabilities, distributed systems fundamentals, and hands-on execution across all technical interview rounds. However, notable discrepancies emerged between engineering and executive reviewers regarding strategic product tradeoffs, high-stakes communication, and leadership presence under ambiguity.
                  </p>
                </div>

                {/* Consensus & Discrepancies Sections */}
                <div className="space-y-8">
                  {/* Consensus Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#00A76F]/10 text-[#00A76F] flex items-center justify-center">
                          <CheckCircle size={15} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#212b36] dark:text-white">Consensus</h3>
                          <p className="text-[11px] text-gray-500">Attributes with aligned evaluations across interviewers</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#00A76F] bg-[#00A76F]/10 px-2.5 py-0.5 rounded-full">
                        0 Attributes
                      </span>
                    </div>

                    <div className="w-full py-8 px-4 flex flex-col items-center justify-center text-center rounded-xl bg-gray-50/50 dark:bg-gray-800/20 border border-dashed border-gray-200 dark:border-gray-800">
                      <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-200">No consensus attributes identified yet</p>
                      <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                        Consensus insights will appear once multiple interviewers evaluate and align on the same competency attributes.
                      </p>
                    </div>
                  </div>

                  {/* Discrepancies Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#FF5630]/10 text-[#FF5630] flex items-center justify-center">
                          <ArrowRightLeft size={15} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#212b36] dark:text-white">Discrepancies</h3>
                          <p className="text-[11px] text-gray-500">Attributes with divergent ratings or conflicting viewpoints</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#FF5630] bg-[#FF5630]/10 px-2.5 py-0.5 rounded-full">
                        0 Attributes
                      </span>
                    </div>

                    <div className="w-full py-8 px-4 flex flex-col items-center justify-center text-center rounded-xl bg-gray-50/50 dark:bg-gray-800/20 border border-dashed border-gray-200 dark:border-gray-800">
                      <p className="text-[13px] font-semibold text-[#212b36] dark:text-gray-200">No rating discrepancies found</p>
                      <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                        Attributes with divergent evaluations or conflicting viewpoints across interview stages will be highlighted here.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scorecard Ratings Section */}
                <div className="bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-5 sm:p-6 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center shrink-0">
                        <Star size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#212b36] dark:text-white">Scorecard Ratings</h3>
                        <p className="text-[11px] text-gray-500">Key competency attributes rated across interviewers</p>
                      </div>
                    </div>
                    
                    {/* Rating Color Code Legend */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00A76F]" />
                        <span className="font-medium text-[#212b36] dark:text-gray-300">Strong Yes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1890FF]" />
                        <span className="font-medium text-[#212b36] dark:text-gray-300">Yes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFAB00]" />
                        <span className="font-medium text-[#212b36] dark:text-gray-300">No</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5630]" />
                        <span className="font-medium text-[#212b36] dark:text-gray-300">Strong No</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {SCORECARD_SUMMARY_ATTRIBUTES.map((attr, idx) => {
                      return (
                        <div 
                          key={idx} 
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-gray-50/60 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                {attr.category}
                              </span>
                            </div>
                            <h4 className="text-[13px] font-semibold text-[#212b36] dark:text-white truncate">
                              {attr.name}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            {MOCK_SCORECARDS.map(sc => {
                              const rating = sc.categories
                                ?.flatMap(c => c.attributes)
                                ?.find(a => a.name === attr.name)?.rating || 'Unassessed';
                              const style = getRatingAvatarStyle(rating);
                              const initials = getInitials(sc.interviewer);

                              return (
                                <button 
                                  key={sc.id} 
                                  type="button"
                                  onClick={() => openInspectorDrawer(sc.interviewer, attr.name)}
                                  className="group relative cursor-pointer"
                                >
                                  <div 
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shadow-xs transition-transform group-hover:scale-110 ${style.bg} ${style.text} ${style.border}`}
                                  >
                                    {initials}
                                  </div>
                                  
                                  {/* Hover tooltip */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                                    <div className="bg-[#212b36] dark:bg-gray-900 text-white text-[11px] py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap border border-gray-700/50">
                                      <div className="font-bold">{sc.interviewer}</div>
                                      <div className="text-[10px] text-gray-300 mt-0.5">
                                        {sc.stage} • <span className={`font-semibold ${rating.toLowerCase() === 'strong yes' ? 'text-[#00A76F]' : rating.toLowerCase() === 'yes' ? 'text-[#1890FF]' : rating.toLowerCase() === 'no' ? 'text-[#FFAB00]' : rating.toLowerCase() === 'strong no' ? 'text-[#FF5630]' : 'text-gray-400'}`}>{rating}</span>
                                      </div>
                                      <div className="text-[9px] text-[#1890FF] font-medium mt-0.5">Click to inspect scorecard details →</div>
                                    </div>
                                    <div className="w-2 h-2 bg-[#212b36] dark:bg-gray-900 rotate-45 -mt-1" />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* OTHER TABS PLACEHOLDER */
        <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-12 text-center flex flex-col items-center justify-center min-h-[350px] shadow-sm animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 flex items-center justify-center mb-3">
            <FolderOpen size={28} />
          </div>
          <h3 className="text-base font-bold text-[#212b36] dark:text-white mb-1">
            No Data
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm">
            Content for <strong className="text-gray-600 dark:text-gray-300 font-semibold">{activeTab}</strong> tab will be configured here.
          </p>
        </div>
      )}

      {/* Slide-Over Detail Inspector Drawer (Right Panel) */}
      {inspectorData && (
        <div className="fixed inset-0 z-[150] overflow-hidden">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in cursor-pointer"
            onClick={closeInspectorDrawer}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md md:max-w-lg bg-white dark:bg-[#161c24] shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-800 animate-slide-in-right overflow-hidden">
              
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/40 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-sm font-bold text-[#212b36] dark:text-white shadow-xs shrink-0">
                    {getInitials(inspectorData.scorecard.interviewer)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-[#212b36] dark:text-white">
                        {inspectorData.scorecard.interviewer}
                      </h3>
                      {(() => {
                        const recStyle = getRecBadge(inspectorData.scorecard.recommendation);
                        return (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${recStyle.bg} ${recStyle.text} ${recStyle.border}`}>
                            <span>{recStyle.emoji}</span>
                            <span>{recStyle.label}</span>
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-[12px] text-gray-500 mt-0.5">
                      {inspectorData.scorecard.stage} • {inspectorData.scorecard.date}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeInspectorDrawer}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#212b36] dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-gray-700/60 transition-colors cursor-pointer shrink-0"
                  aria-label="Close panel"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                
                {/* Pinned Focused Attribute Card */}
                {(() => {
                  const focusedAttr = inspectorData.scorecard.categories
                    ?.flatMap(c => c.attributes.map(a => ({ ...a, category: c.name })))
                    ?.find(a => a.name === inspectorData.focusedAttributeName);
                  
                  const ratingStyle = getRatingAvatarStyle(focusedAttr?.rating || 'Unassessed');

                  return (
                    <div className="rounded-2xl p-4 bg-gradient-to-br from-[#1890FF]/10 via-[#1890FF]/5 to-transparent border-2 border-[#1890FF]/30 shadow-xs relative overflow-hidden">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1890FF] bg-[#1890FF]/10 px-2 py-0.5 rounded">
                          {focusedAttr?.category || 'Competency Attribute'}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Sparkles size={12} className="text-[#1890FF]" /> Target Attribute
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 mt-1">
                        <h4 className="text-sm sm:text-base font-bold text-[#212b36] dark:text-white">
                          {inspectorData.focusedAttributeName}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`w-3.5 h-3.5 rounded-full ${ratingStyle.bg} shadow-xs`} />
                          <span className={`text-[13px] font-bold ${focusedAttr?.rating?.toLowerCase() === 'strong yes' ? 'text-[#00A76F]' : focusedAttr?.rating?.toLowerCase() === 'yes' ? 'text-[#1890FF]' : focusedAttr?.rating?.toLowerCase() === 'no' ? 'text-[#FFAB00]' : focusedAttr?.rating?.toLowerCase() === 'strong no' ? 'text-[#FF5630]' : 'text-gray-400'}`}>
                            {focusedAttr?.rating || 'Unassessed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Quick Key Takeaway Quote */}
                <div>
                  <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Key Takeaways
                  </h5>
                  <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-3.5 border border-gray-100 dark:border-gray-800">
                    <p className="text-[13px] text-[#212b36] dark:text-gray-200 italic font-medium leading-relaxed">
                      "{inspectorData.scorecard.takeaways}"
                    </p>
                  </div>
                </div>

                {/* Core Metrics Grid */}
                <div>
                  <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Evaluation Metrics
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Hard Skills', value: inspectorData.scorecard.hardSkills },
                      { label: 'Soft Skills', value: inspectorData.scorecard.softSkills },
                      { label: 'Culture Fit', value: inspectorData.scorecard.cultureFit || 8.0 }
                    ].map(metric => {
                      const isHigh = metric.value >= 8.0;
                      const isMed = metric.value >= 5.0 && metric.value < 8.0;
                      const colorText = isHigh ? 'text-[#00A76F]' : isMed ? 'text-[#FFAB00]' : 'text-[#FF5630]';
                      return (
                        <div key={metric.label} className="p-3 text-center rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{metric.label}</div>
                          <div className={`text-base font-black ${colorText}`}>{Number(metric.value).toFixed(1)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interviewer Private Notes */}
                <div>
                  <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText size={13} className="text-[#1890FF]" /> Notes & Observations
                  </h5>
                  <div className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50/70 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    {inspectorData.scorecard.notes}
                  </div>
                </div>

                {/* Categorized Attributes Breakdown */}
                <div>
                  <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Full Rubric for this Round
                  </h5>
                  <div className="space-y-3">
                    {(inspectorData.scorecard.categories || []).map(cat => (
                      <div key={cat.name} className="bg-gray-50/50 dark:bg-gray-800/20 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#1890FF] mb-2">
                          {cat.name}
                        </div>
                        <div className="space-y-1.5">
                          {cat.attributes.map((attr, idx) => {
                            const isFocused = attr.name === inspectorData.focusedAttributeName;
                            return (
                              <div 
                                key={idx} 
                                className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                                  isFocused 
                                    ? 'bg-[#1890FF]/10 border border-[#1890FF]/40 font-semibold shadow-xs' 
                                    : 'hover:bg-white dark:hover:bg-gray-800/60'
                                }`}
                              >
                                <span className={`text-[12px] truncate pr-2 ${isFocused ? 'text-[#1890FF] font-bold' : 'text-[#454f5b] dark:text-gray-300'}`}>
                                  {attr.name}
                                </span>
                                <div className="shrink-0 flex items-center gap-1.5">
                                  {renderRatingCircle(attr.rating, "w-3 h-3")}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-end">
                <button
                  type="button"
                  onClick={closeInspectorDrawer}
                  className="px-4 py-2 text-xs font-bold text-[#212b36] dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer shadow-xs"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
      {/* REUSABLE FEED SCORECARD MODAL */}
      <FeedScorecardModal
        open={isFeedModalOpen}
        onClose={() => setIsFeedModalOpen(false)}
        onSubmit={(data) => {
          setSaveToast('Scorecard submitted successfully');
          setTimeout(() => setSaveToast(null), 3000);
        }}
        candidateName="Neha Kulkarni"
        roundName="Technical Round 2: System Architecture"
        roleName="Senior Backend Engineer"
      />
    </div>
  );
}