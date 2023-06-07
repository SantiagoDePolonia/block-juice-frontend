import { WagmiConfig, createConfig, configureChains, sepolia } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
 
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider()],
)
 
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

interface WagmiWrapperProps {
  children: React.ReactNode
}

function WagmiWrapper({children}: WagmiWrapperProps) {
  return (
    <WagmiConfig config={config}>{children}</WagmiConfig>
  )
}

export default WagmiWrapper;