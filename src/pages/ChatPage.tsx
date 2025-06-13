import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Zap, Trophy, Target, Plus } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useGame } from '../stores/GameStore';
import { useXMTP } from '../providers/XMTPProvider';
import { ChatMessage } from '../types/game';

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { address, isConnected } = useAccount();
  const { 
    messages, 
    addMessage, 
    currentPlayer, 
    updatePlayerXP, 
    unlockAchievement,
    completeQuest,
    initializePlayer,
    updateQuestProgress
  } = useGame();
  
  const { sendMessage: sendXMTPMessage, isConnected: xmtpConnected } = useXMTP();

  // Initialize player when wallet connects
  useEffect(() => {
    if (isConnected && address && !currentPlayer) {
      initializePlayer(address);
    }
  }, [isConnected, address, currentPlayer, initializePlayer]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!isConnected || !address) {
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'system',
        content: '❌ Please connect your wallet first to participate in the chat!',
        timestamp: new Date(),
        type: 'system'
      };
      addMessage(errorMessage);
      setMessage('');
      return;
    }

    if (!currentPlayer) {
      initializePlayer(address);
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: currentPlayer.address,
      content: message,
      timestamp: new Date(),
      type: 'user'
    };

    addMessage(newMessage);
    
    // Send via XMTP if connected
    if (xmtpConnected) {
      try {
        await sendXMTPMessage('group-conversation-topic', message);
      } catch (error) {
        console.log('XMTP send failed, continuing in local mode');
      }
    }

    const messageContent = message;
    setMessage('');
    
    // Simulate AI responses and game events
    simulateGameEvents(messageContent);
  };

  const simulateGameEvents = (userMessage: string) => {
    if (!currentPlayer) return;

    setIsTyping(true);
    
    setTimeout(() => {
      // Simulate different DeFi actions based on message content
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('swap') || lowerMessage.includes('trade')) {
        const xpGained = Math.floor(Math.random() * 100) + 50;
        updatePlayerXP(currentPlayer.address, xpGained);
        
        // Update quest progress
        updateQuestProgress('weekly-swap-challenge', currentPlayer.address, 0.2);
        
        const systemMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          content: `🔄 ${currentPlayer.username} completed a swap and earned ${xpGained} XP!`,
          timestamp: new Date(),
          type: 'system',
          metadata: {
            action: 'swap',
            xpGained
          }
        };
        
        addMessage(systemMessage);
        
        // Check for achievements
        setTimeout(() => {
          if (Math.random() > 0.6) {
            unlockAchievement('first-swap', currentPlayer.address);
          }
        }, 1000);
        
      } else if (lowerMessage.includes('liquidity') || lowerMessage.includes('lp')) {
        const xpGained = Math.floor(Math.random() * 150) + 100;
        updatePlayerXP(currentPlayer.address, xpGained);
        
        // Update quest progress
        updateQuestProgress('liquidity-pool-master', currentPlayer.address, 0.3);
        
        const systemMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          content: `💧 ${currentPlayer.username} provided liquidity and earned ${xpGained} XP!`,
          timestamp: new Date(),
          type: 'system',
          metadata: {
            action: 'liquidity',
            xpGained
          }
        };
        
        addMessage(systemMessage);
        
        setTimeout(() => {
          if (Math.random() > 0.7) {
            unlockAchievement('liquidity-legend', currentPlayer.address);
          }
        }, 1000);
        
      } else if (lowerMessage.includes('stake') || lowerMessage.includes('staking')) {
        const xpGained = Math.floor(Math.random() * 120) + 80;
        updatePlayerXP(currentPlayer.address, xpGained);
        
        const systemMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          content: `🛡️ ${currentPlayer.username} staked tokens and earned ${xpGained} XP!`,
          timestamp: new Date(),
          type: 'system',
          metadata: {
            action: 'stake',
            xpGained
          }
        };
        
        addMessage(systemMessage);
        
      } else if (lowerMessage.includes('bridge')) {
        const xpGained = Math.floor(Math.random() * 90) + 60;
        updatePlayerXP(currentPlayer.address, xpGained);
        
        const systemMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          content: `🌉 ${currentPlayer.username} bridged assets and earned ${xpGained} XP!`,
          timestamp: new Date(),
          type: 'system',
          metadata: {
            action: 'bridge',
            xpGained
          }
        };
        
        addMessage(systemMessage);
        
      } else if (lowerMessage.includes('quest') || lowerMessage.includes('challenge')) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          content: `🎯 Check out the active quests! Click the quests tab or mini-app to see what challenges await you. Complete them for bonus XP and NFT rewards!`,
          timestamp: new Date(),
          type: 'bot'
        };
        
        addMessage(botMessage);
        
      } else if (lowerMessage.includes('complete quest')) {
        // Try to complete a quest
        completeQuest('weekly-swap-challenge', currentPlayer.address);
        
      } else {
        // General AI response
        const responses = [
          "🤖 I'm your DeFi RPG companion! Try mentioning 'swap', 'liquidity', 'stake', 'bridge', or 'quest' to see game mechanics in action.",
          "🎮 Level up your DeFi game! Complete transactions to earn XP and unlock achievements.",
          "🚀 Pro tip: Join group quests for bonus rewards and team up with other players!",
          "💎 Keep building your DeFi portfolio to unlock new RPG classes and exclusive achievements.",
          "⚡ Your next level-up is just a few transactions away! What DeFi action will you take next?",
          "🏆 Check your profile to see your progress, or visit the leaderboard to see how you rank!",
          "🎯 Active quests are waiting for you! Type 'quest' to learn more about available challenges."
        ];
        
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: 'bot'
        };
        
        addMessage(botMessage);
      }
      
      setIsTyping(false);
    }, 1500);
  };

  const getMessageIcon = (message: ChatMessage) => {
    if (message.type === 'system') {
      if (message.metadata?.action === 'swap') return <Zap className="w-4 h-4 text-yellow-500" />;
      if (message.metadata?.action === 'liquidity') return <Target className="w-4 h-4 text-blue-500" />;
      if (message.metadata?.action === 'stake') return <Trophy className="w-4 h-4 text-green-500" />;
      if (message.metadata?.action === 'bridge') return <Target className="w-4 h-4 text-purple-500" />;
      return <Bot className="w-4 h-4 text-purple-500" />;
    }
    if (message.type === 'bot') return <Bot className="w-4 h-4 text-cyan-500" />;
    return null;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/50">
      {/* Chat Header */}
      <div className="bg-gray-800/90 backdrop-blur-xl border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">DeFi RPG Group Chat</h2>
            <p className="text-sm text-gray-400">
              {isConnected ? (
                currentPlayer ? (
                  `${currentPlayer.username} • Level ${currentPlayer.level} • ${messages.length} messages`
                ) : (
                  'Initializing player...'
                )
              ) : (
                'Connect wallet to join the conversation'
              )} 
            </p>
          </div>
          <button className="p-2 bg-purple-500/20 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.sender === currentPlayer?.address ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-purple-500 text-white'
                    : msg.type === 'system'
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-100'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center space-x-2 mb-1">
                  {getMessageIcon(msg)}
                  <span className="text-xs font-medium opacity-75">
                    {msg.type === 'system' 
                      ? 'System' 
                      : msg.type === 'bot' 
                      ? 'DeFi RPG Bot' 
                      : msg.sender === currentPlayer?.address 
                      ? 'You' 
                      : `Player_${msg.sender.slice(-4)}`
                    }
                  </span>
                  <span className="text-xs opacity-50">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>

                {/* Message Content */}
                <p className="text-sm leading-relaxed">{msg.content}</p>

                {/* XP Indicator */}
                {msg.metadata?.xpGained && (
                  <div className="mt-2 flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400">
                      +{msg.metadata.xpGained} XP
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-700 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-cyan-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-800/90 backdrop-blur-xl border-t border-gray-700">
        <div className="flex space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isConnected 
                ? "Type a message... (try 'swap', 'liquidity', 'stake', 'bridge', or 'quest')"
                : "Connect your wallet to participate in chat"
            }
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            disabled={isTyping || !isConnected}
          />
          <button
            type="submit"
            disabled={!message.trim() || isTyping || !isConnected}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        
        {!isConnected && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Connect your wallet above to start chatting and earning XP!
          </p>
        )}
      </form>
    </div>
  );
};

export default ChatPage;