import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { config, chains } from './lib/wagmi';
import { GameStoreProvider, useGame } from './stores/GameStore';
import { XMTPProvider } from './providers/XMTPProvider';
import Layout from './components/Layout';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import QuestsPage from './pages/QuestsPage';
import OnboardingPage from './pages/OnboardingPage';
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Component to handle wallet connection and player initialization
const AppContent: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { currentPlayer, initializePlayer } = useGame();

  useEffect(() => {
    if (isConnected && address && !currentPlayer) {
      initializePlayer(address);
    }
  }, [isConnected, address, currentPlayer, initializePlayer]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={
              // Redirect to onboarding if connected but no player profile
              isConnected && !currentPlayer ? <Navigate to="/onboarding" replace /> : <ChatPage />
            } />
            <Route path="profile" element={
              isConnected && !currentPlayer ? <Navigate to="/onboarding" replace /> : <ProfilePage />
            } />
            <Route path="leaderboard" element={
              isConnected && !currentPlayer ? <Navigate to="/onboarding" replace /> : <LeaderboardPage />
            } />
            <Route path="quests" element={
              isConnected && !currentPlayer ? <Navigate to="/onboarding" replace /> : <QuestsPage />
            } />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains} appInfo={{ appName: 'DeFi RPG Agent' }}>
        <QueryClientProvider client={queryClient}>
          <GameStoreProvider>
            <XMTPProvider>
              <AppContent />
            </XMTPProvider>
          </GameStoreProvider>
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;