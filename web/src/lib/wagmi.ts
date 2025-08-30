import { http, createConfig } from "wagmi";
import { localhost } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// Define Ganache as localhost chain
export const ganache = {
  ...localhost,
  id: 1337, // Ganache default chain ID
  name: "Ganache",
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_GANACHE_URL || "http://127.0.0.1:7545"],
    },
  },
} as const;

export const config = createConfig({
  chains: [ganache],
  connectors: [
    injected(), // MetaMask, etc.
  ],
  transports: {
    [ganache.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
