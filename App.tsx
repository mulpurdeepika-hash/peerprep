import React, { useState, useCallback, useEffect } from 'react';
import type { AppState, Quiz, AnswerFeedback, StudyGroup, GroupChatMessage, Goal, Task, ChatMessage, SharedNote, UserStats } from './types';
import { generateStudyGuide, generateQuiz, checkAnswers, createChat } from './services/geminiService';
import { updateStatsForAction, getInitialStats } from './services/statsService';
import Header from './components/Header';
import TopicForm from './components/TopicForm';
import StudyGuide from './components/StudyGuide';
import PracticeQuiz from './components/PracticeQuiz';
import Chat from './components/Chat';
import GroupChat from './components/GroupChat';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import GroupManager from './components/GroupManager';
import Planner from './components/Planner';
import DoubtAssistant from './components/DoubtAssistant';
import NotesSharer from './components/NotesSharer';
import PomodoroTimer from './components/PomodoroTimer';
import Leaderboard from './components/Leaderboard';
import { BookOpenIcon, ChatBubbleLeftRightIcon, DocumentTextIcon } from './components/icons';

const studyStateReset = {
    topic: '',
    studyGuide: null,
    quiz: null,
    chatHistory: [],
    chatSession: null,
    isLoadingGuide: false,
    isLoadingQuiz: false,
    isCheckingAnswers: false,
    isChatting: false,
    error: null,
    quizResults: null,
    activeTab: 'guide' as const,
    studySessionStartTime: null,
};

const initialState: AppState = {
  currentUser: null,
  ...studyStateReset,
  view: 'login',
  groups: [],
  activeGroup: null,
  groupChats: {},
  sharedNotes: {},
  goals: [],
  tasks: [],
  doubtChatHistory: [],
  doubtChatSession: null,
  userStats: null,
  leaderboardData: [],
};


