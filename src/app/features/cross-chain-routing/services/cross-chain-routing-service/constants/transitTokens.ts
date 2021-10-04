import { BLOCKCHAIN_NAME } from 'src/app/shared/models/blockchain/BLOCKCHAIN_NAME';
import InstantTradeToken from 'src/app/features/instant-trade/models/InstantTradeToken';
import { SupportedCrossChainSwapBlockchain } from 'src/app/features/cross-chain-routing/services/cross-chain-routing-service/models/SupportedCrossChainSwapBlockchain';
import { NetMode } from 'src/app/shared/models/blockchain/NetMode';

export type TransitTokens = Record<SupportedCrossChainSwapBlockchain, InstantTradeToken>;

export const transitTokensWithMode: Record<NetMode, TransitTokens> = {
  mainnet: {
    [BLOCKCHAIN_NAME.ETHEREUM]: {
      address: '0xA4EED63db85311E22dF4473f87CcfC3DaDCFA3E3',
      decimals: 18,
      symbol: 'RBC'
    },
    [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
      address: '0x8E3BCC334657560253B83f08331d85267316e08a',
      decimals: 18,
      symbol: 'BRBC'
    },
    [BLOCKCHAIN_NAME.POLYGON]: {
      address: '0xc3cFFDAf8F3fdF07da6D5e3A89B8723D5E385ff8',
      decimals: 18,
      symbol: 'MRBC'
    },
    [BLOCKCHAIN_NAME.AVALANCHE]: {
      address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
      decimals: 18,
      symbol: 'DAI.e'
    }
  },
  testnet: {
    [BLOCKCHAIN_NAME.ETHEREUM]: {
      address: '0xaff4481d10270f50f203e0763e2597776068cbc5',
      decimals: 18,
      symbol: 'WEENUS'
    },
    [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
      address: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
      decimals: 18,
      symbol: 'USDT'
    },
    [BLOCKCHAIN_NAME.POLYGON]: {
      address: '0x5aeb1bbcb4f83fdf2c440028b7725bdd358a9afc',
      decimals: 18,
      symbol: 'USDT'
    },
    [BLOCKCHAIN_NAME.AVALANCHE]: undefined
  }
};
