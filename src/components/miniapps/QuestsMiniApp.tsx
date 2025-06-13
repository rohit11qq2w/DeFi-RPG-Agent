import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Users, User, CheckCircle, Gift, Play } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useGame } from '../../stores/GameStore';

const QuestsMiniApp: React.FC = () => {
  const { address } = useAccount();
  const { quests, currentPlayer, completeQuest, joinQuest } = useGame();

  const activeQuests = quests.filter(q => q.status === 'active');
  const completedQuests = quests.filter(q => q.status === 'completed');

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const handleCompleteQuest = (questId: string) => {
    if (!currentPlayer) return;
    completeQuest(questId, currentPlayer.address);
  };

  const handleJoinQuest = (questId: string) => {
    if (!currentPlayer) return;
    joinQuest(questId, currentPlayer.address);
  };

  const isPlayerInQuest = (quest: any) => {
    return currentPlayer && quest.participants.includes(currentPlayer.address);
  };

  const hasPlayerCompleted = (quest: any) => {
    return currentPlayer && quest.completedBy.includes(currentPlayer.address);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-white mb-2">Active Quests</h3>
        <p className="text-gray-400 text-sm">Complete challenges to earn XP and rewards</p>
      </motion.div>

      {/* Quest Stats */}
      <motion.div 
        className="grid grid-cols-2 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
          <div className="text-center">
            <p className="text-lg font-bold text-white">{activeQuests.length}</p>
            <p className="text-xs text-green-400">Active</p>
          </div>
        </div>
        <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
          <div className="text-center">
            <p className="text-lg font-bold text-white">{currentPlayer?.stats.questsCompleted || 0}</p>
            <p className="text-xs text-blue-400">Completed</p>
          </div>
        </div>
      </motion.div>

      {/* Active Quests */}
      <div className="space-y-4">
        {activeQuests.map((quest, index) => (
          <motion.div
            key={quest.id}
            className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            {/* Quest Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  quest.type === 'group' ? 'bg-cyan-500/20' : 'bg-purple-500/20'
                }`}>
                  {quest.type === 'group' ? 
                    <Users className="w-5 h-5 text-cyan-400" /> : 
                    <User className="w-5 h-5 text-purple-400" />
                  }
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{quest.title}</h4>
                  <p className="text-xs text-gray-400">{quest.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-orange-400">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-medium">{getTimeRemaining(quest.deadline)}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Progress</span>
                <span className="text-xs text-white font-medium">{Math.round(quest.progress * 100)}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${quest.progress * 100}%` }}
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-3">
              <p className="text-xs font-medium text-white mb-1">Requirements:</p>
              <div className="space-y-1">
                {quest.requirements.map((req, reqIndex) => (
                  <div key={reqIndex} className="flex items-center space-x-2 text-xs text-gray-300">
                    <Target className="w-3 h-3 text-gray-400" />
                    <span>{req.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards */}
            <div className="mb-3">
              <p className="text-xs font-medium text-white mb-1">Rewards:</p>
              <div className="flex flex-wrap gap-1">
                {quest.rewards.map((reward, rewardIndex) => (
                  <div
                    key={rewardIndex}
                    className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 rounded text-xs"
                  >
                    <Gift className="w-3 h-3 text-green-400" />
                    <span className="text-green-300">{reward.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Participants */}
            {quest.type === 'group' && (
              <div className="mb-3">
                <p className="text-xs font-medium text-white mb-1">
                  Participants ({quest.participants.length})
                </p>
                <div className="flex -space-x-1">
                  {quest.participants.slice(0, 5).map((participant, partIndex) => (
                    <div
                      key={partIndex}
                      className="w-5 h-5 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full border border-gray-700 flex items-center justify-center"
                    >
                      <span className="text-xs text-white font-bold">
                        {participant.slice(-1)}
                      </span>
                    </div>
                  ))}
                  {quest.participants.length > 5 && (
                    <div className="w-5 h-5 bg-gray-600 rounded-full border border-gray-700 flex items-center justify-center">
                      <span className="text-xs text-gray-300">+{quest.participants.length - 5}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            {!currentPlayer ? (
              <div className="text-center py-2">
                <p className="text-xs text-gray-500">Connect wallet to participate</p>
              </div>
            ) : hasPlayerCompleted(quest) ? (
              <div className="w-full py-2 bg-green-500/20 rounded-lg text-green-400 font-medium text-center text-sm flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Completed</span>
              </div>
            ) : !isPlayerInQuest(quest) ? (
              <button
                onClick={() => handleJoinQuest(quest.id)}
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg text-white font-medium hover:from-blue-600 hover:to-blue-500 transition-all duration-200 text-sm flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Join Quest</span>
              </button>
            ) : (
              <button
                onClick={() => handleCompleteQuest(quest.id)}
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 text-sm"
              >
                Complete Quest
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* No Active Quests */}
      {activeQuests.length === 0 && (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No active quests available</p>
          <p className="text-sm text-gray-500 mt-1">Check back later for new challenges!</p>
        </motion.div>
      )}
    </div>
  );
};

export default QuestsMiniApp;