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
    default_rpc: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    archive_rpc: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    key: 'goerli',
    type: 'evm',
    block_time: 10000,
    native_curr_symbol: 'ETH',
  },
];