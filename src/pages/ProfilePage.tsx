import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Zap, 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp,
  Star,
  Shield,
  Coins,
  Activity
} from 'lucide-react';
import { useGame } from '../stores/GameStore';

const ProfilePage: React.FC = () => {
  const { currentPlayer } = useGame();

  if (!currentPlayer) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <User className="w-16 h-16 text-gray-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">No Profile Found</h2>
          <p className="text-gray-400">Connect your wallet to view your profile</p>
        </div>
      </div>
    );
  }

  const levelProgress = (currentPlayer.xp % 1000) / 1000;
  
  const statCards = [
    { 
      label: 'Total Swaps', 
      value: currentPlayer.stats.totalSwaps, 
      icon: TrendingUp, 
      color: 'purple',
      trend: '+12%'
    },
    { 
      label: 'Liquidity Provided', 
      value: `$${currentPlayer.stats.totalLiquidity.toLocaleString()}`, 
      icon: Star, 
      color: 'cyan',
      trend: '+8%'
    },
    { 
      label: 'Total Staked', 
      value: `$${currentPlayer.stats.totalStaked.toLocaleString()}`, 
      icon: Shield, 
      color: 'green',
      trend: '+15%'
    },
    { 
      label: 'Bridges Completed', 
      value: currentPlayer.stats.totalBridged, 
      icon: Activity, 
      color: 'orange',
      trend: '+3'
    },
    { 
      label: 'Quests Completed', 
      value: currentPlayer.stats.questsCompleted, 
      icon: Target, 
      color: 'pink',
      trend: '+2'
    },
    { 
      label: 'NFTs Earned', 
      value: currentPlayer.stats.nftsEarned, 
      icon: Coins, 
      color: 'yellow',
      trend: '+1'
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Profile Header */}
      <motion.div 
        className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl p-8 border border-purple-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="relative">
            <img
              src={currentPlayer.avatar}
              alt={currentPlayer.username}
              className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full p-2">
              <span className="text-2xl">{currentPlayer.rpgClass.icon}</span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{currentPlayer.username}</h1>
              <p className="text-gray-400 text-sm">
                {currentPlayer.address.slice(0, 8)}...{currentPlayer.address.slice(-6)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
              {/* Level */}
              <div className="text-center">
                <p className="text-2xl font-bold text-white">Level {currentPlayer.level}</p>
                <p className="text-sm text-gray-400">RPG Level</p>
              </div>

              {/* XP */}
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{currentPlayer.xp.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Total XP</p>
              </div>

              {/* Join Date */}
              <div className="text-center">
                <p className="text-lg font-bold text-white">
                  {currentPlayer.joinedAt.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">Member Since</p>
              </div>
            </div>

            {/* Level Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Progress to Level {currentPlayer.level + 1}</span>
                <span className="text-sm text-white font-medium">
                  {currentPlayer.xp % 1000} / 1000 XP
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RPG Class Details */}
      <motion.div 
        className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <span className="text-2xl">{currentPlayer.rpgClass.icon}</span>
          <span>{currentPlayer.rpgClass.name}</span>
        </h2>
        <p className="text-gray-300 mb-4">{currentPlayer.rpgClass.description}</p>
        
        <div className="space-y-2">
          <h3 className="font-medium text-white">Class Bonuses:</h3>
          {currentPlayer.rpgClass.bonuses.map((bonus, index) => (
            <div key={index} className="flex items-center space-x-2 text-green-400">
              <Star className="w-4 h-4" />
              <span className="text-sm">{bonus}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
              <span className={`text-sm font-medium text-${stat.color === 'green' ? 'green' : 'gray'}-400`}>
                {stat.trend}
              </span>
            </div>
            
            <div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Achievements */}
      <motion.div 
        className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span>Recent Achievements</span>
        </h2>
        
        {currentPlayer.achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPlayer.achievements.slice(0, 4).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <span className="text-3xl">{achievement.icon}</span>
                <div>
                  <h3 className="font-bold text-white">{achievement.name}</h3>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-yellow-500 font-medium">
                      +{achievement.xpReward} XP
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No achievements yet</p>
            <p className="text-gray-500 text-sm">
              Complete your first DeFi action to earn achievements!
            </p>
          </div>
        )}
      </motion.div>

      {/* Activity Timeline */}
      <motion.div 
        className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-purple-500" />
          <span>Recent Activity</span>
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-700/30 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div>
              <p className="text-white font-medium">Joined DeFi RPG</p>
              <p className="text-sm text-gray-400">
                {currentPlayer.joinedAt.toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-gray-700/30 rounded-lg opacity-60">
            <div className="w-2 h-2 bg-gray-500 rounded-full" />
            <div>
              <p className="text-gray-300">More activity coming soon...</p>
              <p className="text-sm text-gray-500">Start trading to see your history</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;