import {
  BlockchainName,
  CROSS_CHAIN_TRADE_TYPE,
  CrossChainTradeType,
  arbitrumRbcBridgeSupportedBlockchains,
  archonBridgeSupportedBlockchains,
  bridgersCrossChainSupportedBlockchains,
  cbridgeSupportedBlockchains,
  changenowProxySupportedBlockchains,
  deBridgeCrossChainSupportedBlockchains,
  layerZeroBridgeSupportedBlockchains,
  lifiCrossChainSupportedBlockchains,
  mesonCrossChainSupportedChains,
  orbiterSupportedBlockchains,
  owlToSupportedBlockchains,
  pulseChainSupportedBlockchains,
  rangoSupportedBlockchains,
  scrollBridgeSupportedBlockchains,
  squidrouterCrossChainSupportedBlockchains,
  symbiosisCrossChainSupportedBlockchains,
  taikoBridgeSupportedBlockchains,
  xySupportedBlockchains,
  stargateV2SupportedBlockchains
} from 'rubic-sdk';

export const CROSS_CHAIN_SUPPORTED_CHAINS_CONFIG: Record<
  Exclude<CrossChainTradeType, 'multichain'>,
  Readonly<BlockchainName[]>
> = {
  [CROSS_CHAIN_TRADE_TYPE.SYMBIOSIS]: symbiosisCrossChainSupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.LIFI]: lifiCrossChainSupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.DEBRIDGE]: deBridgeCrossChainSupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.BRIDGERS]: bridgersCrossChainSupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.XY]: xySupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.CELER_BRIDGE]: cbridgeSupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.CHANGENOW]: changenowProxySupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.STARGATE]: stargateV2SupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.ARBITRUM]: arbitrumRbcBridgeSupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.SQUIDROUTER]: squidrouterCrossChainSupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.SCROLL_BRIDGE]: scrollBridgeSupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.TAIKO_BRIDGE]: taikoBridgeSupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.RANGO]: rangoSupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.PULSE_CHAIN_BRIDGE]: pulseChainSupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.ORBITER_BRIDGE]: orbiterSupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.LAYERZERO]: layerZeroBridgeSupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.ARCHON_BRIDGE]: archonBridgeSupportedBlockchains,
  [CROSS_CHAIN_TRADE_TYPE.MESON]: mesonCrossChainSupportedChains,
  [CROSS_CHAIN_TRADE_TYPE.OWL_TO_BRIDGE]: owlToSupportedBlockchains
} as const;
