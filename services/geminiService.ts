import { GoogleGenAI, Type } from "@google/genai";
import type { Quiz, Question, AnswerFeedback } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudyGuide = async (topic: string): Promise<string> => {
  const prompt = `Generate a comprehensive yet concise study guide on the topic of "${topic}". Use markdown for formatting with headings, subheadings, bullet points, and bold text for key terms. The guide should be well-structured and easy to understand for a high school or early college student.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  
  return response.text;
};

export const generateQuiz = async (topic: string): Promise<Quiz> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate a 5-question quiz on the topic of "${topic}". Include a mix of multiple_choice, true_false, and short_answer questions. For multiple choice, provide 4 options.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ['multiple_choice', 'true_false', 'short_answer'] },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            nullable: true,
                        },
                        answer: { type: Type.STRING },
                    },
                    required: ['question', 'type', 'answer'],
                },
            },
        },
    });

    const quizData = JSON.parse(response.text);
    return quizData as Quiz;
};

export const checkAnswers = async (topic: string, quiz: Quiz, userAnswers: (string | null)[]): Promise<AnswerFeedback[]> => {
    const prompt = `
        Topic: "${topic}"
        I have a quiz and a user's answers. Please evaluate each answer and provide feedback.
        
        Quiz with correct answers:
        ${JSON.stringify(quiz, null, 2)}
        
        User's answers:
        ${JSON.stringify(userAnswers, null, 2)}
        
        For each question, determine if the user's answer is correct. For short answer questions, be lenient with phrasing as long as the core concept is correct. Provide brief, encouraging feedback for each answer.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        isCorrect: { type: Type.BOOLEAN },
                        feedback: { type: Type.STRING },
                    },
                    required: ['isCorrect', 'feedback'],
                },
            },
        },
    });

    const feedbackData = JSON.parse(response.text);
    return feedbackData as AnswerFeedback[];
};

export const createChat = (systemInstruction?: string) => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    }
  });
};