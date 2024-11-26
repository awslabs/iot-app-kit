module.exports = function (source) {
  const resources = JSON.parse(source);

  const msgs = {};

  for (const [key] of Object.entries(resources)) {
    const { text } = resources[key];
    msgs[key] = text;
  }
  return JSON.stringify(msgs);
};
