import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import MiniApp from './MiniApp';
import { useGame } from '../stores/GameStore';

const Layout: React.FC = () => {
  const { showMiniApp } = useGame();

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navigation />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
      
      {/* Mini App Overlay */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: showMiniApp ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-96 bg-gray-800/95 backdrop-blur-xl border-l border-purple-500/20 shadow-2xl z-50"
      >
        <MiniApp />
      </motion.div>
    </div>
  );
};

export default Layout;