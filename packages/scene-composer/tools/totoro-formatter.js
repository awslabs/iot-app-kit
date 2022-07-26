// This will soon move to the IotRociNpmModules package

exports.format = function (msgs) {
  const results = {};
  for (const [id, msg] of Object.entries(msgs)) {
    results[id] = {
      text: msg.defaultMessage,
      note: msg.description,
    };
  }
  return results;
};
