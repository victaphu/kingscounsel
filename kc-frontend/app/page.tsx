"use client"
import { Provider } from 'react-redux'
import store from './redux/store'
import Menu from './components/Menu/Menu'
import Actions from './components/Actions/Actions'
import ChessGame from './components/Board'
import { WagmiConfig } from 'wagmi'
import wagmiConfig from './config/Web3Config'

export default function Home() {
  return (<Provider store={store}>
    <WagmiConfig config={wagmiConfig}>
      <div className="app container mx-auto h-screen lg:p-12 p-0 flex lg:flex-row">
        <div className="my-16 lg:flex hidden"><Menu /></div>
        <ChessGame replayMode={false} />
        <div className="mb-[164px] mt-7"><Actions /></div>
        <div className="app-bg"></div>
      </div>
    </WagmiConfig>        
  </Provider >
  )
}
