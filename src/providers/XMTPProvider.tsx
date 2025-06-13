import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { XMTPClient, Conversation, XMTPMessage } from '../types/xmtp';

interface XMTPContextType {
  client: any | null;
  conversations: Conversation[];
  isConnected: boolean;
  isLoading: boolean;
  connectXMTP: () => Promise<void>;
  sendMessage: (conversationTopic: string, content: string) => Promise<void>;
  createConversation: (peerAddress: string) => Promise<Conversation | null>;
}

const XMTPContext = createContext<XMTPContextType | undefined>(undefined);

export const XMTPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<any | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const connectXMTP = async () => {
    if (!walletClient || !address) {
      console.log('No wallet client or address available - running in demo mode');
      setIsConnected(false);
      return;
    }

    setIsLoading(true);
    try {
      // For now, we'll simulate XMTP connection since it requires proper setup
      // In production, you would uncomment the following:
      
      // const { Client } = await import('@xmtp/xmtp-js');
      // const xmtpClient = await Client.create(walletClient, { env: 'dev' });
      // setClient(xmtpClient);
      
      console.log('XMTP connection simulated - running in demo mode');
      setIsConnected(false); // Set to false for demo mode
      
    } catch (error) {
      console.log('XMTP connection failed - continuing in demo mode:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (conversationTopic: string, content: string) => {
    if (!client) {
      console.log('Demo mode: Message would be sent via XMTP:', content);
      return;
    }
    
    try {
      const conversation = conversations.find(c => c.topic === conversationTopic);
      if (!conversation) return;
      
      const newMessage: XMTPMessage = {
        id: Date.now().toString(),
        senderAddress: address || '',
        content,
        timestamp: new Date(),
        contentType: 'text/plain'
      };
      
      setConversations(prev => 
        prev.map(conv => 
          conv.topic === conversationTopic 
            ? { ...conv, messages: [...conv.messages, newMessage] }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const createConversation = async (peerAddress: string): Promise<Conversation | null> => {
    if (!client) {
      console.log('Demo mode: Conversation would be created with:', peerAddress);
      return null;
    }
    
    try {
      // Simulate conversation creation
      const newConvo: Conversation = {
        id: `demo-${Date.now()}`,
        topic: `demo-topic-${Date.now()}`,
        peerAddress: peerAddress,
        createdAt: new Date(),
        messages: []
      };
      
      setConversations(prev => [...prev, newConvo]);
      return newConvo;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      return null;
    }
  };

  useEffect(() => {
    if (address && walletClient && !client) {
      connectXMTP();
    }
  }, [address, walletClient]);

  const value: XMTPContextType = {
    client,
    conversations,
    isConnected,
    isLoading,
    connectXMTP,
    sendMessage,
    createConversation
  };

  return (
    <XMTPContext.Provider value={value}>
      {children}
    </XMTPContext.Provider>
  );
};

export const useXMTP = () => {
  const context = useContext(XMTPContext);
  if (context === undefined) {
    throw new Error('useXMTP must be used within an XMTPProvider');
  }
  return context;
};