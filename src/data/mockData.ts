import { RPGClass, Player, Quest, Achievement } from '../types/game';

export const rpgClasses: RPGClass[] = [
  {
    id: 'swapper',
    name: 'Swapper',
    description: 'Masters of token exchange, earning bonuses on trading activities',
    icon: '⚡',
    primaryStat: 'Trading Volume',
    bonuses: ['+20% XP from swaps', 'Lower gas fees on trades'],
    requirements: [
      { type: 'swaps', minAmount: 10, description: '10+ token swaps' }
    ]
  },
  {
    id: 'farmer',
    name: 'Liquidity Farmer',
    description: 'Providers of liquidity, earning rewards from yield farming',
    icon: '🌾',
    primaryStat: 'Total Liquidity',
    bonuses: ['+25% XP from LP activities', 'Higher yield multipliers'],
    requirements: [
      { type: 'liquidity', minAmount: 1000, description: '$1000+ in liquidity provided' }
    ]
  },
  {
    id: 'staker',
    name: 'Staking Sentinel',
    description: 'Long-term holders who secure networks through staking',
    icon: '🛡️',
    primaryStat: 'Staked Amount',
    bonuses: ['+30% XP from staking', 'Compound rewards boost'],
    requirements: [
      { type: 'staking', minAmount: 500, description: '$500+ staked assets' }
    ]
  },
  {
    id: 'bridger',
    name: 'Bridge Navigator',
    description: 'Cross-chain experts who bridge assets between networks',
    icon: '🌉',
    primaryStat: 'Bridge Volume',
    bonuses: ['+15% XP from bridging', 'Reduced bridge fees'],
    requirements: [
      { type: 'bridging', minAmount: 5, description: '5+ cross-chain bridges' }
    ]
  }
];

export const mockPlayers: Player[] = [
  {
    address: '0x1234567890123456789012345678901234567890',
    username: 'CryptoWarrior',
    rpgClass: rpgClasses[0],
    level: 5,
    xp: 4750,
    xpToNextLevel: 250,
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=warrior',
    achievements: [
      {
        id: 'first-swap',
        name: 'First Swap',
        description: 'Complete your first token swap',
        icon: '🔄',
        rarity: 'common',
        xpReward: 100,
        unlockedAt: new Date(Date.now() - 86400000)
      }
    ],
    stats: {
      totalSwaps: 25,
      totalLiquidity: 5000,
      totalStaked: 2000,
      totalBridged: 8,
      questsCompleted: 3,
      nftsEarned: 2
    },
    joinedAt: new Date('2024-01-15')
  },
  {
    address: '0x2345678901234567890123456789012345678901',
    username: 'DeFiMage',
    rpgClass: rpgClasses[1],
    level: 7,
    xp: 6200,
    xpToNextLevel: 800,
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=mage',
    achievements: [
      {
        id: 'liquidity-legend',
        name: 'Liquidity Legend',
        description: 'Provide over $50,000 in total liquidity',
        icon: '💎',
        rarity: 'legendary',
        xpReward: 2500,
        unlockedAt: new Date(Date.now() - 172800000)
      }
    ],
    stats: {
      totalSwaps: 15,
      totalLiquidity: 12000,
      totalStaked: 8000,
      totalBridged: 3,
      questsCompleted: 5,
      nftsEarned: 4
    },
    joinedAt: new Date('2024-01-10')
  },
  {
    address: '0x3456789012345678901234567890123456789012',
    username: 'StakeKnight',
    rpgClass: rpgClasses[2],
    level: 6,
    xp: 5800,
    xpToNextLevel: 200,
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=knight',
    achievements: [],
    stats: {
      totalSwaps: 8,
      totalLiquidity: 3000,
      totalStaked: 15000,
      totalBridged: 2,
      questsCompleted: 4,
      nftsEarned: 3
    },
    joinedAt: new Date('2024-01-12')
  }
];

