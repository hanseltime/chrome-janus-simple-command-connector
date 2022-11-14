/************************************************************
 *
 * Shared config between unit and integration config testing
 *
 ***********************************************************/

// Allow for HTML_REPORT to generate an output report
const additionalReporters = []
if (process.env.HTML_REPORT) {
  additionalReporters.push([
    'jest-html-reporters',
    {
      openReport: true,
    },
  ])
}

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: ['default', ...additionalReporters],
  transform: {
    '\\.tsx?$': 'ts-jest',
    '\\.jsx?$': 'babel-jest',
  },
}
