import './App.css';
import Nav from './components/Nav/Nav';
import Fetch from './components/FetchTokenBound/Fetch';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mantle, mantleTestnet } from 'wagmi/chains';

const chains = [mantle, mantleTestnet];
const projectId = process.env.REACT_APP_PROJECT_ID;

const { publicClient } = configureChains(
  chains, 
  [w3mProvider({ projectId })]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains)


function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Nav/>
        <Fetch/>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

export default App;
