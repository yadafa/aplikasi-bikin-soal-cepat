import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ExamConfig, ExamResult, QuestionType } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Title of the exam packet" },
    basicCompetency: { type: Type.STRING, description: "The relevant Basic Competency (KD) or Learning Achievement (CP/TP)" },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          number: { type: Type.INTEGER },
          text: { type: Type.STRING, description: "The question stem" },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of options if applicable (MC, Complex MC)"
          },
          correctAnswer: { 
            type: Type.STRING, 
            description: "Correct answer. For Complex MC, use comma separated values." 
          },
          explanation: { type: Type.STRING, description: "Detailed explanation of the answer" },
          type: { type: Type.STRING }
        },
        required: ["number", "text", "explanation", "type"]
      }
    },
    rubric: { type: Type.STRING, description: "General scoring rubric or additional notes" }
  },
  required: ["title", "basicCompetency", "questions"]
};

export const generateExamQuestions = async (config: ExamConfig): Promise<ExamResult> => {
  const modelId = "gemini-2.5-flash"; // Good balance of speed and reasoning for this task

  const prompt = `
    Bertindaklah sebagai guru ahli dan pembuat soal profesional. 
    Buatlah paket soal ujian dengan spesifikasi berikut:
    
    Mode: ${config.mode}
    Bahasa: ${config.language}
    Jenjang: ${config.level}
    Kelas: ${config.grade}
    Mata Pelajaran: ${config.subject}
    Kurikulum: ${config.curriculum}
    Jenis Asesmen: ${config.assessmentType}
    Topik Materi: ${config.topic}
    Sub-Materi: ${config.subTopic || '-'}
    Kompetensi Dasar (Manual): ${config.competency || 'Tentukan Otomatis'}
    Tipe Soal: ${config.questionType}
    Jumlah Soal: ${config.totalQuestions}
    Tingkat Kesulitan: ${config.difficulty}

    Instruksi Khusus:
    1. Jika Kompetensi Dasar manual diisi, gunakan itu. Jika "Tentukan Otomatis", analisislah topik dan jenjang untuk menentukan KD (Kurikulum 2013) atau CP/TP (Kurikulum Merdeka) yang paling relevan. Masukkan ini ke field 'basicCompetency'.
    2. Pastikan soal sesuai dengan kaidah penulisan soal yang benar.
    3. Jika Tipe Soal adalah 'Pilihan Ganda Kompleks', pastikan opsi jawaban bisa dipilih lebih dari satu yang benar.
    4. Sertakan pembahasan yang mendalam untuk setiap soal.
    5. Output harus dalam format JSON yang valid sesuai skema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);

    // Transform complex answers if necessary (schema forces string for simplicity, we parse it back)
    const formattedQuestions = data.questions.map((q: any) => {
      let correct = q.correctAnswer;
      // Heuristic to handle array-like strings for complex MC if the model returns them as string
      if (config.questionType === QuestionType.COMPLEX_MULTIPLE_CHOICE && typeof correct === 'string' && correct.includes(',')) {
          // Keep it as string or split depending on how we want to validate. 
          // For this UI, we treat the answer key as a text block usually, but let's keep it flexible.
      }
      return {
        ...q,
        type: config.questionType // Ensure type is consistent
      };
    });

    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      config,
      title: data.title,
      basicCompetency: data.basicCompetency,
      questions: formattedQuestions,
      rubric: data.rubric
    };

  } catch (error) {
    console.error("Error generating exam:", error);
    throw error;
  }
};