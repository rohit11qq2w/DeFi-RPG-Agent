export interface XMTPMessage {
  id: string;
  senderAddress: string;
  content: string;
  timestamp: Date;
  contentType: string;
}

export interface Conversation {
  id: string;
  topic: string;
  peerAddress: string;
  createdAt: Date;
  messages: XMTPMessage[];
}

export interface XMTPClient {
  address: string;
  conversations: Conversation[];
  isConnected: boolean;
}