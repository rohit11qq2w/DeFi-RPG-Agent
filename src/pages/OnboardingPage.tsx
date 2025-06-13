import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Gamepad2, Zap, Trophy, Target, Users, ArrowRight } from 'lucide-react';
import { useGame } from '../stores/GameStore';
import { rpgClasses } from '../data/mockData';

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [username, setUsername] = useState('');
  
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { initializePlayer, setCurrentPlayer } = useGame();

  const steps = [
    'Welcome',
    'Connect Wallet',
    'Choose Class',
    'Set Username',
    'Complete'
  ];

  const features = [
    {
      icon: Zap,
      title: 'Earn XP',
      description: 'Gain experience points for every DeFi action you take'
    },
    {
      icon: Trophy,
      title: 'Unlock Achievements',
      description: 'Collect rare NFT achievements for major milestones'
    },
    {
      icon: Target,
      title: 'Complete Quests',
      description: 'Join group challenges and earn exclusive rewards'
    },
    {
      icon: Users,
      title: 'Social Gaming',
      description: 'Chat with other players and compete on leaderboards'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinish = () => {
    if (address) {
      initializePlayer(address);
      // Set class and username for the player
      // In a real app, this would update the player profile
      navigate('/');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                <Gamepad2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome to DeFi RPG Agent
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Transform your DeFi journey into an epic RPG adventure. Earn XP, unlock achievements, 
                and compete with friends while managing your portfolio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
                >
                  <feature.icon className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Connect Your Wallet</h2>
              <p className="text-gray-400 text-lg">
                Connect your wallet to start your DeFi RPG journey
              </p>
            </div>

            <div className="flex justify-center">
              <ConnectButton />
            </div>

            {isConnected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <ArrowRight className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-green-400 font-medium">Wallet connected successfully!</p>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-green-500 rounded-lg text-white font-medium hover:bg-green-600 transition-colors"
                >
                  Continue
                </button>
              </motion.div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Choose Your RPG Class</h2>
              <p className="text-gray-400 text-lg">
                Select a class that matches your DeFi strategy
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {rpgClasses.map((rpgClass) => (
                <motion.div
                  key={rpgClass.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedClass(rpgClass.id)}
                  className={`p-6 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedClass === rpgClass.id
                      ? 'bg-purple-500/20 border-purple-500'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-center space-y-4">
                    <span className="text-4xl">{rpgClass.icon}</span>
                    <h3 className="text-xl font-bold text-white">{rpgClass.name}</h3>
                    <p className="text-gray-400 text-sm">{rpgClass.description}</p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-purple-400">Bonuses:</p>
                      {rpgClass.bonuses.map((bonus, index) => (
                        <p key={index} className="text-xs text-gray-300">• {bonus}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedClass && (
              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-cyan-600 transition-all duration-200"
                >
                  Continue
                </button>
              </div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Set Your Username</h2>
              <p className="text-gray-400 text-lg">
                Choose a username for your RPG identity
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                maxLength={20}
              />
              
              {username && (
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {rpgClasses.find(c => c.id === selectedClass)?.icon}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-white">{username}</p>
                      <p className="text-xs text-gray-400">
                        {rpgClasses.find(c => c.id === selectedClass)?.name} • Level 1
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {username.length >= 3 && (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-cyan-600 transition-all duration-200"
              >
                Continue
              </button>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">You're All Set!</h2>
              <p className="text-gray-400 text-lg">
                Your DeFi RPG adventure is ready to begin
              </p>
            </div>

            <div className="max-w-md mx-auto p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <h3 className="font-bold text-white mb-4">Your Character</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">
                    {rpgClasses.find(c => c.id === selectedClass)?.icon}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">{username}</p>
                  <p className="text-sm text-gray-400">
                    {rpgClasses.find(c => c.id === selectedClass)?.name}
                  </p>
                  <p className="text-xs text-gray-500">Level 1 • 0 XP</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <span>Enter Game</span>
              <Gamepad2 className="w-5 h-5" />
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                    index <= currentStep
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-200 ${
                      index < currentStep ? 'bg-purple-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </div>

        {/* Step Content */}
        <div className="min-h-[600px] flex items-center justify-center">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;