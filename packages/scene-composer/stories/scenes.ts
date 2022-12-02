const sceneFiles = require.context('../public', false, /\.scene\.json$/);

const scenes = sceneFiles.keys().reduce((acc, path) => {
  const key = path.replace('.scene.json', '').replace('./', '');
  const url = path.replace('./', '');

  acc[key] = url;
  return acc;
}, {});

export default scenes;
