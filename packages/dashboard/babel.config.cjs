// Don't process node_modules except for AWS UI.
module.exports = {
  ignore: [/node_modules\/?!@cloudscape-designs\/components/],
  presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
};
