export const networks_list = [

  {
    default_rpc: 'http://blockchain:8545',
    archive_rpc: 'http://blockchain:8545',
    key: 'local-test',
    type: 'evm',
    block_time: 100,
    native_curr_symbol: 'ETH',
  },

  {
    default_rpc: 'http://blockchain:8545',
    archive_rpc: 'http://blockchain:8545',
    key: 'local',
    type: 'evm',
    block_time: 3000,
    native_curr_symbol: 'ETH',
  },

  { // testnet
    default_rpc: 'https://nd-504-877-410.p2pify.com/a170ad9608d7d8fa8a4ea18d4af8b685',
    archive_rpc: 'https://rpc.ankr.com/eth_goerli',
    key: 'goerli',
    type: 'evm',
    block_time: 10000,
    native_curr_symbol: 'GoETH',
  },
];