import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Star, Calendar, TrendingUp } from 'lucide-react';
import { useGame } from '../../stores/GameStore';

const ProfileMiniApp: React.FC = () => {
  const { currentPlayer } = useGame();

  if (!currentPlayer) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Connect wallet to view profile</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Swaps', value: currentPlayer.stats.totalSwaps, icon: TrendingUp, color: 'purple' },
    { label: 'Liquidity Provided', value: `$${currentPlayer.stats.totalLiquidity.toLocaleString()}`, icon: Star, color: 'cyan' },
    { label: 'Staked Amount', value: `$${currentPlayer.stats.totalStaked.toLocaleString()}`, icon: Zap, color: 'green' },
    { label: 'Quests Completed', value: currentPlayer.stats.questsCompleted, icon: Calendar, color: 'orange' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Player Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img
          src={currentPlayer.avatar}
          alt={currentPlayer.username}
          className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-purple-500"
        />
        <h3 className="text-xl font-bold text-white">{currentPlayer.username}</h3>
        <p className="text-gray-400 text-sm">{currentPlayer.address.slice(0, 8)}...{currentPlayer.address.slice(-6)}</p>
      </motion.div>

      {/* Level & XP */}
      <motion.div 
        className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-4 border border-purple-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-white">Level {currentPlayer.level}</span>
          <span className="text-sm text-gray-400">{currentPlayer.xp.toLocaleString()} XP</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
            style={{ width: `${((currentPlayer.xp % 1000) / 1000) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{currentPlayer.xpToNextLevel} XP to next level</p>
      </motion.div>

      {/* RPG Class */}
      <motion.div 
        className="bg-gray-700/50 rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-3 mb-3">
          <span className="text-2xl">{currentPlayer.rpgClass.icon}</span>
          <div>
            <h4 className="font-bold text-white">{currentPlayer.rpgClass.name}</h4>
            <p className="text-sm text-gray-400">{currentPlayer.rpgClass.description}</p>
          </div>
        </div>
        <div className="space-y-1">
          {currentPlayer.rpgClass.bonuses.map((bonus, index) => (
            <div key={index} className="text-xs text-green-400 flex items-center space-x-2">
              <Star className="w-3 h-3" />
              <span>{bonus}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-gray-700/50 rounded-lg p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
              <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
            </div>
            <p className="text-lg font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Achievements */}
      <motion.div 
        className="bg-gray-700/50 rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h4 className="font-bold text-white mb-3">Recent Achievements</h4>
        {currentPlayer.achievements.length > 0 ? (
          <div className="space-y-2">
            {currentPlayer.achievements.slice(0, 3).map((achievement, index) => (
              <div key={achievement.id} className="flex items-center space-x-3">
                <span className="text-lg">{achievement.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{achievement.name}</p>
                  <p className="text-xs text-gray-400">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No achievements yet. Complete quests to earn your first!</p>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileMiniApp;