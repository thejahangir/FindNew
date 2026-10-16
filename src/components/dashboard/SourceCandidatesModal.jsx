import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const SOURCE_APPLICATIONS_DATA = {
  'Northstar Talent': [
    {
      id: 'maya-chen',
      name: 'Maya Chen',
      email: 'maya.chen@example.test',
      source: 'Northstar Talent',
      date: 'Oct 8, 2026',
      status: 'Considered'
    },
    {
      id: 'jordan-lee',
      name: 'Jordan Lee',
      email: 'jordan.lee@example.test',
      source: 'Northstar Talent',
      date: 'Oct 7, 2026',
      status: 'Awaiting review'
    }
  ],
  'Summit Search': [
    {
      id: 'elena-rostova',
      name: 'Elena Rostova',
      email: 'elena.rostova@example.test',
      source: 'Summit Search',
      date: 'Oct 6, 2026',
      status: 'Considered'
    },
    {
      id: 'devansh-patel',
      name: 'Devansh Patel',
      email: 'devansh.patel@example.test',
      source: 'Summit Search',
      date: 'Oct 4, 2026',
      status: 'Awaiting review'
    }
  ],
  'Ledger Recruitment': [
    {
      id: 'marcus-vance',
      name: 'Marcus Vance',
      email: 'marcus.vance@example.test',
      source: 'Ledger Recruitment',
      date: 'Sep 25, 2026',
      status: 'Considered'
    },
    {
      id: 'liam-oconnor',
      name: 'Liam O\'Connor',
      email: 'liam.oconnor@example.test',
      source: 'Ledger Recruitment',
      date: 'Sep 24, 2026',
      status: 'Awaiting review'
    }
  ],
  'Careers website': [
    {
      id: 'sophia-kim',
      name: 'Sophia Kim',
      email: 'sophia.kim@example.test',
      source: 'Careers website',
      date: 'Aug 5, 2026',
      status: 'Considered'
    },
    {
      id: 'daniel-zhang',
      name: 'Daniel Zhang',
      email: 'daniel.zhang@example.test',
      source: 'Careers website',
      date: 'Aug 4, 2026',
      status: 'Awaiting review'
    }
  ],
  'LinkedIn': [
    {
      id: 'sneha-patil',
      name: 'Sneha Patil',
      email: 'sneha.patil@example.test',
      source: 'LinkedIn',
      date: 'Aug 12, 2026',
      status: 'Considered'
    },
    {
      id: 'rahul-verma',
      name: 'Rahul Verma',
      email: 'rahul.verma@example.test',
      source: 'LinkedIn',
      date: 'Aug 11, 2026',
      status: 'Awaiting review'
    }
  ],
  'Indeed': [
    {
      id: 'zara-almansoor',
      name: 'Zara Al-Mansoor',
      email: 'zara.almansoor@example.test',
      source: 'Indeed',
      date: 'Aug 19, 2026',
      status: 'Awaiting review'
    },
    {
      id: 'kavita-iyer',
      name: 'Kavita Iyer',
      email: 'kavita.iyer@example.test',
      source: 'Indeed',
      date: 'Aug 18, 2026',
      status: 'Considered'
    }
  ],
  'Internal Referral': [
    {
      id: 'ananya-sharma',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@example.test',
      source: 'Internal Referral',
      date: 'Oct 8, 2026',
      status: 'Considered'
    },
    {
      id: 'pooja-iyer',
      name: 'Pooja Iyer',
      email: 'pooja.iyer@example.test',
      source: 'Internal Referral',
      date: 'Oct 5, 2026',
      status: 'Awaiting review'
    }
  ],
  'Unattributed': [
    {
      id: 'varun-khanna',
      name: 'Varun Khanna',
      email: 'varun.khanna@example.test',
      source: 'Unattributed',
      date: 'Sep 30, 2026',
      status: 'Awaiting review'
    },
    {
      id: 'amit-singh',
      name: 'Amit Singh',
      email: 'amit.singh@example.test',
      source: 'Unattributed',
      date: 'Sep 28, 2026',
      status: 'Considered'
    }
  ]
};

export default function SourceCandidatesModal({
  open,
  onClose,
  childSource
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !childSource) return null;

  const childName = childSource.name || 'Northstar Talent';
  const candidates = SOURCE_APPLICATIONS_DATA[childName] || [
    {
      id: 'maya-chen',
      name: 'Maya Chen',
      email: 'maya.chen@example.test',
      source: childName,
      date: 'Oct 8, 2026',
      status: 'Considered'
    },
    {
      id: 'jordan-lee',
      name: 'Jordan Lee',
      email: 'jordan.lee@example.test',
      source: childName,
      date: 'Oct 7, 2026',
      status: 'Awaiting review'
    }
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#161c24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 pt-5 pb-3.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Title & Subtitle */}
            <div className="min-w-0">
              <div
                role="heading"
                aria-level={2}
                className="text-base sm:text-lg font-bold text-[#212b36] dark:text-white leading-none"
                style={{ textTransform: 'none' }}
              >
                Applications from {childName}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1 truncate">
                {childSource.totalVolume} candidates · {childSource.totalQualified} considered · {childSource.totalRate}%
              </p>
            </div>

            {/* Right: Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Candidates List */}
        <div className="px-5 sm:px-6 py-1 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="grid grid-cols-12 gap-4 items-center py-2.5 px-2.5 -mx-2.5 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 rounded-xl transition-colors"
            >
              {/* Column 1: Candidate Name & Email */}
              <div className="col-span-5 min-w-0">
                <div className="text-sm font-bold text-[#212b36] dark:text-white leading-snug truncate">
                  {cand.name}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5 truncate">
                  {cand.email}
                </div>
              </div>

              {/* Column 2: Source & Date */}
              <div className="col-span-4 min-w-0 text-left">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 leading-snug truncate">
                  {cand.source}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-normal mt-0.5 truncate">
                  {cand.date}
                </div>
              </div>

              {/* Column 3: Status Pill (Left-aligned within its column track) */}
              <div className="col-span-3 flex items-center justify-start min-w-0">
                {cand.status === 'Considered' ? (
                  <span className="inline-flex items-center text-[12px] font-semibold text-[#13854e] dark:text-emerald-400 bg-[#e8f8f0] dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-[#c3ecd7]/60 dark:border-emerald-900/40 leading-none shrink-0">
                    Considered
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[12px] font-semibold text-[#a46d1b] dark:text-amber-400 bg-[#fef7ea] dark:bg-amber-950/50 px-3 py-1 rounded-full border border-[#fae7c5]/60 dark:border-amber-900/40 leading-none shrink-0">
                    Awaiting review
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer Note */}
        <div className="px-5 sm:px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 shrink-0">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-normal leading-relaxed">
            Sample rows shown for this prototype; production opens the full filtered application list.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-normal mt-2">
            {candidates.length} example candidates
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