const App: React.FC = () => {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    try {
      const loggedInUser = localStorage.getItem('studyBuddyUser');
      if (loggedInUser) {
        const storedGroups = localStorage.getItem('studyBuddyGroups');
        const groups = storedGroups ? JSON.parse(storedGroups) : [];
        const storedChats = localStorage.getItem('studyBuddyGroupChats');
        const groupChats = storedChats ? JSON.parse(storedChats) : {};
        const storedNotes = localStorage.getItem('studyBuddySharedNotes');
        const sharedNotes = storedNotes ? JSON.parse(storedNotes) : {};
        const storedGoals = localStorage.getItem('studyBuddyGoals');
        const goals = storedGoals ? JSON.parse(storedGoals) : [];
        const storedTasks = localStorage.getItem('studyBuddyTasks');
        const tasks = storedTasks ? JSON.parse(storedTasks) : [];
        
        // Load all user stats for leaderboard
        const allStatsString = localStorage.getItem('studyBuddyAllStats');
        const allStats: Record<string, UserStats> = allStatsString ? JSON.parse(allStatsString) : {};
        const userStats = allStats[loggedInUser] || getInitialStats(loggedInUser);
        if(!allStats[loggedInUser]) {
            allStats[loggedInUser] = userStats;
            localStorage.setItem('studyBuddyAllStats', JSON.stringify(allStats));
        }
        const leaderboardData = Object.values(allStats);

        setState(s => ({ ...s, currentUser: loggedInUser, view: 'dashboard', groups, groupChats, sharedNotes, goals, tasks, userStats, leaderboardData }));
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  }, []);

  // Poll for group chat updates to simulate real-time communication
  useEffect(() => {
    if (state.view === 'study' && state.activeGroup) {
      const intervalId = setInterval(() => {
        try {
          const storedChats = localStorage.getItem('studyBuddyGroupChats');
          if (storedChats) {
            const latestChats = JSON.parse(storedChats);
            if (JSON.stringify(latestChats) !== JSON.stringify(state.groupChats)) {
              setState(s => ({ ...s, groupChats: latestChats }));
            }
          }
        } catch (error) {
          console.error("Error polling for group chats:", error);
        }
      }, 2000); // Poll every 2 seconds

      return () => clearInterval(intervalId);
    }
  }, [state.view, state.activeGroup, state.groupChats]);

  const handleUpdateStats = useCallback((action: 'CREATE_GUIDE' | 'COMPLETE_QUIZ' | 'COMPLETE_POMODORO' | 'CREATE_GROUP' | 'SHARE_NOTE' | 'LOG_STUDY_SESSION', payload?: any) => {
    if (!state.userStats) return;

    const { updatedStats, newAchievements } = updateStatsForAction(state.userStats, action, payload);
    
    // In a real app, you'd show a notification for newAchievements
    if (newAchievements.length > 0) {
        console.log("New achievements unlocked:", newAchievements.map(a => a.name).join(', '));
        // alert(`New achievement unlocked: ${newAchievements.map(a => a.name).join(', ')}!`);
    }

    const allStatsString = localStorage.getItem('studyBuddyAllStats');
    const allStats: Record<string, UserStats> = allStatsString ? JSON.parse(allStatsString) : {};
    allStats[state.userStats.userId] = updatedStats;
    
    localStorage.setItem('studyBuddyAllStats', JSON.stringify(allStats));

    setState(s => ({
        ...s,
        userStats: updatedStats,
        leaderboardData: Object.values(allStats),
    }));
  }, [state.userStats]);


  const handleLogin = (email: string) => {
    try {
      localStorage.setItem('studyBuddyUser', email);
      const storedGroups = localStorage.getItem('studyBuddyGroups');
      const groups = storedGroups ? JSON.parse(storedGroups) : [];
      // Also initialize stats on login
      const allStatsString = localStorage.getItem('studyBuddyAllStats');
      const allStats: Record<string, UserStats> = allStatsString ? JSON.parse(allStatsString) : {};
      const userStats = allStats[email] || getInitialStats(email);
      if(!allStats[email]) {
        allStats[email] = userStats;
        localStorage.setItem('studyBuddyAllStats', JSON.stringify(allStats));
      }
      const leaderboardData = Object.values(allStats);
      setState(s => ({ ...s, currentUser: email, view: 'dashboard', groups, userStats, leaderboardData }));
    } catch (error) {
       console.error("Could not access localStorage:", error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('studyBuddyUser');
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
    setState(initialState);
  };
  
  // --- Group Management Handlers ---

  const handleCreateGroup = (name: string) => {
    if(!state.currentUser) return;
    const newGroup: StudyGroup = {
      id: `group-${Date.now()}`,
      name,
      owner: state.currentUser,
      members: [state.currentUser],
    };
    const updatedGroups = [...state.groups, newGroup];
    setState(s => ({ ...s, groups: updatedGroups }));
    localStorage.setItem('studyBuddyGroups', JSON.stringify(updatedGroups));
    handleUpdateStats('CREATE_GROUP');
  };

  const handleAddMember = (groupId: string, email: string) => {
    const updatedGroups = state.groups.map(g => {
        if(g.id === groupId && !g.members.includes(email)) {
            return {...g, members: [...g.members, email]};
        }
        return g;
    });
    setState(s => ({ ...s, groups: updatedGroups, activeGroup: updatedGroups.find(g => g.id === groupId) || null }));
    localStorage.setItem('studyBuddyGroups', JSON.stringify(updatedGroups));
  };

  const handleRemoveMember = (groupId: string, email: string) => {
     const updatedGroups = state.groups.map(g => {
        if(g.id === groupId) {
            return {...g, members: g.members.filter(m => m !== email)};
        }
        return g;
    });
    setState(s => ({ ...s, groups: updatedGroups, activeGroup: updatedGroups.find(g => g.id === groupId) || null }));
    localStorage.setItem('studyBuddyGroups', JSON.stringify(updatedGroups));
  };

  const handleSendGroupMessage = (groupId: string, text: string) => {
    if (!state.currentUser) return;
    
    const newMessage: GroupChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      groupId,
      sender: state.currentUser,
      text,
      timestamp: Date.now(),
    };

    const updatedChats = {
      ...state.groupChats,
      [groupId]: [...(state.groupChats[groupId] || []), newMessage],
    };

    setState(s => ({ ...s, groupChats: updatedChats }));
    try {
      localStorage.setItem('studyBuddyGroupChats', JSON.stringify(updatedChats));
    } catch (error) {
       console.error("Could not access localStorage:", error);
    }
  };

  // --- Notes Sharing Handlers ---
  const handleShareNote = (groupId: string, title: string, content: string) => {
    if (!state.currentUser) return;
    
    const newNote: SharedNote = {
      id: `note-${Date.now()}-${Math.random()}`,
      groupId,
      sender: state.currentUser,
      title,
      content,
      timestamp: Date.now(),
    };

    const updatedNotes = {
      ...state.sharedNotes,
      [groupId]: [...(state.sharedNotes[groupId] || []), newNote],
    };

    setState(s => ({ ...s, sharedNotes: updatedNotes }));
    try {
      localStorage.setItem('studyBuddySharedNotes', JSON.stringify(updatedNotes));
    } catch (error) {
       console.error("Could not access localStorage:", error);
    }
    handleUpdateStats('SHARE_NOTE');
  };

  const handleDeleteNote = (noteId: string) => {
    if (!state.activeGroup) return;

    const groupId = state.activeGroup.id;
    const updatedNotesForGroup = (state.sharedNotes[groupId] || []).filter(note => note.id !== noteId);
    
    const updatedNotes = {
        ...state.sharedNotes,
        [groupId]: updatedNotesForGroup,
    };

    setState(s => ({...s, sharedNotes: updatedNotes}));
    localStorage.setItem('studyBuddySharedNotes', JSON.stringify(updatedNotes));
  };


  // --- Planner Handlers ---
  const handleCreateGoal = (title: string) => {
    const newGoal: Goal = { id: `goal-${Date.now()}`, title };
    const updatedGoals = [...state.goals, newGoal];
    setState(s => ({ ...s, goals: updatedGoals }));
    localStorage.setItem('studyBuddyGoals', JSON.stringify(updatedGoals));
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = state.goals.filter(g => g.id !== goalId);
    const updatedTasks = state.tasks.filter(t => t.goalId !== goalId);
    setState(s => ({ ...s, goals: updatedGoals, tasks: updatedTasks }));
    localStorage.setItem('studyBuddyGoals', JSON.stringify(updatedGoals));
    localStorage.setItem('studyBuddyTasks', JSON.stringify(updatedTasks));
  };

  const handleCreateTask = (goalId: string, text: string) => {
    const newTask: Task = { id: `task-${Date.now()}`, goalId, text, isCompleted: false };
    const updatedTasks = [...state.tasks, newTask];
    setState(s => ({ ...s, tasks: updatedTasks }));
    localStorage.setItem('studyBuddyTasks', JSON.stringify(updatedTasks));
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = state.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t);
    setState(s => ({ ...s, tasks: updatedTasks }));
    localStorage.setItem('studyBuddyTasks', JSON.stringify(updatedTasks));
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = state.tasks.filter(t => t.id !== taskId);
    setState(s => ({ ...s, tasks: updatedTasks }));
    localStorage.setItem('studyBuddyTasks', JSON.stringify(updatedTasks));
  };

  // --- View Navigation Handlers ---

  const handleStartSoloStudy = () => {
      setState(s => ({ ...s, ...studyStateReset, view: 'study', activeGroup: null, studySessionStartTime: Date.now() }));
  };

  const handleSelectGroup = (group: StudyGroup) => {
      setState(s => ({ ...s, ...studyStateReset, view: 'study', activeGroup: group, studySessionStartTime: Date.now() }));
  };

  const handleBackToDashboard = () => {
      if (state.studySessionStartTime) {
          const durationSeconds = Math.round((Date.now() - state.studySessionStartTime) / 1000);
          handleUpdateStats('LOG_STUDY_SESSION', { studySeconds: durationSeconds });
      }
      setState(s => ({ ...s, view: 'dashboard', activeGroup: null, ...studyStateReset }));
  };

  const handleGoToPlanner = () => {
      setState(s => ({...s, view: 'planner'}));
  };
  
  const handleGoToPomodoro = () => {
      setState(s => ({ ...s, view: 'pomodoro' }));
  };

  const handleGoToLeaderboard = () => {
      setState(s => ({ ...s, view: 'leaderboard' }));
  };

  // --- Doubt Assistant Handlers ---
  const handleGoToDoubtAssistant = useCallback(async () => {
      let session = state.doubtChatSession;
      if (!session) {
          const systemInstruction = "You are a friendly and knowledgeable AI assistant for students. Your goal is to provide clear, concise, and accurate answers to their specific doubts and questions on any academic topic. Explain concepts simply and provide examples when helpful.";
          session = createChat(systemInstruction);
          setState(s => ({ ...s, doubtChatSession: session, view: 'doubt_assistant' }));
      } else {
          setState(s => ({ ...s, view: 'doubt_assistant' }));
      }
  }, [state.doubtChatSession]);

  const handleSendDoubtMessage = useCallback(async (message: string) => {
      const { doubtChatSession } = state;
      if (!doubtChatSession) return;

      const userMessage: ChatMessage = { role: 'user', parts: [{ text: message }] };
      setState(s => ({ 
          ...s, 
          isChatting: true, 
          doubtChatHistory: [...s.doubtChatHistory, userMessage] 
      }));

      try {
          const stream = await doubtChatSession.sendMessageStream({ message });
          
          let modelResponse = '';
          const modelMessage: ChatMessage = { role: 'model', parts: [{ text: '' }]};
          // Add the placeholder for the model's response
          setState(s => ({ ...s, doubtChatHistory: [...s.doubtChatHistory, modelMessage] }));

          for await (const chunk of stream) {
              modelResponse += chunk.text;
              setState(s => {
                  const newHistory = [...s.doubtChatHistory];
                  const lastMessage = newHistory[newHistory.length - 1];
                  if (lastMessage.role === 'model') {
                      lastMessage.parts[0].text = modelResponse;
                  }
                  return { ...s, doubtChatHistory: newHistory };
              });
          }
      } catch (error) {
          console.error("Doubt Assistant chat error:", error);
          const errorMessage: ChatMessage = { role: 'model', parts: [{ text: 'Sorry, I encountered an error. Please try again.' }]};
          setState(s => ({ ...s, doubtChatHistory: [...s.doubtChatHistory, errorMessage] }));
      } finally {
          setState(s => ({ ...s, isChatting: false }));
      }
  }, [state.doubtChatSession, state.doubtChatHistory]);


  // --- Study Content Handlers ---

  const handleTopicSubmit = useCallback(async (topic: string) => {
    setState(s => ({ 
        ...s,
        isLoadingGuide: true, 
        topic,
        studyGuide: null, quiz: null, quizResults: null, error: null,
    }));
    try {
      const guide = await generateStudyGuide(topic);
      const chat = createChat();
      setState(s => ({ ...s, studyGuide: guide, chatSession: chat, isLoadingGuide: false, activeTab: 'guide' }));
      handleUpdateStats('CREATE_GUIDE');
    } catch (err) {
      console.error(err);
      setState(s => ({ ...s, error: 'Failed to generate study guide. Please try again.', isLoadingGuide: false }));
    }
  }, [handleUpdateStats]);

  const handleGenerateQuiz = useCallback(async () => {
    if (!state.topic) return;
    setState(s => ({ ...s, isLoadingQuiz: true, quiz: null, quizResults: null, error: null }));
    try {
      const quizData: Quiz = await generateQuiz(state.topic);
      setState(s => ({ ...s, quiz: quizData, isLoadingQuiz: false }));
    } catch (err) {
      console.error(err);
      setState(s => ({ ...s, error: 'Failed to generate quiz. Please try again.', isLoadingQuiz: false }));
    }
  }, [state.topic]);

  const handleCheckAnswers = useCallback(async (userAnswers: (string | null)[]) => {
    if (!state.topic || !state.quiz) return;
    setState(s => ({ ...s, isCheckingAnswers: true, error: null }));
    try {
      const results: AnswerFeedback[] = await checkAnswers(state.topic, state.quiz, userAnswers);
      const correctAnswers = results.filter(r => r.isCorrect).length;
      const score = (correctAnswers / state.quiz.length) * 100;
      handleUpdateStats('COMPLETE_QUIZ', { quizScore: score });
      setState(s => ({ ...s, quizResults: results, isCheckingAnswers: false }));
    } catch (err) {
      console.error(err);
      setState(s => ({ ...s, error: 'Failed to check answers. Please try again.', isCheckingAnswers: false }));
    }
  }, [state.topic, state.quiz, handleUpdateStats]);

  const handlePomodoroSessionComplete = useCallback(() => {
    handleUpdateStats('COMPLETE_POMODORO');
  }, [handleUpdateStats]);

  const renderStudyContent = () => {
    if (state.isLoadingGuide) {
      return <LoadingSpinner message="Generating your personalized study guide..." />;
    }

    if (state.studyGuide) {
        const TABS_BASE_CLASS = 'w-full py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors';
        const TABS_ACTIVE_CLASS = 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300';
        const TABS_INACTIVE_CLASS = 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700';

      return (
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 flex space-x-2">
            <button 
                onClick={() => setState(s => ({...s, activeTab: 'guide'}))}
                className={`${TABS_BASE_CLASS} ${state.activeTab === 'guide' ? TABS_ACTIVE_CLASS : TABS_INACTIVE_CLASS}`}
            >
                <BookOpenIcon className="w-5 h-5 mr-2" /> Study Guide
            </button>
            <button 
                onClick={() => setState(s => ({...s, activeTab: 'chat'}))}
                className={`${TABS_BASE_CLASS} ${state.activeTab === 'chat' ? TABS_ACTIVE_CLASS : TABS_INACTIVE_CLASS}`}
            >
                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" /> {state.activeGroup ? 'Group Chat' : 'AI Chat'}
            </button>
            {state.activeGroup && (
                <button 
                    onClick={() => setState(s => ({...s, activeTab: 'notes'}))}
                    className={`${TABS_BASE_CLASS} ${state.activeTab === 'notes' ? TABS_ACTIVE_CLASS : TABS_INACTIVE_CLASS}`}
                >
                    <DocumentTextIcon className="w-5 h-5 mr-2" /> Shared Notes
                </button>
            )}
          </div>
          {(() => {
            switch(state.activeTab) {
                case 'guide':
                    return (
                        <div>
                            <StudyGuide
                                topic={state.topic}
                                guide={state.studyGuide!}
                                onGenerateQuiz={handleGenerateQuiz}
                                isLoadingQuiz={state.isLoadingQuiz}
                            />
                            {state.isLoadingQuiz && <div className="mt-8"><LoadingSpinner message="Crafting your practice quiz..." /></div>}
                            {state.quiz && (
                                <PracticeQuiz
                                    quiz={state.quiz}
                                    onCheckAnswers={handleCheckAnswers}
                                    isChecking={state.isCheckingAnswers}
                                    results={state.quizResults}
                                />
                            )}
                        </div>
                    );
                case 'chat':
                    return state.activeGroup && state.currentUser ? (
                      <GroupChat 
                        group={state.activeGroup}
                        currentUser={state.currentUser}
                        chatHistory={state.groupChats[state.activeGroup.id] || []}
                        onSendMessage={handleSendGroupMessage}
                      />
                    ) : (
                      <Chat chatSession={state.chatSession} topic={state.topic} />
                    );
                case 'notes':
                    return state.activeGroup && state.currentUser ? (
                        <NotesSharer
                            group={state.activeGroup}
                            currentUser={state.currentUser}
                            notes={state.sharedNotes[state.activeGroup.id] || []}
                            onShareNote={handleShareNote}
                            onDeleteNote={handleDeleteNote}
                        />
                    ) : null;
                default:
                    return null;
            }
          })()}
        </div>
      );
    }

    return <TopicForm onSubmit={handleTopicSubmit} isLoading={state.isLoadingGuide} />;
  };

  const renderCurrentView = () => {
    switch(state.view) {
        case 'login':
            return <Login onLogin={handleLogin} />;
        case 'dashboard':
            const userGroups = state.groups.filter(g => g.members.includes(state.currentUser!));
            return (
                <Dashboard 
                    currentUser={state.currentUser!}
                    groups={userGroups}
                    onCreateGroup={handleCreateGroup}
                    onSelectGroup={handleSelectGroup}
                    onStartSoloStudy={handleStartSoloStudy}
                    onGoToPlanner={handleGoToPlanner}
                    onGoToDoubtAssistant={handleGoToDoubtAssistant}
                    onGoToPomodoro={handleGoToPomodoro}
                    onGoToLeaderboard={handleGoToLeaderboard}
                />
            );
        case 'leaderboard':
            return (
                <Leaderboard
                    currentUserStats={state.userStats}
                    leaderboardData={state.leaderboardData}
                    onBackToDashboard={handleBackToDashboard}
                />
            );
        case 'planner':
            return (
                <Planner 
                    goals={state.goals}
                    tasks={state.tasks}
                    onCreateGoal={handleCreateGoal}
                    onDeleteGoal={handleDeleteGoal}
                    onCreateTask={handleCreateTask}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onBackToDashboard={handleBackToDashboard}
                />
            );
        case 'pomodoro':
            return (
                <PomodoroTimer
                    onBackToDashboard={handleBackToDashboard}
                    onSessionComplete={handlePomodoroSessionComplete}
                />
            );
        case 'doubt_assistant':
            return (
                <DoubtAssistant 
                    chatSession={state.doubtChatSession}
                    chatHistory={state.doubtChatHistory}
                    onSendMessage={handleSendDoubtMessage}
                    onBackToDashboard={handleBackToDashboard}
                    isLoading={state.isChatting}
                />
            );
        case 'study':
            return (
                <div className="w-full">
                    <div className="max-w-4xl mx-auto mb-6">
                      <button onClick={handleBackToDashboard} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">&larr; Back to Dashboard</button>
                    </div>
                    {state.activeGroup && state.currentUser && (
                        <GroupManager 
                            group={state.activeGroup}
                            currentUser={state.currentUser}
                            onAddMember={handleAddMember}
                            onRemoveMember={handleRemoveMember}
                        />
                    )}
                    {renderStudyContent()}
                </div>
            );
        default:
            return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentUser={state.currentUser} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          {state.error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md" role="alert"><p>{state.error}</p></div>}
          {renderCurrentView()}
      </main>
      <footer className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm">
        <p>Powered by Gemini. Created for educational purposes.</p>
      </footer>
    </div>
  );
};

export default App;