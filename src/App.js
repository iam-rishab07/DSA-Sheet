import React, { useState, useEffect, useMemo } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { dsaData } from './data';
import { serviceDsaData, weeklyPlannerData, readinessChecklistData } from './serviceData';
import {
  Search,
  CheckCircle,
  Circle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Trash2,
  Check,
  AlertCircle,
  X,
  Calendar,
  ListTodo,
  Code2,
  Sparkles
} from 'lucide-react';

export default function DSATracker() {
  // --- STATE ---
  // KAIZEN is strictly dark theme
  const darkMode = true;

  // Active sheet tab: 'standard' or 'service'
  const [activeSheet, setActiveSheet] = useState(() => {
    const saved = localStorage.getItem('active_dsa_sheet');
    return saved || 'standard';
  });

  const [serviceSubTab, setServiceSubTab] = useState('questions');

  // Completion status for standard: { [problemTitle]: boolean }
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('dsa_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // Notes state for standard: { [problemTitle]: string }
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('dsa_notes');
    return saved ? JSON.parse(saved) : {};
  });

  // Completion status for service: { [problemTitle]: boolean }
  const [serviceProgress, setServiceProgress] = useState(() => {
    const saved = localStorage.getItem('service_dsa_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // Notes state for service: { [problemTitle]: string }
  const [serviceNotes, setServiceNotes] = useState(() => {
    const saved = localStorage.getItem('service_dsa_notes');
    return saved ? JSON.parse(saved) : {};
  });

  // Space Revision Tracker: { [topic]: { rev1: boolean, rev2: boolean, rev3: boolean, notes: string } }
  const [serviceRevision, setServiceRevision] = useState(() => {
    const saved = localStorage.getItem('service_revision_tracker');
    return saved ? JSON.parse(saved) : {};
  });

  // Mock Interview Tracker: { [company]: { done: boolean, date: string, score: string, difficulty: string, remarks: string } }
  const [serviceMocks, setServiceMocks] = useState(() => {
    const saved = localStorage.getItem('service_mock_tracker');
    return saved ? JSON.parse(saved) : {};
  });

  // Weekly Planner: { [week]: boolean }
  const [serviceWeeklyPlanner, setServiceWeeklyPlanner] = useState(() => {
    const saved = localStorage.getItem('service_weekly_planner');
    return saved ? JSON.parse(saved) : {};
  });

  // Readiness Checklist: { [item]: boolean }
  const [serviceReadiness, setServiceReadiness] = useState(() => {
    const saved = localStorage.getItem('service_readiness_checklist');
    return saved ? JSON.parse(saved) : {};
  });

  // Placement Pipeline: { [company]: { applied: boolean, oa: boolean, tech1: boolean, ... } }
  const [servicePlacements, setServicePlacements] = useState(() => {
    const saved = localStorage.getItem('service_placement_tracker');
    return saved ? JSON.parse(saved) : {};
  });

  // Days active / study streak Mon-Sun: { [day]: boolean }
  const [streakDays, setStreakDays] = useState(() => {
    const saved = localStorage.getItem('service_streak_days');
    return saved ? JSON.parse(saved) : { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false };
  });

  // Weekly Goals: { target: number, revisions: number, mocks: number }
  const [weeklyGoal, setWeeklyGoal] = useState(() => {
    const saved = localStorage.getItem('service_weekly_goal');
    return saved ? JSON.parse(saved) : { target: 0, revisions: 0, mocks: 0 };
  });

  // Custom placement other field value
  const [customPlacementText, setCustomPlacementText] = useState(() => {
    const saved = localStorage.getItem('service_custom_placement_text');
    return saved || '';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, completed, incomplete
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // all, Easy, Medium, Hard

  // Collapsed categories: { [categoryName]: boolean (true means collapsed) }
  const [expandedCategories, setExpandedCategories] = useState(() => {
    return {};
  });

  // Active note editing problem title: string | null
  const [activeNoteEditing, setActiveNoteEditing] = useState(null);

  // Note text drafts for editing: { [problemTitle]: string }
  const [noteDrafts, setNoteDrafts] = useState({});

  // Status indicator for saved notes: { [problemTitle]: 'saved' | 'saving' | '' }
  const [saveStatus, setSaveStatus] = useState({});

  // Confirmation Reset Modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // --- THEME EFFECT ---
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const favicon = document.getElementById('favicon');
    if (favicon) {
      favicon.href = darkMode ? '/logo_dark_theme.png' : '/logo_light_theme.png';
    }
  }, [darkMode]);

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    localStorage.setItem('active_dsa_sheet', activeSheet);
  }, [activeSheet]);

  useEffect(() => {
    localStorage.setItem('dsa_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('dsa_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('service_dsa_progress', JSON.stringify(serviceProgress));
  }, [serviceProgress]);

  useEffect(() => {
    localStorage.setItem('service_dsa_notes', JSON.stringify(serviceNotes));
  }, [serviceNotes]);

  useEffect(() => {
    localStorage.setItem('service_revision_tracker', JSON.stringify(serviceRevision));
  }, [serviceRevision]);

  useEffect(() => {
    localStorage.setItem('service_mock_tracker', JSON.stringify(serviceMocks));
  }, [serviceMocks]);

  useEffect(() => {
    localStorage.setItem('service_weekly_planner', JSON.stringify(serviceWeeklyPlanner));
  }, [serviceWeeklyPlanner]);

  useEffect(() => {
    localStorage.setItem('service_readiness_checklist', JSON.stringify(serviceReadiness));
  }, [serviceReadiness]);

  useEffect(() => {
    localStorage.setItem('service_placement_tracker', JSON.stringify(servicePlacements));
  }, [servicePlacements]);

  useEffect(() => {
    localStorage.setItem('service_streak_days', JSON.stringify(streakDays));
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem('service_weekly_goal', JSON.stringify(weeklyGoal));
  }, [weeklyGoal]);

  useEffect(() => {
    localStorage.setItem('service_custom_placement_text', customPlacementText);
  }, [customPlacementText]);

  // --- HELPERS ---
  const getProblemUrl = (problem) => {
    if (problem.platform === 'GFG') {
      return `https://www.geeksforgeeks.org/problems/${problem.slug}`;
    }
    return `https://leetcode.com/problems/${problem.slug}/`;
  };

  const toggleProblem = (title) => {
    if (activeSheet === 'service') {
      setServiceProgress(prev => ({
        ...prev,
        [title]: !prev[title]
      }));
    } else {
      setProgress(prev => ({
        ...prev,
        [title]: !prev[title]
      }));
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const expandAll = () => {
    const expanded = {};
    const activeData = activeSheet === 'service' ? serviceDsaData : dsaData;
    Object.keys(activeData).forEach(cat => {
      expanded[cat] = true;
    });
    setExpandedCategories(expanded);
  };

  const collapseAll = () => {
    setExpandedCategories({});
  };

  // Toggle notes editor for a problem using activeNoteEditing
  const handleToggleNoteEditor = (title) => {
    const activeNotes = activeSheet === 'service' ? serviceNotes : notes;
    if (activeNoteEditing === title) {
      setActiveNoteEditing(null);
    } else {
      setActiveNoteEditing(title);
      setNoteDrafts(drafts => ({
        ...drafts,
        [title]: activeNotes[title] || ''
      }));
    }
  };

  // Handle note typing
  const handleNoteChange = (title, text) => {
    setNoteDrafts(prev => ({
      ...prev,
      [title]: text
    }));

    setSaveStatus(prev => ({
      ...prev,
      [title]: 'saving'
    }));
  };

  // Save note on blur or pause
  const saveNote = (title) => {
    const text = noteDrafts[title] || '';
    if (activeSheet === 'service') {
      setServiceNotes(prev => {
        const nextNotes = { ...prev };
        if (text.trim() === '') {
          delete nextNotes[title];
        } else {
          nextNotes[title] = text;
        }
        return nextNotes;
      });
    } else {
      setNotes(prev => {
        const nextNotes = { ...prev };
        if (text.trim() === '') {
          delete nextNotes[title];
        } else {
          nextNotes[title] = text;
        }
        return nextNotes;
      });
    }

    setSaveStatus(prev => ({
      ...prev,
      [title]: 'saved'
    }));

    setTimeout(() => {
      setSaveStatus(prev => ({
        ...prev,
        [title]: ''
      }));
    }, 1500);
  };

  const resetAllProgress = () => {
    if (activeSheet === 'service') {
      setServiceProgress({});
      setServiceNotes({});
      setServiceRevision({});
      setServiceMocks({});
      setServiceWeeklyPlanner({});
      setServiceReadiness({});
      setServicePlacements({});
      setStreakDays({ Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false });
      setWeeklyGoal({ target: 0, revisions: 0, mocks: 0 });
      setCustomPlacementText('');
    } else {
      setProgress({});
      setNotes({});
    }
    setNoteDrafts({});
    setActiveNoteEditing(null);
    setIsResetModalOpen(false);
  };

  // --- STATS COMPUTATIONS ---
  const stats = useMemo(() => {
    const activeData = activeSheet === 'service' ? serviceDsaData : dsaData;
    const activeProgress = activeSheet === 'service' ? serviceProgress : progress;

    let totalCount = 0;
    let completedCount = 0;

    const diffStats = {
      Easy: { total: 0, completed: 0 },
      Medium: { total: 0, completed: 0 },
      Hard: { total: 0, completed: 0 }
    };

    const categoryStats = {};

    Object.entries(activeData).forEach(([category, problems]) => {
      categoryStats[category] = { total: 0, completed: 0 };

      problems.forEach(problem => {
        const isCompleted = !!activeProgress[problem.title];

        totalCount++;
        if (isCompleted) completedCount++;

        const diff = problem.difficulty;
        if (diffStats[diff]) {
          diffStats[diff].total++;
          if (isCompleted) diffStats[diff].completed++;
        }

        categoryStats[category].total++;
        if (isCompleted) categoryStats[category].completed++;
      });
    });

    return {
      totalCount,
      completedCount,
      percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      diffStats,
      categoryStats
    };
  }, [activeSheet, progress, serviceProgress]);

  // --- FILTERED DATA COMPUTATION ---
  const filteredData = useMemo(() => {
    const activeData = activeSheet === 'service' ? serviceDsaData : dsaData;
    const activeProgress = activeSheet === 'service' ? serviceProgress : progress;

    const result = {};
    let matchedCount = 0;

    Object.entries(activeData).forEach(([category, problems]) => {
      const filteredProblems = problems.filter(problem => {
        // Search query filter
        const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter (all, completed, incomplete)
        const isCompleted = !!activeProgress[problem.title];
        let matchesStatus = true;
        if (activeFilter === 'completed') matchesStatus = isCompleted;
        if (activeFilter === 'incomplete') matchesStatus = !isCompleted;

        // Difficulty filter
        let matchesDifficulty = true;
        if (difficultyFilter !== 'all') matchesDifficulty = problem.difficulty === difficultyFilter;

        return matchesSearch && matchesStatus && matchesDifficulty;
      });

      if (filteredProblems.length > 0) {
        result[category] = filteredProblems;
        matchedCount += filteredProblems.length;
      }
    });

    return { data: result, count: matchedCount };
  }, [activeSheet, searchQuery, activeFilter, difficultyFilter, progress, serviceProgress]);

  const renderMilestoneCard = (milestoneKey) => {
    const milestones = {
      bronze: {
        title: "Bronze Coder",
        desc: "You finished Arrays, Strings & Hashing!",
        sub: "Keep Going! You are now ahead of thousands of students.",
        topics: 3,
        qs: 24,
        percent: "20%",
        theme: "from-amber-900/20 via-amber-800/10 to-transparent border-amber-800/30 text-amber-400",
        icon: "🏆"
      },
      silver: {
        title: "Silver Coder",
        desc: "You finished Sorting, Binary Search & Linked List!",
        sub: "Keep Going! You are now ahead of thousands of students.",
        topics: 6,
        qs: 48,
        percent: "40%",
        theme: "from-slate-700/25 via-slate-600/15 to-transparent border-slate-700/35 text-slate-300",
        icon: "🥈"
      },
      gold: {
        title: "Gold Coder",
        desc: "You finished Stack, Queue & Trees!",
        sub: "Keep Going! You are now ahead of thousands of students.",
        topics: 9,
        qs: 72,
        percent: "60%",
        theme: "from-yellow-600/20 via-yellow-500/10 to-transparent border-yellow-500/30 text-yellow-500",
        icon: "🥇"
      },
      diamond: {
        title: "Diamond Coder",
        desc: "You finished BST, Heap & Sliding Window!",
        sub: "Keep Going! You are now ahead of thousands of students.",
        topics: 12,
        qs: 96,
        percent: "80%",
        theme: "from-cyan-600/20 via-cyan-500/10 to-transparent border-cyan-500/30 text-cyan-400",
        icon: "💎"
      },
      ready: {
        title: "Interview Ready",
        desc: "You finished Greedy, Graph & Backtracking!",
        sub: "Keep Going! You are now ahead of thousands of students.",
        topics: 15,
        qs: 120,
        percent: "100%",
        theme: "from-teal-500/25 via-emerald-500/15 to-transparent border-emerald-500/35 text-teal-400",
        icon: "🎓"
      }
    };

    const ms = milestones[milestoneKey];
    const isCompleted = stats.completedCount >= ms.qs;

    return (
      <div key={milestoneKey} className={`p-6 rounded-2xl border bg-gradient-to-r ${ms.theme} transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative shadow-lg ${
        isCompleted ? 'opacity-100 scale-100 ring-1 ring-emerald-500/20' : 'opacity-40 select-none'
      }`}>
        <div className="space-y-1.5 relative z-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{ms.icon}</span>
            <h4 className="text-lg font-extrabold tracking-tight uppercase">{ms.title}</h4>
            {isCompleted && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-450 border border-emerald-500/25 uppercase">
                Completed
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-neutral-100">{ms.desc}</p>
          <p className="text-xs text-neutral-400 font-medium">{ms.sub}</p>
        </div>

        <div className="flex items-center gap-4 shrink-0 relative z-5 font-semibold text-xs text-neutral-350">
          <div className="text-center">
            <span className="block text-xxs uppercase tracking-wider text-neutral-500 font-bold">Topics Done</span>
            <span className="text-base font-extrabold text-neutral-200 mt-0.5 block">{ms.topics}/15</span>
          </div>
          <div className="w-px h-8 bg-neutral-900" />
          <div className="text-center">
            <span className="block text-xxs uppercase tracking-wider text-neutral-500 font-bold">Qs Solved</span>
            <span className="text-base font-extrabold text-neutral-200 mt-0.5 block">{ms.qs}/120</span>
          </div>
          <div className="w-px h-8 bg-neutral-900" />
          <div className="text-center">
            <span className="block text-xxs uppercase tracking-wider text-neutral-500 font-bold">Progress</span>
            <span className="text-base font-extrabold text-neutral-200 mt-0.5 block">{ms.percent}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${darkMode ? 'dark bg-black text-neutral-50' : 'bg-slate-50 text-slate-900'} min-h-screen font-sans transition-colors duration-300`}>
      <Analytics />

      {/* HEADER SECTION */}
      <header className="border-b border-slate-200/80 dark:border-neutral-900 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-10 transition-all duration-300 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4.5 flex flex-row items-center justify-between gap-4">

          {/* Logo Title Block */}
          <div className="flex items-center gap-4">
            <img 
              src="/logo_navbar.png" 
              alt="KAIZEN DSA Sheet Logo" 
              className="w-14 h-14 object-contain" 
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent leading-none">
                KAIZEN DSA SHEET
              </h1>
            </div>
          </div>

          {/* Solved Count pill badge in center */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-250 dark:border-neutral-900 bg-slate-50/50 dark:bg-neutral-950/50 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-500 dark:text-neutral-450">Solved:</span>
            <span className="text-slate-800 dark:text-neutral-200 font-bold">
              {stats.completedCount} / {stats.totalCount}
            </span>
          </div>

          {/* Theme toggles and collapse buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={expandAll}
              className={`px-1.5 py-1 text-[10px] sm:px-2.5 sm:py-1 sm:text-xxs font-bold uppercase rounded-md tracking-wider transition-colors ${darkMode
                  ? 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              Expand<span className="hidden sm:inline"> All</span>
            </button>
            <button
              onClick={collapseAll}
              className={`px-1.5 py-1 text-[10px] sm:px-2.5 sm:py-1 sm:text-xxs font-bold uppercase rounded-md tracking-wider transition-colors ${darkMode
                  ? 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              Collapse<span className="hidden sm:inline"> All</span>
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-neutral-900 mx-0.5 sm:mx-1"></div>

            {/* Confirm Reset Open button */}
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="p-1.5 sm:p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Reset All Progress"
            >
              <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* SHEET SWITCHER TAB BAR */}
        <div className="flex justify-center border-b border-neutral-900/60 pb-6 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 p-1.5 bg-neutral-950/80 backdrop-blur-xl border border-neutral-900 rounded-2xl shadow-2xl">
            <button
              onClick={() => setActiveSheet('standard')}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 relative active:scale-95 hover:scale-[1.01] ${
                activeSheet === 'standard'
                  ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-400 border border-indigo-500/30 font-extrabold shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                  : 'border border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              <Code2 className={`w-4 h-4 ${activeSheet === 'standard' ? 'text-indigo-400 animate-pulse' : 'text-neutral-500'}`} />
              <span>Standard DSA (NeetCode 150)</span>
            </button>

            <button
              onClick={() => setActiveSheet('service')}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 relative active:scale-95 hover:scale-[1.01] ${
                activeSheet === 'service'
                  ? 'bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-400 border border-teal-500/30 font-extrabold shadow-[0_0_20px_rgba(20,184,166,0.15)]'
                  : 'border border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeSheet === 'service' ? 'text-teal-400 animate-pulse' : 'text-neutral-550'}`} />
              <span>Service-Based DSA (120+ Qs)</span>
              <span className="px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-extrabold tracking-wider bg-teal-500/15 text-teal-400 border border-teal-500/25 uppercase shrink-0">
                New
              </span>
            </button>
          </div>
        </div>

        {activeSheet === 'service' && (
          <section className="text-center py-8 px-4 space-y-3.5 relative overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950/40">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-emerald-500/5 to-transparent pointer-events-none" />
            <span className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-teal-500/10 border border-teal-500/20 text-teal-450 rounded-full inline-block">
              Placement Special
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 bg-clip-text text-transparent px-4">
              Service-Based Company DSA Sheet
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto px-4 leading-relaxed font-semibold">
              Crack TCS, Infosys, Accenture, Cognizant, Wipro, Capgemini, HCL &amp; More
            </p>
            <p className="text-[10px] sm:text-xxs uppercase tracking-widest text-neutral-500 font-bold">
              120+ Must-Do DSA Questions • Prepared by <span className="text-teal-400 font-extrabold">Vrushabh Gorivale</span>
            </p>
          </section>
        )}

        {/* PROGRESS DASHBOARD */}
        {activeSheet === 'service' ? (
          /* SERVICE SHEET DASHBOARD */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* OVERALL PROGRESS CARD */}
            <div className={`md:col-span-2 p-6 rounded-2xl border transition-all duration-300 ${darkMode ? 'bg-neutral-955 border-neutral-900 shadow-2xl' : 'bg-white border-slate-200/80 shadow-sm'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-1.5">
                    Overall Progress
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 font-semibold">
                    Complete all 120+ questions to master DSA
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-3xl font-extrabold text-teal-400 leading-none">
                    {stats.completedCount} <span className="text-sm font-semibold text-slate-400 dark:text-neutral-500">/ {stats.totalCount}</span>
                  </span>
                  <span className="ml-2.5 px-2.5 py-1 text-xs font-bold rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    {stats.percentage}%
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-slate-200 dark:bg-neutral-900 rounded-full h-2.5 overflow-hidden mb-5">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${stats.percentage}%` }}
                ></div>
              </div>

              {/* Sub-KPI grids */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50 dark:border-neutral-900/50">
                <div className="text-center">
                  <span className="text-xxs font-bold uppercase tracking-wider text-neutral-500 block">Topics Completed</span>
                  <span className="text-base font-extrabold text-neutral-250 mt-0.5 block">
                    {Object.keys(serviceDsaData).filter(cat => serviceDsaData[cat].every(p => serviceProgress[p.title])).length} / 15
                  </span>
                </div>
                <div className="text-center border-l border-slate-200/50 dark:border-neutral-900/50">
                  <span className="text-xxs font-bold uppercase tracking-wider text-neutral-500 block">Questions Solved</span>
                  <span className="text-base font-extrabold text-neutral-250 mt-0.5 block">
                    {stats.completedCount} / 120
                  </span>
                </div>
              </div>
            </div>

            {/* DIFFICULTY PROGRESS CARD */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${darkMode ? 'bg-neutral-955 border-neutral-900 shadow-2xl' : 'bg-white border-slate-200/80 shadow-sm'}`}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">Difficulty Progress</h3>
              <div className="space-y-3.5">
                {/* Easy */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-500">Easy</span>
                    <span className="text-neutral-450">{stats.diffStats.Easy.completed} / {stats.diffStats.Easy.total}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.diffStats.Easy.total > 0 ? (stats.diffStats.Easy.completed / stats.diffStats.Easy.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                {/* Medium */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-500">Medium</span>
                    <span className="text-neutral-450">{stats.diffStats.Medium.completed} / {stats.diffStats.Medium.total}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.diffStats.Medium.total > 0 ? (stats.diffStats.Medium.completed / stats.diffStats.Medium.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                {/* Hard */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-rose-500">Hard</span>
                    <span className="text-neutral-450">{stats.diffStats.Hard.completed} / {stats.diffStats.Hard.total}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.diffStats.Hard.total > 0 ? (stats.diffStats.Hard.completed / stats.diffStats.Hard.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>



          </div>
        ) : (
          /* STANDARD SHEET OVERALL PROGRESS BANNER */
          <div className="space-y-6">
            <section className={`p-6 rounded-2xl border transition-all duration-300 ${darkMode
                ? 'bg-neutral-955 border-neutral-900 shadow-2xl shadow-black/10'
                : 'bg-white border-slate-200/80 shadow-sm'
              }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold">Overall Progress</h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 font-semibold">
                    Your journey through the NeetCode 150 curriculum
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-2xl font-extrabold text-teal-500 leading-none">
                    {stats.completedCount} <span className="text-sm font-semibold text-slate-400 dark:text-neutral-500">/ {stats.totalCount}</span>
                  </span>
                  <span className="ml-2 px-2.5 py-1 text-xs font-bold rounded-full bg-teal-500/10 text-teal-500 dark:bg-teal-500/10 dark:text-teal-400">
                    {stats.percentage}% Solved
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-neutral-900 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${stats.percentage}%` }}
                ></div>
              </div>
            </section>

            {/* STATS PANEL SUMMARY */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Easy metrics */}
              <div className={`p-5 rounded-2xl border transition-all duration-300 ${darkMode
                  ? 'bg-neutral-955 border-neutral-900 shadow-2xl shadow-black/10'
                  : 'bg-white border-slate-200/80 shadow-sm'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Easy Problems</span>
                  <span className="px-2 py-0.5 text-xxs font-bold rounded-md bg-emerald-500/10 text-emerald-500">
                    {stats.diffStats.Easy.total > 0 ? Math.round((stats.diffStats.Easy.completed / stats.diffStats.Easy.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-2xl font-extrabold tracking-tight">
                    {stats.diffStats.Easy.completed} <span className="text-sm font-medium text-slate-500 dark:text-neutral-400">/ {stats.diffStats.Easy.total}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.diffStats.Easy.total > 0 ? (stats.diffStats.Easy.completed / stats.diffStats.Easy.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Medium metrics */}
              <div className={`p-5 rounded-2xl border transition-all duration-300 ${darkMode
                  ? 'bg-neutral-955 border-neutral-900 shadow-2xl shadow-black/10'
                  : 'bg-white border-slate-200/80 shadow-sm'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Medium Problems</span>
                  <span className="px-2 py-0.5 text-xxs font-bold rounded-md bg-amber-500/10 text-amber-500">
                    {stats.diffStats.Medium.total > 0 ? Math.round((stats.diffStats.Medium.completed / stats.diffStats.Medium.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-2xl font-extrabold tracking-tight">
                    {stats.diffStats.Medium.completed} <span className="text-sm font-medium text-slate-500 dark:text-neutral-400">/ {stats.diffStats.Medium.total}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.diffStats.Medium.total > 0 ? (stats.diffStats.Medium.completed / stats.diffStats.Medium.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Hard metrics */}
              <div className={`p-5 rounded-2xl border transition-all duration-300 ${darkMode
                  ? 'bg-neutral-955 border-neutral-900 shadow-2xl shadow-black/10'
                  : 'bg-white border-slate-200/80 shadow-sm'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Hard Problems</span>
                  <span className="px-2 py-0.5 text-xxs font-bold rounded-md bg-rose-500/10 text-rose-500">
                    {stats.diffStats.Hard.total > 0 ? Math.round((stats.diffStats.Hard.completed / stats.diffStats.Hard.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-2xl font-extrabold tracking-tight">
                    {stats.diffStats.Hard.completed} <span className="text-sm font-medium text-slate-500 dark:text-neutral-400">/ {stats.diffStats.Hard.total}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.diffStats.Hard.total > 0 ? (stats.diffStats.Hard.completed / stats.diffStats.Hard.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </section>
          </div>
        )}
        {/* SERVICE SHEET SUB-TABS */}
        {activeSheet === 'service' && (
          <div className="flex flex-wrap justify-center gap-3 border-b border-neutral-900 pb-5">
            {[
              { id: 'questions', label: '120+ Questions', icon: BookOpen },
              { id: 'revision', label: 'Space Revision Tracker', icon: Calendar },
              { id: 'planner', label: '8-Week Planner & Checklists', icon: ListTodo }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setServiceSubTab(tab.id)}
                  className={`px-4.5 py-2.5 text-xs font-bold rounded-xl border transition-all duration-300 cursor-pointer flex items-center gap-2 active:scale-95 hover:scale-[1.01] ${
                    serviceSubTab === tab.id
                      ? 'bg-teal-500/10 border-teal-500/40 text-teal-400 font-extrabold shadow-[0_0_15px_rgba(20,184,166,0.1)]'
                      : 'border-neutral-900 bg-neutral-950/60 text-neutral-450 hover:text-neutral-200'
                  }`}
                >
                  <TabIcon size={14} className={serviceSubTab === tab.id ? 'text-teal-400 animate-pulse' : 'text-neutral-500'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* QUESTIONS & CATEGORY GRID TAB VIEW */}
        {(activeSheet === 'standard' || serviceSubTab === 'questions') && (
          <div className="space-y-8 animate-slide-up">
            {/* SEARCH AND FILTER BAR */}
            <section className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${darkMode
                ? 'bg-neutral-955 border-neutral-900 shadow-2xl shadow-black/10'
                : 'bg-white border-slate-200/80 shadow-sm'
              }`}>
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search inputs */}
                <div className="relative w-full lg:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search matching DSA problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/25 transition-all ${darkMode
                        ? 'border-neutral-800 bg-black text-neutral-55 placeholder-neutral-550 focus:border-emerald-500/80'
                        : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-emerald-500/80'
                      }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-250"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filter buttons block */}
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">

                  {/* Status Filter Tab Group */}
                  <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <span className="text-xxs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500">Filters</span>
                    <div className={`inline-flex rounded-lg border p-0.5 ${darkMode ? 'border-neutral-900 bg-black' : 'border-slate-200 bg-slate-50'
                      }`}>
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'completed', label: 'Completed' },
                        { id: 'incomplete', label: 'Incomplete' }
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setActiveFilter(filter.id)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${activeFilter === filter.id
                              ? darkMode
                                ? 'bg-neutral-800 text-neutral-50 shadow-sm'
                                : 'bg-indigo-600 text-white shadow-sm'
                              : darkMode
                                ? 'text-neutral-400 hover:text-neutral-200'
                                : 'text-slate-650 hover:text-slate-950'
                            }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty filter Tab Group */}
                  <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <span className="text-xxs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500">Difficulty</span>
                    <div className={`inline-flex rounded-lg border p-0.5 ${darkMode ? 'border-neutral-900 bg-black' : 'border-slate-200 bg-slate-50'
                      }`}>
                      {['all', 'Easy', 'Medium', 'Hard'].map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setDifficultyFilter(diff)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${difficultyFilter === diff
                              ? darkMode
                                ? 'bg-neutral-800 text-neutral-50 shadow-sm'
                                : 'bg-indigo-600 text-white shadow-sm'
                              : darkMode
                                ? 'text-neutral-400 hover:text-neutral-200'
                                : 'text-slate-650 hover:text-slate-955'
                            }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Active summary counts and clear filters */}
              {(searchQuery || activeFilter !== 'all' || difficultyFilter !== 'all') && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-200/50 dark:border-neutral-900/50 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-neutral-400 font-semibold">
                    Found <strong className="font-bold text-slate-800 dark:text-neutral-200">{filteredData.count}</strong> matching problems.
                  </span>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilter('all');
                      setDifficultyFilter('all');
                    }}
                    className={`flex items-center gap-1 font-bold cursor-pointer ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                      }`}
                  >
                    Clear Active Filters
                  </button>
                </div>
              )}
            </section>

            {/* CATEGORY GRID */}
            <section className="flex flex-col gap-6">
              {filteredData.count === 0 ? (
                <div className={`text-center py-16 rounded-2xl border transition-all ${darkMode ? 'bg-neutral-950 border-neutral-900' : 'bg-white border-slate-200/80 shadow-sm'
                  }`}>
                  <AlertCircle className="mx-auto text-slate-400 dark:text-neutral-500 mb-3" size={32} />
                  <h3 className="font-bold text-lg">No Matching Problems Found</h3>
                  <p className="text-slate-500 dark:text-neutral-400 text-sm mt-1">Try clearing your filters or altering your search text.</p>
                </div>
              ) : (
                Object.entries(filteredData.data).map(([category, problems]) => {
                  const activeData = activeSheet === 'service' ? serviceDsaData : dsaData;
                  const activeProgress = activeSheet === 'service' ? serviceProgress : progress;
                  const activeNotes = activeSheet === 'service' ? serviceNotes : notes;

                  const isCollapsed = !expandedCategories[category];
                  const totalInCategory = activeData[category].length;
                  const completedInCategory = activeData[category].filter(p => activeProgress[p.title]).length;
                  const percentCompleted = totalInCategory > 0 ? Math.round((completedInCategory / totalInCategory) * 100) : 0;

                  const allCategories = Object.keys(activeData);
                  const originalIndex = allCategories.indexOf(category);

                  return (
                    <div key={category} className="space-y-6">
                      <div
                        className={`rounded-2xl border overflow-hidden transition-all duration-300 ${darkMode
                            ? 'bg-neutral-950 border-neutral-900 shadow-2xl shadow-black/10'
                            : 'bg-white border-slate-200/80 shadow-sm'
                          }`}
                      >
                        {/* Category Header Click Block */}
                        <div
                          onClick={() => toggleCategory(category)}
                          className="px-6 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-neutral-900/40 transition-colors select-none"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-baseline gap-2 mb-2">
                              <h2 className="text-base font-bold truncate">
                                {category}
                              </h2>
                              <span className="text-xs font-semibold text-slate-550 dark:text-neutral-400 shrink-0">
                                ({completedInCategory} / {totalInCategory} Solved)
                              </span>
                            </div>

                            {/* Category mini-progress slider bar */}
                            <div className="w-full max-w-xs bg-slate-200 dark:bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${percentCompleted}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="text-slate-400 dark:text-neutral-500 p-1.5 hover:bg-slate-100 dark:hover:bg-neutral-900 rounded-lg shrink-0">
                            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                          </div>
                        </div>

                        {/* Problem Rows (Accordion collapsed state check) */}
                        {!isCollapsed && (
                          <div className="border-t border-slate-200/80 dark:border-neutral-900">
                            
                            {/* TABLE VIEW (Tablet & Desktop) */}
                            <div className="hidden sm:block overflow-x-auto">
                              <table className="w-full text-left border-collapse min-w-[560px]">
                                <thead>
                                  <tr className={`text-xxs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200/80 dark:border-neutral-900 ${darkMode ? 'bg-neutral-900/30' : 'bg-slate-100'
                                    }`}>
                                    <th className="py-3 px-5 w-16 text-center">Status</th>
                                    <th className="py-3 px-3">Title</th>
                                    <th className="py-3 px-3 w-24 text-center">Difficulty</th>
                                    <th className="py-3 px-3 w-28 text-center">{activeSheet === 'service' ? 'Platform' : 'LeetCode'}</th>
                                    <th className="py-3 px-5 w-20 text-center">Notes</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-150 dark:divide-neutral-900 text-xs sm:text-sm">
                                  {problems.map((problem) => {
                                    const isCompleted = !!activeProgress[problem.title];
                                    const hasNotes = !!activeNotes[problem.title];
                                    const isEditingNotes = activeNoteEditing === problem.title;

                                    // Row color configurations dynamically derived
                                    let rowClasses = '';
                                    if (isCompleted) {
                                      rowClasses = darkMode
                                        ? 'bg-emerald-955/10 text-neutral-305'
                                        : 'bg-emerald-50/60 text-slate-700';
                                    } else {
                                      rowClasses = darkMode
                                        ? 'bg-transparent hover:bg-neutral-900/10 text-neutral-200'
                                        : 'bg-transparent hover:bg-slate-50/30 text-slate-900';
                                    }

                                    // Difficulty tag styles
                                    let diffClasses = '';
                                    if (problem.difficulty === 'Easy') {
                                      diffClasses = 'bg-emerald-500/10 text-emerald-500 border-emerald-550/10';
                                    } else if (problem.difficulty === 'Medium') {
                                      diffClasses = 'bg-amber-500/10 text-amber-500 border-amber-550/10';
                                    } else {
                                      diffClasses = 'bg-rose-500/10 text-rose-500 border-rose-550/10';
                                    }

                                    return (
                                      <React.Fragment key={problem.title}>
                                        <tr className={`transition-colors border-slate-250 dark:border-neutral-900 ${rowClasses}`}>

                                          {/* Checkbox column */}
                                          <td className="py-3.5 px-5 text-center">
                                            <button
                                              onClick={() => toggleProblem(problem.title)}
                                              className="inline-flex focus:outline-none transition-transform active:scale-90 cursor-pointer"
                                              title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                                            >
                                              {isCompleted ? (
                                                <CheckCircle className="text-emerald-500 fill-emerald-500/10 shrink-0" size={18} />
                                              ) : (
                                                <Circle className="text-slate-400 dark:text-neutral-500 hover:text-slate-650 dark:hover:text-neutral-450 shrink-0" size={18} />
                                              )}
                                            </button>
                                          </td>

                                          {/* Title column */}
                                          <td className="py-3.5 px-3 font-medium">
                                            <div className="flex items-center gap-2">
                                              <span className={`${isCompleted ? 'line-through text-slate-500 dark:text-neutral-500' : ''}`}>
                                                {problem.title}
                                              </span>
                                              {hasNotes && (
                                                <span
                                                  onClick={() => handleToggleNoteEditor(problem.title)}
                                                  className={`p-0.5 px-1.5 rounded cursor-pointer transition-all text-xxs font-bold flex items-center gap-0.5 shrink-0 ${darkMode
                                                      ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                                                      : 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200'
                                                    }`}
                                                  title="View approach notes"
                                                >
                                                  <BookOpen size={10} />
                                                  Notes
                                                </span>
                                              )}
                                            </div>
                                          </td>

                                          {/* Difficulty badge */}
                                          <td className="py-3.5 px-3 text-center">
                                            <span className={`inline-block px-2 py-0.5 text-xxs font-semibold border rounded-full ${diffClasses}`}>
                                              {problem.difficulty}
                                            </span>
                                          </td>

                                          {/* link badges */}
                                          <td className="py-3.5 px-3 text-center">
                                            <a
                                              href={getProblemUrl(problem)}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xxs font-bold transition-all border ${
                                                problem.platform === 'GFG'
                                                  ? darkMode
                                                    ? 'text-emerald-400 bg-emerald-500/5 border-emerald-550/15 hover:bg-emerald-550/15'
                                                    : 'text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100'
                                                  : darkMode
                                                    ? 'text-amber-400 bg-amber-500/5 border-amber-500/15 hover:bg-amber-550/15'
                                                    : 'text-amber-600 bg-amber-55 border border-amber-205 hover:bg-amber-100'
                                              }`}
                                            >
                                              <span>{problem.platform === 'GFG' ? 'GFG' : 'LeetCode'}</span>
                                              <ExternalLink size={10} />
                                            </a>
                                          </td>

                                          {/* Notes expansion toggle */}
                                          <td className="py-3.5 px-5 text-center">
                                            <button
                                              onClick={() => handleToggleNoteEditor(problem.title)}
                                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isEditingNotes
                                                  ? 'bg-indigo-500 text-white border-indigo-500'
                                                  : hasNotes
                                                    ? darkMode
                                                      ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-900/20'
                                                      : 'bg-cyan-55 border-cyan-200 text-cyan-705 hover:bg-cyan-100'
                                                    : darkMode
                                                      ? 'border-neutral-900 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'
                                                      : 'border-slate-200 text-slate-450 hover:border-slate-350 hover:text-slate-800'
                                                }`}
                                              title={isEditingNotes ? "Close notes" : "Edit notes"}
                                            >
                                              <BookOpen size={14} />
                                            </button>
                                          </td>

                                        </tr>

                                        {/* Expanded notes editor container block */}
                                        {isEditingNotes && (
                                          <tr className={darkMode ? 'bg-neutral-950/40' : 'bg-slate-50/50'}>
                                            <td colSpan="5" className="p-0 border-b border-slate-200/80 dark:border-neutral-900">
                                              <div className="px-6 sm:px-12 py-4 border-l-2 border-emerald-500 dark:border-emerald-600 space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                  <span className="font-semibold text-slate-550 dark:text-neutral-405 flex items-center gap-1.5">
                                                    <BookOpen size={14} className="text-emerald-500" />
                                                    Notes &amp; Hints for {problem.title}
                                                  </span>
                                                  <div className="flex items-center gap-3">
                                                    {saveStatus[problem.title] === 'saving' && (
                                                      <span className="text-slate-500 animate-pulse font-medium">Auto-saving...</span>
                                                    )}
                                                    {saveStatus[problem.title] === 'saved' && (
                                                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                                                        <Check size={12} />
                                                        Saved!
                                                      </span>
                                                    )}
                                                    <button
                                                      onClick={() => handleToggleNoteEditor(problem.title)}
                                                      className="text-slate-450 hover:text-slate-700 dark:hover:text-neutral-200 cursor-pointer"
                                                    >
                                                      <X size={14} />
                                                    </button>
                                                  </div>
                                                </div>
                                                <textarea
                                                  value={noteDrafts[problem.title] ?? ""}
                                                  onChange={(e) => handleNoteChange(problem.title, e.target.value)}
                                                  onBlur={() => saveNote(problem.title)}
                                                  placeholder="Type solution approaches, reminders, or formulas here..."
                                                  rows="3"
                                                  className={`w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-400 font-mono resize-y ${darkMode
                                                      ? 'border-neutral-800 bg-black text-neutral-100'
                                                      : 'border-slate-250 bg-white text-slate-950'
                                                    }`}
                                                />
                                                <span className="text-xxs text-slate-450 dark:text-neutral-500 block">
                                                  Notes are auto-saved dynamically on keyboard inputs. Click outside to focus lock.
                                                </span>
                                              </div>
                                            </td>
                                          </tr>
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>

                            {/* LIST VIEW (Mobile) */}
                            <div className="block sm:hidden divide-y divide-slate-150 dark:divide-neutral-900">
                              {problems.map((problem) => {
                                const isCompleted = !!activeProgress[problem.title];
                                const hasNotes = !!activeNotes[problem.title];
                                const isEditingNotes = activeNoteEditing === problem.title;

                                // Container class derivation
                                let rowClasses = '';
                                if (isCompleted) {
                                  rowClasses = darkMode
                                    ? 'bg-emerald-950/5 text-neutral-350'
                                    : 'bg-emerald-50/30 text-slate-700';
                                } else {
                                  rowClasses = darkMode
                                    ? 'bg-transparent text-neutral-250'
                                    : 'bg-transparent text-slate-900';
                                }

                                // Difficulty tag styles
                                let diffClasses = '';
                                if (problem.difficulty === 'Easy') {
                                  diffClasses = 'bg-emerald-500/10 text-emerald-500 border-emerald-550/10';
                                } else if (problem.difficulty === 'Medium') {
                                  diffClasses = 'bg-amber-500/10 text-amber-500 border-amber-550/10';
                                } else {
                                  diffClasses = 'bg-rose-500/10 text-rose-500 border-rose-550/10';
                                }

                                return (
                                  <div key={problem.title} className={`p-4 space-y-3 transition-colors ${rowClasses}`}>
                                    <div className="flex items-center justify-between gap-3">
                                      {/* Left: Checkbox + Title */}
                                      <div className="flex items-center gap-3 min-w-0">
                                        <button
                                          onClick={() => toggleProblem(problem.title)}
                                          className="focus:outline-none transition-transform active:scale-90 shrink-0 cursor-pointer"
                                          title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                                        >
                                          {isCompleted ? (
                                            <CheckCircle className="text-emerald-500 fill-emerald-500/10" size={20} />
                                          ) : (
                                            <Circle className="text-slate-400 dark:text-neutral-500 hover:text-slate-650 dark:hover:text-neutral-450" size={20} />
                                          )}
                                        </button>
                                        <div className="min-w-0">
                                          <div className={`font-semibold text-sm ${isCompleted ? 'line-through text-slate-500 dark:text-neutral-500' : ''}`}>
                                            {problem.title}
                                          </div>
                                          <div className="flex items-center gap-2 mt-1.5">
                                            <span className={`inline-block px-2 py-0.5 text-[9px] font-semibold border rounded-full ${diffClasses}`}>
                                              {problem.difficulty}
                                            </span>
                                            {hasNotes && (
                                              <span
                                                onClick={() => handleToggleNoteEditor(problem.title)}
                                                className={`p-0.5 px-1.5 rounded cursor-pointer transition-all text-[9px] font-bold flex items-center gap-0.5 shrink-0 ${darkMode
                                                    ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                                                    : 'bg-cyan-105 text-cyan-800 hover:bg-cyan-200'
                                                  }`}
                                              >
                                                <BookOpen size={9} />
                                                Notes
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Right: Buttons */}
                                      <div className="flex items-center gap-2 shrink-0">
                                        <a
                                          href={getProblemUrl(problem)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`p-2 rounded-lg transition-all border ${
                                            problem.platform === 'GFG'
                                              ? darkMode
                                                ? 'text-emerald-400 bg-emerald-500/5 border-emerald-550/15 hover:bg-emerald-550/15'
                                                : 'text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100'
                                              : darkMode
                                                ? 'text-amber-400 bg-amber-500/5 border-amber-500/15 hover:bg-amber-550/15'
                                                : 'text-amber-600 bg-amber-55 border border-amber-200 hover:bg-amber-100'
                                          }`}
                                          title={`Practice on ${problem.platform === 'GFG' ? 'GFG' : 'LeetCode'}`}
                                        >
                                          <ExternalLink size={14} />
                                        </a>
                                        <button
                                          onClick={() => handleToggleNoteEditor(problem.title)}
                                          className={`p-2 rounded-lg border transition-all cursor-pointer ${isEditingNotes
                                              ? 'bg-indigo-500 text-white border-indigo-500'
                                              : hasNotes
                                                ? darkMode
                                                  ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-900/20'
                                                  : 'bg-cyan-55 border-cyan-200 text-cyan-705 hover:bg-cyan-100'
                                                : darkMode
                                                  ? 'border-neutral-900 text-neutral-500 hover:border-neutral-700 hover:text-neutral-350'
                                                  : 'border-slate-200 text-slate-450 hover:border-slate-350 hover:text-slate-800'
                                            }`}
                                          title={isEditingNotes ? "Close notes" : "Edit notes"}
                                        >
                                          <BookOpen size={14} />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Mobile Note Editor */}
                                    {isEditingNotes && (
                                      <div className={`pt-2 border-t border-slate-200/50 dark:border-neutral-900 space-y-2`}>
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-semibold text-slate-550 dark:text-neutral-450 flex items-center gap-1.5">
                                            <BookOpen size={12} className="text-emerald-500" />
                                            Notes &amp; Hints
                                          </span>
                                          <div className="flex items-center gap-3">
                                            {saveStatus[problem.title] === 'saving' && (
                                              <span className="text-slate-500 animate-pulse font-medium">Auto-saving...</span>
                                            )}
                                            {saveStatus[problem.title] === 'saved' && (
                                              <span className="text-emerald-500 font-bold flex items-center gap-1">
                                                <Check size={12} />
                                                Saved!
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <textarea
                                          value={noteDrafts[problem.title] ?? ""}
                                          onChange={(e) => handleNoteChange(problem.title, e.target.value)}
                                          onBlur={() => saveNote(problem.title)}
                                          placeholder="Type solution approaches, reminders, or formulas here..."
                                          rows="3"
                                          className={`w-full p-2.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-400 font-mono resize-y ${darkMode
                                              ? 'border-neutral-800 bg-black text-neutral-100'
                                              : 'border-slate-250 bg-white text-slate-955'
                                            }`}
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                          </div>
                        )}

                      </div>
                      
                      {/* MILESTONE BADGES INLINE FOR SERVICE SHEET */}
                      {activeSheet === 'service' && (
                        <>
                          {originalIndex === 2 && renderMilestoneCard('bronze')}
                          {originalIndex === 5 && renderMilestoneCard('silver')}
                          {originalIndex === 8 && renderMilestoneCard('gold')}
                          {originalIndex === 11 && renderMilestoneCard('diamond')}
                          {originalIndex === 14 && renderMilestoneCard('ready')}
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </section>
          </div>
        )}

        {/* SERVICE SHEET SUB-TAB: REVISION TRACKER */}
        {activeSheet === 'service' && serviceSubTab === 'revision' && (
          <section className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-6 space-y-6 animate-slide-up">
            <div className="flex items-center gap-3">
              <Calendar className="text-teal-400" size={24} />
              <div>
                <h3 className="text-lg font-bold">Space Repetition Revision Tracker</h3>
                <p className="text-xs text-neutral-450 font-medium mt-0.5">Space repetition is the key to long-term memory retention</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px] text-sm">
                <thead>
                  <tr className="text-xxs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-900 bg-neutral-900/30">
                    <th className="py-3.5 px-4 w-40">Topic</th>
                    <th className="py-3.5 px-4 w-28 text-center">1st Revision</th>
                    <th className="py-3.5 px-4 w-28 text-center">2nd Revision</th>
                    <th className="py-3.5 px-4 w-28 text-center">3rd Revision</th>
                    <th className="py-3.5 px-4">Notes / Reminders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {Object.keys(serviceDsaData).map(topic => {
                    const revState = serviceRevision[topic] || { rev1: false, rev2: false, rev3: false, notes: '' };
                    const toggleRev = (field) => {
                      setServiceRevision(prev => ({
                        ...prev,
                        [topic]: {
                          ...revState,
                          [field]: !revState[field]
                        }
                      }));
                    };
                    const handleNotesChange = (val) => {
                      setServiceRevision(prev => ({
                        ...prev,
                        [topic]: {
                          ...revState,
                          notes: val
                        }
                      }));
                    };

                    return (
                      <tr key={topic} className="hover:bg-neutral-900/10 transition-colors">
                        <td className="py-3 px-4 font-semibold text-neutral-200">{topic}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleRev('rev1')}
                            className="inline-flex focus:outline-none transition-transform active:scale-95 cursor-pointer"
                          >
                            {revState.rev1 ? (
                              <CheckCircle className="text-teal-400 fill-teal-500/10" size={18} />
                            ) : (
                              <Circle className="text-neutral-600 hover:text-neutral-500" size={18} />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleRev('rev2')}
                            className="inline-flex focus:outline-none transition-transform active:scale-95 cursor-pointer"
                          >
                            {revState.rev2 ? (
                              <CheckCircle className="text-teal-400 fill-teal-500/10" size={18} />
                            ) : (
                              <Circle className="text-neutral-600 hover:text-neutral-500" size={18} />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleRev('rev3')}
                            className="inline-flex focus:outline-none transition-transform active:scale-95 cursor-pointer"
                          >
                            {revState.rev3 ? (
                              <CheckCircle className="text-teal-400 fill-teal-500/10" size={18} />
                            ) : (
                              <Circle className="text-neutral-600 hover:text-neutral-500" size={18} />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={revState.notes || ''}
                            onChange={(e) => handleNotesChange(e.target.value)}
                            placeholder="Add approach notes, key formulas, etc."
                            className="w-full bg-black border border-neutral-850 hover:border-neutral-800 focus:border-teal-500 text-xs px-3 py-1.5 rounded-lg focus:outline-none placeholder-neutral-600 font-mono text-neutral-250 transition-colors"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SERVICE SHEET SUB-TAB: PLANNER & CHECKLISTS */}
        {activeSheet === 'service' && serviceSubTab === 'planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
            
            {/* WEEKLY PLANNER */}
            <section className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Calendar className="text-teal-400" size={24} />
                <div>
                  <h3 className="text-lg font-bold">8-Week Preparation Planner</h3>
                  <p className="text-xs text-neutral-450 font-medium mt-0.5">Plan and execute your structured preparation schedule</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[500px]">
                  <thead>
                    <tr className="text-xxs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-900 bg-neutral-900/30">
                      <th className="py-3 px-3 w-16 text-center">Done</th>
                      <th className="py-3 px-3 w-20">Timeline</th>
                      <th className="py-3 px-3 w-40">Topics</th>
                      <th className="py-3 px-3">Key Questions / Milestones</th>
                      <th className="py-3 px-3 w-20 text-center">Target Qs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {weeklyPlannerData.map(item => {
                      const isWeekDone = !!serviceWeeklyPlanner[item.week];
                      const toggleWeek = () => {
                        setServiceWeeklyPlanner(prev => ({
                          ...prev,
                          [item.week]: !prev[item.week]
                        }));
                      };

                      return (
                        <tr key={item.week} className={`hover:bg-neutral-900/10 transition-colors ${
                          isWeekDone ? 'bg-teal-950/5 text-neutral-400' : ''
                        }`}>
                          <td className="py-3.5 px-3 text-center">
                            <button
                              onClick={toggleWeek}
                              className="inline-flex focus:outline-none transition-transform active:scale-95 cursor-pointer"
                            >
                              {isWeekDone ? (
                                <CheckCircle className="text-teal-400 fill-teal-500/10" size={18} />
                              ) : (
                                <Circle className="text-neutral-600 hover:text-neutral-500" size={18} />
                              )}
                            </button>
                          </td>
                          <td className="py-3.5 px-3 font-extrabold text-neutral-305">Week {item.week}</td>
                          <td className="py-3.5 px-3 font-semibold text-neutral-200">{item.topics}</td>
                          <td className="py-3.5 px-3 text-neutral-400 leading-relaxed font-semibold">{item.keyQuestions}</td>
                          <td className="py-3.5 px-3 text-center font-extrabold text-teal-400">{item.targetQs}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* INTERVIEW READINESS CHECKLIST */}
            <section className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-6 space-y-6">
              <div className="flex items-center gap-3">
                <ListTodo className="text-teal-400" size={24} />
                <div>
                  <h3 className="text-lg font-bold">Interview Readiness Checklist</h3>
                  <p className="text-xs text-neutral-450 font-medium mt-0.5">Check off each area as you become fully confident</p>
                </div>
              </div>

              <div className="space-y-6">
                {Object.entries(readinessChecklistData).map(([category, items]) => {
                  const completedItems = items.filter(item => serviceReadiness[item]).length;
                  const totalItems = items.length;
                  const pct = Math.round((completedItems / totalItems) * 100) || 0;

                  return (
                    <div key={category} className="border border-neutral-900 bg-black/40 rounded-xl p-4.5 space-y-3.5">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <h4 className="text-sm font-bold text-neutral-200 tracking-wide">{category}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-extrabold text-teal-450">{completedItems} / {totalItems}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-500/10 text-teal-400">
                            {pct}%
                          </span>
                        </div>
                      </div>

                      {/* Mini progress bar */}
                      <div className="w-full bg-neutral-900 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-teal-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>

                      {/* Items checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1.5 font-semibold">
                        {items.map(item => {
                          const isChecked = !!serviceReadiness[item];
                          const toggleItem = () => {
                            setServiceReadiness(prev => ({
                              ...prev,
                              [item]: !prev[item]
                            }));
                          };

                          return (
                            <button
                              key={item}
                              onClick={toggleItem}
                              className={`flex items-center gap-2 text-left p-2 rounded-lg border transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-teal-950/10 border-teal-950/20 text-teal-350 font-bold'
                                  : 'bg-neutral-900/30 border-neutral-900 hover:border-neutral-850 text-neutral-400'
                              }`}
                            >
                              <span className="shrink-0">
                                {isChecked ? (
                                  <Check className="text-teal-400" size={14} />
                                ) : (
                                  <span className="w-3.5 h-3.5 rounded border border-neutral-700 inline-block bg-black/40" />
                                )}
                              </span>
                              <span className="truncate">{item}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        )}


      </main>

      {/* FOOTER */}
      <footer className={`border-t mt-16 pt-12 pb-8 transition-all duration-300 ${
        darkMode ? 'border-neutral-900 bg-black text-neutral-400' : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Great Banner Image */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-900 shadow-lg">
            <img 
              src="/footer_banner.png" 
              alt="KAIZEN Philosophy: Coding, Development, Concepts, Growth - One Step Everyday" 
              className="w-full h-auto object-contain" 
            />
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 text-left">
            
            {/* Column 1: App info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo_navbar.png" 
                  alt="KAIZEN Logo" 
                  className="w-8 h-8 object-contain" 
                />
                <span className={`font-extrabold text-sm sm:text-base tracking-wider ${
                  darkMode ? 'text-neutral-100' : 'text-slate-800'
                }`}>
                  KAIZEN DSA SHEET
                </span>
              </div>
              <p className="text-xs leading-relaxed max-w-sm">
                A premium, interactive curriculum tracker designed to help developers systematically practice, refine, and master critical coding concepts and algorithm designs.
              </p>
            </div>

            {/* Column 2: Philosophy */}
            <div className="space-y-4">
              <h4 className={`text-xs font-bold uppercase tracking-widest ${
                darkMode ? 'text-neutral-200' : 'text-slate-700'
              }`}>
                The Kaizen Way
              </h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Learn: Master patterns daily.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Improve: Solve problems systematically.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Grow: Elevate engineering careers.</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Quote & Statement */}
            <div className="space-y-4">
              <h4 className={`text-xs font-bold uppercase tracking-widest ${
                darkMode ? 'text-neutral-200' : 'text-slate-700'
              }`}>
                Founder's Vision
              </h4>
              <p className="text-xs italic leading-relaxed">
                "Continuous improvement is better than delayed perfection. One step everyday leads to the peak."
              </p>
              <p className="text-xs font-bold text-emerald-500">
                — Vrushabh Gorivale, Founder &amp; CEO of KAIZEN
              </p>
            </div>

          </div>

          {/* Copyright signature */}
          <div className="pt-8 border-t border-neutral-200/50 dark:border-neutral-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xxs text-neutral-500 font-medium">
            <span>&copy; 2026 KAIZEN. All rights reserved.</span>
            <span className={darkMode ? 'text-neutral-405' : 'text-slate-600'}>
              Created with ❤️ under the vision of Vrushabh Gorivale
            </span>
          </div>

        </div>
      </footer>

      {/* DYNAMIC CONFIRMATION MODAL */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          <div className={`border rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200 ${darkMode ? 'bg-neutral-950 border-neutral-900 text-neutral-100' : 'bg-white border-slate-200 text-slate-900'
            }`}>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-450 rounded-full shrink-0">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold">
                  Reset Progress &amp; Notes?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
                  This will permanently clear all your 151 checkboxes and reset any typed hints or approaches. This cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 text-xxs text-rose-600 dark:text-rose-450 p-3 rounded-lg leading-relaxed font-semibold">
              Wipes `dsa_progress` and `dsa_notes` keys from the browser's localStorage module.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-colors ${darkMode
                    ? 'border-neutral-800 text-neutral-300 hover:bg-neutral-900'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={resetAllProgress}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors focus:outline-none"
              >
                Confirm Reset
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
