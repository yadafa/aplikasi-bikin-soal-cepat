export enum QuestionType {
  MULTIPLE_CHOICE = 'Pilihan Ganda',
  COMPLEX_MULTIPLE_CHOICE = 'Pilihan Ganda Kompleks',
  TRUE_FALSE = 'Benar / Salah',
  MATCHING = 'Menjodohkan',
  ESSAY = 'Uraian / Essay'
}

export enum DifficultyLevel {
  LEVEL_1 = 'Level 1: Mudah (Pemahaman Dasar)',
  LEVEL_2 = 'Level 2: Sedang (Aplikasi)',
  LEVEL_3 = 'Level 3: Sulit (Analisis)',
  HOTS = 'HOTS (Evaluasi & Kreasi)'
}

export interface ExamConfig {
  mode: 'sekolah' | 'bimbel';
  language: string;
  level: string;
  grade: string;
  subject: string;
  curriculum: string;
  assessmentType: string;
  topic: string;
  subTopic?: string;
  competency?: string;
  questionType: QuestionType;
  totalQuestions: number;
  difficulty: DifficultyLevel;
}

export interface GeneratedQuestion {
  number: number;
  text: string;
  options?: string[]; // For MC and Complex MC
  correctAnswer: string | string[]; // String for MC, Array for Complex
  explanation: string;
  type: QuestionType;
}

export interface ExamResult {
  id: string;
  timestamp: number;
  config: ExamConfig;
  title: string;
  basicCompetency?: string;
  questions: GeneratedQuestion[];
  rubric?: string;
}