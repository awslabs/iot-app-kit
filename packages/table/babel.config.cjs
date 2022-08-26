// Don't process node_modules except for AWS UI.
module.exports = {
  ignore: [/node_modules\/?!@awsui\/components-react/],
  presets: ['@babel/preset-env'],
};
