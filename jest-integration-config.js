const config = require('./jest.config')
// any file with this extension will be runned using this config
config.testMatch = ['**/*.test.ts']

module.exports = config
