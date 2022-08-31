// Don't process node_modules except for cloudscape-design.
module.exports = {
  ignore: [/node_modules\/?!@cloudscape-design\/components/],
  presets: ['@babel/preset-env'],
};
