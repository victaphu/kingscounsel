"use client"
import { Provider } from "react-redux"
import Menu from "../components/Menu/Menu"
import Actions from "../components/Actions/Actions"
import store from "../redux/store"
import wagmiConfig from "../config/Web3Config"
import { WagmiConfig } from "wagmi"

export default function BoardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <Provider store={store}>
        <WagmiConfig config={wagmiConfig}>

          <div className="app container mx-auto h-screen lg:p-12 p-0 flex lg:flex-row">
            <div className="my-16 lg:flex hidden"><Menu /></div>
            {children}
            <div className="mb-[164px] mt-7"><Actions /></div>
            <div className="app-bg"></div>
          </div>
        </WagmiConfig>
      </Provider >
    </section>
  )
}