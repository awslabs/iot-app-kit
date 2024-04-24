const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = function override(config) { 
   config.plugins = (config.plugins || []).concat([ 
    new NodePolyfillPlugin({excludeAliases: ['console']})
   ]);

   return config; 
}

