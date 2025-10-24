import type { UserStats, Achievement } from '../types';
import { ACHIEVEMENTS } from '../constants';

const POINTS_CONFIG = {
  GUIDE_CREATED: 10,
  QUIZ_TAKEN: 5,
  QUIZ_ACED_BONUS: 25, // bonus points for score >= 80%
  POMODORO_COMPLETED: 15,
  NOTE_SHARED: 5,
  STUDY_MINUTE: 1, // 1 point per minute of study
  GROUP_CREATED: 20,
};

export const getInitialStats = (userId: string): UserStats => ({
  userId,
  points: 0,
  achievements: [],
  guidesCreated: 0,
  quizzesTaken: 0,
  quizzesAced: 0,
  pomodorosCompleted: 0,
  notesShared: 0,
  studySeconds: 0,
});

type ActionType = 'CREATE_GUIDE' | 'COMPLETE_QUIZ' | 'COMPLETE_POMODORO' | 'CREATE_GROUP' | 'SHARE_NOTE' | 'LOG_STUDY_SESSION';

interface ActionPayload {
    quizScore?: number; // percentage from 0 to 100
    studySeconds?: number;
}

export const updateStatsForAction = (
  currentStats: UserStats,
  action: ActionType,
  payload: ActionPayload = {}
): { updatedStats: UserStats; newAchievements: Achievement[] } => {
  const stats = { ...currentStats };
  let pointsToAdd = 0;

  switch (action) {
    case 'CREATE_GUIDE':
      stats.guidesCreated += 1;
      pointsToAdd = POINTS_CONFIG.GUIDE_CREATED;
      break;
    case 'COMPLETE_QUIZ':
      stats.quizzesTaken += 1;
      pointsToAdd = POINTS_CONFIG.QUIZ_TAKEN;
      if (payload.quizScore !== undefined && payload.quizScore >= 80) {
        stats.quizzesAced += 1;
        pointsToAdd += POINTS_CONFIG.QUIZ_ACED_BONUS;
      }
      break;
    case 'COMPLETE_POMODORO':
      stats.pomodorosCompleted += 1;
      pointsToAdd = POINTS_CONFIG.POMODORO_COMPLETED;
      break;
    case 'CREATE_GROUP':
      pointsToAdd = POINTS_CONFIG.GROUP_CREATED;
      break;
    case 'SHARE_NOTE':
      stats.notesShared += 1;
      pointsToAdd = POINTS_CONFIG.NOTE_SHARED;
      break;
    case 'LOG_STUDY_SESSION':
      const seconds = payload.studySeconds || 0;
      stats.studySeconds += seconds;
      pointsToAdd = Math.round(seconds / 60) * POINTS_CONFIG.STUDY_MINUTE;
      break;
  }
  
  stats.points += pointsToAdd;

  // Check for new achievements
  const newAchievements: Achievement[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (stats.achievements.includes(achievement.id)) {
      continue; // Already earned
    }

    let achievementEarned = false;
    switch (achievement.id) {
      case 'FIRST_GUIDE':
        if (stats.guidesCreated >= 1) achievementEarned = true;
        break;
      case 'ACE_QUIZ':
        if (stats.quizzesAced >= 1) achievementEarned = true;
        break;
      case 'TIME_MASTER':
        if (stats.pomodorosCompleted >= 1) achievementEarned = true;
        break;
      case 'GROUP_FOUNDER':
         if (action === 'CREATE_GROUP') achievementEarned = true;
        break;
      case 'COLLABORATOR':
        if (stats.notesShared >= 1) achievementEarned = true;
        break;
      case 'STUDY_HOUR':
        if (stats.studySeconds >= 3600) achievementEarned = true;
        break;
    }

    if (achievementEarned) {
      stats.achievements.push(achievement.id);
      newAchievements.push(achievement);
    }
  }

  return { updatedStats: stats, newAchievements };
};
