import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Search, Plus, Filter, MoreVertical, Briefcase, MapPin, 
 Users, Clock, CheckCircle, CheckCircle2, AlertCircle, Calendar, 
 ChevronDown, ChevronRight, ArrowUpRight, Star, CalendarClock, Copy, Edit, Trash2, X, UploadCloud, Send, BrainCircuit, FileText, Upload, Type, ArrowRight, Loader2, ChevronsRight, ChevronsLeft, GripVertical, RotateCcw, SlidersHorizontal,
  Building2, Bookmark, Award, Sparkles } from 'lucide-react';
import SearchableSelect from '../components/ui/SearchableSelect';
import findNewIco from '../assets/findnew-ico.png';
import JobFilterPanel, { FILTER_DATA } from '../components/dashboard/JobFilterPanel';
import JobQuickFilterBar, { QUICK_PARAMETERS_DATA } from '../components/dashboard/JobQuickFilterBar';
import FollowUpModal from '../components/dashboard/FollowUpModal';
import { isItemFavorited, toggleFavorite } from '../data/favoritesData';
import { isItemFollowedUp, isItemFollowed, toggleFollowItem } from '../data/followupsData';

const MOCK_JOBS = [
  { id: 1, title: 'Senior AI Research Scientist', company: 'Anthropic Labs', department: 'Engineering', location: 'Bangalore, India', type: 'Full-time', status: 'Open', applicants: 450, newApplicants: 184, postedDate: '2026-08-10', daysOpen: 70, experience: '5-8 yrs', avgMatch: 94, skills: ['PyTorch', 'Python', 'LLMs', 'Transformers', 'NLP', 'CUDA'], hiringManager: 'Amit Sharma', score: 98 },
  { id: 2, title: 'Product Design Lead', company: 'Figma', department: 'Design', location: 'San Francisco, CA', type: 'Hybrid', status: 'Draft', applicants: 0, newApplicants: 0, postedDate: '2026-08-20', daysOpen: 60, experience: '6-9 yrs', avgMatch: 82, skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Wireframing', 'User Testing', 'Prototyping'], hiringManager: 'Sarah Jenkins', score: 0 },
  { id: 3, title: 'VP of Marketing', company: 'Stripe', department: 'Marketing', location: 'New York, NY', type: 'Full-time', status: 'Closed', applicants: 89, newApplicants: 0, postedDate: '2026-07-01', daysOpen: 110, experience: '10+ yrs', avgMatch: 89, skills: ['Brand Strategy', 'Growth Marketing', 'Demand Gen', 'SEO/SEM', 'Content Strategy', 'Analytics'], hiringManager: 'David Chen', score: 100 },
  { id: 4, title: 'Data Engineer', company: 'Snowflake', department: 'Data Science', location: 'London, UK', type: 'Full-time', status: 'On Hold', applicants: 12, newApplicants: 2, postedDate: '2026-08-18', daysOpen: 62, experience: '3-5 yrs', avgMatch: 85, skills: ['Python', 'Apache Spark', 'PostgreSQL', 'Airflow', 'Kafka', 'Data Modeling'], hiringManager: 'Amit Sharma', score: 85 },
  { id: 5, title: 'Frontend Developer', company: 'Meta', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'Open', applicants: 210, newApplicants: 15, postedDate: '2026-08-21', daysOpen: 59, experience: '3-6 yrs', avgMatch: 92, skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux', 'GraphQL'], hiringManager: 'Amit Sharma', score: 92 },
  { id: 6, title: 'DevOps Engineer', company: 'Amazon AWS', department: 'Engineering', location: 'Bangalore, India', type: 'Contract', status: 'Open', applicants: 85, newApplicants: 8, postedDate: '2026-08-22', daysOpen: 58, experience: '4-7 yrs', avgMatch: 88, skills: ['Kubernetes', 'Docker', 'AWS Cloud', 'CI/CD Pipelines', 'Terraform', 'Prometheus'], hiringManager: 'Sarah Jenkins', score: 88 },
  { id: 7, title: 'HR Business Partner', company: 'Google', department: 'HR', location: 'New York, NY', type: 'Hybrid', status: 'Draft', applicants: 5, newApplicants: 1, postedDate: '2026-08-15', daysOpen: 65, experience: '5-8 yrs', avgMatch: 78, skills: ['Talent Strategy', 'Employee Relations', 'HRIS Systems', 'Performance Mgmt', 'Onboarding', 'Labor Laws'], hiringManager: 'David Chen', score: 75 },
  { id: 8, title: 'Sales Executive', company: 'Salesforce', department: 'Sales', location: 'London, UK', type: 'Full-time', status: 'Closed', applicants: 120, newApplicants: 0, postedDate: '2026-07-10', daysOpen: 101, experience: '3-5 yrs', avgMatch: 90, skills: ['B2B SaaS Sales', 'Enterprise Accounts', 'Salesforce CRM', 'Lead Gen', 'Negotiation', 'Pipeline Mgmt'], hiringManager: 'Amit Sharma', score: 90 },
  { id: 9, title: 'Product Manager', company: 'Uber Technologies', department: 'Product', location: 'San Francisco, CA', type: 'Full-time', status: 'On Hold', applicants: 48, newApplicants: 3, postedDate: '2026-08-05', daysOpen: 75, experience: '4-8 yrs', avgMatch: 91, skills: ['Product Strategy', 'Agile / Scrum', 'Roadmapping', 'User Research', 'Jira Software', 'Data Analytics'], hiringManager: 'Sarah Jenkins', score: 91 },
  { id: 10, title: 'Cloud Infrastructure Architect', company: 'Databricks', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'Open', applicants: 64, newApplicants: 9, postedDate: '2026-08-12', daysOpen: 68, experience: '8+ yrs', avgMatch: 95, skills: ['AWS Cloud', 'Terraform', 'Kubernetes', 'Cloud Security', 'Microservices', 'Linux Systems'], hiringManager: 'Amit Sharma', score: 95 },
  { id: 11, title: 'Full Stack Engineer', company: 'OpenAI', department: 'Engineering', location: 'San Francisco, CA', type: 'Full-time', status: 'Open', applicants: 320, newApplicants: 42, postedDate: '2026-08-25', daysOpen: 55, experience: '4-7 yrs', avgMatch: 96, skills: ['TypeScript', 'Next.js', 'Python', 'Node.js', 'PostgreSQL', 'Tailwind CSS'], hiringManager: 'Amit Sharma', score: 97 },
  { id: 12, title: 'Machine Learning Engineer', company: 'Apple', department: 'Engineering', location: 'Remote - US', type: 'Full-time', status: 'Open', applicants: 185, newApplicants: 28, postedDate: '2026-08-27', daysOpen: 53, experience: '3-6 yrs', avgMatch: 93, skills: ['PyTorch', 'TensorFlow', 'CoreML', 'Python', 'Computer Vision', 'C++'], hiringManager: 'Sarah Jenkins', score: 94 },
  { id: 13, title: 'Senior UX Researcher', company: 'Airbnb', department: 'Design', location: 'New York, NY', type: 'Hybrid', status: 'Open', applicants: 74, newApplicants: 12, postedDate: '2026-09-01', daysOpen: 48, experience: '5-8 yrs', avgMatch: 87, skills: ['User Interviews', 'Usability Testing', 'Figma', 'Qualitative Analysis', 'Persona Building', 'Journey Mapping'], hiringManager: 'Sarah Jenkins', score: 89 },
  { id: 14, title: 'Security Operations Lead', company: 'Microsoft', department: 'Engineering', location: 'Seattle, WA', type: 'Full-time', status: 'Open', applicants: 58, newApplicants: 6, postedDate: '2026-09-03', daysOpen: 46, experience: '7-10 yrs', avgMatch: 91, skills: ['Cybersecurity', 'SIEM / Splunk', 'Incident Response', 'Cloud Security', 'Azure Security', 'Zero Trust'], hiringManager: 'Amit Sharma', score: 93 },
  { id: 15, title: 'Growth Marketing Manager', company: 'Netflix', department: 'Marketing', location: 'Los Angeles, CA', type: 'Full-time', status: 'Open', applicants: 142, newApplicants: 24, postedDate: '2026-09-05', daysOpen: 44, experience: '4-7 yrs', avgMatch: 88, skills: ['Paid Acquisition', 'A/B Testing', 'Retention Loops', 'SQL / Analytics', 'Meta Ads', 'Funnel Optimization'], hiringManager: 'David Chen', score: 86 },
  { id: 16, title: 'Backend Software Architect', company: 'Spotify', department: 'Engineering', location: 'Berlin, Germany', type: 'Full-time', status: 'Open', applicants: 96, newApplicants: 14, postedDate: '2026-09-08', daysOpen: 41, experience: '8-12 yrs', avgMatch: 95, skills: ['Java / Spring', 'Go / Golang', 'Kafka', 'Distributed Systems', 'gRPC', 'PostgreSQL'], hiringManager: 'Amit Sharma', score: 96 },
  { id: 17, title: 'Technical Program Manager', company: 'Google', department: 'Product', location: 'Bangalore, India', type: 'Hybrid', status: 'Draft', applicants: 0, newApplicants: 0, postedDate: '2026-09-10', daysOpen: 39, experience: '6-9 yrs', avgMatch: 84, skills: ['Agile / Scrum', 'Cross-functional Leadership', 'Jira', 'Risk Management', 'System Design', 'Stakeholder Comms'], hiringManager: 'Sarah Jenkins', score: 0 },
  { id: 18, title: 'Customer Success Team Lead', company: 'Salesforce', department: 'Customer Success', location: 'Dublin, Ireland', type: 'Full-time', status: 'Open', applicants: 62, newApplicants: 7, postedDate: '2026-09-12', daysOpen: 37, experience: '5-8 yrs', avgMatch: 89, skills: ['Client Retention', 'QBR Leadership', 'SaaS Onboarding', 'Zendesk', 'Churn Reduction', 'Account Growth'], hiringManager: 'David Chen', score: 88 },
  { id: 19, title: 'Senior Data Analyst', company: 'Snowflake', department: 'Data Science', location: 'Toronto, Canada', type: 'Hybrid', status: 'Open', applicants: 115, newApplicants: 19, postedDate: '2026-09-14', daysOpen: 35, experience: '3-5 yrs', avgMatch: 90, skills: ['SQL Advanced', 'Tableau', 'dbt', 'Python', 'Statistical Analysis', 'Snowflake DW'], hiringManager: 'Amit Sharma', score: 91 },
  { id: 20, title: 'QA Automation Lead', company: 'Atlassian', department: 'Engineering', location: 'Sydney, Australia', type: 'Full-time', status: 'On Hold', applicants: 38, newApplicants: 2, postedDate: '2026-09-15', daysOpen: 34, experience: '5-8 yrs', avgMatch: 86, skills: ['Cypress', 'Playwright', 'Selenium', 'CI/CD Pipelines', 'JavaScript / TS', 'API Testing'], hiringManager: 'Sarah Jenkins', score: 84 },
  { id: 21, title: 'Enterprise Account Executive', company: 'Databricks', department: 'Sales', location: 'New York, NY', type: 'Full-time', status: 'Open', applicants: 88, newApplicants: 11, postedDate: '2026-09-18', daysOpen: 31, experience: '6-10 yrs', avgMatch: 92, skills: ['Enterprise SaaS', 'MEDDPICC', 'C-Level Selling', 'Cloud Solutions', 'Salesforce CRM', 'Territory Planning'], hiringManager: 'David Chen', score: 93 },
  { id: 22, title: 'Senior iOS Developer', company: 'Apple', department: 'Engineering', location: 'San Francisco, CA', type: 'Full-time', status: 'Open', applicants: 150, newApplicants: 22, postedDate: '2026-09-20', daysOpen: 29, experience: '5-8 yrs', avgMatch: 94, skills: ['Swift', 'SwiftUI', 'Combine', 'iOS SDK', 'Unit Testing', 'CI/CD Fastlane'], hiringManager: 'Amit Sharma', score: 95 },
  { id: 23, title: 'Finance & Strategy Analyst', company: 'Stripe', department: 'Finance', location: 'London, UK', type: 'Full-time', status: 'Draft', applicants: 2, newApplicants: 0, postedDate: '2026-09-22', daysOpen: 27, experience: '2-5 yrs', avgMatch: 81, skills: ['Financial Modeling', 'SaaS Metrics (LTV/CAC)', 'Excel / VBA', 'SQL Queries', 'Budget Forecasting', 'Investor Reporting'], hiringManager: 'David Chen', score: 0 },
  { id: 24, title: 'Solutions Architect', company: 'Amazon AWS', department: 'Engineering', location: 'Singapore', type: 'Full-time', status: 'Open', applicants: 72, newApplicants: 8, postedDate: '2026-09-24', daysOpen: 25, experience: '8-12 yrs', avgMatch: 96, skills: ['AWS Well-Architected', 'Cloud Migration', 'Kubernetes', 'Enterprise Security', 'Client Demos', 'Terraform'], hiringManager: 'Amit Sharma', score: 98 },
  { id: 25, title: 'Content & Social Lead', company: 'Figma', department: 'Marketing', location: 'Remote', type: 'Full-time', status: 'Closed', applicants: 240, newApplicants: 0, postedDate: '2026-07-20', daysOpen: 91, experience: '4-7 yrs', avgMatch: 88, skills: ['Content Strategy', 'Community Building', 'Social Copywriting', 'SEO Content', 'Figma Design', 'Brand Storytelling'], hiringManager: 'David Chen', score: 90 },
  { id: 26, title: 'Talent Acquisition Specialist', company: 'Meta', department: 'HR', location: 'Bangalore, India', type: 'Contract', status: 'Open', applicants: 95, newApplicants: 16, postedDate: '2026-09-28', daysOpen: 21, experience: '3-6 yrs', avgMatch: 85, skills: ['Tech Sourcing', 'LinkedIn Recruiter', 'Boolean Search', 'Candidate Screening', 'ATS Management', 'Offer Negotiation'], hiringManager: 'Sarah Jenkins', score: 87 },
  { id: 27, title: 'Infrastructure SRE', company: 'Uber Technologies', department: 'Engineering', location: 'Austin, TX', type: 'Full-time', status: 'Open', applicants: 68, newApplicants: 9, postedDate: '2026-10-02', daysOpen: 17, experience: '4-8 yrs', avgMatch: 93, skills: ['Linux Kernel', 'Observability / Grafana', 'Prometheus', 'Terraform', 'Incident Management', 'Golang'], hiringManager: 'Amit Sharma', score: 92 },
  { id: 28, title: 'VP of Product Strategy', company: 'OpenAI', department: 'Product', location: 'San Francisco, CA', type: 'Full-time', status: 'Open', applicants: 112, newApplicants: 31, postedDate: '2026-10-05', daysOpen: 14, experience: '12+ yrs', avgMatch: 97, skills: ['AI Product Strategy', 'P&L Ownership', 'Team Scaling', 'Ecosystem Strategy', 'Executive Comms', 'Roadmap Governance'], hiringManager: 'Sarah Jenkins', score: 99 },
  { id: 29, title: 'Senior Cloud Security Architect', company: 'Palo Alto Networks', department: 'Engineering', location: 'Austin, TX', type: 'Full-time', status: 'Closed', applicants: 110, newApplicants: 0, postedDate: '2026-06-15', daysOpen: 125, experience: '7-10 yrs', avgMatch: 93, skills: ['Cloud Security', 'Kubernetes', 'AWS Cloud', 'Terraform', 'CI/CD Pipelines'], hiringManager: 'Amit Sharma', score: 94 },
  { id: 30, title: 'Senior Backend Engineer', company: 'Databricks', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'Closed', applicants: 175, newApplicants: 0, postedDate: '2026-06-28', daysOpen: 112, experience: '5-8 yrs', avgMatch: 91, skills: ['Python / AI', 'PostgreSQL / SQL', 'Docker & K8s', 'AWS Cloud'], hiringManager: 'Sarah Jenkins', score: 92 }
];


export const getJobPipelineData = (job) => {
  if (job.pipeline) {
    const p = job.pipeline;
    const total = (p.applied || 0) + (p.screen || 0) + (p.interview || 0) + (p.offer || 0) + (p.hired || 0);
    return { ...p, total: total || job.applicants || 0 };
  }

  // Individual realistic candidate stage counts per job
  const stageDistributionMap = {
    1: { applied: 210, screen: 130, interview: 80, offer: 22, hired: 8 },   // Senior AI Research Scientist (450)
    2: { applied: 0, screen: 0, interview: 0, offer: 0, hired: 0 },          // Product Design Lead (0)
    3: { applied: 24, screen: 32, interview: 22, offer: 8, hired: 3 },       // VP of Marketing (Closed, 89)
    4: { applied: 8, screen: 3, interview: 1, offer: 0, hired: 0 },          // Data Engineer (On Hold, 12)
    5: { applied: 110, screen: 60, interview: 30, offer: 8, hired: 2 },      // Frontend Developer (210)
    6: { applied: 48, screen: 22, interview: 11, offer: 3, hired: 1 },       // DevOps Engineer (85)
    7: { applied: 3, screen: 2, interview: 0, offer: 0, hired: 0 },          // HR Business Partner (Draft, 5)
    8: { applied: 35, screen: 45, interview: 28, offer: 8, hired: 4 },       // Sales Executive (Closed, 120)
    9: { applied: 26, screen: 14, interview: 6, offer: 2, hired: 0 },        // Product Manager (On Hold, 48)
    10: { applied: 36, screen: 18, interview: 8, offer: 2, hired: 0 },       // Cloud Infrastructure Architect (64)
    11: { applied: 185, screen: 82, interview: 40, offer: 10, hired: 3 },    // Full Stack Engineer (320)
    12: { applied: 95, screen: 52, interview: 28, offer: 8, hired: 2 },      // Machine Learning Engineer (185)
    13: { applied: 38, screen: 22, interview: 11, offer: 3, hired: 0 },      // Senior UX Researcher (74)
    14: { applied: 32, screen: 16, interview: 8, offer: 2, hired: 0 },       // Security Operations Lead (58)
    15: { applied: 80, screen: 38, interview: 18, offer: 5, hired: 1 },      // Growth Marketing Manager (142)
    16: { applied: 45, screen: 28, interview: 17, offer: 5, hired: 1 },      // Backend Software Architect (96)
    17: { applied: 0, screen: 0, interview: 0, offer: 0, hired: 0 },          // Technical Program Manager (Draft, 0)
    18: { applied: 32, screen: 18, interview: 9, offer: 2, hired: 1 },       // Customer Success Team Lead (62)
    19: { applied: 65, screen: 32, interview: 14, offer: 3, hired: 1 },      // Senior Data Analyst (115)
    20: { applied: 22, screen: 11, interview: 4, offer: 1, hired: 0 },       // QA Automation Lead (On Hold, 38)
    21: { applied: 46, screen: 25, interview: 13, offer: 3, hired: 1 },      // Enterprise Account Executive (88)
    22: { applied: 78, screen: 42, interview: 22, offer: 6, hired: 2 },      // Senior iOS Developer (150)
    23: { applied: 2, screen: 0, interview: 0, offer: 0, hired: 0 },          // Finance & Strategy Analyst (Draft, 2)
    24: { applied: 40, screen: 20, interview: 9, offer: 2, hired: 1 },       // Solutions Architect (72)
    25: { applied: 110, screen: 75, interview: 40, offer: 12, hired: 3 },     // Content & Social Lead (Closed, 240)
    26: { applied: 52, screen: 26, interview: 13, offer: 3, hired: 1 },      // Talent Acquisition Specialist (95)
    27: { applied: 35, screen: 20, interview: 10, offer: 2, hired: 1 },      // Infrastructure SRE (68)
    28: { applied: 42, screen: 38, interview: 22, offer: 7, hired: 3 },      // VP of Product Strategy (112)
    29: { applied: 32, screen: 42, interview: 26, offer: 8, hired: 2 },      // Senior Cloud Security Architect (Closed, 110)
    30: { applied: 65, screen: 60, interview: 38, offer: 9, hired: 3 }       // Senior Backend Engineer (Closed, 175)
  };

  if (stageDistributionMap[job.id]) {
    const p = stageDistributionMap[job.id];
    return { ...p, total: job.applicants || 0 };
  }

  const total = job.applicants || 0;
  if (total === 0) {
    return { applied: 0, screen: 0, interview: 0, offer: 0, hired: 0, total: 0 };
  }

  // Fallback for new / created jobs
  const hired = job.status === 'Closed' ? Math.max(1, Math.min(3, Math.round(total * 0.02))) : (job.status === 'Open' ? Math.max(0, Math.floor(total * 0.01)) : 0);
  const offer = Math.max(0, Math.round(total * 0.05));
  const interview = Math.max(1, Math.round(total * 0.18));
  const screen = Math.max(1, Math.round(total * 0.25));
  const applied = Math.max(0, total - (hired + offer + interview + screen));
  return { applied, screen, interview, offer, hired, total };
};

const DEFAULT_CHATBOT_WIDTH = 320;
const MAX_CHATBOT_WIDTH = 600;

function JobPipelineDisplay({ job, width = "w-[330px]" }) {
  const pipe = getJobPipelineData(job);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const containerRef = useRef(null);

  const stages = [
    { key: 'applied', label: 'Applied', count: pipe.applied, color: '#1890FF' },
    { key: 'screen', label: 'Screen', count: pipe.screen, color: '#00B8D9' },
    { key: 'interview', label: 'Interview', count: pipe.interview, color: '#00A76F' },
    { key: 'offer', label: 'Offer', count: pipe.offer, color: '#FFAB00' },
    { key: 'hired', label: 'Hired', count: pipe.hired, color: '#059669' }
  ];

  const handleHover = (stage, e) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const targetRect = e.currentTarget.getBoundingClientRect();
      const x = (targetRect.left + targetRect.width / 2) - containerRect.left;
      setActiveTooltip({ ...stage, x });
    }
  };

  return (
    <div ref={containerRef} className={`${width} space-y-1.5 relative select-none`}>
      {/* Custom unified floating tooltip - only one tooltip displayed */}
      {activeTooltip && (
        <div 
          className="absolute z-50 pointer-events-none transform -translate-x-1/2 transition-all duration-75 animate-fade-in"
          style={{ 
            left: `${activeTooltip.x}px`,
            top: '-28px'
          }}
        >
          <div className="bg-gray-900/95 dark:bg-gray-800 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-lg whitespace-nowrap flex items-center gap-1.5 border border-gray-700/60">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: activeTooltip.color }}></span>
            <span>{activeTooltip.label}:</span>
            <span className="font-bold text-white tabular-nums">{activeTooltip.count}</span>
          </div>
          <div className="w-1.5 h-1.5 bg-gray-900/95 dark:bg-gray-800 rotate-45 mx-auto -mt-0.5 border-r border-b border-gray-700/60"></div>
        </div>
      )}

      {/* Segmented Pipeline Bar */}
      <div className="flex h-2.5 w-full rounded-full overflow-hidden gap-1 bg-gray-100 dark:bg-gray-800 p-0.5 shadow-2xs">
        {pipe.total === 0 ? (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700/60 rounded-full" />
        ) : (
          stages.map(stage => {
            if (stage.count <= 0) return null;
            return (
              <div
                key={stage.key}
                style={{ flexGrow: stage.count, flexShrink: 1, flexBasis: '0%', backgroundColor: stage.color }}
                className="h-full first:rounded-l-full last:rounded-r-full hover:brightness-110 transition-all cursor-pointer"
                onMouseEnter={(e) => handleHover(stage, e)}
                onMouseLeave={() => setActiveTooltip(null)}
              />
            );
          })
        )}
      </div>

      {/* Stage Legend */}
      <div className="grid grid-cols-5 text-center text-[10px] font-medium gap-1 pt-0.5">
        {stages.map(stage => (
          <div
            key={stage.key}
            className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer py-1 rounded hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
            style={{ color: activeTooltip?.key === stage.key ? stage.color : undefined }}
            onMouseEnter={(e) => handleHover(stage, e)}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: stage.color }}></span>
            <span className="truncate">{stage.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function JobsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeViewParam = searchParams.get('view') || 'all';
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [currentPage, setCurrentPage] = useState(1);
  const [followUpTarget, setFollowUpTarget] = useState(null);
  const [favRefreshKey, setFavRefreshKey] = useState(0);

  // Sync favorites & follow-ups real-time
  useEffect(() => {
    const handleUpdate = () => setFavRefreshKey(k => k + 1);
    window.addEventListener('favorites-updated', handleUpdate);
    window.addEventListener('followups-updated', handleUpdate);
    return () => {
      window.removeEventListener('favorites-updated', handleUpdate);
      window.removeEventListener('followups-updated', handleUpdate);
    };
  }, []);

  const favoritedJobsCount = useMemo(() => jobs.filter(j => isItemFavorited('Job', j.id)).length, [jobs, favRefreshKey]);
  const followedJobsCount = useMemo(() => jobs.filter(j => isItemFollowedUp('Job', j.id)).length, [jobs, favRefreshKey]);

  const handleViewFilterChange = (mode) => {
    const newParams = new URLSearchParams(searchParams);
    if (mode === 'all') {
      newParams.delete('view');
    } else {
      newParams.set('view', mode);
    }
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handleToggleFav = (job, e) => {
    if (e) e.stopPropagation();
    toggleFavorite({
      relatedId: job.id,
      type: 'Job',
      title: job.title,
      subtitle: `${job.department} • ${job.location}`,
      tag: job.status
    });
    setFavRefreshKey(k => k + 1);
  };

  const [followConfirmation, setFollowConfirmation] = useState(null);
  const followConfirmTimerRef = useRef(null);

  const handleToggleFollow = (job, e) => {
    if (e) e.stopPropagation();
    const res = toggleFollowItem({
      relatedId: job.id,
      type: 'Job',
      title: job.title,
      subject: `Job: ${job.title} (${job.department})`
    });
    setFavRefreshKey(k => k + 1);

    if (followConfirmTimerRef.current) clearTimeout(followConfirmTimerRef.current);

    setFollowConfirmation({
      name: job.title,
      isUnfollow: !res.isFollowed,
      message: res.isFollowed
        ? 'You will be getting all notification of all activity.'
        : 'You will no longer receive activity notifications.'
    });

    followConfirmTimerRef.current = setTimeout(() => {
      setFollowConfirmation(null);
    }, 4500);
  };

  const handleOpenFollowup = (job, e) => {
    handleToggleFollow(job, e);
  };
  const rightPanelRef = useRef(null);
  const base10JobsHeightRef = useRef({ grid: 980, card: 980 });
  const [filterPanelHeight, setFilterPanelHeight] = useState(980);
  const [searchQuery, setSearchQuery] = useState('');
 const [sortBy, setSortBy] = useState('recommended');
 const [viewMode, setViewMode] = useState('grid');
 const [selectedFilters, setSelectedFilters] = useState({
    department: [],
    position: [],
    location: [],
    experience: [],
    company: [],
    employmentType: [],
    workMode: [],
    aiHealth: [],
    posted: []
  });

  const [quickFilters, setQuickFilters] = useState({
    status: [],
    skills: [],
    priority: [],
    hiringManager: [],
    recruiter: [],
    openings: [],
    shift: [],
    topSource: [],
    education: [],
    noticePeriod: []
  });

  const handleFilterChange = (categoryKey, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [categoryKey]: value
    }));
  };

  const handleQuickFilterChange = (key, value) => {
    setQuickFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      department: [],
      position: [],
      location: [],
      experience: [],
      company: [],
      employmentType: [],
      workMode: [],
      aiHealth: [],
      posted: []
    });
    setQuickFilters({
      status: [],
      skills: [],
      priority: [],
      hiringManager: [],
      recruiter: [],
      openings: [],
      shift: [],
      topSource: [],
      education: [],
      noticePeriod: []
    });
    setSearchQuery('');
    setSortBy('recommended');
  };

  const handleClearAllQuickFilters = () => {
    setQuickFilters({
      status: [],
      skills: [],
      priority: [],
      hiringManager: [],
      recruiter: [],
      openings: [],
      shift: [],
      topSource: [],
      education: [],
      noticePeriod: []
    });
  };

  // Dynamic status counts and parameter options for JobQuickFilterBar
  const dynamicQuickParameters = useMemo(() => {
    const openCount = jobs.filter(j => j.status === 'Open' || j.status === 'Published' || j.status === 'Internal').length;
    const closedCount = jobs.filter(j => j.status === 'Closed').length;
    const draftCount = jobs.filter(j => j.status === 'Draft').length;
    const onHoldCount = jobs.filter(j => j.status === 'On Hold' || j.status === 'Hold' || j.status === 'On-Hold').length;

    return {
      ...QUICK_PARAMETERS_DATA,
      status: [
        { id: 'Open', label: 'Open', count: openCount },
        { id: 'Closed', label: 'Closed', count: closedCount },
        { id: 'Draft', label: 'Draft', count: draftCount },
        { id: 'On Hold', label: 'On Hold', count: onHoldCount }
      ]
    };
  }, [jobs]);
 
 const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
 const [successMessage, setSuccessMessage] = useState(null);
 const [errors, setErrors] = useState({});

 const [isSendAgencyModalOpen, setIsSendAgencyModalOpen] = useState(false);
 const [selectedJobForAgency, setSelectedJobForAgency] = useState(null);
 const [sendAgencyData, setSendAgencyData] = useState({ agency: '', message: '' });
 const [customAlert, setCustomAlert] = useState(null);
 const [openActionMenuId, setOpenActionMenuId] = useState(null);
 const [editingJobId, setEditingJobId] = useState(null);
 const itemsPerPage = 10;

 const [isViewJobModalOpen, setIsViewJobModalOpen] = useState(false);
 const [selectedJobToView, setSelectedJobToView] = useState(null);

 useEffect(() => {
 const handleClickOutside = () => setOpenActionMenuId(null);
 document.addEventListener('click', handleClickOutside);
 return () => document.removeEventListener('click', handleClickOutside);
 }, []);
 
 const [modalStep, setModalStep] = useState(1);
 const [skippedJdUpload, setSkippedJdUpload] = useState(false);
 const [isExtracting, setIsExtracting] = useState(false);
 const [isDragging, setIsDragging] = useState(false);

 const [newJobData, setNewJobData] = useState({
 title: '',
 department: '',
 location: '',
 type: 'Full-time',
 workMode: 'On-site',
 hiringManager: '',
 jdText: '',
 jdFile: null
 });

 const validate = () => {
 const newErrors = {};
 if (!newJobData.title.trim()) newErrors.title = 'Job Title is required';
 if (!newJobData.department.trim()) newErrors.department = 'Department is required';
 if (!newJobData.location.trim()) newErrors.location = 'Location is required';
 
 setErrors(newErrors);
 return Object.keys(newErrors).length === 0;
 };

 const handleCloseModal = () => {
 setIsCreateModalOpen(false);
 setEditingJobId(null);
 setNewJobData({title: '', department: '', location: '', type: 'Full-time', hiringManager: '', jdText: '', jdFile: null});
 setErrors({});
 setModalStep(1);
 setSkippedJdUpload(false);
 setIsExtracting(false);
 };

 const simulateExtraction = () => {
 setIsExtracting(true);
 setTimeout(() => {
 setIsExtracting(false);
 setNewJobData(prev => ({
 ...prev,
 title: 'Senior Frontend Engineer',
 department: 'Engineering',
 location: 'Remote',
 hiringManager: 'Amit Sharma'
 }));
 setModalStep(2);
 }, 1500);
 };
 
 const handleFileUpload = (file) => {
 if (file) {
 setNewJobData(prev => ({...prev, jdFile: file}));
 if (modalStep === 1) {
 simulateExtraction();
 }
 }
 };
 
 const handleDragOver = (e) => {
 e.preventDefault();
 setIsDragging(true);
 };
 
 const handleDragLeave = () => {
 setIsDragging(false);
 };
 
 const handleDrop = (e) => {
 e.preventDefault();
 setIsDragging(false);
 if (e.dataTransfer.files && e.dataTransfer.files[0]) {
 handleFileUpload(e.dataTransfer.files[0]);
 }
 };
 
 
 const filteredJobs = useMemo(() => {
 const list = jobs.filter(job => {
 // View Switcher Filter: All / Favorites / Follow-Ups
    if (activeViewParam === 'favorites' && !isItemFavorited('Job', job.id)) {
      return false;
    }
    if (activeViewParam === 'followups' && !isItemFollowedUp('Job', job.id)) {
      return false;
    }

    const matchesSearch = !searchQuery || 
 job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
 job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
 (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase()));
    // Status filtering:
    // By default "Closed" jobs should NOT be visible. User can see Closed jobs by selecting "Closed" in the Status filter.
    let matchesStatus = true;
    if (quickFilters.status && quickFilters.status.length > 0) {
      matchesStatus = quickFilters.status.some(st => {
        const s = st.toLowerCase();
        if (s === 'open') return job.status === 'Open' || job.status === 'Published' || job.status === 'Internal';
        if (s === 'on hold') return job.status === 'On Hold' || job.status === 'Hold' || job.status === 'On-Hold';
        return job.status.toLowerCase() === s;
      });
    } else {
      // By default (All), exclude Closed jobs
      matchesStatus = job.status !== 'Closed';
    }

 // Multi-select department filter
 let matchesDept = true;
 if (selectedFilters.department && selectedFilters.department.length > 0) {
 const activeLabels = FILTER_DATA.department
 .filter(d => selectedFilters.department.includes(d.id))
 .map(d => d.label.toLowerCase());
 matchesDept = activeLabels.some(lbl => lbl.includes(job.department.toLowerCase()) || job.department.toLowerCase().includes(lbl.split(' ')[0]));
 }

 // Multi-select location filter
 let matchesLoc = true;
 if (selectedFilters.location && selectedFilters.location.length > 0) {
 const activeLocs = FILTER_DATA.location
 .filter(l => selectedFilters.location.includes(l.id))
 .map(l => l.label.toLowerCase());
 matchesLoc = activeLocs.some(lbl => job.location && (lbl.includes(job.location.toLowerCase()) || job.location.toLowerCase().includes(lbl.split(',')[0])));
 }

 // Multi-select employment type filter
 let matchesType = true;
 if (selectedFilters.employmentType && selectedFilters.employmentType.length > 0) {
 const activeTypes = FILTER_DATA.employmentType
 .filter(t => selectedFilters.employmentType.includes(t.id))
 .map(t => t.label.toLowerCase());
 matchesType = activeTypes.some(lbl => job.type && (lbl.includes(job.type.toLowerCase()) || job.type.toLowerCase().includes(lbl.split(' ')[0])));
 }

 // Quick Filter: Hiring Manager
 let matchesHM = true;
 if (quickFilters.hiringManager && quickFilters.hiringManager.length > 0) {
 const activeHMs = QUICK_PARAMETERS_DATA.hiringManager
 .filter(hm => quickFilters.hiringManager.includes(hm.id))
 .map(hm => hm.label.toLowerCase());
 matchesHM = activeHMs.some(hm => job.hiringManager && job.hiringManager.toLowerCase().includes(hm));
 }

    // Quick Filter: Skills
    let matchesSkills = true;
    if (quickFilters.skills && quickFilters.skills.length > 0) {
      const activeSkills = QUICK_PARAMETERS_DATA.skills
        .filter(s => quickFilters.skills.includes(s.id))
        .map(s => s.label.toLowerCase());
      matchesSkills = activeSkills.some(skill => 
        job.skills && job.skills.some(js => js.toLowerCase().includes(skill) || skill.includes(js.toLowerCase()))
      );
    }

 return matchesSearch && matchesStatus && matchesDept && matchesLoc && matchesType && matchesHM && matchesSkills;
 });

 // Apply Sort
 return list.sort((a, b) => {
 switch (sortBy) {
 case 'newest':
 return new Date(b.postedDate) - new Date(a.postedDate);
 case 'oldest':
 return new Date(a.postedDate) - new Date(b.postedDate);
 case 'applicants_desc':
 return b.applicants - a.applicants;
 case 'score_desc':
 return (b.score || 0) - (a.score || 0);
 case 'title_asc':
 return a.title.localeCompare(b.title);
 case 'recommended':
 default:
 return (b.score || 0) - (a.score || 0) || a.id - b.id;
 }
 });
 }, [jobs, searchQuery, selectedFilters, quickFilters, sortBy, activeViewParam, favRefreshKey]);

 // Reset to page 1 when filters or sort change
 useEffect(() => {
 setCurrentPage(1);
 }, [searchQuery, selectedFilters, quickFilters, sortBy]);

 const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
 const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

 const getStatusColor = (status) => {
 switch(status) {
 case 'Open':
 case 'Published':
 case 'Internal': return 'bg-[#00A76F]/10 text-[#00A76F] dark:text-[#22c55e]';
 case 'Draft': return 'bg-[#FFAB00]/10 text-[#b78103] dark:text-[#FFAB00]';
 case 'On Hold': return 'bg-[#8E33FF]/10 text-[#8E33FF] dark:text-[#a855f7]';
 case 'Closed': return 'bg-[#FF5630]/10 text-[#FF5630] dark:text-[#ff5630]';
 default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
 }
 };

 // KPI Cards Data: All Jobs, Open, Draft, On Hold, Closed
 const kpiStats = useMemo(() => {
 const total = jobs.filter(j => j.status !== 'Closed').length;
 const open = jobs.filter(j => j.status === 'Open' || j.status === 'Published' || j.status === 'Internal').length;
 const draft = jobs.filter(j => j.status === 'Draft').length;
 const onHold = jobs.filter(j => j.status === 'On Hold' || j.status === 'Hold' || j.status === 'On-Hold').length;
 const closed = jobs.filter(j => j.status === 'Closed').length;

 return [
 { 
 id: 'All', 
 title: 'All Jobs', 
 count: total, 
 icon: Briefcase, 
 color: 'text-[#1890FF]', 
 bgColor: 'bg-[#1890FF]/10', 
 borderColor: 'border-[#1890FF]/20',
 subtext: 'Active requisitions' 
 },
 { 
 id: 'Open', 
 title: 'Open', 
 count: open, 
 icon: CheckCircle2, 
 color: 'text-[#00A76F] dark:text-[#22c55e]', 
 bgColor: 'bg-[#00A76F]/10', 
 borderColor: 'border-[#00A76F]/20',
 subtext: 'Active & published' 
 },
 { 
 id: 'Draft', 
 title: 'Draft', 
 count: draft, 
 icon: FileText, 
 color: 'text-[#b78103] dark:text-[#FFAB00]', 
 bgColor: 'bg-[#FFAB00]/10', 
 borderColor: 'border-[#FFAB00]/20',
 subtext: 'Unpublished listings' 
 },
 { 
 id: 'On Hold', 
 title: 'On Hold', 
 count: onHold, 
 icon: Clock, 
 color: 'text-[#8E33FF]', 
 bgColor: 'bg-[#8E33FF]/10', 
 borderColor: 'border-[#8E33FF]/20',
 subtext: 'Paused hiring' 
 },
 { 
 id: 'Closed', 
 title: 'Closed', 
 count: closed, 
 icon: AlertCircle, 
 color: 'text-[#FF5630]', 
 bgColor: 'bg-[#FF5630]/10', 
 borderColor: 'border-[#FF5630]/20',
 subtext: 'Archived / filled' 
 }
 ];
 }, [jobs]);
  // Maintain Left Filter Panel height fixed to the height of the job list with 10 jobs.
  // When applying filters and the job list gets smaller, height of the filter is NOT reduced.
  useEffect(() => {
    if (!rightPanelRef.current) return;

    const measureHeight = () => {
      if (window.innerWidth >= 1024 && rightPanelRef.current) {
        const currentH = rightPanelRef.current.offsetHeight;

        // If the right panel currently has 10 jobs displayed (or hasn't recorded yet),
        // update the 10-job benchmark height for this view mode
        if (paginatedJobs.length >= 10 || !base10JobsHeightRef.current[viewMode]) {
          if (currentH > 400) {
            base10JobsHeightRef.current[viewMode] = Math.max(
              base10JobsHeightRef.current[viewMode] || 0,
              currentH
            );
          }
        }

        const benchmarkHeight = base10JobsHeightRef.current[viewMode] || 980;
        setFilterPanelHeight(Math.max(benchmarkHeight, currentH));
      } else {
        setFilterPanelHeight(null);
      }
    };

    const timer = setTimeout(measureHeight, 60);

    const observer = new ResizeObserver(() => {
      measureHeight();
    });

    observer.observe(rightPanelRef.current);
    window.addEventListener('resize', measureHeight);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', measureHeight);
    };
  }, [paginatedJobs.length, viewMode]);

 return (
 <>
  <div className="p-6 space-y-5 relative">
      {/* TOP BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-1">
        <Link to="/dashboard" className="hover:text-[#1890FF] transition-colors cursor-pointer">
          Dashboard
        </Link>
        <ChevronRight size={14} className="text-gray-400 shrink-0" />
        <span className="text-[#212b36] dark:text-white">All Jobs</span>
      </nav>

      {/* JOB HEADER CARD */}
      <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/70 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#212b36] dark:text-white tracking-tight leading-none">
                All Jobs
              </h1>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#1890FF]/10 text-[#1890FF]">
                {jobs.length} Total
              </span>
            </div>
            <p className="mt-2 text-[13px] text-gray-500 dark:text-gray-400 font-medium">
              Manage and track all open requisitions across departments.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button className="px-3.5 py-2 bg-white dark:bg-[#161c24] border border-gray-200 dark:border-gray-800 text-[#212b36] dark:text-white rounded-xl text-xs sm:text-sm font-bold shadow-2xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 cursor-pointer h-[38px]">
              <ArrowUpRight size={15} /> Export
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-[#1890FF] hover:bg-[#0077e6] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-[#1890FF]/25 hover:shadow-md transition-all flex items-center gap-2 cursor-pointer h-[38px] active:scale-98"
            >
              <Plus size={15} /> Create Job
            </button>
          </div>
        </div>
      </div>

 {/* 5 KPI CARDS ROW (All Jobs, Open, Draft, On Hold, Closed) */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
  {kpiStats.map((kpi) => {
  const Icon = kpi.icon;

  return (
  <div
  key={kpi.id}
  className="bg-white dark:bg-[#161c24] p-4 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800/80 flex flex-col justify-between transition-all duration-200"
 >
 {/* Top Row: Icon badge + Title on left, Fixed/Total Count on right */}
 <div className="flex items-center justify-between gap-2 min-h-[32px]">
 <div className="flex items-center gap-2.5 min-w-0">
 <div className={`w-8 h-8 rounded-xl ${kpi.bgColor} flex items-center justify-center shrink-0 border ${kpi.borderColor}`}>
 <Icon size={17} className={kpi.color} />
 </div>
 <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate uppercase tracking-wider">
 {kpi.title}
 </h4>
 </div>

 <span className="text-xl sm:text-2xl font-extrabold text-[#212b36] dark:text-white tracking-tight leading-none shrink-0">
 {kpi.count}
 </span>
 </div>

 {/* Bottom Subtext Row */}
 <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400">
 <span className="truncate">
 {kpi.subtext}
 </span>
 </div>
 </div>
 );
 })}
 </div>

 {/* MAIN CONTENT ROW: Left Filter Panel + Main Jobs Content */}
 <div className="flex flex-col lg:flex-row gap-6 relative items-start">
 {/* LEFT FILTER PANEL */}
 <JobFilterPanel
 selectedFilters={selectedFilters}
 onFilterChange={handleFilterChange}
 onResetAll={handleResetFilters}
 totalResultsCount={filteredJobs.length}
          panelHeight={filterPanelHeight}
        />

 {/* MAIN CONTENT AREA: Jobs Table & Pagination */}
 <div ref={rightPanelRef} className="flex-1 min-w-0 space-y-4 w-full">
 {/* Horizontal Filter Bar with Quick Parameters & Custom Sort By */}
          <JobQuickFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search jobs, title, department, location..."
            quickFilters={quickFilters}
            onQuickFilterChange={handleQuickFilterChange}
            onClearAll={handleClearAllQuickFilters}
            parameterOptions={dynamicQuickParameters}
            sortBy={sortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onSortChange={setSortBy}
            showPresetFilters={true}
            showFavoritesFilter={true}
            showFollowingFilter={false}
            activeView={activeViewParam}
            onViewChange={handleViewFilterChange}
            favoritesCount={favoritedJobsCount}
            followupsCount={followedJobsCount}
          />


 {/* Jobs Display: Grid View (Default) or List / Table View */}
{filteredJobs.length === 0 ? (
  <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 p-12 text-center shadow-xs">
    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
      <Briefcase size={32} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-bold text-[#212b36] dark:text-white mb-1">No jobs found</h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
      We couldn't find any jobs matching your current search and filter criteria.
    </p>
    <button 
      onClick={handleResetFilters}
      className="mt-4 px-4 py-2 bg-[#1890FF] text-white rounded-xl text-xs font-bold hover:bg-[#096dd9] transition-colors cursor-pointer"
    >
      Clear all filters
    </button>
  </div>
) : viewMode === 'card' ? (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
    {paginatedJobs.map((job, index) => {

      return (
        <div 
          key={job.id} 
          onClick={() => navigate('/dashboard/agencies', { state: { jobData: job } })}
          className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group cursor-pointer relative"
        >
          {/* Card Top Header: Briefcase, Job Title + Status, Subtitle (Company, Location, Dept, Type, Exp), and Actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50/80 dark:bg-gray-800 flex items-center justify-center text-[#1890FF] shrink-0 border border-blue-100/50 dark:border-gray-700/60 shadow-xs mt-0.5">
                <Briefcase size={18} />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                {/* First line: Job Title + Status */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors leading-snug">
                    {job.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getStatusColor(job.status)} inline-flex items-center gap-1 shrink-0`}>
                    <span className="w-1 h-1 rounded-full bg-current"></span>
                    {job.status}
                  </span>
                </div>

                {/* Subtitle Line 1: Company Name & Location */}
                <div className="flex items-center gap-2 flex-wrap text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-200">
                    <Building2 size={12} className="text-gray-400 shrink-0" />
                    {job.company}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-gray-400 shrink-0" /> {job.location}
                  </span>
                </div>

                {/* Subtitle Line 2: Department, Employment Type and Experience in a single line */}
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  <span>{job.department}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <span>{job.type}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded text-[11px]">
                    <Award size={11} className="shrink-0" /> {job.experience} exp
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Favorite, Follow Up & 3-Dots Menu */}
            <div className="flex items-center gap-1.5 relative shrink-0">
              {/* Favorite Button */}
              <button 
                type="button"
                onClick={(e) => handleToggleFav(job, e)}
                title={isItemFavorited('Job', job.id) ? 'Favorited (Click to remove)' : 'Add to Favorites'}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs border ${
                  isItemFavorited('Job', job.id)
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50'
                    : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50/60 dark:hover:bg-amber-950/30 border-transparent hover:border-amber-200/50'
                }`}
              >
                <Star size={14} className={isItemFavorited('Job', job.id) ? 'fill-amber-400 text-amber-500' : ''} />
              </button>


              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenActionMenuId(openActionMenuId === job.id ? null : job.id);
                }}
                className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                title="Actions"
              >
                <MoreVertical size={16} />
              </button>

              {openActionMenuId === job.id && (
                <div className="absolute right-0 top-9 w-48 bg-white dark:bg-[#212b36] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800 z-50 overflow-hidden py-1 animate-fade-in text-left">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJobForAgency(job);
                      setIsSendAgencyModalOpen(true);
                      setOpenActionMenuId(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-[#00A76F] hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Send size={14} /> Send to Agency
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJobToView(job);
                      setIsViewJobModalOpen(true);
                      setOpenActionMenuId(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileText size={14} /> View Job
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(null); }}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Copy size={14} /> Copy Link
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenActionMenuId(null);
                      navigate('/dashboard/agencies', { state: { jobData: job, tab: 'Job Setup' } });
                    }}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Edit size={14} /> Edit Job
                  </button>
                  <div className="my-1 border-t border-gray-100 dark:border-gray-800/50"></div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(null); }}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Skills (5/6 pills) */}
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/60">
              {job.skills.map((skill, sIdx) => (
                <span 
                  key={sIdx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 border border-gray-200/70 dark:border-gray-700/60 hover:border-[#1890FF]/40 hover:text-[#1890FF] transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Card Pipeline Bar */}
          <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/60">
            <JobPipelineDisplay job={job} width="w-full" />
          </div>

          {/* Card Bottom: Stats */}
          <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Total Application:</span>
              <span className="font-bold text-[#212b36] dark:text-white tabular-nums">{job.applicants.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Open:</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300 tabular-nums">{job.daysOpen} days</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Average match:</span>
              <span className="font-bold text-[#00A76F] dark:text-[#22c55e] tabular-nums">{job.avgMatch}</span>
            </div>
          </div>
        </div>
      );
    })}
  </div>
) : (
  <div className="bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800/50">
            <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-400 min-w-[360px]">Job Details</th>
            <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-400 min-w-[330px]">Pipeline</th>
            <th className="px-6 py-4 text-xs font-bold text-black dark:text-gray-400 min-w-[200px]">Stats</th>
            <th className="px-6 py-4 text-center text-xs font-bold text-black dark:text-gray-400 w-24">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700/70">
          {paginatedJobs.map((job, index) => {

            return (
              <tr 
                key={job.id} 
                onClick={() => navigate('/dashboard/agencies', { state: { jobData: job } })}
                className={`hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors group cursor-pointer border-b border-gray-200 dark:border-gray-700/70 last:border-b-0 ${openActionMenuId === job.id ? 'relative z-40' : ''}`}
              >
                <td className="px-6 py-4.5 min-w-[360px]">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50/80 dark:bg-gray-800 flex items-center justify-center text-[#1890FF] shrink-0 mt-0.5 border border-blue-100/50 dark:border-gray-700/60 shadow-xs">
                      <Briefcase size={18} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      {/* Line 1: Title, Company, Status */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-[#212b36] dark:text-white group-hover:text-[#1890FF] transition-colors cursor-pointer">
                          {job.title}
                        </span>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          <Building2 size={11} className="text-gray-400" />
                          {job.company}
                        </span>

                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getStatusColor(job.status)} inline-flex items-center gap-1`}>
                          <span className="w-1 h-1 rounded-full bg-current"></span>
                          {job.status}
                        </span>
                      </div>

                      {/* Line 2: Location, Dept, Type, Experience, Days open, Average match */}
                      <div className="flex items-center gap-2 flex-wrap text-xs font-medium text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-gray-400" /> {job.location}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        <span>{job.department}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        <span>{job.type}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>

                        {/* Experience */}
                        <span className="inline-flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-200 bg-amber-500/10 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-[11px]">
                          <Award size={11} /> {job.experience} exp
                        </span>
                      </div>

                      {/* Line 3: Skills (5/6 tags) */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {job.skills.map((skill, sIdx) => (
                            <span 
                              key={sIdx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 border border-gray-200/70 dark:border-gray-700/60 hover:border-[#1890FF]/40 hover:text-[#1890FF] transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                {/* Pipeline Stage Funnel Bar Column */}
                <td className="px-6 py-4.5 whitespace-nowrap min-w-[330px]">
                  <JobPipelineDisplay job={job} width="w-[330px]" />
                </td>

                <td className="px-6 py-4.5 whitespace-nowrap">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Total Application:</span>
                      <span className="font-bold text-[#212b36] dark:text-white tabular-nums">
                        {job.applicants.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Open:</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
                        {job.daysOpen} days
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Average match:</span>
                      <span className="font-bold text-[#00A76F] dark:text-[#22c55e] tabular-nums">
                        {job.avgMatch}
                      </span>
                    </div>
                  </div>
                </td>
                <td className={`px-6 py-4.5 ${openActionMenuId === job.id ? 'relative z-50' : ''}`}>
                  <div className="flex items-center justify-center gap-1.5 relative">
                    {/* Favorite Button */}
                    <button 
                      type="button"
                      onClick={(e) => handleToggleFav(job, e)}
                      title={isItemFavorited('Job', job.id) ? 'Favorited (Click to remove)' : 'Add to Favorites'}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs border ${
                        isItemFavorited('Job', job.id)
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50'
                          : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50/60 dark:hover:bg-amber-950/30 border-transparent hover:border-amber-200/50'
                      }`}
                    >
                      <Star size={14} className={isItemFavorited('Job', job.id) ? 'fill-amber-400 text-amber-500' : ''} />
                    </button>

                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(openActionMenuId === job.id ? null : job.id);
                      }}
                      className="p-2 text-black hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                      title="Actions"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openActionMenuId === job.id && (
                      <div className={`absolute right-0 ${index >= paginatedJobs.length - 2 && paginatedJobs.length > 2 ? 'bottom-full mb-1' : 'top-10 mt-1'} w-48 bg-white dark:bg-[#212b36] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800 z-50 overflow-hidden py-1 animate-fade-in text-left`}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJobForAgency(job);
                            setIsSendAgencyModalOpen(true);
                            setOpenActionMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-[#00A76F] hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Send size={14} />
                          Send to Agency
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJobToView(job);
                            setIsViewJobModalOpen(true);
                            setOpenActionMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <FileText size={14} />
                          View Job
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(null); }}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Copy size={14} />
                          Copy Link
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(null);
                            navigate('/dashboard/agencies', { state: { jobData: job, tab: 'Job Setup' } });
                          }}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Edit size={14} />
                          Edit Job
                        </button>
                        <div className="my-1 border-t border-gray-100 dark:border-gray-800/50"></div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(null); }}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-[#FF5630] hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
)}

{filteredJobs.length > 0 && (
  <div className="bg-white dark:bg-[#161c24] px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800/50 shadow-xs flex items-center justify-between">
    <span className="text-sm text-black dark:text-gray-400 font-medium">
      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
    </span>
    <div className="flex gap-1 items-center">
      <span className="text-sm text-black dark:text-gray-400 font-medium mr-2">
        Page {currentPage} of {totalPages}
      </span>
      <button 
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium transition-colors ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'}`}
      >
        Previous
      </button>
      <button 
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium transition-colors ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#212b36] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'}`}
      >
        Next
      </button>
    </div>
  </div>
)}
        </div>
      </div>
    </div>

    {/* Send to Agency Modal */}
 {isSendAgencyModalOpen && createPortal(
 <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
 <div className="bg-white dark:bg-[#212b36] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col scale-in-center">
 
 <div className="p-6 border-b border-gray-100 dark:border-gray-800/50 flex justify-between items-center bg-gray-50 dark:bg-gray-800/10">
 <h2 className="text-xl font-bold text-[#212b36] dark:text-white flex items-center gap-2">
 <Send size={24} className="text-[#00A76F]" />
 Send to Agency
 </h2>
 <button 
 onClick={() => setIsSendAgencyModalOpen(false)}
 className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors cursor-pointer"
 >
 <X size={20} />
 </button>
 </div>
 
 <div className="p-6 overflow-visible space-y-4">
 <p className="text-sm text-black dark:text-gray-400">
 You are sending <span className="font-bold text-[#212b36] dark:text-white">{selectedJobForAgency?.title}</span> to an agency partner.
 </p>
 
 <div className="flex flex-col">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Select Agency</label>
 <SearchableSelect 
 options={[
 { label: 'Adecco', value: 'Adecco' },
 { label: 'Randstad', value: 'Randstad' },
 { label: 'ManpowerGroup', value: 'ManpowerGroup' },
 { label: 'Kelly Services', value: 'Kelly Services' }
 ]}
 value={sendAgencyData.agency}
 onChange={(val) => setSendAgencyData({...sendAgencyData, agency: val})}
 placeholder="Select an agency..."
 />
 </div>

 <div className="flex flex-col">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Message / Instructions</label>
 <textarea 
 value={sendAgencyData.message}
 onChange={(e) => setSendAgencyData({...sendAgencyData, message: e.target.value})}
 rows="4"
 className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-sm focus:outline-none focus:ring-0 focus:border-[#1890FF] transition-colors resize-y text-[#212b36] dark:text-white"
 placeholder="Enter any specific requirements, priority notes, or guidelines..."
 ></textarea>
 </div>
 </div>

 </div>
 <div className="p-6 border-t border-gray-100 dark:border-gray-800/50 flex justify-between items-center bg-gray-50 dark:bg-gray-800/10 rounded-b-2xl">
 <button 
 onClick={() => setModalStep(1)}
 className="px-5 py-2.5 text-sm font-bold text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
 >
 Back
 </button>
 <div className="flex gap-3">

 <button 
 onClick={() => setIsSendAgencyModalOpen(false)}
 className="px-5 py-2.5 text-sm font-bold text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
 >
 Cancel
 </button>
 <button 
 disabled={!sendAgencyData.agency}
 onClick={() => {
 setCustomAlert({
 title: 'Request Sent Successfully',
 message: `Job "${selectedJobForAgency?.title}" has been sent to ${sendAgencyData.agency}!`
 });
 setIsSendAgencyModalOpen(false);
 setSendAgencyData({ agency: '', message: '' });
 }}
 className={`px-5 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm transition-colors cursor-pointer ${sendAgencyData.agency ? 'bg-[#00A76F] hover:bg-[#00A76F]/90' : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'}`}
 >
 Send Request
 </button>
 </div>
 </div>
 </div>,
 document.body
 )}

 {/* Custom Alert Modal */}
 {customAlert && createPortal(
 <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
 <div className="bg-white dark:bg-[#212b36] rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col scale-in-center items-center text-center p-8 border border-gray-100 dark:border-gray-800/50">
 <div className="w-20 h-20 bg-[#00A76F]/10 text-[#00A76F] rounded-full flex items-center justify-center mb-6">
 <CheckCircle size={40} />
 </div>
 <h3 className="text-2xl font-bold text-[#212b36] dark:text-white mb-3">{customAlert.title}</h3>
 <p className="text-black dark:text-gray-400 mb-8 text-[15px] leading-relaxed">
 {customAlert.message}
 </p>
 <button 
 onClick={() => setCustomAlert(null)}
 className="w-full py-3.5 text-[15px] font-bold text-white bg-[#00A76F] hover:bg-[#00A76F]/90 rounded-xl shadow-[0_8px_16px_rgba(0,167,111,0.24)] transition-all cursor-pointer"
 >
 Done
 </button>
 </div>
 </div>,
 document.body
 )}

 {/* Create Job Modal */}
 {isCreateModalOpen && createPortal(
 <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
 <div className="bg-white dark:bg-[#161c24] w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800/50 flex flex-col max-h-[90vh]">
 <div className="p-6 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
 <h2 className="text-lg font-bold text-[#212b36] dark:text-white">{editingJobId ? 'Edit Job' : 'Create New Job'}</h2>
 <button 
 onClick={handleCloseModal}
 className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
 >
 <X size={20} />
 </button>
 </div>
 
 
 {modalStep === 1 ? (
 <div className="p-8 overflow-y-auto flex flex-col items-center justify-center min-h-[400px]">
 {isExtracting ? (
 <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
 <div className="relative">
 <div className="w-20 h-20 border-4 border-[#1890FF]/20 rounded-full"></div>
 <div className="w-20 h-20 border-4 border-[#1890FF] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
 <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#1890FF]" size={32} />
 </div>
 <div className="text-center">
 <h3 className="text-xl font-bold text-[#212b36] dark:text-white mb-2">Analyzing Job Description</h3>
 <p className="text-black text-sm">Our AI is extracting key details to pre-fill your form...</p>
 </div>
 </div>
 ) : (
 <div className="w-full max-w-md space-y-8 animate-fade-in">
 <div className="text-center">
 <h3 className="text-2xl font-bold text-[#212b36] dark:text-white mb-2">Let's create a new job</h3>
 <p className="text-black text-sm">Provide a job description to automatically populate the details.</p>
 </div>
 
 <div className="space-y-5">
 <div 
 onClick={() => document.getElementById('jd-upload').click()}
 onDragOver={handleDragOver}
 onDragLeave={handleDragLeave}
 onDrop={handleDrop}
 className={`relative flex flex-col items-center justify-center py-5 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${isDragging ? 'border-[#1890FF] bg-[#1890FF]/5' : 'border-gray-200 dark:border-gray-700 hover:border-[#1890FF] hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
 >
 <input 
 id="jd-upload" 
 type="file" 
 className="hidden" 
 accept=".pdf,.doc,.docx,.txt"
 onChange={(e) => handleFileUpload(e.target.files[0])}
 />
 <div className="w-10 h-10 bg-[#1890FF]/10 text-[#1890FF] rounded-full flex items-center justify-center mb-2">
 <UploadCloud size={20} />
 </div>
 <h4 className="font-bold text-[#212b36] dark:text-white text-sm mb-1">Upload Job Description</h4>
 <p className="text-[11px] text-black text-center">Drag & drop or click (PDF, DOCX, TXT)</p>
 </div>
 
 <div className="relative flex items-center">
 <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
 <span className="flex-shrink-0 mx-4 text-xs font-bold text-[#212b36] dark:text-gray-300">OR PASTE TEXT</span>
 <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
 </div>
 
 <div className="space-y-3">
 <textarea 
 value={newJobData.jdText}
 onChange={(e) => setNewJobData({...newJobData, jdText: e.target.value})}
 className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-[#161c24] border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-0 focus:border-[#1890FF] transition-colors resize-none text-[#212b36] dark:text-white"
 placeholder="Paste your job description text here..."
 ></textarea>
 <button 
 disabled={!newJobData.jdText.trim()}
 onClick={() => {
 setSkippedJdUpload(false);
 simulateExtraction();
 }}
 className={`w-full flex justify-center items-center gap-2 py-3 text-sm font-bold text-white rounded-xl transition-colors ${newJobData.jdText.trim() ? 'bg-[#1890FF] hover:bg-[#1890FF]/90 cursor-pointer shadow-[0_4px_12px_rgba(24,144,255,0.24)]' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed shadow-none'}`}
 >
 <BrainCircuit size={16} />
 Extract & Continue
 </button>
 </div>
 
 <div className="pt-2 text-center">
 <button 
 onClick={() => {
 setSkippedJdUpload(true);
 setNewJobData({
 title: '',
 department: '',
 location: '',
 type: 'Full-time',
 workMode: 'On-site',
 hiringManager: '',
 jdText: '',
 jdFile: null
 });
 setModalStep(2);
 }}
 className="text-sm font-bold text-[#212b36] dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
 >
 Skip and fill manually <ArrowRight size={14} />
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 ) : (

 <>
<div className="p-6 overflow-y-auto space-y-4 flex-1">
 <div className="flex flex-col">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Job Title</label>
 <input 
 type="text" 
 value={newJobData.title}
 onChange={(e) => {
 setNewJobData({...newJobData, title: e.target.value});
 if (errors.title) setErrors({...errors, title: null});
 }}
 className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-sm focus:outline-none focus:ring-0 transition-colors ${errors.title ? 'border-[#FF5630] focus:border-[#FF5630]' : 'border-gray-200 dark:border-gray-700/50 focus:border-[#1890FF]'} text-[#212b36] dark:text-white`}
 placeholder="e.g. Senior Frontend Engineer"
 />
 <div className="min-h-[20px] mt-1 flex items-start">
 {errors.title && <p className="text-[#FF5630] text-xs animate-fade-in">{errors.title}</p>}
 </div>
 </div>
 
 <div className="grid grid-cols-2 gap-4">
 <div className="flex flex-col">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Department</label>
 <input 
 type="text" 
 value={newJobData.department}
 onChange={(e) => {
 setNewJobData({...newJobData, department: e.target.value});
 if (errors.department) setErrors({...errors, department: null});
 }}
 className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-sm focus:outline-none focus:ring-0 transition-colors ${errors.department ? 'border-[#FF5630] focus:border-[#FF5630]' : 'border-gray-200 dark:border-gray-700/50 focus:border-[#1890FF]'} text-[#212b36] dark:text-white`}
 placeholder="e.g. Engineering"
 />
 <div className="min-h-[20px] mt-1 flex items-start">
 {errors.department && <p className="text-[#FF5630] text-xs animate-fade-in">{errors.department}</p>}
 </div>
 </div>
 <div className="flex flex-col">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Employment Type</label>
 <SearchableSelect 
 options={[
 { label: 'Full-time', value: 'Full-time' },
 { label: 'Part-time', value: 'Part-time' },
 { label: 'Contract', value: 'Contract' },
 { label: 'Hybrid', value: 'Hybrid' }
 ]}
 value={newJobData.type}
 onChange={(value) => setNewJobData({...newJobData, type: value})}
 placeholder="Select employment type..."
 />
 <div className="min-h-[20px] mt-1"></div>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="flex flex-col">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Work Mode</label>
 <SearchableSelect 
 options={[
 { label: 'On-site', value: 'On-site' },
 { label: 'Hybrid', value: 'Hybrid' },
 { label: 'Remote', value: 'Remote' }
 ]}
 value={newJobData.workMode}
 onChange={(value) => setNewJobData({...newJobData, workMode: value})}
 placeholder="Select work mode..."
 />
 <div className="min-h-[20px] mt-1"></div>
 </div>

 <div className="flex flex-col">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Location (City, Country)</label>
 <input 
 type="text" 
 value={newJobData.location}
 onChange={(e) => {
 setNewJobData({...newJobData, location: e.target.value});
 if (errors.location) setErrors({...errors, location: null});
 }}
 className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-sm focus:outline-none focus:ring-0 transition-colors ${errors.location ? 'border-[#FF5630] focus:border-[#FF5630]' : 'border-gray-200 dark:border-gray-700/50 focus:border-[#1890FF]'} text-[#212b36] dark:text-white`}
 placeholder="e.g. San Francisco, CA or Remote"
 />
 <div className="min-h-[20px] mt-1 flex items-start">
 {errors.location && <p className="text-[#FF5630] text-xs animate-fade-in">{errors.location}</p>}
 </div>
 </div>
 </div>

 {skippedJdUpload && (
 <div className="flex flex-col mt-4">
 <label className="block text-sm font-bold text-[#212b36] dark:text-white mb-1.5">Job Description File (Optional)</label>
 <div 
 onClick={() => document.getElementById('jd-upload-manual').click()}
 onDragOver={handleDragOver}
 onDragLeave={handleDragLeave}
 onDrop={handleDrop}
 className={`relative flex flex-col items-center justify-center py-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${isDragging ? 'border-[#1890FF] bg-[#1890FF]/5' : 'border-gray-200 dark:border-gray-700 hover:border-[#1890FF] hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
 >
 <input 
 id="jd-upload-manual" 
 type="file" 
 className="hidden" 
 accept=".pdf,.doc,.docx,.txt"
 onChange={(e) => {
 if (e.target.files && e.target.files[0]) {
 handleFileUpload(e.target.files[0]);
 }
 }}
 />
 <div className="flex flex-col items-center gap-1">
 <UploadCloud size={20} className="text-[#1890FF] mb-1" />
 <span className="text-sm font-medium text-[#212b36] dark:text-white">
 {newJobData.jdFile ? newJobData.jdFile.name : 'Upload Document (PDF, DOC, TXT)'}
 </span>
 {!newJobData.jdFile && (
 <span className="text-xs text-black">Drag & drop or click to upload</span>
 )}
 </div>
 </div>
 </div>
 )}
 </div>

 <div className="p-6 border-t border-gray-100 dark:border-gray-800/50 flex justify-between items-center bg-gray-50 dark:bg-gray-800/10 rounded-b-2xl">
 <button 
 onClick={() => setModalStep(1)}
 className="px-5 py-2.5 text-sm font-bold text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
 >
 Back
 </button>
 <div className="flex gap-3">
 <button 
 onClick={handleCloseModal}
 className="px-5 py-2.5 text-sm font-bold text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
 >
 Cancel
 </button>
 <button 
 onClick={() => {
 if (validate()) {
 if (editingJobId) {
 setJobs(jobs.map(j => j.id === editingJobId ? { ...j, ...newJobData } : j));
 setSuccessMessage(`Job "${newJobData.title}" updated successfully!`);
 } else {
 const newJob = {
 id: Math.max(...jobs.map(j => j.id), 0) + 1,
 ...newJobData,
 status: 'Draft',
 applicants: 0,
 newApplicants: 0,
 postedDate: new Date().toISOString().split('T')[0],
 score: 0
 };
 setJobs([...jobs, newJob]);
 setSuccessMessage(`Job "${newJobData.title}" created successfully!`);
 navigate('/dashboard/agencies', { state: { tab: 'Job Setup', jobData: newJob, from: { name: 'Job List', path: '/dashboard/jobs' } } });
 }
 setTimeout(() => setSuccessMessage(null), 4000);
 handleCloseModal();
 }
 }}
 className="px-5 py-2.5 text-sm font-bold text-white bg-[#1890FF] hover:bg-[#1890FF]/90 rounded-lg shadow-sm transition-colors cursor-pointer"
 >
 {editingJobId ? 'Update Job' : 'Create & Continue Setup'}
 </button>
 </div>
 </div>
 </>
 )}
            </div>
          </div>,
          document.body
        )}

      {/* Follow Up Modal */}
      <FollowUpModal
        isOpen={Boolean(followUpTarget)}
        onClose={() => setFollowUpTarget(null)}
        targetItem={followUpTarget}
        onFollowupAdded={() => setFavRefreshKey(k => k + 1)}
      />

      {/* CUSTOMIZED FOLLOW CONFIRMATION NOTIFICATION */}
      {followConfirmation && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3.5 px-4 py-3.5 bg-white dark:bg-[#161c24] text-[#212b36] dark:text-white rounded-2xl shadow-2xl border border-[#1890FF]/30 dark:border-gray-800 animate-fade-in max-w-md">
          <div className="w-10 h-10 rounded-xl bg-[#1890FF]/15 text-[#1890FF] flex items-center justify-center shrink-0">
            <Bookmark size={20} className={followConfirmation.isUnfollow ? '' : 'fill-[#1890FF]'} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-[#212b36] dark:text-white">
              {followConfirmation.isUnfollow ? `Unfollowed ${followConfirmation.name}` : `Following ${followConfirmation.name}`}
            </h4>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
              {followConfirmation.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFollowConfirmation(null)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* View Job Modal */}
 {isViewJobModalOpen && selectedJobToView && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
 <div className="bg-white dark:bg-[#161c24] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
 <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
 <div>
 <h2 className="text-xl font-bold text-[#212b36] dark:text-white">{selectedJobToView.title}</h2>
 <p className="text-sm text-gray-500 mt-1">{selectedJobToView.department} • {selectedJobToView.type} • {selectedJobToView.location}</p>
 </div>
 <button onClick={() => setIsViewJobModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
 <X size={20} />
 </button>
 </div>
 <div className="p-6 space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div><p className="text-xs text-gray-500">Status</p><p className="text-sm font-bold text-[#212b36] dark:text-white">{selectedJobToView.status}</p></div>
 <div><p className="text-xs text-gray-500">Posted Date</p><p className="text-sm font-bold text-[#212b36] dark:text-white">{selectedJobToView.postedDate}</p></div>
 <div><p className="text-xs text-gray-500">Hiring Manager</p><p className="text-sm font-bold text-[#212b36] dark:text-white">{selectedJobToView.hiringManager}</p></div>
 <div><p className="text-xs text-gray-500">Active Candidates</p><p className="text-sm font-bold text-[#212b36] dark:text-white">{selectedJobToView.applicants}</p></div>
 </div>
 </div>
 </div>
        </div>,
        document.body
      )}

 {/* Toast Notification */}
 {successMessage && createPortal(
        <div className="fixed top-6 right-6 z-[9999] bg-white dark:bg-[#161c24] border border-[#00A76F]/20 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-4 flex items-center gap-4 animate-fade-in transform transition-all">
 <div className="w-10 h-10 rounded-full bg-[#00A76F]/10 flex items-center justify-center text-[#00A76F] shrink-0">
 <CheckCircle size={20} />
 </div>
 <div className="pr-2">
 <h4 className="text-sm font-bold text-[#212b36] dark:text-white">Success</h4>
 <p className="text-xs font-medium text-black dark:text-gray-400 mt-0.5">{successMessage}</p>
 </div>
 <button onClick={() => setSuccessMessage(null)} className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
 <X size={16} />
 </button>
 </div>,
        document.body
      )}
 </>
 );
}
