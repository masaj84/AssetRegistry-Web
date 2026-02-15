export const blockchainConfig = {
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '11155111'),
  chainName: import.meta.env.VITE_CHAIN_NAME || 'Sepolia Testnet',
  explorerUrl: import.meta.env.VITE_EXPLORER_URL || 'https://sepolia.etherscan.io',
};
