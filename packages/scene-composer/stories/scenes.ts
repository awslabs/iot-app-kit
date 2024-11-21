const sceneFiles = import.meta.glob<Record<string, unknown>>('../public/*.scene.json', { eager: true });

const scenes = Object.keys(sceneFiles).reduce<Record<string, string>>((acc, path) => {
  const key = path.replace('.scene.json', '').replace('../public/', '');
  const url = path.replace('..', 'http://0.0.0.0:7006');

  acc[key] = url;
  return acc;
}, {});

export default scenes;
