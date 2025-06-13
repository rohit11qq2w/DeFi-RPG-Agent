import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { base, baseGoerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [base, baseGoerli],
  [
    // Only add Alchemy provider if API key is available
    ...(import.meta.env.VITE_ALCHEMY_ID && import.meta.env.VITE_ALCHEMY_ID !== 'demo' 
      ? [alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID })] 
      : []
    ),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'DeFi RPG Agent',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '2f5a2b1c8d3e4f5a6b7c8d9e0f1a2b3c',
  chains,
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { config, chains };