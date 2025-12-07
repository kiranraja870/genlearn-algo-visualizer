// @ts-nocheck

// @ts-nocheck
'use client'; // <--- ADD THIS LINE HERE

import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  BarChart2, 
  CheckCircle, 
  AlertCircle, 
  Briefcase, 
  Code, 
  PieChart, 
  Cpu, 
  X,
  Stethoscope,
  Activity,
  TrendingUp,
  Landmark,
  Target,
  Award,
  Zap,
  Download
} from 'lucide-react';

// --- Domain Knowledge Base (Updated for Dark Mode Contrast) ---
const DOMAINS = {
  'Software Engineer': {
    keywords: ['javascript', 'typescript', 'react', 'node', 'python', 'java', 'c++', 'aws', 'docker', 'kubernetes', 'sql', 'nosql', 'git', 'ci/cd', 'agile', 'scrum', 'backend', 'frontend', 'fullstack', 'api', 'graphql', 'rest', 'system design', 'microservices'],
    color: 'text-blue-400',
    bgColor: 'bg-blue-600',
    bgLight: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    icon: Code
  },
  'Data Scientist': {
    keywords: ['python', 'r', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'machine learning', 'deep learning', 'nlp', 'statistics', 'analysis', 'visualization', 'tableau', 'power bi', 'sql', 'big data', 'hadoop', 'spark', 'modeling'],
    color: 'text-purple-400',
    bgColor: 'bg-purple-600',
    bgLight: 'bg-purple-500/20',
    border: 'border-purple-500/30',
    icon: Cpu
  },
  'Product Manager': {
    keywords: ['roadmap', 'strategy', 'stakeholder', 'user stories', 'backlog', 'prioritization', 'agile', 'scrum', 'jira', 'confluence', 'market research', 'user experience', 'kpi', 'metrics', 'growth', 'launch', 'product lifecycle'],
    color: 'text-green-400',
    bgColor: 'bg-green-600',
    bgLight: 'bg-green-500/20',
    border: 'border-green-500/30',
    icon: Briefcase
  },
  'UI/UX Designer': {
    keywords: ['figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'wireframing', 'prototyping', 'user research', 'usability testing', 'interaction design', 'visual design', 'user flow', 'persona', 'accessibility', 'ui', 'ux', 'typography', 'color theory'],
    color: 'text-pink-400',
    bgColor: 'bg-pink-600',
    bgLight: 'bg-pink-500/20',
    border: 'border-pink-500/30',
    icon: PieChart
  },
  'Marketing Specialist': {
    keywords: ['seo', 'sem', 'content marketing', 'social media', 'google analytics', 'campaign', 'branding', 'copywriting', 'email marketing', 'crm', 'hubspot', 'salesforce', 'lead generation', 'ppc', 'advertising', 'market research'],
    color: 'text-orange-400',
    bgColor: 'bg-orange-600',
    bgLight: 'bg-orange-500/20',
    border: 'border-orange-500/30',
    icon: BarChart2
  },
  'Medical Doctor': {
    keywords: ['patient care', 'diagnosis', 'treatment', 'clinical', 'surgery', 'internal medicine', 'pediatrics', 'anatomy', 'physiology', 'pharmacology', 'emr', 'ehr', 'medical history', 'hipaa', 'rounds', 'pathology', 'medical education'],
    color: 'text-red-400',
    bgColor: 'bg-red-600',
    bgLight: 'bg-red-500/20',
    border: 'border-red-500/30',
    icon: Stethoscope
  },
  'Nursing': {
    keywords: ['nursing', 'registered nurse', 'rn', 'lpn', 'patient care', 'bls', 'acls', 'cpr', 'vital signs', 'medication administration', 'iv therapy', 'triage', 'patient education', 'wound care', 'bedside manner', 'charting', 'infection control'],
    color: 'text-rose-400',
    bgColor: 'bg-rose-500',
    bgLight: 'bg-rose-500/20',
    border: 'border-rose-500/30',
    icon: Activity
  },
  'Business Admin': {
    keywords: ['business development', 'operations', 'management', 'strategic planning', 'negotiation', 'b2b', 'sales', 'revenue', 'budgeting', 'forecasting', 'stakeholder management', 'partnership', 'supply chain', 'logistics', 'p&l', 'roi'],
    color: 'text-amber-400',
    bgColor: 'bg-amber-600',
    bgLight: 'bg-amber-500/20',
    border: 'border-amber-500/30',
    icon: TrendingUp
  },
  'Banking & Finance': {
    keywords: ['finance', 'accounting', 'audit', 'tax', 'risk management', 'portfolio', 'investment', 'asset management', 'equity', 'compliance', 'financial analysis', 'financial modeling', 'valuation', 'bloomberg', 'gaap', 'ifrs', 'reconciliation', 'ledger'],
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-600',
    bgLight: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    icon: Landmark
  }
};

const COMMON_SOFT_SKILLS = [
  'leadership', 'communication', 'teamwork', 'problem solving', 'time management', 
  'adaptability', 'creativity', 'work ethic', 'attention to detail', 'critical thinking',
  'emotional intelligence', 'conflict resolution', 'mentoring', 'collaboration'
];

// --- Simple SVG Radar Chart Component ---
const RadarChart = ({ data, size = 300 }) => {
  const radius = size / 2.5;
  const center = size / 2;
  const levels = 4;
  
  // Convert polar coordinates to cartesian
  const getCoordinates = (angle, value) => {
    const x = center + value * radius * Math.cos(angle);
    const y = center + value * radius * Math.sin(angle);
    return { x, y };
  };

  const domains = Object.keys(data);
  const total = domains.length;
  const angleSlice = (Math.PI * 2) / total;

  // Background Grid
  const gridPoints = Array.from({ length: levels }).map((_, i) => {
    const levelFactor = (i + 1) / levels;
    return domains.map((_, j) => {
      const angle = j * angleSlice - Math.PI / 2;
      const { x, y } = getCoordinates(angle, levelFactor);
      return `${x},${y}`;
    }).join(' ');
  });

  // Data Polygon
  const dataPoints = domains.map((domain, i) => {
    const angle = i * angleSlice - Math.PI / 2;
    // Normalize score (assume max score 15 for full radius)
    const normalizedScore = Math.min(1, data[domain].score / 15); 
    const { x, y } = getCoordinates(angle, normalizedScore);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Grid Lines - Lighter for dark mode */}
      {gridPoints.map((points, i) => (
        <polygon 
          key={i} 
          points={points} 
          fill="none" 
          stroke="#334155" 
          strokeWidth="1" 
        />
      ))}
      
      {/* Axes */}
      {domains.map((domain, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        const { x, y } = getCoordinates(angle, 1);
        return (
          <g key={i}>
            <line x1={center} y1={center} x2={x} y2={y} stroke="#334155" strokeWidth="1" />
            <text 
              x={x} 
              y={y} 
              dy={y < center ? -10 : 20} 
              dx={x < center ? -20 : x > center ? 20 : 0}
              textAnchor="middle" 
              className="text-[10px] fill-slate-400 uppercase font-semibold"
            >
              {domain.split(' ')[0]} 
            </text>
          </g>
        );
      })}

      {/* Data Shape */}
      <polygon 
        points={dataPoints} 
        fill="rgba(99, 102, 241, 0.4)" 
        stroke="#6366f1" 
        strokeWidth="2" 
      />
      
      {/* Data Points */}
      {domains.map((domain, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        const normalizedScore = Math.min(1, data[domain].score / 15);
        const { x, y } = getCoordinates(angle, normalizedScore);
        return (
          <circle key={i} cx={x} cy={y} r="4" fill="#818cf8" />
        );
      })}
    </svg>
  );
};

// --- Circular Progress / Score Gauge Component ---
const ScoreGauge = ({ score }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (s) => {
    if (s >= 80) return 'text-green-400';
    if (s >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="transform -rotate-90 w-full h-full">
        {/* Track - Darker for dark mode */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-slate-800"
        />
        {/* Progress */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ${getColor(score)}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${getColor(score)}`}>{score}</span>
        <span className="text-xs text-slate-500 uppercase font-semibold">Score</span>
      </div>
    </div>
  );
};


export default function CVAnalyzer() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [mammothLoaded, setMammothLoaded] = useState(false);
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const dashboardRef = useRef(null);

  // Load External Libraries (Mammoth for DOCX, html2canvas/jspdf for PDF)
  useEffect(() => {
    const scripts = [
      "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    ];

    let loadedCount = 0;
    
    // Check if scripts are already loaded from a previous mount
    if (window.mammoth) setMammothLoaded(true);
    if (window.html2canvas && window.jspdf) setLibsLoaded(true);

    scripts.forEach(src => {
      // Avoid duplicate script tags
      if (document.querySelector(`script[src="${src}"]`)) {
        loadedCount++;
        if (loadedCount === scripts.length) {
          if (!window.mammoth) setTimeout(() => setMammothLoaded(true), 500);
          else setMammothLoaded(true);
          setLibsLoaded(true);
        }
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        loadedCount++;
        // Check specifically which lib loaded
        if (src.includes('mammoth')) setMammothLoaded(true);
        if (loadedCount === scripts.length) setLibsLoaded(true);
      };
      script.onerror = () => {
         console.error(`Failed to load script: ${src}`);
         // Optionally handle error state here
      };
      document.body.appendChild(script);
    });
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]; // Safe navigation
    if (selectedFile) {
      if (selectedFile.name.endsWith('.docx')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please upload a .docx file.");
      }
    }
  };

  const analyzeCV = async () => {
    if (!file || !mammothLoaded || !window.mammoth) {
        setError("System modules not ready. Please refresh.");
        return;
    }
    setAnalyzing(true);
    
    const reader = new FileReader();
    reader.onload = function(loadEvent) {
      const arrayBuffer = loadEvent.target.result;
      
      window.mammoth.extractRawText({ arrayBuffer: arrayBuffer })
        .then((result) => {
          const text = result.value.toLowerCase();
          performAnalysis(text);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to parse DOCX file. Please ensure it is not corrupted.");
          setAnalyzing(false);
        });
    };
    reader.readAsArrayBuffer(file);
  };

  const performAnalysis = (text) => {
    // 1. Calculate Keyword Matches per Domain
    const scores = {};
    let totalKeywordsFound = 0;
    
    Object.keys(DOMAINS).forEach(domain => {
      const keywords = DOMAINS[domain].keywords;
      const matches = keywords.filter(k => text.includes(k));
      scores[domain] = {
        score: matches.length,
        matches: matches,
        totalKeywords: keywords.length
      };
      totalKeywordsFound += matches.length;
    });

    // 2. Determine Professions
    const sortedDomains = Object.keys(scores).sort((a, b) => scores[b].score - scores[a].score);
    const topDomain = sortedDomains[0];
    const secondaryDomain = sortedDomains[1];
    
    // 3. Extract Soft Skills
    const softSkills = COMMON_SOFT_SKILLS.filter(skill => text.includes(skill));

    // 4. Word Count & Readability
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // 5. Health Score
    let healthScore = 40;
    healthScore += Math.min(40, totalKeywordsFound * 1.5);
    healthScore += Math.min(20, softSkills.length * 3);
    healthScore = Math.min(100, Math.round(healthScore));

    // 6. Experience
    let experienceLevel = 'Entry Level';
    if (totalKeywordsFound > 15 && wordCount > 400) experienceLevel = 'Mid-Level';
    if (totalKeywordsFound > 25 && wordCount > 600) experienceLevel = 'Senior Level';

    // 7. Recommendations
    let recommendedJobs = [];
    const topScore = scores[topDomain].score;
    const secondScore = scores[secondaryDomain].score;

    if (topScore === 0) {
      recommendedJobs = ['Generalist', 'Administrative Assistant', 'Intern'];
    } else {
      recommendedJobs.push(topDomain);
      if (experienceLevel === 'Senior Level') {
        recommendedJobs[0] = `Senior ${topDomain}`;
        recommendedJobs.push(`${topDomain} Lead`);
      }
      if (secondScore > topScore * 0.4) {
        if (topDomain === 'Software Engineer' && secondaryDomain === 'Data Scientist') recommendedJobs.push('Machine Learning Engineer');
        if (topDomain === 'Data Scientist' && secondaryDomain === 'Software Engineer') recommendedJobs.push('Data Engineer');
        if (topDomain === 'Software Engineer' && secondaryDomain === 'Product Manager') recommendedJobs.push('Technical Product Manager');
        if (topDomain === 'Product Manager' && secondaryDomain === 'UI/UX Designer') recommendedJobs.push('Product Designer');
        if (topDomain === 'Marketing Specialist' && secondaryDomain === 'Data Scientist') recommendedJobs.push('Marketing Analyst');
        if (topDomain === 'Business Admin' && secondaryDomain === 'Banking & Finance') recommendedJobs.push('Financial Manager');
      }
    }

    setTimeout(() => {
      setAnalysisResult({
        profession: topDomain,
        secondaryProfession: secondaryDomain,
        scores,
        totalKeywordsFound,
        softSkills,
        stats: { wordCount, readingTime, fileSize: (file.size / 1024).toFixed(2) + ' KB' },
        healthScore,
        experienceLevel,
        recommendedJobs: [...new Set(recommendedJobs)]
      });
      setAnalyzing(false);
    }, 1500);
  };

  const downloadPDF = async () => {
    if (!dashboardRef.current || !window.html2canvas || !window.jspdf) {
        alert("PDF tools are still loading. Please wait a moment.");
        return;
    }

    const btn = document.getElementById('download-btn');
    if(btn) btn.innerText = "Generating PDF...";

    try {
      const canvas = await window.html2canvas(dashboardRef.current, {
        scale: 2, // High resolution
        backgroundColor: '#020617', // Match dark theme bg
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add more pages if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${file.name.replace('.docx', '')}_Analysis.pdf`);
    } catch (err) {
      console.error("PDF Generation failed:", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      if(btn) btn.innerText = "Download Full Report";
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    // DARK THEME: bg-slate-950 (Almost Black), text-slate-200
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 pb-12">
      
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-900/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">CV Intelligence <span className="text-indigo-400">Ultra</span></h1>
          </div>
          <div className="flex items-center gap-4">
             {analysisResult && (
               <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                 {analysisResult.stats.fileSize}
               </span>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Intro / Upload State */}
        {!analysisResult && !analyzing && (
          <div className="animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto mt-12">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6 tracking-tight">
                Curriculum Vitae Analyze
              </h2>
              <p className="text-lg text-slate-400">
                AI-driven insights for your resume. Decode your career DNA in seconds.
              </p>
            </div>

            {/* Dark Mode Upload Card */}
            <div className="bg-slate-900 rounded-2xl shadow-2xl shadow-black border border-slate-800 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="p-10 relative z-10">
                <div className="border-2 border-dashed border-slate-700 rounded-xl bg-slate-950/50 p-12 text-center hover:bg-slate-800/50 hover:border-indigo-500/50 transition-all duration-300 relative">
                  <input 
                    type="file" 
                    accept=".docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center gap-4 relative">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-indigo-400 shadow-inner group-hover:scale-110 transition-transform duration-300 border border-slate-700">
                      <Upload className="w-10 h-10" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-200">
                        {file ? file.name : "Upload Resume (.docx)"}
                      </p>
                      <p className="text-sm text-slate-500 mt-2">
                        Drag & drop or click to browse
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 text-red-400 text-sm rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={analyzeCV}
                  disabled={!file || !mammothLoaded}
                  className={`w-full mt-8 py-4 px-6 rounded-xl font-bold text-lg text-white shadow-lg transition-all 
                    ${!file 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                      : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 border border-indigo-500'
                    }`}
                >
                  {mammothLoaded ? 'Initialize Analysis' : 'Loading Engine...'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State - Dark Mode */}
        {analyzing && (
          <div className="max-w-xl mx-auto text-center py-32">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
              <Briefcase className="absolute inset-0 m-auto text-indigo-400 w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-2">Decryption in Progress...</h3>
            <p className="text-slate-500">Parsing keywords, mapping skills, and generating vector charts.</p>
          </div>
        )}

        {/* Dashboard - Reference for PDF Capture */}
        {analysisResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-xl">
               <button 
                  onClick={resetAnalysis}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Reset
               </button>
               <button 
                  id="download-btn"
                  onClick={downloadPDF}
                  disabled={!libsLoaded}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-900/50"
               >
                  <Download className="w-4 h-4" />
                  {libsLoaded ? 'Download Full Report' : 'Loading PDF Tools...'}
               </button>
            </div>

            {/* PRINTABLE AREA STARTS HERE */}
            <div ref={dashboardRef} id="dashboard-content" className="bg-slate-950 p-2 md:p-6 rounded-none md:rounded-3xl">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
                {/* 1. Executive Summary Card */}
                <div className="lg:col-span-12 bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="flex items-center gap-8">
                      {/* Gauge */}
                      <div className="flex-shrink-0">
                        <ScoreGauge score={analysisResult.healthScore} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider border border-indigo-500/30 px-2 py-0.5 rounded">Primary Profile</span>
                        </div>
                        <h2 className={`text-3xl md:text-5xl font-black ${DOMAINS[analysisResult.profession]?.color || 'text-white'} mb-3`}>
                          {analysisResult.profession}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm font-semibold border border-slate-700">
                            {analysisResult.experienceLevel}
                          </span>
                          <span className="px-3 py-1 bg-slate-800 text-indigo-300 rounded-full text-sm font-semibold border border-slate-700">
                            {analysisResult.totalKeywordsFound} Keywords Detected
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto text-right">
                      <h4 className="text-xs font-bold text-slate-500 uppercase">AI Recommended Roles</h4>
                      <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                        {analysisResult.recommendedJobs.map((job, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg shadow-md text-sm font-medium">
                            <Target className="w-4 h-4 text-indigo-500" />
                            {job}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Left Col: Skill Radar & Soft Skills */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Radar Chart */}
                  <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col items-center">
                    <h3 className="text-lg font-bold text-slate-200 mb-6 w-full flex items-center gap-2 border-b border-slate-800 pb-4">
                      <Activity className="w-5 h-5 text-indigo-400" />
                      Competency Matrix
                    </h3>
                    <div className="relative py-4">
                      <RadarChart data={analysisResult.scores} size={280} />
                    </div>
                  </div>

                  {/* Soft Skills */}
                  <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800">
                    <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2 border-b border-slate-800 pb-4">
                      <Award className="w-5 h-5 text-pink-400" />
                      Soft Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.softSkills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-pink-500/10 text-pink-300 border border-pink-500/20 rounded-lg text-sm font-medium capitalize flex items-center gap-1.5">
                          <Zap className="w-3 h-3" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Center Col: Detailed Domain Breakdown */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 h-full">
                    <h3 className="text-lg font-bold text-slate-200 mb-6 border-b border-slate-800 pb-4">Domain Proficiency</h3>
                    <div className="space-y-6">
                      {Object.keys(DOMAINS).map((domain) => {
                        const data = analysisResult.scores[domain];
                        const score = data.score;
                        if (score === 0) return null;

                        const percentage = Math.min(100, (score / 15) * 100);
                        const DomainIcon = DOMAINS[domain].icon;
                        
                        return (
                          <div key={domain} className="group">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-md ${DOMAINS[domain].bgLight} ${DOMAINS[domain].border} border`}>
                                  <DomainIcon className={`w-4 h-4 ${DOMAINS[domain].color}`} />
                                </div>
                                <span className="text-sm font-bold text-slate-300">{domain}</span>
                              </div>
                              <span className="text-sm font-medium text-slate-500">{score} matches</span>
                            </div>
                            
                            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-2 border border-slate-700">
                              <div 
                                className={`h-2.5 rounded-full ${DOMAINS[domain].bgColor} shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-all duration-1000`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>

                            {(domain === analysisResult.profession || domain === analysisResult.secondaryProfession) && (
                              <div className="flex flex-wrap gap-1.5 mt-2 opacity-100">
                                {data.matches.map((k, i) => (
                                  <span key={i} className="text-[10px] uppercase font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                    {k}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Col: Improvements */}
                <div className="lg:col-span-3 space-y-6">
                  
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                    <div className="bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-800 text-center">
                      <p className="text-xs font-bold text-slate-500 uppercase">Readability</p>
                      <p className="text-2xl font-bold text-white">{analysisResult.stats.readingTime} <span className="text-sm text-slate-500 font-normal">min</span></p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-800 text-center">
                      <p className="text-xs font-bold text-slate-500 uppercase">Word Count</p>
                      <p className="text-2xl font-bold text-white">{analysisResult.stats.wordCount}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 h-full">
                    <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2 uppercase tracking-wide border-b border-slate-800 pb-4">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      Optimization Gaps
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Missing keywords for <strong className="text-slate-300">{analysisResult.profession}</strong>:
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {DOMAINS[analysisResult.profession].keywords
                        .filter(k => !analysisResult.scores[analysisResult.profession].matches.includes(k))
                        .slice(0, 10)
                        .map((keyword, idx) => (
                          <span key={idx} className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-xs font-medium">
                            + {keyword}
                          </span>
                        ))
                      }
                      {DOMAINS[analysisResult.profession].keywords.every(k => analysisResult.scores[analysisResult.profession].matches.includes(k)) && (
                        <p className="text-green-400 text-sm font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4"/> 100% Optimized
                        </p>
                      )}
                    </div>
                  </div>

                </div>

              </div>
              <div className="text-center mt-8 text-slate-600 text-xs">
                 Generated by CV Intelligence Ultra • {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}