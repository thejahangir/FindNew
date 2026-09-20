import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

const MOCK_CANDIDATES = [
  { id: 'c1', type: 'Candidate', title: 'Ananya Sharma', subtitle: 'Technical Interview' },
  { id: 'c2', type: 'Candidate', title: 'Rahul Verma', subtitle: 'Culture Fit' },
  { id: 'c3', type: 'Candidate', title: 'Priya Patel', subtitle: 'Application Review' },
  { id: 'c4', type: 'Candidate', title: 'Arjun Kumar', subtitle: 'Reference Check' },
  { id: 'c5', type: 'Candidate', title: 'Ravi Desai', subtitle: 'Applied' },
  { id: 'c6', type: 'Candidate', title: 'Sneha Patil', subtitle: 'Screening' },
  { id: 'c7', type: 'Candidate', title: 'Karan Mehra', subtitle: 'Interviewing' },
  { id: 'c8', type: 'Candidate', title: 'Ankita Rao', subtitle: 'Offer' },
  { id: 'c9', type: 'Candidate', title: 'Varun Khanna', subtitle: 'Applied' },
  { id: 'c10', type: 'Candidate', title: 'Pooja Iyer', subtitle: 'Screening' },
  { id: 'c11', type: 'Candidate', title: 'Divya Singh', subtitle: 'Technical Interview' },
  { id: 'c12', type: 'Candidate', title: 'Nitin Gupta', subtitle: 'Put On Hold' },
  { id: 'c13', type: 'Candidate', title: 'Neha Sharma', subtitle: 'Applied' },
  { id: 'c14', type: 'Candidate', title: 'Amit Singh', subtitle: 'Screening' },
  { id: 'c15', type: 'Candidate', title: 'Kavita Das', subtitle: 'Reference Check' },
  { id: 'c16', type: 'Candidate', title: 'Rohit Joshi', subtitle: 'Offer' }
];

const MOCK_JOBS = [
  { id: 'j1', type: 'Job', title: 'Senior AI Research Scientist', subtitle: 'Engineering • Bangalore, India' },
  { id: 'j2', type: 'Job', title: 'Product Design Lead', subtitle: 'Design • San Francisco, CA' },
  { id: 'j3', type: 'Job', title: 'VP of Marketing', subtitle: 'Marketing • New York, NY' },
  { id: 'j4', type: 'Job', title: 'Data Engineer', subtitle: 'Data Science • London, UK' },
  { id: 'j5', type: 'Job', title: 'Frontend Developer', subtitle: 'Engineering • Remote' },
  { id: 'j6', type: 'Job', title: 'DevOps Engineer', subtitle: 'Engineering • Bangalore, India' },
  { id: 'j7', type: 'Job', title: 'HR Business Partner', subtitle: 'HR • New York, NY' },
  { id: 'j8', type: 'Job', title: 'Sales Executive', subtitle: 'Sales • London, UK' }
];

const MOCK_AGENCIES = [
  { id: 'a1', type: 'Agency', title: 'TechTalent Partners', subtitle: 'desk@techtalentpartners.com' },
  { id: 'a2', type: 'Agency', title: 'Elite Hiring Solutions', subtitle: 'submissions@elitehiring.com' },
  { id: 'a3', type: 'Agency', title: 'Vanguard Recruitment', subtitle: 'jobs@vanguardrecruit.com' },
  { id: 'a4', type: 'Agency', title: 'Global Recruiters Inc.', subtitle: 'india@globalrecruiters.com' },
  { id: 'a5', type: 'Agency', title: 'NextGen Staffing', subtitle: 'profiles@nextgenstaffing.com' }
];

const mockSearchResults = [...MOCK_CANDIDATES, ...MOCK_JOBS, ...MOCK_AGENCIES];

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 3) {
      const filtered = mockSearchResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.type.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query]);

  return (
    <div ref={wrapperRef} className="hidden lg:flex flex-1 max-w-md mx-4 xl:mx-8 relative">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search candidates, jobs, or agencies..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.length >= 3) setIsOpen(true);
          }}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#161c24] border border-gray-200 dark:border-gray-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1890FF]/20 focus:border-[#1890FF] transition-all text-[#212b36] dark:text-white"
        />
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#212b36] border border-gray-200 dark:border-gray-800/80 rounded-xl shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <ul className="py-1">
                {results.map((result) => (
                  <li 
                    key={result.id}
                    className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800/50 last:border-0"
                  >
                    <div className="text-sm font-bold text-[#212b36] dark:text-white mb-0.5">
                      {result.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {result.type} • {result.subtitle}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No results found for "{query}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
