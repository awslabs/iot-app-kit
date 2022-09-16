// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

function defaultIndexTemplate(filePaths) {
  const exportEntries = ['/** Auto-generated file. DO NOT UPDATE MANUALLY **/'].concat(
    filePaths.map((filePath) => {
      const basename = path.basename(filePath, path.extname(filePath));
      return `export { default as ${basename} } from './${basename}'`;
    }),
  );
  return exportEntries.join('\n');
}

module.exports = defaultIndexTemplate;
