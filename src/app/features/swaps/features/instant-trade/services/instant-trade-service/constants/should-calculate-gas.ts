import { BLOCKCHAIN_NAME, BlockchainName } from 'rubic-sdk';

export const shouldCalculateGas: Record<BlockchainName, boolean> = {
  [BLOCKCHAIN_NAME.HARMONY]: false,
  [BLOCKCHAIN_NAME.NEAR]: false,
  [BLOCKCHAIN_NAME.SOLANA]: false,
  [BLOCKCHAIN_NAME.AVALANCHE]: true,
  [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: true,
  [BLOCKCHAIN_NAME.FANTOM]: true,
  [BLOCKCHAIN_NAME.ETHEREUM]: true,
  [BLOCKCHAIN_NAME.MOONRIVER]: false,
  [BLOCKCHAIN_NAME.POLYGON]: true,
  [BLOCKCHAIN_NAME.TELOS]: true,
  [BLOCKCHAIN_NAME.ARBITRUM]: false,
  [BLOCKCHAIN_NAME.AURORA]: false,
  [BLOCKCHAIN_NAME.OPTIMISM]: false,
  [BLOCKCHAIN_NAME.CRONOS]: false,
  [BLOCKCHAIN_NAME.OKE_X_CHAIN]: false,
  [BLOCKCHAIN_NAME.GNOSIS]: false,
  [BLOCKCHAIN_NAME.FUSE]: false,
  [BLOCKCHAIN_NAME.MOONBEAM]: false,
  [BLOCKCHAIN_NAME.CELO]: false,
  [BLOCKCHAIN_NAME.BOBA]: false,
  [BLOCKCHAIN_NAME.ASTAR]: false,
  [BLOCKCHAIN_NAME.BITCOIN]: false,
  [BLOCKCHAIN_NAME.ETHEREUM_POW]: true,
  [BLOCKCHAIN_NAME.TRON]: false,
  [BLOCKCHAIN_NAME.KAVA]: false,
  [BLOCKCHAIN_NAME.BITGERT]: false,
  [BLOCKCHAIN_NAME.OASIS]: false,
  [BLOCKCHAIN_NAME.METIS]: false,
  [BLOCKCHAIN_NAME.DFK]: false,
  [BLOCKCHAIN_NAME.KLAYTN]: false,
  [BLOCKCHAIN_NAME.VELAS]: false,
  [BLOCKCHAIN_NAME.SYSCOIN]: false
};
