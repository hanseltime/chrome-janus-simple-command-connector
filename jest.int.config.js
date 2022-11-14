/** @type {import('ts-jest').JestConfigWithTsJest} */

/************************************************************
 *
 * Configuration for integration testing
 *
 * Please keep a separation between tests that are connected to
 * systems and those that are not.
 *
 ***********************************************************/

const baseConfig = require('./jest.base.config')

module.exports = {
  ...baseConfig,
  testMatch: ['**/*.spec.int.ts'],
}
