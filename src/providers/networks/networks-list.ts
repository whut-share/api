export const networks_list = [

  {
    default_rpc: 'http://blockchain:8545',
    archive_rpc: 'http://blockchain:8545',
    key: 'local',
    type: 'evm',
    block_time: 3000,
  },

  { // testnet
    default_rpc: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    archive_rpc: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    key: 'goerli',
    type: 'evm',
    block_time: 10000,
  },
];