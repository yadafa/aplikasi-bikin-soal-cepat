import React, { useState } from 'react';
import { ExamResult, QuestionType } from '../types';
import { User, GraduationCap, Copy, Download, Printer, CheckCircle, PieChart, Search, Edit3 } from 'lucide-react';

interface ResultSectionProps {
  result: ExamResult | null;
}

const ResultSection: React.FC<ResultSectionProps> = ({ result }) => {
  const [viewMode, setViewMode] = useState<'teacher' | 'student'>('teacher');

  if (!result) return null;

  const handleDownloadWord = () => {
    // Helper to render options in Word format
    const renderOptionsForWord = (q: any) => {
        if (q.type === QuestionType.MULTIPLE_CHOICE) {
            return (q.options || []).map((opt: string, i: number) => 
                `<p style="margin: 0 0 5px 20px; font-family: Calibri, sans-serif;">${String.fromCharCode(65+i)}. ${opt}</p>`
            ).join('');
        }
        if (q.type === QuestionType.COMPLEX_MULTIPLE_CHOICE) {
            return (q.options || []).map((opt: string) => 
                `<p style="margin: 0 0 5px 20px; font-family: Calibri, sans-serif;">☐ ${opt}</p>`
            ).join('');
        }
        if (q.type === QuestionType.TRUE_FALSE) {
            return `<p style="margin: 0 0 5px 20px; font-family: Calibri, sans-serif;">◯ Benar &nbsp;&nbsp;&nbsp;&nbsp; ◯ Salah</p>`;
        }
        // Essay default space
        return `<p style="margin: 10px 0 20px 0;">__________________________________________________________________________________________</p>`;
    };

    const content = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>${result.title}</title>
            <style>
                body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; }
                .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .header-table td { padding: 4px; vertical-align: top; }
                .q-container { margin-bottom: 15px; page-break-inside: avoid; }
                .answer-box { background-color: #fef9c3; padding: 10px; border: 1px solid #fde047; margin-top: 10px; font-size: 10pt; }
            </style>
        </head>
        <body>
            <h2 style="text-align: center; margin-bottom: 5px; text-transform: uppercase;">PAKET SOAL UJIAN ${result.config.subject}</h2>
            <h3 style="text-align: center; margin-top: 0; margin-bottom: 20px; text-transform: uppercase;">${result.config.assessmentType}</h3>
            
            <table class="header-table">
                <tr><td width="150"><b>Mata Pelajaran</b></td><td>: ${result.config.subject}</td></tr>
                <tr><td><b>Kelas / Tingkat</b></td><td>: ${result.config.grade}</td></tr>
                <tr><td><b>Jenjang</b></td><td>: ${result.config.level}</td></tr>
                <tr><td><b>Kurikulum</b></td><td>: ${result.config.curriculum.split('(')[0]}</td></tr>
                <tr><td><b>Kompetensi</b></td><td>: ${result.basicCompetency || '-'}</td></tr>
                <tr><td><b>Waktu</b></td><td>: ${result.config.totalQuestions * 3} Menit</td></tr>
            </table>
            <hr/>
            
            <h3>SOAL ${result.config.questionType.toUpperCase()}</h3>
            
            ${result.questions.map((q, i) => `
                <div class="q-container">
                    <p style="margin-bottom: 5px;"><b>${i + 1}.</b> ${q.text}</p>
                    ${renderOptionsForWord(q)}
                    
                    ${viewMode === 'teacher' ? `
                        <div class="answer-box">
                            <b>Kunci Jawaban:</b> ${Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}<br/>
                            <b>Pembahasan:</b> ${q.explanation}
                        </div>
                    ` : ''}
                </div>
            `).join('')}

             ${viewMode === 'teacher' && result.rubric ? `
                <br/><hr/>
                <h3>Rubrik Penilaian</h3>
                <div>${result.rubric}</div>
            ` : ''}
        </body>
        </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Soal_${result.config.subject.replace(/\s+/g, '_')}_${result.config.grade.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderQuestionInput = (question: any) => {
    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <div className="space-y-2 mt-3 pl-2">
            {question.options?.map((opt: string, idx: number) => (
              <div key={idx} className="flex items-start">
                <div className="flex items-center h-5">
                  <input type="radio" name={`q-${question.number}`} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                </div>
                <div className="ml-3 text-sm text-gray-700">{opt}</div>
              </div>
            ))}
          </div>
        );
      case QuestionType.COMPLEX_MULTIPLE_CHOICE:
        return (
          <div className="space-y-2 mt-3 pl-2">
            {question.options?.map((opt: string, idx: number) => (
              <div key={idx} className="flex items-start">
                <div className="flex items-center h-5">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                </div>
                <div className="ml-3 text-sm text-gray-700">{opt}</div>
              </div>
            ))}
          </div>
        );
       case QuestionType.TRUE_FALSE:
        return (
          <div className="space-y-2 mt-3 pl-2">
             <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                     <input type="radio" name={`q-${question.number}`} className="h-4 w-4 text-indigo-600" />
                     <span className="text-sm">Benar</span>
                </label>
                <label className="flex items-center space-x-2">
                     <input type="radio" name={`q-${question.number}`} className="h-4 w-4 text-indigo-600" />
                     <span className="text-sm">Salah</span>
                </label>
             </div>
          </div>
        );
      default: // Essay
        return (
          <div className="mt-3">
             <textarea className="w-full border border-gray-300 rounded-md p-2 h-24 bg-gray-50" placeholder="Tulis jawaban disini..."></textarea>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Toolbar */}
      <div className="bg-indigo-900 text-white p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-indigo-800 rounded-lg p-1">
          <button 
            onClick={() => setViewMode('teacher')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'teacher' ? 'bg-white text-indigo-900 shadow-sm' : 'text-indigo-200 hover:text-white'}`}
          >
            <User size={16} className="mr-2" />
            Mode Guru (Lengkap)
          </button>
          <button 
            onClick={() => setViewMode('student')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'student' ? 'bg-white text-indigo-900 shadow-sm' : 'text-indigo-200 hover:text-white'}`}
          >
            <GraduationCap size={16} className="mr-2" />
            Mode Siswa (Siap Cetak)
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 bg-indigo-700 hover:bg-indigo-600 rounded text-xs font-medium transition-colors">
                <PieChart size={14} className="mr-1"/> Analisis
            </button>
            <button className="flex items-center px-3 py-2 bg-indigo-700 hover:bg-indigo-600 rounded text-xs font-medium transition-colors">
                <CheckCircle size={14} className="mr-1"/> Quality Check
            </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border-b p-3 flex justify-between items-center overflow-x-auto">
         <div className="flex space-x-2">
            <button 
                onClick={() => navigator.clipboard.writeText(document.getElementById('print-area')?.innerText || '')}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
            >
                <Copy size={16} className="mr-2"/> Salin Teks
            </button>
            <button 
                onClick={handleDownloadWord}
                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm shadow-sm font-medium"
            >
                <Download size={16} className="mr-2"/> Download Word
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm shadow-sm font-medium"
            >
                <Printer size={16} className="mr-2"/> Cetak
            </button>
         </div>
      </div>

      {/* Exam Paper Preview - ID print-area moved to the inner paper div for better print control */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 min-h-[800px]" id="print-area">
          
          {/* Header */}
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h2 className="text-xl font-bold uppercase tracking-wider">PAKET SOAL UJIAN {result.config.subject.toUpperCase()}</h2>
            <h3 className="text-lg font-semibold mt-1">{result.config.assessmentType.toUpperCase()}</h3>
          </div>

          <table className="w-full text-sm mb-6 font-medium text-gray-800">
             <tbody>
                <tr>
                    <td className="w-32 py-1">Mata Pelajaran</td>
                    <td>: {result.config.subject}</td>
                </tr>
                <tr>
                    <td className="w-32 py-1">Kelas / Tingkat</td>
                    <td>: {result.config.grade}</td>
                </tr>
                <tr>
                    <td className="w-32 py-1">Jenjang</td>
                    <td>: {result.config.level}</td>
                </tr>
                <tr>
                    <td className="w-32 py-1">Kurikulum</td>
                    <td>: {result.config.curriculum.split('(')[0]}</td>
                </tr>
                 <tr>
                    <td className="w-32 py-1 align-top">Kompetensi</td>
                    <td>: {result.basicCompetency || '-'}</td>
                </tr>
                <tr>
                    <td className="w-32 py-1">Waktu</td>
                    <td>: {result.config.totalQuestions * 3} Menit</td>
                </tr>
             </tbody>
          </table>

          {/* Questions */}
          <div className="space-y-8">
            <div className="border-l-4 border-indigo-500 pl-4 bg-indigo-50 py-2 rounded-r mb-6 print:hidden">
                <h4 className="font-bold text-indigo-900 text-sm uppercase mb-1">SOAL {result.config.questionType.toUpperCase()}</h4>
                <p className="text-xs text-indigo-700">Pilihlah jawaban yang menurut anda paling benar.</p>
            </div>

            {result.questions.map((q, idx) => (
              <div key={idx} className="break-inside-avoid">
                <div className="flex gap-2">
                    <span className="font-bold">{idx + 1}.</span>
                    <div className="flex-1">
                        <p className="text-justify leading-relaxed">{q.text}</p>
                        {renderQuestionInput(q)}
                    </div>
                </div>
                
                {/* Teacher Only: Answer Key & Explanation - Removed print:hidden so it respects viewMode on print */}
                {viewMode === 'teacher' && (
                    <div className="mt-4 ml-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                        <h5 className="font-bold text-yellow-800 flex items-center mb-2">
                            <CheckCircle size={14} className="mr-1"/> Kunci Jawaban:
                        </h5>
                        <p className="mb-3 font-mono text-gray-800 font-medium">{Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}</p>
                        
                        <h5 className="font-bold text-yellow-800 flex items-center mb-1">
                            <Search size={14} className="mr-1"/> Pembahasan:
                        </h5>
                        <p className="text-gray-700">{q.explanation}</p>
                    </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer / Rubric */}
           {viewMode === 'teacher' && result.rubric && (
               <div className="mt-12 pt-6 border-t print:break-before-page">
                   <h4 className="font-bold text-lg mb-4">Rubrik Penilaian & Catatan</h4>
                   <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg">
                       {result.rubric}
                   </div>
               </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default ResultSection;