import React from 'react';
import { ExamConfig, QuestionType, DifficultyLevel } from '../types';
import { School, Zap, Languages, GraduationCap, BookOpen, Layers, CheckSquare } from 'lucide-react';

interface FormSectionProps {
  config: ExamConfig;
  onChange: (field: keyof ExamConfig, value: any) => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({ config, onChange, onSubmit, isGenerating }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Mode Tabs */}
      <div className="grid grid-cols-2 border-b">
        <button 
          className={`flex items-center justify-center space-x-2 py-4 font-medium transition-colors ${config.mode === 'sekolah' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          onClick={() => onChange('mode', 'sekolah')}
        >
          <School size={20} />
          <span>GURU SEKOLAH</span>
        </button>
        <button 
          className={`flex items-center justify-center space-x-2 py-4 font-medium transition-colors ${config.mode === 'bimbel' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          onClick={() => onChange('mode', 'bimbel')}
        >
          <Zap size={20} />
          <span>GURU BIMBEL</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Section Header */}
        <div className="flex items-center space-x-2 text-indigo-900 font-bold border-b pb-2">
          <BookOpen size={18} />
          <span className="uppercase tracking-wide text-sm">Identitas & Materi</span>
        </div>

        {/* Form Grid */}
        <div className="space-y-4">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
              <Languages size={14} className="mr-1 text-gray-400" /> Bahasa Pengantar
            </label>
            <select 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              value={config.language}
              onChange={(e) => onChange('language', e.target.value)}
            >
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="Bahasa Inggris">Bahasa Inggris</option>
              <option value="Bahasa Arab">Bahasa Arab</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Jenjang</label>
              <select 
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 bg-white"
                value={config.level}
                onChange={(e) => onChange('level', e.target.value)}
              >
                <option value="">Pilih Jenjang</option>
                <option value="PAUD / TK">PAUD / TK</option>
                <option value="SD / MI">SD / MI</option>
                <option value="SMP / MTs">SMP / MTs</option>
                <option value="SMA / MA / SMK">SMA / MA / SMK</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kelas / Tingkat</label>
              <select 
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 bg-white"
                value={config.grade}
                onChange={(e) => onChange('grade', e.target.value)}
              >
                <option value="">Pilih Kelas</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={`Kelas ${i+1}`}>Kelas {i+1}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mata Pelajaran</label>
            <select 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 bg-white"
              value={config.subject}
              onChange={(e) => onChange('subject', e.target.value)}
            >
              <option value="">Pilih Mapel</option>
              <option value="Matematika">Matematika</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="IPA (Terpadu)">IPA (Terpadu)</option>
              <option value="IPS (Terpadu)">IPS (Terpadu)</option>
              <option value="Biologi">Biologi</option>
              <option value="Fisika">Fisika</option>
              <option value="Kimia">Kimia</option>
              <option value="Sejarah">Sejarah</option>
              <option value="Geografi">Geografi</option>
              <option value="Sosiologi">Sosiologi</option>
              <option value="Ekonomi">Ekonomi</option>
              <option value="Bahasa Inggris">Bahasa Inggris</option>
              <option value="Bahasa Jawa">Bahasa Jawa</option>
              <option value="PKN">PKN</option>
              <option value="PAI">PAI</option>
              <option value="Pendidikan Agama Kristen">Pendidikan Agama Kristen</option>
              <option value="Pendidikan Agama Hindu">Pendidikan Agama Hindu</option>
              <option value="Pendidikan Agama Budha">Pendidikan Agama Budha</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kurikulum</label>
            <select 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 bg-white"
              value={config.curriculum}
              onChange={(e) => onChange('curriculum', e.target.value)}
            >
              <option value="Kurikulum Merdeka (Kemendikbudristek)">Kurikulum Merdeka (Kemendikbudristek)</option>
              <option value="Kurikulum 2013">Kurikulum 2013</option>
              <option value="Cambridge">Cambridge</option>
            </select>
          </div>

           <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Semester / Momen Asesmen</label>
            <select 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 bg-white"
              value={config.assessmentType}
              onChange={(e) => onChange('assessmentType', e.target.value)}
            >
              <option value="">-- Pilih Program --</option>
              <option value="Ulangan Harian">Ulangan Harian (Formatif)</option>
              <option value="PTS / STS (Tengah Semester)">PTS / STS (Tengah Semester)</option>
              <option value="PAS / SAS (Akhir Semester)">PAS / SAS (Akhir Semester)</option>
              <option value="Asesmen Diagnostik">Asesmen Diagnostik</option>
              <option value="AKM / ANBK">AKM / ANBK</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Topik / Materi Utama</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              placeholder="Misal: Hukum Newton, Ekosistem"
              value={config.topic}
              onChange={(e) => onChange('topic', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kompetensi Dasar (CP/TP)</label>
            <div className="relative">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-indigo-500 bg-indigo-50/30"
                  placeholder="Otomatis (AI) - atau ketik manual..."
                  value={config.competency || ''}
                  onChange={(e) => onChange('competency', e.target.value)}
                />
                <div className="absolute left-3 top-3 text-indigo-500">
                    <Zap size={16} />
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Biarkan kosong agar AI memilihkan CP/KD yang paling relevan.</p>
          </div>
        </div>

        {/* Technical Config */}
        <div className="flex items-center space-x-2 text-indigo-900 font-bold border-b pb-2 pt-4">
          <Layers size={18} />
          <span className="uppercase tracking-wide text-sm">Konfigurasi Teknis</span>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Jenis Soal</label>
          <div className="space-y-2">
            {Object.values(QuestionType).map((type) => (
              <label key={type} className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors ${config.questionType === type ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="questionType" 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  checked={config.questionType === type}
                  onChange={() => onChange('questionType', type)}
                />
                <span className="ml-3 block text-sm font-medium text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Total Jumlah Soal</label>
                 <input 
                    type="number" 
                    min="1"
                    max="50"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                    value={config.totalQuestions}
                    onChange={(e) => onChange('totalQuestions', parseInt(e.target.value) || 5)}
                 />
            </div>
            <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Tingkat Kesulitan</label>
                 <select 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={config.difficulty}
                  onChange={(e) => onChange('difficulty', e.target.value)}
                 >
                    {Object.values(DifficultyLevel).map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                 </select>
            </div>
        </div>

        <button 
          onClick={onSubmit}
          disabled={isGenerating || !config.topic}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform active:scale-95 transition-all flex items-center justify-center space-x-2
            ${isGenerating || !config.topic ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'}`}
        >
          <Zap fill="currentColor" size={20} />
          <span>{isGenerating ? 'SEDANG MENYUSUN...' : 'GENERATE SOAL'}</span>
        </button>

      </div>
    </div>
  );
};

export default FormSection;