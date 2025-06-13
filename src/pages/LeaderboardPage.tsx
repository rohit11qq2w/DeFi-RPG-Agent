import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Medal, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Filter,
  Search,
  Zap
} from 'lucide-react';
import { useGame } from '../stores/GameStore';

const LeaderboardPage: React.FC = () => {
  const { leaderboard, currentPlayer } = useGame();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'xp' | 'level' | 'quests'>('xp');

  const filteredLeaderboard = leaderboard
    .filter(entry => 
      entry.player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.player.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'level':
          return b.player.level - a.player.level;
        case 'quests':
          return b.player.stats.questsCompleted - a.player.stats.questsCompleted;
        default:
          return b.score - a.score;
      }
    });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">#{rank}</span>
          </div>
        );
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30';
      default:
        return 'bg-gray-800/50 border-gray-700 hover:border-gray-600';
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center space-x-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Leaderboard
          </h1>
        </div>
        <p className="text-gray-400 text-lg">
          Compete with other DeFi RPG players and climb the ranks
        </p>
      </motion.div>

      {/* Current Player Highlight */}
      {currentPlayer && (
        <motion.div 
          className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl p-6 border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-bold text-white mb-4">Your Ranking</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={currentPlayer.avatar}
                alt={currentPlayer.username}
                className="w-16 h-16 rounded-full border-2 border-purple-500"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{currentPlayer.username}</h3>
                <p className="text-purple-400 font-medium">
                  {currentPlayer.rpgClass.icon} {currentPlayer.rpgClass.name}
                </p>
                <p className="text-sm text-gray-400">Level {currentPlayer.level}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-white">
                  {currentPlayer.xp.toLocaleString()}
                </span>
              </div>
              <p className="text-lg text-purple-400 font-bold">
                Rank #{leaderboard.findIndex(entry => entry.player.address === currentPlayer.address) + 1}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div 
        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'xp' | 'level' | 'quests')}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="xp">Sort by XP</option>
              <option value="level">Sort by Level</option>
              <option value="quests">Sort by Quests</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredLeaderboard.slice(0, 3).map((entry, index) => (
          <motion.div
            key={entry.player.address}
            className={`p-6 rounded-2xl border text-center ${getRankBackground(entry.rank)}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <div className="mb-4">
              {getRankIcon(entry.rank)}
            </div>
            
            <img
              src={entry.player.avatar}
              alt={entry.player.username}
              className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-current"
            />
            
            <h3 className="text-lg font-bold text-white mb-1">
              {entry.player.username}
            </h3>
            <p className="text-sm text-gray-400 mb-2">
              {entry.player.rpgClass.icon} {entry.player.rpgClass.name}
            </p>
            <p className="text-sm text-gray-400 mb-4">Level {entry.player.level}</p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-xl font-bold text-white">
                  {entry.score.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-center space-x-1">
                {getChangeIcon(entry.change)}
                <span className={`text-sm ${
                  entry.change > 0 ? 'text-green-400' : 
                  entry.change < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {entry.change !== 0 && (entry.change > 0 ? '+' : '')}{entry.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Full Leaderboard */}
      <motion.div 
        className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Full Rankings</h2>
        </div>
        
        <div className="divide-y divide-gray-700">
          {filteredLeaderboard.slice(3).map((entry, index) => (
            <motion.div
              key={entry.player.address}
              className={`p-4 hover:bg-gray-700/30 transition-colors ${
                entry.player.address === currentPlayer?.address
                  ? 'bg-purple-500/10 border-l-4 border-purple-500'
                  : ''
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.02 }}
            >
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <div className="w-12 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Player Info */}
                <img
                  src={entry.player.avatar}
                  alt={entry.player.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white">{entry.player.username}</h3>
                    {entry.player.address === currentPlayer?.address && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <span>{entry.player.rpgClass.icon} {entry.player.rpgClass.name}</span>
                    <span>•</span>
                    <span>Level {entry.player.level}</span>
                    <span>•</span>
                    <span>{entry.player.stats.questsCompleted} quests</span>
                  </div>
                </div>

                {/* Score & Change */}
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-white">
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getChangeIcon(entry.change)}
                    <span className={`text-sm ${
                      entry.change > 0 ? 'text-green-400' : 
                      entry.change < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {entry.change !== 0 && (entry.change > 0 ? '+' : '')}{entry.change}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* No Results */}
      {filteredLeaderboard.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No players found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  );
};

export default LeaderboardPage;