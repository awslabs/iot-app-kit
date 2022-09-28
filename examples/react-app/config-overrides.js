const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = function override(config) { 
   config.plugins = (config.plugins || []).concat([ 
    new NodePolyfillPlugin({excludeAliases: ['console']})
   ]);

   // Override the default svg rules from create-react-app to set absolute path as localhost
   config.module.rules.find((rule => !!rule.oneOf))?.['oneOf'].forEach(rule => {
      let isSvg = false;
      if (!Array.isArray(rule.test) && rule.test) {
         isSvg = rule.test.test('.svg');
      }
      if (isSvg) {
         rule.use = [
            {
               loader: require.resolve('file-loader'),
               options: {
               publicPath: 'http://localhost:3000/',
               name: 'static/media/[name].[hash].[ext]',
               },
            },
         ]
      }
   });

   return config; 
}

