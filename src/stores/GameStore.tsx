import React, { createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Player, Quest, Achievement, ChatMessage, GameEvent, LeaderboardEntry } from '../types/game';
import { rpgClasses, mockPlayers, mockQuests, mockAchievements } from '../data/mockData';

interface GameState {
  // Player data
  currentPlayer: Player | null;
  players: Player[];
  
  // Game mechanics
  quests: Quest[];
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  
  // Chat & messaging
  messages: ChatMessage[];
  events: GameEvent[];
  
  // UI state
  isLoading: boolean;
  selectedTab: string;
  showMiniApp: boolean;
  miniAppView: 'profile' | 'leaderboard' | 'quests' | 'achievements';
  
  // Actions
  setCurrentPlayer: (player: Player) => void;
  addMessage: (message: ChatMessage) => void;
  addEvent: (event: GameEvent) => void;
  updatePlayerXP: (address: string, xp: number) => void;
  completeQuest: (questId: string, playerAddress: string) => void;
  unlockAchievement: (achievementId: string, playerAddress: string) => void;
  setSelectedTab: (tab: string) => void;
  setMiniAppView: (view: 'profile' | 'leaderboard' | 'quests' | 'achievements') => void;
  toggleMiniApp: () => void;
  initializePlayer: (address: string) => void;
  joinQuest: (questId: string, playerAddress: string) => void;
  updateQuestProgress: (questId: string, playerAddress: string, progress: number) => void;
}

