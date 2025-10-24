// FIX: Aliased the imported `Chat` type to `GenAIChat` to avoid a name collision with the `Chat` component.
import type { Chat as GenAIChat } from "@google/genai";
import React from "react";

export interface Question {
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  answer: string;
}

export interface Quiz extends Array<Question> {}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface AnswerFeedback {
  isCorrect: boolean;
  feedback: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  owner: string; // user email
  members: string[]; // array of user emails
}

export interface GroupChatMessage {
  id: string;
  groupId: string;
  sender: string; // user email
  text: string;
  timestamp: number;
}

export interface SharedNote {
  id: string;
  groupId: string;
  sender: string; // user email
  title: string;
  content: string;
  timestamp: number;
}

export interface Task {
  id: string;
  goalId: string;
  text: string;
  isCompleted: boolean;
}

export interface Goal {
  id: string;
  title: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

export interface UserStats {
  userId: string; // user email
  points: number;
  achievements: string[]; // array of achievement ids
  guidesCreated: number;
  quizzesTaken: number;
  quizzesAced: number;
  pomodorosCompleted: number;
  notesShared: number;
  studySeconds: number;
}

export interface AppState {
  currentUser: string | null;
  topic: string;
  studyGuide: string | null;
  quiz: Quiz | null;
  chatHistory: ChatMessage[];
  // FIX: Used the aliased `GenAIChat` type to resolve the name collision.
  chatSession: GenAIChat | null;
  isLoadingGuide: boolean;
  isLoadingQuiz: boolean;
  isCheckingAnswers: boolean;
  isChatting: boolean;
  error: string | null;
  quizResults: AnswerFeedback[] | null;
  activeTab: 'guide' | 'chat' | 'notes';

  // New State for Groups & Planner
  view: 'login' | 'dashboard' | 'study' | 'planner' | 'doubt_assistant' | 'pomodoro' | 'leaderboard';
  groups: StudyGroup[];
  activeGroup: StudyGroup | null;
  groupChats: Record<string, GroupChatMessage[]>;
  sharedNotes: Record<string, SharedNote[]>;
  goals: Goal[];
  tasks: Task[];
  
  // New state for Doubt Assistant
  doubtChatHistory: ChatMessage[];
  doubtChatSession: GenAIChat | null;

  // New state for Leaderboard and rewards
  userStats: UserStats | null;
  leaderboardData: UserStats[];
  studySessionStartTime: number | null;
}