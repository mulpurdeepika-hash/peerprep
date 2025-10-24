import type { Achievement } from './types';
import { BookOpenIcon, SparklesIcon, ClockIcon, UsersIcon, DocumentTextIcon } from './components/icons';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'FIRST_GUIDE',
    name: 'First Steps',
    description: 'Generate your first study guide.',
    icon: BookOpenIcon,
  },
  {
    id: 'ACE_QUIZ',
    name: 'Quiz Whiz',
    description: 'Ace a quiz with a score of 80% or higher.',
    icon: SparklesIcon,
  },
  {
    id: 'TIME_MASTER',
    name: 'Time Master',
    description: 'Complete your first Pomodoro focus session.',
    icon: ClockIcon,
  },
  {
    id: 'GROUP_FOUNDER',
    name: 'Group Founder',
    description: 'Create your first study group.',
    icon: UsersIcon,
  },
  {
    id: 'COLLABORATOR',
    name: 'Collaborator',
    description: 'Share your first note in a group.',
    icon: DocumentTextIcon,
  },
  {
    id: 'STUDY_HOUR',
    name: 'Dedicated Scholar',
    description: 'Log over an hour of total study time.',
    icon: BookOpenIcon,
  },
];
