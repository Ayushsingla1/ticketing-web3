import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi'
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { darkTheme } from '@rainbow-me/rainbowkit';
import React from 'react';

export const EduChain = {
    id: 656476,
    name: "Open Campus Codex",
    nativeCurrency: {
      decimals: 18,
      name: "Open Campus Codex",
      symbol: "EDU",
    },
    rpcUrls: {
      default: { http: ["https://rpc.open-campus-codex.gelato.digital"] },
    },
    blockExplorers: {
      default: { name: "OpenCampus", url: "https://opencampus-codex.blockscout.com/" },
    },
    testnet: true,
  };
  

const config = getDefaultConfig({
  appName: 'Edu-Ticket',
  projectId: '121',
  chains: [EduChain],
  ssr: false,
});

const queryClient = new QueryClient();
const WalletProvider = ({children}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({borderRadius: 'small',accentColor: '#7b3fe4',overlayBlur: 'small',})}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletProvider;