import React from 'react';
import { ExamResult } from '../types';
import { Clock, Trash2, ChevronRight, FileText } from 'lucide-react';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: ExamResult[];
  onSelect: (item: ExamResult) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  isOpen, onClose, history, onSelect, onDelete, onClearAll 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Sidebar */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="p-4 border-b flex items-center justify-between bg-indigo-50">
          <div className="flex items-center space-x-2 text-indigo-900 font-bold">
            <Clock size={20} />
            <span>Riwayat Soal</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <p>Belum ada riwayat soal.</p>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow relative group">
                <div 
                  className="cursor-pointer"
                  onClick={() => { onSelect(item); onClose(); }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-indigo-600 text-sm uppercase">{item.config.subject}</h4>
                    <span className="text-xs text-gray-400">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{item.config.level} • {item.config.questionType}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <FileText size={12} className="mr-1" />
                    {item.questions.length} Soal
                  </div>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                  className="absolute right-3 bottom-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                   <ChevronRight size={16} />
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <button 
              onClick={onClearAll}
              className="w-full flex items-center justify-center space-x-2 text-red-500 hover:text-red-700 text-sm font-medium py-2 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} />
              <span>Hapus Semua Riwayat</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