const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentPlayer: null,
    players: [...mockPlayers],
    quests: [...mockQuests],
    achievements: [...mockAchievements],
    leaderboard: [],
    messages: [
      {
        id: 'welcome-1',
        sender: 'system',
        content: '🎮 Welcome to DeFi RPG Agent! Connect your wallet to start your adventure.',
        timestamp: new Date(Date.now() - 60000),
        type: 'system'
      },
      {
        id: 'welcome-2',
        sender: 'bot',
        content: '🚀 Try typing "swap", "liquidity", "stake", or "quest" to see the game mechanics in action!',
        timestamp: new Date(Date.now() - 30000),
        type: 'bot'
      }
    ],
    events: [],
    isLoading: false,
    selectedTab: 'chat',
    showMiniApp: false,
    miniAppView: 'profile',
    
    // Actions
    setCurrentPlayer: (player) => {
      set({ currentPlayer: player });
      
      // Update leaderboard when current player changes
      const state = get();
      const leaderboard = state.players
        .map((p, index) => ({
          rank: index + 1,
          player: p,
          score: p.xp,
          change: Math.floor(Math.random() * 20) - 10 // Random change for demo
        }))
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
        
      set({ leaderboard });
    },
    
    addMessage: (message) => {
      set((state) => ({
        messages: [...state.messages, message]
      }));
    },
    
    addEvent: (event) => {
      set((state) => ({
        events: [event, ...state.events]
      }));
    },
    
    updatePlayerXP: (address, xpGained) => {
      set((state) => {
        const updatedPlayers = state.players.map(player => {
          if (player.address === address) {
            const newXP = player.xp + xpGained;
            const newLevel = Math.floor(newXP / 1000) + 1;
            const leveledUp = newLevel > player.level;
            
            if (leveledUp) {
              // Add level up event
              get().addEvent({
                id: Date.now().toString(),
                type: 'level_up',
                player: address,
                data: { newLevel, xpGained },
                timestamp: new Date()
              });
              
              // Add level up message
              get().addMessage({
                id: `levelup-${Date.now()}`,
                sender: 'system',
                content: `🎉 ${player.username} leveled up to Level ${newLevel}! (+${xpGained} XP)`,
                timestamp: new Date(),
                type: 'system',
                metadata: { action: 'level_up', xpGained }
              });
            }
            
            return {
              ...player,
              xp: newXP,
              level: newLevel,
              xpToNextLevel: 1000 - (newXP % 1000)
            };
          }
          return player;
        });
        
        const currentPlayer = state.currentPlayer?.address === address 
          ? updatedPlayers.find(p => p.address === address) || state.currentPlayer
          : state.currentPlayer;
          
        return {
          players: updatedPlayers,
          currentPlayer
        };
      });
    },
    
    joinQuest: (questId, playerAddress) => {
      set((state) => {
        const updatedQuests = state.quests.map(quest => {
          if (quest.id === questId && !quest.participants.includes(playerAddress)) {
            return {
              ...quest,
              participants: [...quest.participants, playerAddress]
            };
          }
          return quest;
        });
        
        const quest = state.quests.find(q => q.id === questId);
        if (quest) {
          get().addMessage({
            id: `quest-join-${Date.now()}`,
            sender: 'system',
            content: `🎯 ${state.currentPlayer?.username || 'Player'} joined "${quest.title}"!`,
            timestamp: new Date(),
            type: 'system'
          });
        }
        
        return { quests: updatedQuests };
      });
    },
    
    updateQuestProgress: (questId, playerAddress, progress) => {
      set((state) => {
        const updatedQuests = state.quests.map(quest => {
          if (quest.id === questId) {
            const newProgress = Math.min(quest.progress + progress, 1);
            return {
              ...quest,
              progress: newProgress
            };
          }
          return quest;
        });
        
        return { quests: updatedQuests };
      });
    },
    
    completeQuest: (questId, playerAddress) => {
      set((state) => {
        const quest = state.quests.find(q => q.id === questId);
        if (!quest || quest.completedBy.includes(playerAddress)) return state;
        
        const updatedQuests = state.quests.map(q => {
          if (q.id === questId) {
            return {
              ...q,
              completedBy: [...q.completedBy, playerAddress],
              progress: Math.min(q.progress + 0.2, 1),
              status: q.completedBy.length + 1 >= q.participants.length ? 'completed' as const : q.status
            };
          }
          return q;
        });
        
        // Award XP for quest completion
        quest.rewards.forEach(reward => {
          if (reward.type === 'xp' && reward.amount) {
            get().updatePlayerXP(playerAddress, reward.amount);
          }
        });
        
        // Update player stats
        const updatedPlayers = state.players.map(player => {
          if (player.address === playerAddress) {
            return {
              ...player,
              stats: {
                ...player.stats,
                questsCompleted: player.stats.questsCompleted + 1
              }
            };
          }
          return player;
        });
        
        get().addEvent({
          id: Date.now().toString(),
          type: 'quest_completed',
          player: playerAddress,
          data: { quest },
          timestamp: new Date()
        });
        
        get().addMessage({
          id: `quest-complete-${Date.now()}`,
          sender: 'system',
          content: `🏆 ${state.currentPlayer?.username || 'Player'} completed "${quest.title}"! Earned ${quest.rewards.find(r => r.type === 'xp')?.amount || 0} XP!`,
          timestamp: new Date(),
          type: 'system'
        });
        
        return { 
          quests: updatedQuests,
          players: updatedPlayers,
          currentPlayer: state.currentPlayer?.address === playerAddress 
            ? updatedPlayers.find(p => p.address === playerAddress) || state.currentPlayer
            : state.currentPlayer
        };
      });
    },
    
    unlockAchievement: (achievementId, playerAddress) => {
      set((state) => {
        const achievement = state.achievements.find(a => a.id === achievementId);
        if (!achievement) return state;
        
        const updatedPlayers = state.players.map(player => {
          if (player.address === playerAddress) {
            // Check if player already has this achievement
            if (player.achievements.some(a => a.id === achievementId)) {
              return player;
            }
            
            return {
              ...player,
              achievements: [...player.achievements, achievement],
              stats: {
                ...player.stats,
                nftsEarned: player.stats.nftsEarned + 1
              }
            };
          }
          return player;
        });
        
        get().updatePlayerXP(playerAddress, achievement.xpReward);
        get().addEvent({
          id: Date.now().toString(),
          type: 'achievement_unlocked',
          player: playerAddress,
          data: { achievement },
          timestamp: new Date()
        });
        
        get().addMessage({
          id: `achievement-${Date.now()}`,
          sender: 'system',
          content: `🏆 ${state.currentPlayer?.username || 'Player'} unlocked "${achievement.name}" achievement! (+${achievement.xpReward} XP)`,
          timestamp: new Date(),
          type: 'system'
        });
        
        return { 
          players: updatedPlayers,
          currentPlayer: state.currentPlayer?.address === playerAddress 
            ? updatedPlayers.find(p => p.address === playerAddress) || state.currentPlayer
            : state.currentPlayer
        };
      });
    },
    
    setSelectedTab: (tab) => set({ selectedTab: tab }),
    setMiniAppView: (view) => set({ miniAppView: view }),
    toggleMiniApp: () => set((state) => ({ showMiniApp: !state.showMiniApp })),
    
    initializePlayer: (address) => {
      const state = get();
      const existingPlayer = state.players.find(p => p.address === address);
      
      if (existingPlayer) {
        set({ currentPlayer: existingPlayer });
        
        // Auto-join first quest if not already joined
        const firstQuest = state.quests.find(q => q.status === 'active');
        if (firstQuest && !firstQuest.participants.includes(address)) {
          get().joinQuest(firstQuest.id, address);
        }
        
        return;
      }
      
      // Create new player with default RPG class
      const newPlayer: Player = {
        address,
        username: `Player_${address.slice(-4)}`,
        rpgClass: rpgClasses[0], // Default to first class
        level: 1,
        xp: 0,
        xpToNextLevel: 1000,
        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${address}`,
        achievements: [],
        stats: {
          totalSwaps: 0,
          totalLiquidity: 0,
          totalStaked: 0,
          totalBridged: 0,
          questsCompleted: 0,
          nftsEarned: 0
        },
        joinedAt: new Date()
      };
      
      set((state) => ({
        players: [...state.players, newPlayer],
        currentPlayer: newPlayer
      }));
      
      // Welcome message for new player
      get().addMessage({
        id: `welcome-${Date.now()}`,
        sender: 'system',
        content: `🎮 Welcome ${newPlayer.username}! You've been assigned the ${newPlayer.rpgClass.name} class. Start your DeFi adventure!`,
        timestamp: new Date(),
        type: 'system'
      });
      
      // Auto-join first quest
      const firstQuest = state.quests.find(q => q.status === 'active');
      if (firstQuest) {
        setTimeout(() => {
          get().joinQuest(firstQuest.id, address);
        }, 1000);
      }
    }
  }))
);

// React Context Provider
const GameStoreContext = createContext<ReturnType<typeof useGameStore> | null>(null);

export const GameStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize leaderboard on mount
  useEffect(() => {
    const updateLeaderboard = () => {
      const state = useGameStore.getState();
      const leaderboard = state.players
        .map((player, index) => ({
          rank: index + 1,
          player,
          score: player.xp,
          change: Math.floor(Math.random() * 20) - 10 // Random change for demo
        }))
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
        
      useGameStore.setState({ leaderboard });
    };
    
    updateLeaderboard();
    
    // Update leaderboard when players change
    const unsubscribe = useGameStore.subscribe(
      (state) => state.players,
      updateLeaderboard
    );
    
    return unsubscribe;
  }, []);
  
  return (
    <GameStoreContext.Provider value={useGameStore()}>
      {children}
    </GameStoreContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameStoreContext);
  if (!context) {
    throw new Error('useGame must be used within a GameStoreProvider');
  }
  return context;
};