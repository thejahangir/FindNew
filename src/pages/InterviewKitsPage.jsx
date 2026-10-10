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
  Edit3
} from 'lucide-react';
import { useChatbot } from '../contexts/ChatbotContext';

const TABS = ['Interview Prep', 'Job Description', 'Resume', 'Scorecard'];

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
    id: 'Unassessed',
    label: 'Unassessed',
    colorClass: 'bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500',
    activeRing: 'ring-2 ring-gray-400 dark:ring-gray-300 ring-offset-1 ring-offset-white dark:ring-offset-[#161c24]'
  },
  {
    id: 'Beginner',
    label: 'Beginner',
    colorClass: 'bg-[#FF5630]',
    activeRing: 'ring-2 ring-[#FF5630] ring-offset-1 ring-offset-white dark:ring-offset-[#161c24]'
  },
  {
    id: 'Competent',
    label: 'Competent',
    colorClass: 'bg-[#FFAB00]',
    activeRing: 'ring-2 ring-[#FFAB00] ring-offset-1 ring-offset-white dark:ring-offset-[#161c24]'
  },
  {
    id: 'Advanced',
    label: 'Advanced',
    colorClass: 'bg-[#00A76F]',
    activeRing: 'ring-2 ring-[#00A76F] ring-offset-1 ring-offset-white dark:ring-offset-[#161c24]'
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
    institution: 'IIT Bombay (2012 - 2016)'
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
    roundName: 'Round 2 (Parallel): Hiring Manager Fit',
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
  const [noteForOthers, setNoteForOthers] = useState(
    `Solid on high-level architecture and ledger design. In Round 3 (Executive / Bar Raiser), recommend probing her experience managing cross-geo stakeholder alignment and scaling engineering teams through rapid growth.`
  );
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);
  const [isNoteSaved, setIsNoteSaved] = useState(true);
  const [selectedRecommendation, setSelectedRecommendation] = useState('Strong Hire');
  const [saveToast, setSaveToast] = useState(null);
  const [attributeRatings, setAttributeRatings] = useState({
    'Self-motivated & Ownership': 'Advanced',
    'Team Player & Empathy': 'Competent',
    'Clear Communication': 'Advanced',
    'Disciplined & Adaptable': 'Competent',
    'Distributed Systems Architecture': 'Advanced',
    'System Design & Concurrency': 'Advanced',
    'API Design & Scalability': 'Advanced',
    'Java & Kafka Ecosystem': 'Advanced',
    'Algorithmic Rigor & Optimization': 'Advanced',
    'Product Strategy & Tradeoffs': 'Competent',
    'Creative Problem Solving': 'Advanced',
    'Analytical Thinking': 'Advanced',
  });

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
      text: 'Prepare interview brief for Neha Kulkarni — Technical Round 2: System Architecture & Concurrency'
    };

    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      type: 'interview-prep',
      candidateName: 'Neha Kulkarni',
      roundName: 'Technical Round 2: System Architecture & Concurrency',
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
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 text-[13px] font-bold transition-colors whitespace-nowrap relative cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'text-[#1890FF] dark:text-[#1890FF]'
                  : 'text-gray-600 hover:text-[#212b36] dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <span>{tab}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1890FF] rounded-t-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREA */}
      {activeTab === 'Interview Prep' ? (
        <div className="space-y-6 animate-fade-in">
          
          {/* ========================================================= */}
          {/* CARD 1: INTERVIEW DETAILS & LIVE COUNTDOWN + ASK TRINITY */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 shadow-sm space-y-4">
            {/* Header with Round Title & Countdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-[#212b36] dark:text-white flex items-center gap-2">
                    <Video size={16} className="text-gray-500 dark:text-gray-400" />
                    Technical Round 2: System Architecture & Concurrency
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
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 shrink-0 self-start sm:self-auto">
                <Clock size={15} className="text-[#1890FF]" />
                <span className="text-[11px] font-bold text-[#1890FF] uppercase tracking-wider">Starts in:</span>
                <span className="text-xs font-bold text-[#1890FF] font-mono">
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
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#212b36] dark:text-gray-100 uppercase tracking-wider">
                  Skills Checklist
                </span>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded-md bg-[#00A76F]/10 text-[#00A76F]">
                    {JOB_DESCRIPTION_DATA.skills.filter(s => s.required).length} Must Have
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#1890FF]/10 text-[#1890FF]">
                    {JOB_DESCRIPTION_DATA.skills.filter(s => !s.required).length} Nice to Have
                  </span>
                </div>
              </div>

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
      ) : activeTab === 'Scorecard' ? (
        /* ========================================================= */
        /* TAB 4: SCORECARD TAB CONTENT (STATE 1: FILL SCORECARD)    */
        /* ========================================================= */
        <div className="space-y-6 animate-fade-in pb-8">
          
          {/* Status Toast / Alert if triggered */}
          {saveToast && (
            <div className="p-3.5 rounded-xl bg-[#00A76F]/10 border border-[#00A76F]/30 text-[#00A76F] flex items-center justify-between animate-fade-in shadow-2xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#00A76F]" />
                <span className="text-xs font-bold">{saveToast}</span>
              </div>
              <button 
                onClick={() => setSaveToast(null)}
                className="text-xs font-bold text-[#00A76F] hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {!scorecardSubmitted ? (
            /* ========================================================= */
            /* STATE 1: ACTIVE SCORING / FILL SCORECARD                  */
            /* ========================================================= */
            <div className="space-y-6 animate-fade-in">
              {/* CARD 1: INTERVIEWER FEEDBACK / COMMENTS & NOTES */}
              <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 shadow-sm space-y-4">
                {/* Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Interviewer Feedback & Observations</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Share qualitative evaluation, candidate strengths, code structure insights, and potential risks.</p>
                    </div>
                  </div>
                </div>

                {/* Rich Text Editor Wrapper */}
                <div className="border border-gray-200 dark:border-gray-700/80 rounded-xl overflow-hidden focus-within:border-[#1890FF] focus-within:ring-1 focus-within:ring-[#1890FF] transition-all bg-white dark:bg-[#161c24]">
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700/70 text-gray-600 dark:text-gray-300">
                    <button
                      type="button"
                      onClick={() => handleFormatText('**', '**')}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-xs font-bold"
                      title="Bold (**text**)"
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText('*', '*')}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-xs font-bold"
                      title="Italic (*text*)"
                    >
                      <Italic size={14} />
                    </button>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
                    <button
                      type="button"
                      onClick={() => handleFormatText('\n• ', '')}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Bulleted List"
                    >
                      <List size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText('\n1. ', '')}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Numbered List"
                    >
                      <ListOrdered size={14} />
                    </button>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
                    <button
                      type="button"
                      onClick={() => handleFormatText('\n> ', '')}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Quote"
                    >
                      <Quote size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText('`', '`')}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Inline Code (`code`)"
                    >
                      <Code size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText('[', '](https://)')}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Link"
                    >
                      <Link2 size={14} />
                    </button>
                  </div>

                  {/* Text Area */}
                  <textarea
                    id="scorecard-rich-textarea"
                    value={scorecardFeedback}
                    onChange={(e) => setScorecardFeedback(e.target.value)}
                    rows={6}
                    placeholder="Enter your detailed interview feedback, observations, performance in coding/system design exercises, and areas of excellence..."
                    className="w-full p-3.5 text-xs text-[#212b36] dark:text-gray-100 bg-transparent border-0 focus:outline-none focus:ring-0 resize-y leading-relaxed font-sans placeholder-gray-400 dark:placeholder-gray-500"
                  />

                  {/* Formatting Hint & Word Counter */}
                  <div className="px-3.5 py-2 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Markdown supported</span>
                    <span>{scorecardFeedback.trim().split(/\s+/).filter(Boolean).length} words · {scorecardFeedback.length} characters</span>
                  </div>
                </div>

                {/* Note for other interviewers (Expandable accordion) */}
                <div className="pt-1">
                  <div className="rounded-xl border border-gray-200/80 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 overflow-hidden transition-all">
                    <button
                      type="button"
                      onClick={() => setIsNoteExpanded(!isNoteExpanded)}
                      className="w-full p-3.5 flex items-center justify-between text-left hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#1890FF] shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#212b36] dark:text-white">Note for other interviewers</span>
                            {noteForOthers.trim().length > 0 && isNoteSaved && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00A76F]/10 text-[#00A76F] border border-[#00A76F]/20 flex items-center gap-1">
                                <Check size={10} />
                                Note Saved
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Private handover guidance and specific focus areas for subsequent interview rounds.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#1890FF] shrink-0 ml-3">
                        <span>{isNoteExpanded ? 'Collapse' : noteForOthers.trim() ? 'Edit Note' : '+ Add Note'}</span>
                        <ChevronDown size={15} className={`transition-transform duration-200 ${isNoteExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Expanded Plain Text Area */}
                    {isNoteExpanded && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3 bg-white dark:bg-[#161c24] animate-fade-in">
                        <textarea
                          value={noteForOthers}
                          onChange={(e) => setNoteForOthers(e.target.value)}
                          rows={3}
                          placeholder="Write private notes for subsequent interviewers (e.g. 'Strong in distributed locks. In Round 3, please probe deeper into Kafka consumer group rebalance storm handling and database failover strategies...')"
                          className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 text-xs text-[#212b36] dark:text-gray-200 focus:outline-none focus:border-[#1890FF] leading-relaxed resize-y"
                        />
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            type="button"
                            onClick={() => setIsNoteExpanded(false)}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsNoteSaved(true);
                              setIsNoteExpanded(false);
                              setSaveToast('Note for subsequent interviewers saved');
                              setTimeout(() => setSaveToast(null), 2500);
                            }}
                            className="px-4 py-1.5 text-xs font-bold bg-[#1890FF] hover:bg-[#0077e6] text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                          >
                            <Save size={13} />
                            <span>Save Note</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Collapsed Note Preview if Saved & Note exists */}
                    {!isNoteExpanded && noteForOthers.trim().length > 0 && isNoteSaved && (
                      <div className="px-4 pb-3.5 pt-1 border-t border-gray-100/60 dark:border-gray-800/40">
                        <p className="text-xs text-[#454f5b] dark:text-gray-300 italic line-clamp-2 bg-white dark:bg-[#161c24] p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                          "{noteForOthers}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CARD 2: COMPETENCY ATTRIBUTES & RATINGS */}
              <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 shadow-sm space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                      <Target size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Skills & Qualities Checklist</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Rate the candidate on personality, technical skills, and problem solving. Click a circle to set the rating.</p>
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    <span className="text-[#00A76F]">
                      {Object.values(attributeRatings).filter(r => r !== 'Unassessed').length} of {SCORECARD_CATEGORIES.reduce((acc, c) => acc + c.attributes.length, 0)} Assessed
                    </span>
                  </div>
                </div>

                {/* Categorized Attributes Grid matching CandidateProfilePage */}
                <div className="space-y-4">
                  {SCORECARD_CATEGORIES.map((cat) => (
                    <div key={cat.name} className="bg-gray-50/50 dark:bg-gray-800/20 rounded-xl p-3.5 border border-gray-100/80 dark:border-gray-800">
                      <h6 className="text-[11px] font-bold uppercase tracking-wider text-[#1890FF] mb-2.5 flex items-center justify-between">
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-gray-400 font-normal">({cat.attributes.length} attributes)</span>
                      </h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {cat.attributes.map((attr) => {
                          const currentRating = attributeRatings[attr.name] || 'Unassessed';
                          return (
                            <div
                              key={attr.name}
                              className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200"
                            >
                              <span className="text-[12px] font-medium text-[#454f5b] dark:text-gray-300 pr-2 truncate" title={attr.name}>
                                {attr.name}
                              </span>

                              {/* Interactive Circle Color Selector */}
                              <div className="shrink-0 flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/60 px-2 py-1 rounded-full border border-gray-100 dark:border-gray-700/50">
                                {RATING_OPTIONS.map((opt) => {
                                  const isSelected = currentRating === opt.id;
                                  return (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => setAttributeRatings(prev => ({ ...prev, [attr.name]: opt.id }))}
                                      title={`${opt.label}: Click to set`}
                                      className={`p-0.5 rounded-full transition-all cursor-pointer ${
                                        isSelected ? `${opt.activeRing} opacity-100 z-10` : 'opacity-30 hover:opacity-75'
                                      }`}
                                    >
                                      <span className={`w-3.5 h-3.5 rounded-full ${opt.colorClass} block shadow-2xs`} />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rating Scale Legend matching Candidate Profile Scorecards */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50/40 dark:bg-gray-800/20 p-2.5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700/60">
                  <span className="font-bold text-gray-400 uppercase tracking-wider">Legend:</span>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5630] shrink-0" />
                      <span>Beginner</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFAB00] shrink-0" />
                      <span>Competent</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00A76F] shrink-0" />
                      <span>Advanced</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: OVERALL RECOMMENDATION */}
              <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 shadow-sm space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                      <Award size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#212b36] dark:text-white">Overall Recommendation</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Select your hiring recommendation verdict for this round.</p>
                    </div>
                  </div>
                </div>

                {/* Recommendation 4-Option Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {SCORECARD_RECOMMENDATIONS.map((rec) => {
                    const isSelected = selectedRecommendation === rec.id;
                    return (
                      <button
                        key={rec.id}
                        type="button"
                        onClick={() => setSelectedRecommendation(rec.id)}
                        className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                          isSelected
                            ? `${rec.activeRing}`
                            : `bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-800 ${rec.hoverBorder}`
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1890FF] text-white flex items-center justify-center shadow-xs">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{rec.emoji}</span>
                            <span className={`text-[13px] font-bold ${rec.badgeText}`}>{rec.label}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {rec.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BOTTOM ACTION BAR */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800/60 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <CheckCircle2 size={15} className="text-[#00A76F]" />
                  <span>Ready for submission · All skills & qualities rated</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSaveToast('Draft saved successfully');
                      setTimeout(() => setSaveToast(null), 2500);
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScorecardSubmitted(true);
                      setSaveToast('Scorecard submitted successfully');
                      setTimeout(() => setSaveToast(null), 3000);
                    }}
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-[#1890FF] hover:bg-[#0077e6] text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    <span>Submit Scorecard</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* STATE 2: POST-SUBMISSION VIEW                             */
            /* ========================================================= */
            <div className="space-y-6 animate-fade-in">
              {/* 1. TOP SUCCESS PANEL */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#00A76F]/10 via-[#00A76F]/5 to-transparent border border-[#00A76F]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#00A76F]/15 text-[#00A76F] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <CheckCircle2 size={22} className="text-[#00A76F]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#212b36] dark:text-white">
                      Scorecard is submitted . You can amend it until the hiring manager closes the loop.
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Submitted on 1 Oct 2026, 16:05 IST · Technical Round 2: System Architecture & Concurrency
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setScorecardSubmitted(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-700 text-[#212b36] dark:text-white hover:border-[#1890FF] hover:text-[#1890FF] shadow-xs text-xs font-bold transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <Edit3 size={14} />
                  <span>Amend Scorecard</span>
                </button>
              </div>

              {/* 2. SUMMARY OF THE SCORECARD (ROUND 2) */}
              <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 sm:p-6 shadow-sm space-y-6 animate-fade-in">
                {/* Header with Interviewer Info & Recommendation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-[#1890FF] font-bold text-sm flex items-center justify-center shrink-0">
                      JA
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#212b36] dark:text-white">Jahangir Alam (You)</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-[#1890FF]">
                          Principal Architect
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Technical Round 2: System Architecture & Concurrency · Submitted 1 Oct 2026 · 60 mins
                      </p>
                    </div>
                  </div>

                  {/* Recommendation Badge */}
                  <div className="flex items-center gap-3">
                    {(() => {
                      const rec = SCORECARD_RECOMMENDATIONS.find(r => r.id === selectedRecommendation) || SCORECARD_RECOMMENDATIONS[0];
                      return (
                        <div className="text-left sm:text-right">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Your Recommendation</div>
                          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${rec.badgeBg} ${rec.badgeText} ${rec.border} shadow-2xs`}>
                            <span>{rec.emoji}</span>
                            <span>{rec.label}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Interviewer Notes / Qualitative Feedback */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-[#1890FF]" />
                    <h4 className="text-xs font-bold text-[#212b36] dark:text-white uppercase tracking-wider">
                      Interviewer Notes & Qualitative Evaluation
                    </h4>
                  </div>
                  <div className="bg-gray-50/70 dark:bg-gray-800/30 rounded-xl p-4 border border-gray-100 dark:border-gray-800/60">
                    <p className="text-xs text-[#454f5b] dark:text-gray-200 leading-relaxed whitespace-pre-line font-sans">
                      {scorecardFeedback}
                    </p>
                  </div>
                </div>

                {/* Note for other interviewers (if provided) */}
                {noteForOthers.trim().length > 0 && (
                  <div className="rounded-xl border border-amber-200/70 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-[#FFAB00]" />
                      <h4 className="text-xs font-bold text-[#212b36] dark:text-white">
                        Handover Note for Subsequent Interviewers (Executive / Round 3)
                      </h4>
                    </div>
                    <p className="text-xs text-[#454f5b] dark:text-gray-300 italic leading-relaxed">
                      "{noteForOthers}"
                    </p>
                  </div>
                )}

                {/* Evaluated Competency Dimensions Categorized */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target size={14} className="text-[#1890FF]" />
                      <h4 className="text-xs font-bold text-[#212b36] dark:text-white uppercase tracking-wider">
                        Skills & Qualities Evaluated
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-[#00A76F]">
                      {Object.values(attributeRatings).filter(r => r !== 'Unassessed').length} of {SCORECARD_CATEGORIES.reduce((acc, c) => acc + c.attributes.length, 0)} Assessed
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {SCORECARD_CATEGORIES.map((cat) => (
                      <div key={cat.name} className="bg-gray-50/50 dark:bg-gray-800/20 rounded-xl p-3.5 border border-gray-100/80 dark:border-gray-800">
                        <h6 className="text-[11px] font-bold uppercase tracking-wider text-[#1890FF] mb-2.5 flex items-center justify-between">
                          <span>{cat.name}</span>
                          <span className="text-[10px] text-gray-400 font-normal">({cat.attributes.length} attributes)</span>
                        </h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {cat.attributes.map((attr) => {
                            const currentRating = attributeRatings[attr.name] || 'Unassessed';
                            const opt = RATING_OPTIONS.find(o => o.id === currentRating) || RATING_OPTIONS[0];
                            return (
                              <div
                                key={attr.name}
                                className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800"
                              >
                                <span className="text-[12px] font-medium text-[#454f5b] dark:text-gray-300 pr-2 truncate" title={attr.name}>
                                  {attr.name}
                                </span>
                                <div className="shrink-0 flex items-center gap-2">
                                  <span className={`w-3.5 h-3.5 rounded-full ${opt.colorClass} block shadow-2xs`} title={opt.label} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50/40 dark:bg-gray-800/20 p-2.5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700/60">
                    <span className="font-bold text-gray-400 uppercase tracking-wider">Legend:</span>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5630] shrink-0" />
                        <span>Beginner</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFAB00] shrink-0" />
                        <span>Competent</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00A76F] shrink-0" />
                        <span>Advanced</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. THE REST OF THE PANEL: SUMMARY & COMMENTS FROM PREVIOUS ROUND INTERVIEWER */}
              <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-5 sm:p-6 shadow-sm space-y-5 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                      <FileText size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#212b36] dark:text-white">
                        Previous Round Feedback
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Notes and evaluations from previous interview rounds.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#00A76F]/10 text-[#00A76F] border border-[#00A76F]/20 self-start sm:self-auto">
                    1 Prior Round Evaluated
                  </span>
                </div>

                {/* Prior Round 1 Card */}
                <div className="rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-gray-50/50 dark:bg-[#1a222d] p-4 sm:p-5 space-y-4">
                  {/* Round Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200/60 dark:border-gray-700/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-[#00A76F] font-bold text-xs flex items-center justify-center shrink-0">
                        VN
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#212b36] dark:text-white">Vikram Nair</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            Staff Engineer
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Round 1: Technical & Coding · 23 Sep 2026 · 45 mins
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#00A76F]/10 text-[#00A76F] border border-[#00A76F]/30">
                        <span>🌟</span>
                        <span>Strong Hire</span>
                      </span>
                    </div>
                  </div>

                  {/* Key Takeaways Quote */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <FileText size={13} className="text-[#1890FF]" />
                      <span>Key Takeaways & Evaluation</span>
                    </div>
                    <div className="bg-white dark:bg-[#121820] p-3.5 rounded-xl border border-gray-200/70 dark:border-gray-700/60">
                      <p className="text-xs text-[#212b36] dark:text-gray-200 leading-relaxed italic">
                        "Demonstrated exceptional core Java memory management and clean API design. Solved the concurrent rate limiter with token bucket algorithm effortlessly under 25 minutes."
                      </p>
                    </div>
                  </div>

                  {/* Strengths Identified */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Strengths Identified:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Deep understanding of multi-threading and thread-safety mechanisms in high-concurrency JVM.',
                        'Designed a graceful degradation pattern for batch transaction retries under 15 minutes.'
                      ].map((strength, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-white dark:bg-[#121820] border border-gray-200/60 dark:border-gray-700/60 text-xs text-[#454f5b] dark:text-gray-300">
                          <Check size={14} className="text-[#00A76F] shrink-0 mt-0.5" />
                          <span>{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Handover Note left for Round 2 */}
                  <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/40 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1890FF]">
                      <Lightbulb size={14} />
                      <span>Handover Note for Round 2 (System Architecture):</span>
                    </div>
                    <p className="text-xs text-[#454f5b] dark:text-gray-300 italic leading-relaxed">
                      "Check how she handles data reconciliation lag when read-replicas desynchronize in distributed Postgres. Core algorithms and coding are rock solid."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
    </div>
  );
}
