// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

function defaultIndexTemplate(filePaths) {
  const exportEntries = filePaths.map((filePath) => {
    const basename = path.basename(filePath.path, path.extname(filePath.path));
    const exportName = /^\d/.test(basename) ? `Svg${basename}` : basename;
    return `export { default as ${exportName} } from './${basename}'`;
  });
  return exportEntries.join('\n');
}

module.exports = defaultIndexTemplate;
