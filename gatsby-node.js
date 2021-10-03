require('source-map-support').install()
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
})

exports.onCreateBabelConfig = require('./src/config/gatsby-node').onCreateBabelConfig
