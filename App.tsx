import React, { useState, useEffect } from 'react';
import { History, Menu, Sparkles } from 'lucide-react';
import FormSection from './components/FormSection';
import ResultSection from './components/ResultSection';
import HistorySidebar from './components/HistorySidebar';
import { ExamConfig, ExamResult, QuestionType, DifficultyLevel } from './types';
import { generateExamQuestions } from './services/geminiService';

const DEFAULT_CONFIG: ExamConfig = {
  mode: 'sekolah',
  language: 'Bahasa Indonesia',
  level: '',
  grade: '',
  subject: '',
  curriculum: 'Kurikulum Merdeka (Kemendikbudristek)',
  assessmentType: '',
  topic: '',
  competency: '',
  questionType: QuestionType.MULTIPLE_CHOICE,
  totalQuestions: 5,
  difficulty: DifficultyLevel.LEVEL_2
};

function App() {
  const [config, setConfig] = useState<ExamConfig>(DEFAULT_CONFIG);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [history, setHistory] = useState<ExamResult[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('examHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem('examHistory', JSON.stringify(history));
  }, [history]);

  const handleConfigChange = (field: keyof ExamConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null); // Clear previous result while loading
    
    // Simulate slight delay for UI feedback if API is too fast
    // await new Promise(r => setTimeout(r, 800));

    try {
      const newResult = await generateExamQuestions(config);
      setResult(newResult);
      setHistory(prev => [newResult, ...prev]);
    } catch (error) {
      alert("Gagal membuat soal. Pastikan API KEY sudah benar atau coba lagi nanti.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHistorySelect = (item: ExamResult) => {
    setResult(item);
    setConfig(item.config); // Restore config as well
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    if (result?.id === id) {
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Sparkles className="text-white" size={20} />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">Aplikasi BIKIN SOAL CEPAT SMPN 1 PRIGEN</h1>
          </div>
          
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
            title="Riwayat Soal"
          >
            <History size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0 lg:sticky lg:top-24">
            <FormSection 
              config={config} 
              onChange={handleConfigChange} 
              onSubmit={handleGenerate}
              isGenerating={isGenerating}
            />
             <div className="mt-4 text-center text-xs text-gray-400">
                <p>@2025 akanghida-spentugen</p>
             </div>
          </div>

          {/* Right Column: Result or Loading */}
          <div className="w-full lg:w-2/3 xl:w-3/4 min-h-[500px]">
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border p-12 text-center">
                 <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-6"></div>
                 <h2 className="text-xl font-bold text-gray-800">Sedang Menyusun Soal...</h2>
                 <p className="text-gray-500 mt-2 max-w-md">AI sedang menganalisis kurikulum, tingkat kesulitan, dan topik untuk membuat paket soal yang berkualitas untuk Anda.</p>
              </div>
            ) : result ? (
              <ResultSection result={result} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white/50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Sparkles className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Belum ada soal yang dibuat</h3>
                <p className="text-gray-500 mt-1 max-w-xs mx-auto">Isi formulir di sebelah kiri dan klik "Generate Soal" untuk mulai membuat ujian.</p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* History Sidebar */}
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleHistorySelect}
        onDelete={handleDeleteHistory}
        onClearAll={() => {
            if(window.confirm('Yakin ingin menghapus semua riwayat?')) {
                setHistory([]);
                setResult(null);
            }
        }}
      />
    </div>
  );
}

export default App;