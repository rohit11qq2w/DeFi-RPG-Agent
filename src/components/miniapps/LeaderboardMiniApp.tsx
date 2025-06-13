import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useGame } from '../../stores/GameStore';

const LeaderboardMiniApp: React.FC = () => {
  const { leaderboard, currentPlayer } = useGame();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Trophy className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-white mb-2">Leaderboard</h3>
        <p className="text-gray-400 text-sm">Compete with other DeFi RPG players</p>
      </motion.div>

      {/* Current Player Position */}
      {currentPlayer && (
        <motion.div 
          className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-4 border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={currentPlayer.avatar}
                alt={currentPlayer.username}
                className="w-10 h-10 rounded-full border-2 border-purple-500"
              />
              <div>
                <p className="font-bold text-white">{currentPlayer.username} (You)</p>
                <p className="text-sm text-gray-400">Level {currentPlayer.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">{currentPlayer.xp.toLocaleString()} XP</p>
              <p className="text-sm text-gray-400">
                Rank #{leaderboard.findIndex(entry => entry.player.address === currentPlayer.address) + 1}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top Players */}
      <div className="space-y-3">
        <h4 className="font-bold text-white">Top Players</h4>
        {leaderboard.slice(0, 10).map((entry, index) => (
          <motion.div
            key={entry.player.address}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              entry.player.address === currentPlayer?.address
                ? 'bg-purple-500/20 border border-purple-500/30'
                : 'bg-gray-700/50 hover:bg-gray-700/70'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            {/* Rank */}
            <div className="w-8 flex justify-center">
              {getRankIcon(entry.rank)}
            </div>

            {/* Player Info */}
            <img
              src={entry.player.avatar}
              alt={entry.player.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium text-white">{entry.player.username}</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">
                  {entry.player.rpgClass.icon} {entry.player.rpgClass.name}
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400">Lv.{entry.player.level}</span>
              </div>
            </div>

            {/* Score & Change */}
            <div className="text-right">
              <p className="font-bold text-white">{entry.score.toLocaleString()}</p>
              <div className="flex items-center space-x-1">
                {getChangeIcon(entry.change)}
                <span className={`text-xs ${
                  entry.change > 0 ? 'text-green-400' : 
                  entry.change < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {entry.change !== 0 && (entry.change > 0 ? '+' : '')}{entry.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <motion.div 
        className="bg-gray-700/30 rounded-lg p-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-xs text-gray-400 text-center">
          Rankings based on total XP earned. Updated every 5 minutes.
        </p>
      </motion.div>
    </div>
  );
};

export default LeaderboardMiniApp;