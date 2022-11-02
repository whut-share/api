module.exports = {
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  maxWorkers: 1,
  "collectCoverageFrom": [
    "**/*.(t|j)s"
  ],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node",
  "moduleNameMapper": {
    "^@/(.*)$": "<rootDir>/$1"
  }
};

process.env = Object.assign(process.env, {
  IS_BACKGROUND: 'false',
  MONGO_SRV: process.env['MONGO_SRV'].replace('/app?', '/test-app?'),
  LOCAL_FS_BASEDIR: 'public/test-files',
  FILESYSTEM_DRIVER: 'local',
  IS_UNIT_TEST: 'true',
  NETWORKS_WHITELIST: 'local-test',
});