import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Trophy, Target, Award } from 'lucide-react';
import { useGame } from '../stores/GameStore';
import ProfileMiniApp from './miniapps/ProfileMiniApp';
import LeaderboardMiniApp from './miniapps/LeaderboardMiniApp';
import QuestsMiniApp from './miniapps/QuestsMiniApp';
import AchievementsMiniApp from './miniapps/AchievementsMiniApp';

const MiniApp: React.FC = () => {
  const { miniAppView, setMiniAppView, toggleMiniApp } = useGame();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'quests', label: 'Quests', icon: Target },
    { id: 'achievements', label: 'Achievements', icon: Award }
  ];

  const renderContent = () => {
    switch (miniAppView) {
      case 'profile':
        return <ProfileMiniApp />;
      case 'leaderboard':
        return <LeaderboardMiniApp />;
      case 'quests':
        return <QuestsMiniApp />;
      case 'achievements':
        return <AchievementsMiniApp />;
      default:
        return <ProfileMiniApp />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold text-white">Game Hub</h2>
        <button
          onClick={toggleMiniApp}
          className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMiniAppView(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-2 text-sm font-medium transition-colors ${
              miniAppView === tab.id
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          key={miniAppView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default MiniApp;