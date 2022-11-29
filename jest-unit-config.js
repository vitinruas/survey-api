const config = require('./jest.config')
// any file with this extension will be runned using this config
config.testMatch = ['**/*.spec.ts']

module.exports = config
