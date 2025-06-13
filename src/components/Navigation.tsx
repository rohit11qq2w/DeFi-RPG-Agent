import React from 'react';
import { NavLink } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  User, 
  Trophy, 
  Target, 
  Gamepad2,
  Zap,
  Settings
} from 'lucide-react';
import { useGame } from '../stores/GameStore';

const Navigation: React.FC = () => {
  const { currentPlayer, toggleMiniApp, showMiniApp } = useGame();

  const navItems = [
    { to: '/', icon: MessageSquare, label: 'Chat' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/quests', icon: Target, label: 'Quests' }
  ];

  return (
    <nav className="bg-gray-800/90 backdrop-blur-xl border-b border-purple-500/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo & Brand */}
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-2 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              DeFi RPG Agent
            </h1>
            {currentPlayer && (
              <p className="text-sm text-gray-400">
                {currentPlayer.rpgClass.icon} {currentPlayer.username} • Lv.{currentPlayer.level}
              </p>
            )}
          </div>
        </motion.div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-1">
          {navItems.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          {/* XP Display */}
          {currentPlayer && (
            <motion.div 
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg border border-purple-500/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-bold text-white">
                {currentPlayer.xp.toLocaleString()} XP
              </span>
            </motion.div>
          )}

          {/* Mini App Toggle */}
          <motion.button
            onClick={toggleMiniApp}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showMiniApp
                ? 'bg-purple-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          {/* Wallet Connection */}
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;