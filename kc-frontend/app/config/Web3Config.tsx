import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { createConfig, configureChains, } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { polygonMumbai, lineaTestnet, localhost, polygon } from "viem/chains";
import { linea } from "wagmi/chains";
// Configure chains & providers with the Alchemy provider.
// Popular providers are Alchemy (alchemy.com), Infura (infura.io), Quicknode (quicknode.com) etc.
const { chains, publicClient, webSocketPublicClient } = configureChains([polygon], [infuraProvider({apiKey: "24b7efabb5334c14a28d0e727acb3b69"}), publicProvider()]);
// Instantiating Web3Auth

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x" + chains[0].id.toString(16),
  rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
  displayName: chains[0].name,
  tickerName: chains[0].nativeCurrency?.name,
  ticker: chains[0].nativeCurrency?.symbol,
  blockExplorer: chains[0].blockExplorers?.default.url[0] as string,
};

const web3AuthInstance = new Web3Auth({
  clientId: "BM_UR18KDju5ZqxoqfNR42ufXCsWx437bAtjI5Oj6YgqAcKdqTR9q3Jiq8LsExBtgvu0wqI",
  chainConfig,
  uiConfig: {
    theme: "light",
    loginMethodsOrder: ["twitter", "google"],
    defaultLanguage: "en",
    appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
    modalZIndex: "2147483647",
    appName: "King's Counsel",
  },
});

// Add openlogin adapter for customisations
const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
const openloginAdapterInstance = new OpenloginAdapter({
  privateKeyProvider,
  adapterSettings: {
    network: "cyan",
    uxMode: "popup",
    whiteLabel: {
      name: "The King's Council",
      logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
      logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
      defaultLanguage: "en",
      dark: true, // whether to enable dark mode. defaultValue: false
    },
  },
});
web3AuthInstance.configureAdapter(openloginAdapterInstance);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new Web3AuthConnector({
      chains,
      options: {
        web3AuthInstance,
        modalConfig: {
          [WALLET_ADAPTERS.OPENLOGIN]: {
            loginMethods: {
              google: {
                name: "google login",
                logoDark: "url to your custom logo which will shown in dark mode",
              },
              facebook: {
                // it will hide the facebook option from the Web3Auth modal.
                name: "facebook login",
                showOnModal: false,
              },
              reddit: {
                name: "reddit",
                showOnModal: false,
              },
              twitter: {
                name: "twitter",
                showOnModal: false
              },
              email_passwordless: {
                name: "email_passwordless",
                showOnModal: false
              },
              sms_passwordless: {
                name: "sms_passwordless",
                showOnModal: false
              }
            },
            label: 'Social Login'
          },
          [WALLET_ADAPTERS.METAMASK]: {
            label: 'Metamask',
            showOnModal: false,
          },
          [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
            label: "Wallet Connect",
            showOnModal: false,
          },
          [WALLET_ADAPTERS.TORUS_EVM]: {
            label: "Torus",
            showOnModal: false,
          }
        },
      },
    }),
    new MetaMaskConnector({
      chains,
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "0d1de1116a855c20817c023ce3d500bf"
      }
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

export default wagmiConfig;