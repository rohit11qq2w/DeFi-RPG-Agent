export interface Player {
  address: string;
  username: string;
  rpgClass: RPGClass;
  level: number;
  xp: number;
  xpToNextLevel: number;
  avatar: string;
  achievements: Achievement[];
  stats: PlayerStats;
  joinedAt: Date;
}

export interface PlayerStats {
  totalSwaps: number;
  totalLiquidity: number;
  totalStaked: number;
  totalBridged: number;
  questsCompleted: number;
  nftsEarned: number;
}

export interface RPGClass {
  id: string;
  name: string;
  description: string;
  icon: string;
  primaryStat: string;
  bonuses: string[];
  requirements: ClassRequirement[];
}

export interface ClassRequirement {
  type: 'swaps' | 'liquidity' | 'staking' | 'bridging';
  minAmount: number;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  tokenId?: string;
  unlockedAt: Date;
  xpReward: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'group';
  requirements: QuestRequirement[];
  rewards: QuestReward[];
  deadline: Date;
  participants: string[];
  completedBy: string[];
  status: 'active' | 'completed' | 'expired';
  progress: number;
}

export interface QuestRequirement {
  type: 'swap' | 'liquidity' | 'stake' | 'bridge';
  amount: number;
  description: string;
}

export interface QuestReward {
  type: 'xp' | 'nft' | 'title';
  amount?: number;
  tokenId?: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'system' | 'bot';
  metadata?: {
    action?: string;
    xpGained?: number;
    achievement?: Achievement;
    quest?: Quest;
  };
}

export interface LeaderboardEntry {
  rank: number;
  player: Player;
  score: number;
  change: number;
}

export interface GameEvent {
  id: string;
  type: 'xp_gained' | 'level_up' | 'achievement_unlocked' | 'quest_completed';
  player: string;
  data: any;
  timestamp: Date;
}