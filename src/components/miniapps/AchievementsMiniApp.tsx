import React from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, Star } from 'lucide-react';
import { useGame } from '../../stores/GameStore';

const AchievementsMiniApp: React.FC = () => {
  const { achievements, currentPlayer } = useGame();

  const unlockedAchievements = currentPlayer?.achievements || [];
  const lockedAchievements = achievements.filter(
    achievement => !unlockedAchievements.some(unlocked => unlocked.id === achievement.id)
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'rare':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'epic':
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'legendary':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getRarityStars = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 1;
      case 'rare':
        return 2;
      case 'epic':
        return 3;
      case 'legendary':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-white mb-2">Achievements</h3>
        <p className="text-gray-400 text-sm">
          {unlockedAchievements.length} / {achievements.length} unlocked
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div 
        className="bg-gray-700/50 rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Collection Progress</span>
          <span className="text-sm text-white font-medium">
            {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
          />
        </div>
      </motion.div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-bold text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-green-400" />
            <span>Unlocked ({unlockedAchievements.length})</span>
          </h4>
          {unlockedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              className={`p-4 rounded-lg border ${getRarityColor(achievement.rarity)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-bold text-white">{achievement.name}</h4>
                    <div className="flex">
                      {Array.from({ length: getRarityStars(achievement.rarity) }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity.toUpperCase()}
                    </span>
                    <span className="text-sm text-green-400 font-medium">
                      +{achievement.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-bold text-white flex items-center space-x-2">
            <Lock className="w-5 h-5 text-gray-400" />
            <span>Locked ({lockedAchievements.length})</span>
          </h4>
          {lockedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              className="p-4 rounded-lg bg-gray-700/30 border border-gray-600/50 opacity-75"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.75, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl grayscale opacity-50">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-bold text-gray-400">{achievement.name}</h4>
                    <div className="flex">
                      {Array.from({ length: getRarityStars(achievement.rarity) }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-gray-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-full border border-gray-600 text-gray-500">
                      {achievement.rarity.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      +{achievement.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Achievements */}
      {achievements.length === 0 && (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Award className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No achievements available</p>
          <p className="text-sm text-gray-500 mt-1">Start playing to unlock achievements!</p>
        </motion.div>
      )}
    </div>
  );
};

export default AchievementsMiniApp;