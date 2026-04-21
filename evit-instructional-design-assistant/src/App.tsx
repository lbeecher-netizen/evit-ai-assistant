/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { generateCourseMaterial } from './services/geminiService';
import { PROGRAMS } from './constants/blueprints';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { 
  Sparkles, 
  Layout, 
  CheckSquare, 
  Send, 
  Copy, 
  Check, 
  Loader2,
  FileText,
  AlertCircle,
  Eraser,
  BookOpen,
  ChevronDown,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TemplateType = 'Lesson Plan' | 'Storyboard' | 'Assessment Key' | 'Vocabulary List';

export default function App() {
  const [selectedProgram, setSelectedProgram] = useState<string>(PROGRAMS[0]);
  const [selectedModule, setSelectedModule] = useState<string>('All Modules');
  const [blueprint, setBlueprint] = useState('');
  const [templateType, setTemplateType] = useState<TemplateType>('Lesson Plan');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [error, setError] = useState<string | null>(null);
  const renderedRef = useRef<HTMLDivElement>(null);
  
  // Reset blueprint when program changes
  useEffect(() => {
    setBlueprint('');
    setSelectedModule('All Modules');
  }, [selectedProgram]);

  const handleGenerate = async () => {
    const dataToUse = blueprint.trim();
    if (!dataToUse) {
      setError('Please select a module or provide blueprint data before generating.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setGeneratedContent('');
      await generateCourseMaterial(dataToUse, templateType, selectedProgram, selectedModule, (chunk) => {
        setGeneratedContent(prev => prev + chunk);
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating the material. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (viewMode === 'rendered' && renderedRef.current) {
      try {
        const html = renderedRef.current.innerHTML;
        const text = generatedContent;
        
        // Create a blob with the HTML content
        // We wrap it in a basic HTML structure to ensure better compatibility
        const fullHtml = `
          <html>
            <head>
              <style>
                body { font-family: sans-serif; }
                .markdown-body { line-height: 1.5; }
                b, strong { font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="markdown-body">
                ${html}
              </div>
            </body>
          </html>
        `;

        const clipboardItem = new ClipboardItem({
          'text/plain': new Blob([text], { type: 'text/plain' }),
          'text/html': new Blob([fullHtml], { type: 'text/html' }),
        });
        
        await navigator.clipboard.write([clipboardItem]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Rich text copy failed, falling back to plain text:', err);
        navigator.clipboard.writeText(generatedContent);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } else {
      navigator.clipboard.writeText(generatedContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all content and start over?')) {
      setBlueprint('');
      setGeneratedContent('');
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans selection:bg-[#002855] selection:text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-[#141414]/10 bg-white/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#002855] rounded-full flex items-center justify-center text-white">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-xl font-serif italic font-bold tracking-tight">EVIT Course Assistant</h1>
              <div className="flex items-center gap-2">
                <p className="text-[10px] uppercase tracking-widest opacity-50 font-mono">Instructional Design</p>
                <span className="w-1 h-1 bg-[#FFC72C] rounded-full" />
                <p className="text-[10px] uppercase tracking-widest text-[#002855] font-bold">{selectedProgram} Focus</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-6 text-xs font-medium uppercase tracking-wider opacity-70 mr-2">
              <span className="text-[#002855]">AP Style</span>
              <span className="text-[#002855]">Standardized</span>
            </div>
            <div className="h-6 w-[1px] bg-black/10 hidden sm:block" />
            <button 
              onClick={handleClear}
              className="p-2 hover:bg-black/5 rounded-full transition-colors opacity-40 hover:opacity-100"
              title="Clear All"
            >
              <Eraser size={18} />
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#141414] text-white rounded-full font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-[#002855] transition-all duration-500 disabled:opacity-50 group shadow-md"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <>
                  Generate
                  <Send size={12} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
        {/* Input Section (Left) */}
        <section className="lg:col-span-4 space-y-6 flex flex-col h-full">
          {/* Program Selection */}
          <div className="space-y-4">
            <label className="text-[11px] uppercase tracking-[0.2em] font-mono opacity-50 block">
              01. Select Program
            </label>
            <div className="relative">
              <select
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full bg-white border border-[#141414]/10 p-3 rounded-xl text-xs font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-[#002855]/20 pr-10"
                value={selectedProgram}
              >
                {PROGRAMS.map(prog => (
                  <option key={prog} value={prog}>{prog}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" size={14} />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] uppercase tracking-[0.2em] font-mono opacity-50 block">
              02. Select Module
            </label>
            <div className="relative">
              <select
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full bg-white border border-[#141414]/10 p-3 rounded-xl text-xs font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-[#002855]/20 pr-10"
                value={selectedModule}
              >
                <option value="All Modules">All Modules</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={`Module ${i + 1}`}>Module {i + 1}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" size={14} />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] uppercase tracking-[0.2em] font-mono opacity-50 block">
              03. Template
            </label>
            <div className="flex flex-col gap-2">
              {(['Lesson Plan', 'Storyboard', 'Assessment Key', 'Vocabulary List'] as TemplateType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setTemplateType(type)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                    templateType === type
                      ? 'bg-[#002855] border-[#002855] text-white shadow-md'
                      : 'bg-white border-[#141414]/10 hover:border-[#002855]/50 text-[#141414]/70'
                  }`}
                >
                  {type === 'Lesson Plan' && <FileText size={16} />}
                  {type === 'Storyboard' && <Layout size={16} />}
                  {type === 'Assessment Key' && <CheckSquare size={16} />}
                  {type === 'Vocabulary List' && <BookOpen size={16} />}
                  <span className="text-[10px] font-bold uppercase tracking-tight">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            <label className="text-[11px] uppercase tracking-[0.2em] font-mono opacity-50 block">
              04. Blueprint Data
            </label>
            <div className="relative flex-1">
              <textarea
                value={blueprint}
                onChange={(e) => setBlueprint(e.target.value)}
                placeholder="Paste blueprint data here..."
                className="w-full h-full p-4 bg-white border border-[#141414]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all resize-none text-xs leading-relaxed font-mono"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-[10px]"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}
        </section>

        {/* Preview Section (Right) */}
        <section className="lg:col-span-8 space-y-4 flex flex-col h-full min-h-0">
          <div className="flex items-center justify-between">
            <label className="text-[11px] uppercase tracking-[0.2em] font-mono opacity-50">
              05. Preview
            </label>
            <div className="flex items-center gap-4">
              {generatedContent && (
                <div className="flex bg-white/50 border border-[#141414]/10 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('rendered')}
                    className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${
                      viewMode === 'rendered' 
                        ? 'bg-[#002855] text-white shadow-sm' 
                        : 'text-[#141414]/40 hover:text-[#141414]'
                    }`}
                  >
                    Rendered
                  </button>
                  <button
                    onClick={() => setViewMode('raw')}
                    className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${
                      viewMode === 'raw' 
                        ? 'bg-[#002855] text-white shadow-sm' 
                        : 'text-[#141414]/40 hover:text-[#141414]'
                    }`}
                  >
                    Raw
                  </button>
                </div>
              )}
              {generatedContent && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] hover:opacity-70 transition-opacity"
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy for Google Docs
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#F5F5F0] border border-[#141414]/10 rounded-[2rem] flex-1 p-4 sm:p-8 shadow-inner relative overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {!generatedContent && !isLoading ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-4"
                >
                  <div className="w-16 h-16 bg-[#F5F5F0] rounded-full flex items-center justify-center text-[#141414]/20">
                    <Sparkles size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif italic text-lg opacity-40">{selectedProgram} Assistant</h3>
                    <p className="text-xs opacity-30 max-w-[240px] leading-relaxed">
                      Generate high-quality course materials for the EVIT {selectedProgram} program.
                    </p>
                  </div>
                </motion.div>
              ) : isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center space-y-6"
                >
                  <div className="relative">
                    <div className="w-12 h-12 border-2 border-[#5A5A40]/10 border-t-[#5A5A40] rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#5A5A40] rounded-full animate-pulse" />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5A5A40]">Generating...</p>
                </motion.div>
              ) : (
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full"
                >
                  {viewMode === 'rendered' ? (
                    <div className="bg-white min-h-full shadow-[0_0_50px_rgba(0,0,0,0.05)] mx-auto max-w-[850px] p-[1in] border border-gray-100 rounded-sm">
                      <div id="rendered-preview" className="markdown-body" ref={renderedRef}>
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm, remarkBreaks]} 
                          rehypePlugins={[rehypeRaw]}
                        >
                          {generatedContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <pre className="text-[11px] font-mono whitespace-pre-wrap break-words leading-relaxed text-[#141414]/80 bg-[#F5F5F0]/30 p-4 rounded-xl border border-[#141414]/5 h-full overflow-y-auto custom-scrollbar">
                      {generatedContent}
                    </pre>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(20, 20, 20, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
