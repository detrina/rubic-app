import { BLOCKCHAIN_NAME } from 'rubic-sdk';

export const SUPPORTED_ETH_WETH_SWAP_BLOCKCHAINS = [
  BLOCKCHAIN_NAME.ETHEREUM,
  BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN,
  BLOCKCHAIN_NAME.POLYGON,
  BLOCKCHAIN_NAME.HARMONY,
  BLOCKCHAIN_NAME.AVALANCHE,
  BLOCKCHAIN_NAME.MOONRIVER,
  BLOCKCHAIN_NAME.FANTOM,
  BLOCKCHAIN_NAME.ARBITRUM,
  BLOCKCHAIN_NAME.AURORA,
  BLOCKCHAIN_NAME.TELOS
] as const;

export type SupportedEthWethSwapBlockchain = typeof SUPPORTED_ETH_WETH_SWAP_BLOCKCHAINS[number];

export const WETH_CONTRACT_ADDRESS = {
  [BLOCKCHAIN_NAME.ETHEREUM]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  [BLOCKCHAIN_NAME.POLYGON]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  [BLOCKCHAIN_NAME.HARMONY]: '0xcf664087a5bb0237a0bad6742852ec6c8d69a27a',
  [BLOCKCHAIN_NAME.AVALANCHE]: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  [BLOCKCHAIN_NAME.MOONRIVER]: '0x98878B06940aE243284CA214f92Bb71a2b032B8A',
  [BLOCKCHAIN_NAME.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  [BLOCKCHAIN_NAME.ARBITRUM]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  [BLOCKCHAIN_NAME.AURORA]: '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB',
  [BLOCKCHAIN_NAME.TELOS]: '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E'
};
