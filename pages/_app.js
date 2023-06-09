import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

import { configureChains, WagmiConfig, createClient } from "wagmi";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';


const hyperspace = {
  id: 3_141,
  name: 'Hyperspace',
  network: 'Hyperspace',
  nativeCurrency: {
    decimals: 18,
    name: 'Filecoin',
    symbol: 'tFIL',
  },
  rpcUrls: {
    default: "https://filecoin-hyperspace.chainstacklabs.com/rpc/v0",
  },
}

const mantleTestnet = {
  id: 5001,
  name: 'Mantle Testnet',
  network: 'Mantle Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BIT',
    symbol: 'BIT',
  },
  rpcUrls: {
    default: "https://rpc.testnet.mantle.xyz",
  },
}

const { chains, provider } = configureChains(
  [hyperspace, polygonMumbai],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://filecoin-hyperspace.chainstacklabs.com/rpc/v0`,
      }),
    }),
  ],
)

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'ThePeerDao',
      },
    }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     qrcode: true,
    //   },
    // }),
  ],
  provider,
})

// if 
//       return <Component {...pageProps} />;

export default function App({ Component, pageProps, ...appProps }) {
  console.log(appProps.router.pathname)
  const isMeetingPage = ([`/meetings/[id]`].includes(appProps.router.pathname)) 
  return (
    <div>
      <WagmiConfig client={client}>
        <ConnectKitProvider debugMode>
          <div className={`${isMeetingPage ? " " : "container px-5 mx-auto" }`}>
            {
              !isMeetingPage ?  <Navbar /> : null
            }
          <Component {...pageProps} />
          </div>
        </ConnectKitProvider>
      </WagmiConfig>
    </div>
  );
}
