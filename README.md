# DeFi RPG Agent

A gamified DeFi experience that transforms your blockchain interactions into an epic RPG adventure. Built with React, XMTP messaging, and smart contracts on Base chain.

## 🎮 Features

### Core Gameplay
- **RPG Classes**: Swapper, Liquidity Farmer, Staking Sentinel, Bridge Navigator
- **XP System**: Earn experience points for every DeFi action
- **Level Progression**: Advance through levels with increasing rewards
- **Achievement NFTs**: Collect rare NFTs for major milestones
- **Group Quests**: Team up with other players for shared challenges

### Social Features
- **XMTP Chat**: Real-time messaging with embedded game mechanics
- **Leaderboards**: Compete with other players globally
- **Event Broadcasting**: Live updates when players level up or earn achievements
- **Mini-Apps**: Embedded profile, leaderboard, and quest interfaces

### DeFi Integration
- **Base Chain**: Built on Ethereum L2 for fast, cheap transactions
- **Multi-Protocol**: Track swaps, liquidity provision, staking, and bridging
- **Real-time Tracking**: Monitor DeFi activities across protocols
- **Smart Contracts**: ERC721 achievements and ERC1155 XP tokens

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask or Coinbase Wallet
- Base testnet ETH

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd defi-rpg-agent
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
VITE_ALCHEMY_ID=your_alchemy_api_key
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start the development server**
```bash
npm run dev
```

5. **Deploy smart contracts (optional)**
```bash
# Compile contracts
npm run contracts:compile

# Deploy to Base testnet
npm run contracts:deploy
```

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Wagmi** for Web3 integration
- **RainbowKit** for wallet connections
- **Zustand** for state management

### Blockchain Stack
- **Base Chain** (Ethereum L2)
- **Solidity** smart contracts
- **Hardhat** for development
- **OpenZeppelin** for security

### Messaging & Social
- **XMTP** for decentralized messaging
- **Real-time events** for game mechanics
- **Embedded mini-apps** for rich interactions

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Navigation.tsx  # Top navigation bar
│   ├── MiniApp.tsx     # Embedded mini-app container
│   └── miniapps/       # Mini-app components
├── pages/              # Page components
│   ├── ChatPage.tsx    # Main chat interface
│   ├── ProfilePage.tsx # Player profile
│   ├── LeaderboardPage.tsx
│   ├── QuestsPage.tsx
│   └── OnboardingPage.tsx
├── stores/             # State management
│   └── GameStore.tsx   # Main game state
├── providers/          # Context providers
│   └── XMTPProvider.tsx
├── types/              # TypeScript definitions
├── data/               # Mock data and constants
└── lib/                # Utilities and configurations

contracts/
├── DeFiRPGNFT.sol     # ERC721 achievement NFTs
├── DeFiRPGXP.sol      # ERC1155 XP and class tokens
└── DeFiRPGQuests.sol  # Quest management

scripts/
└── deploy.js          # Deployment script
```

## 🎯 Game Mechanics

### RPG Classes

**Swapper** ⚡
- Bonus: +20% XP from swaps
- Requirements: 10+ token swaps

**Liquidity Farmer** 🌾
- Bonus: +25% XP from LP activities
- Requirements: $1000+ liquidity provided

**Staking Sentinel** 🛡️
- Bonus: +30% XP from staking
- Requirements: $500+ staked assets

**Bridge Navigator** 🌉
- Bonus: +15% XP from bridging
- Requirements: 5+ cross-chain bridges

### XP & Leveling
- **1000 XP per level**
- **XP Sources**: Swaps (50-100), Liquidity (100-200), Staking (80-150), Bridging (60-120)
- **Level Benefits**: Increased multipliers, exclusive quests, rare NFTs

### Achievements
- **Common**: First swap, first LP position
- **Rare**: 10 swaps, $5K liquidity
- **Epic**: $10K swap, whale trader
- **Legendary**: $50K+ total volume, quest master

## 🔧 Smart Contracts

### DeFiRPGNFT (ERC721)
- Achievement NFTs with metadata
- Rarity system (common, rare, epic, legendary)
- Player achievement tracking

### DeFiRPGXP (ERC1155)
- XP tokens (ID: 0)
- Class tokens (IDs: 1-4)
- Level and stat tracking

### DeFiRPGQuests
- Quest creation and management
- Progress tracking
- Reward distribution

## 🌐 Deployment

### Frontend (Netlify)
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Smart Contracts (Base)
```bash
# Set up environment
export PRIVATE_KEY=your_private_key

# Deploy to Base testnet
npm run contracts:deploy

# Verify contracts
npm run contracts:verify
```

## 🧪 Testing

### Frontend Testing
```bash
npm run test
```

### Contract Testing
```bash
npx hardhat test
```

### Local Development
```bash
# Start local blockchain
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

## 🔮 Future Enhancements

### Phase 2
- **Battle Mode**: XP duels between players
- **Guilds**: Team-based competitions
- **NFT Marketplace**: Trade achievement NFTs
- **Cross-chain**: Expand to other L2s

### Phase 3
- **AI Strategy**: Personalized DeFi recommendations
- **Governance**: DAO for game mechanics
- **Mobile App**: Native iOS/Android experience
- **Partnerships**: Integration with major DeFi protocols

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **Base** for the L2 infrastructure
- **XMTP** for decentralized messaging
- **OpenZeppelin** for secure smart contracts
- **RainbowKit** for wallet integration
- **Framer Motion** for smooth animations

---

**Transform your DeFi journey into an epic adventure! 🚀**