export const mockQuests: Quest[] = [
  {
    id: 'weekly-swap-challenge',
    title: 'Weekly Swap Challenge',
    description: 'Complete 5 token swaps this week to earn bonus XP and exclusive NFT',
    type: 'group',
    requirements: [
      { type: 'swap', amount: 5, description: 'Complete 5 token swaps' }
    ],
    rewards: [
      { type: 'xp', amount: 500, description: '500 XP bonus' },
      { type: 'nft', tokenId: 'SWAP_MASTER_001', description: 'Swap Master NFT' }
    ],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    participants: [
      '0x1234567890123456789012345678901234567890', 
      '0x2345678901234567890123456789012345678901',
      '0x3456789012345678901234567890123456789012'
    ],
    completedBy: [],
    status: 'active',
    progress: 0.3
  },
  {
    id: 'liquidity-pool-master',
    title: 'Liquidity Pool Master',
    description: 'Provide $2000 in liquidity across different pools to become a LP master',
    type: 'individual',
    requirements: [
      { type: 'liquidity', amount: 2000, description: 'Provide $2000 in liquidity' }
    ],
    rewards: [
      { type: 'xp', amount: 750, description: '750 XP reward' },
      { type: 'title', description: 'LP Master title' }
    ],
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    participants: [
      '0x1234567890123456789012345678901234567890',
      '0x2345678901234567890123456789012345678901'
    ],
    completedBy: [],
    status: 'active',
    progress: 0.6
  },
  {
    id: 'staking-sentinel',
    title: 'Staking Sentinel',
    description: 'Stake $1000 worth of tokens to join the sentinel ranks',
    type: 'individual',
    requirements: [
      { type: 'stake', amount: 1000, description: 'Stake $1000 worth of tokens' }
    ],
    rewards: [
      { type: 'xp', amount: 600, description: '600 XP reward' },
      { type: 'nft', tokenId: 'SENTINEL_001', description: 'Sentinel Badge NFT' }
    ],
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    participants: [
      '0x3456789012345678901234567890123456789012'
    ],
    completedBy: [],
    status: 'active',
    progress: 0.8
  },
  {
    id: 'bridge-explorer',
    title: 'Bridge Explorer',
    description: 'Complete 3 cross-chain bridges to explore the multiverse',
    type: 'group',
    requirements: [
      { type: 'bridge', amount: 3, description: 'Complete 3 cross-chain bridges' }
    ],
    rewards: [
      { type: 'xp', amount: 400, description: '400 XP reward' },
      { type: 'nft', tokenId: 'EXPLORER_001', description: 'Bridge Explorer NFT' }
    ],
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    participants: [
      '0x1234567890123456789012345678901234567890'
    ],
    completedBy: [],
    status: 'active',
    progress: 0.1
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: 'first-swap',
    name: 'First Swap',
    description: 'Complete your first token swap',
    icon: '🔄',
    rarity: 'common',
    xpReward: 100,
    unlockedAt: new Date()
  },
  {
    id: 'whale-trader',
    name: 'Whale Trader',
    description: 'Complete a swap worth over $10,000',
    icon: '🐋',
    rarity: 'epic',
    xpReward: 1000,
    unlockedAt: new Date()
  },
  {
    id: 'liquidity-legend',
    name: 'Liquidity Legend',
    description: 'Provide over $50,000 in total liquidity',
    icon: '💎',
    rarity: 'legendary',
    xpReward: 2500,
    unlockedAt: new Date()
  },
  {
    id: 'quest-master',
    name: 'Quest Master',
    description: 'Complete 10 group quests',
    icon: '🏆',
    rarity: 'rare',
    xpReward: 500,
    unlockedAt: new Date()
  },
  {
    id: 'staking-champion',
    name: 'Staking Champion',
    description: 'Stake tokens for 30 consecutive days',
    icon: '🛡️',
    rarity: 'epic',
    xpReward: 800,
    unlockedAt: new Date()
  },
  {
    id: 'bridge-master',
    name: 'Bridge Master',
    description: 'Complete 20 cross-chain bridges',
    icon: '🌉',
    rarity: 'rare',
    xpReward: 600,
    unlockedAt: new Date()
  },
  {
    id: 'defi-veteran',
    name: 'DeFi Veteran',
    description: 'Reach level 10 in the DeFi RPG',
    icon: '⭐',
    rarity: 'legendary',
    xpReward: 3000,
    unlockedAt: new Date()
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Send 100 messages in group chat',
    icon: '🦋',
    rarity: 'common',
    xpReward: 200,
    unlockedAt: new Date()
  }
];

// Mock DeFi activity data
export const mockDefiActivities = [
  {
    id: '1',
    type: 'swap',
    hash: '0xabc123...',
    from: 'ETH',
    to: 'USDC',
    amount: '1.5',
    value: 2400,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    xpGained: 50
  },
  {
    id: '2',
    type: 'liquidity',
    hash: '0xdef456...',
    pool: 'ETH/USDC',
    amount: '5000',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    xpGained: 150
  },
  {
    id: '3',
    type: 'stake',
    hash: '0xghi789...',
    protocol: 'Compound',
    amount: '1000',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    xpGained: 100
  }
];