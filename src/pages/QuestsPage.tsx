import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Clock, 
  Users, 
  User, 
  CheckCircle, 
  Gift,
  Filter,
  Calendar,
  Zap,
  Trophy,
  Star
} from 'lucide-react';
import { useGame } from '../stores/GameStore';

const QuestsPage: React.FC = () => {
  const { quests, currentPlayer, completeQuest } = useGame();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [typeFilter, setTypeFilter] = useState<'all' | 'individual' | 'group'>('all');

  const filteredQuests = quests.filter(quest => {
    const statusMatch = filter === 'all' || quest.status === filter;
    const typeMatch = typeFilter === 'all' || quest.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleCompleteQuest = (questId: string) => {
    if (!currentPlayer) return;
    completeQuest(questId, currentPlayer.address);
  };

  const getQuestTypeColor = (type: string) => {
    return type === 'group' ? 'cyan' : 'purple';
  };

  const getQuestStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'completed':
        return 'blue';
      case 'expired':
        return 'red';
      default:
        return 'gray';
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
          <Target className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Quests & Challenges
          </h1>
        </div>
        <p className="text-gray-400 text-lg">
          Complete challenges to earn XP, NFTs, and exclusive rewards
        </p>
      </motion.div>

      {/* Quest Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {quests.filter(q => q.status === 'active').length}
              </p>
              <p className="text-sm text-green-400">Active Quests</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {currentPlayer?.stats.questsCompleted || 0}
              </p>
              <p className="text-sm text-blue-400">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-cyan-500/20 rounded-xl p-4 border border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-cyan-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {quests.filter(q => q.type === 'group').length}
              </p>
              <p className="text-sm text-cyan-400">Group Quests</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500/20 rounded-xl p-4 border border-yellow-500/30">
          <div className="flex items-center space-x-3">
            <Gift className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {quests.reduce((total, quest) => total + quest.rewards.length, 0)}
              </p>
              <p className="text-sm text-yellow-400">Total Rewards</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">Status:</span>
            <div className="flex space-x-2">
              {['all', 'active', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Type:</span>
            <div className="flex space-x-2">
              {['all', 'individual', 'group'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    typeFilter === type
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quests Grid */}
      <AnimatePresence>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuests.map((quest, index) => (
            <motion.div
              key={quest.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              {/* Quest Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-${getQuestTypeColor(quest.type)}-500/20`}>
                    {quest.type === 'group' ? 
                      <Users className={`w-6 h-6 text-${getQuestTypeColor(quest.type)}-400`} /> : 
                      <User className={`w-6 h-6 text-${getQuestTypeColor(quest.type)}-400`} />
                    }
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{quest.title}</h3>
                    <p className="text-gray-400">{quest.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getQuestStatusColor(quest.status)}-500/20 text-${getQuestStatusColor(quest.status)}-400 border border-${getQuestStatusColor(quest.status)}-500/30`}>
                    {quest.status.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-1 text-orange-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{getTimeRemaining(quest.deadline)}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm text-white font-medium">{Math.round(quest.progress * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`bg-gradient-to-r from-${getQuestTypeColor(quest.type)}-500 to-${getQuestTypeColor(quest.type)}-400 h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${quest.progress * 100}%` }}
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Requirements</span>
                </h4>
                <div className="space-y-2">
                  {quest.requirements.map((req, reqIndex) => (
                    <div key={reqIndex} className="flex items-center space-x-2 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-gray-500 rounded-full" />
                      <span>{req.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rewards */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                  <Gift className="w-4 h-4" />
                  <span>Rewards</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {quest.rewards.map((reward, rewardIndex) => (
                    <div
                      key={rewardIndex}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 rounded-lg border border-green-500/30"
                    >
                      {reward.type === 'xp' && <Zap className="w-3 h-3 text-yellow-400" />}
                      {reward.type === 'nft' && <Trophy className="w-3 h-3 text-purple-400" />}
                      {reward.type === 'title' && <Star className="w-3 h-3 text-blue-400" />}
                      <span className="text-xs text-green-300 font-medium">{reward.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Participants (for group quests) */}
              {quest.type === 'group' && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Participants ({quest.participants.length})</span>
                  </h4>
                  <div className="flex -space-x-2">
                    {quest.participants.slice(0, 8).map((participant, partIndex) => (
                      <div
                        key={partIndex}
                        className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full border-2 border-gray-800 flex items-center justify-center"
                        title={`Player ${participant.slice(-4)}`}
                      >
                        <span className="text-xs text-white font-bold">
                          {participant.slice(-2)}
                        </span>
                      </div>
                    ))}
                    {quest.participants.length > 8 && (
                      <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center">
                        <span className="text-xs text-gray-300">+{quest.participants.length - 8}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => handleCompleteQuest(quest.id)}
                disabled={
                  quest.status !== 'active' || 
                  quest.completedBy.includes(currentPlayer?.address || '')
                }
                className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                  quest.completedBy.includes(currentPlayer?.address || '')
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : quest.status === 'active'
                    ? `bg-gradient-to-r from-${getQuestTypeColor(quest.type)}-500 to-${getQuestTypeColor(quest.type)}-400 text-white hover:from-${getQuestTypeColor(quest.type)}-600 hover:to-${getQuestTypeColor(quest.type)}-500`
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {quest.completedBy.includes(currentPlayer?.address || '') ? (
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Completed</span>
                  </div>
                ) : quest.status === 'active' ? (
                  'Complete Quest'
                ) : (
                  'Quest Expired'
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* No Quests */}
      {filteredQuests.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No quests found</h3>
          <p className="text-gray-400">
            {filter === 'active' 
              ? 'No active quests available. Check back later for new challenges!'
              : 'Try adjusting your filters to see more quests.'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default QuestsPage;