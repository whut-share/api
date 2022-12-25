import { ChainNetwork } from "./chain-network-object-type";

export const chain_networks_list: ChainNetwork[] = [

  {
    default_rpc: 'http://blockchain:8545',
    archive_rpc: 'http://blockchain:8545',
    id: 'local-test',
    type: 'evm',
    block_time: 100,
    native_curr_symbol: 'ETH',
    scan_url: 'https://etherscan.io',
    icon_url: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png",
  },

  {
    default_rpc: 'http://blockchain:8545',
    archive_rpc: 'http://blockchain:8545',
    id: 'local',
    type: 'evm',
    block_time: 3000,
    native_curr_symbol: 'ETH',
    scan_url: 'https://etherscan.io',
    icon_url: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png",
  },

  { // testnet
    default_rpc: 'https://nd-504-877-410.p2pify.com/a170ad9608d7d8fa8a4ea18d4af8b685',
    archive_rpc: 'https://rpc.ankr.com/eth_goerli',
    id: 'goerli',
    type: 'evm',
    block_time: 10000,
    native_curr_symbol: 'GoETH',
    scan_url: 'https://goerli.etherscan.io',
    icon_url: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png",
  },

  {
    default_rpc: 'https://bscrpc.com',
    archive_rpc: 'https://bscrpc.com',
    id: 'bnb',
    type: 'evm',
    block_time: 4000,
    native_curr_symbol: 'BNB',
    scan_url: 'https://bscscan.com',
    icon_url: 'https://icons-for-free.com/download-icon-cryptocurrency+icons+++color+bnb-1324448968700265727_512.png',
  },
];