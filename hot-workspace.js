const nodemon = require('nodemon');
const { spawn } = require('node:child_process');

// EDIT ME
const targetWorkspace = 'packages/components';
const targetFile = 'bar-chart';

// hardcoded dependency graph. This could be automatically determined through imports.
const dependencyGraph = {
  'packages/core': { dependsOn: [] },
  'packages/source-iotsitewise': { dependsOn: ['packages/core'] },
  'packages/related-table': { dependsOn: ['packages/core'] },
  'packages/components': { dependsOn: ['packages/core', 'packages/source-iotsitewise', 'packages/related-table'] },
};

// save current process to kill
let currentProcess;

/**
 * Run build commands via node process
 *
 * @param {string[]} dependencies
 */
const build = (dependencies = []) => {
  console.log('Building dependencies in the order: ' + dependencies);

  const buildCmds = dependencies.map((dependency) => `npm run build --workspace=${dependency}`);

  const testString = `npm run test:unit --workspace=${targetWorkspace} ${targetFile}`;

  const buildString = buildCmds.length > 0 ? `${buildCmds.reduce((a, b) => `${a} && ${b}`)} && ` : '';

  currentProcess = spawn(`${buildString}${testString}`, { shell: true });

  currentProcess.stdout.on('data', (data) => console.log(data.toString()));

  currentProcess.stderr.on('data', (data) => console.error(data.toString()));
};

/**
 * Algorithm for minimum rebuilding of an acyclic dependency graph:
 *
 * 1. Find all paths between source and destination
 * 2. When a path is found, add each node in the path to a map.
 *    - for duplicates, only keep the deepest node (nodes in a DAG never need to be built more than once)
 * 3. Sort nodes in the map by depth.
 * 4. Build packages from the deepest depth to the shallowest (nodes at equal depths can be parallelized)
 *
 *  @param {string} target - target test package
 *  @param {string} changed - package that changed
 */
const rebuild = (target, changed) => {
  if (target === changed) {
    build(); // run tests without dependencies
    return;
  }

  const deps = {};

  const DFS = (source, destination, graph, path) => {
    if (source === destination) {
      path.forEach((package, index) => {
        if (!deps[package] || deps[package].depth < index) {
          deps[package] = { package, depth: index };
        }
      });
    } else {
      graph[source].dependsOn.forEach((dependent) => {
        path.push(dependent);
        DFS(dependent, destination, graph, path);
        path.pop(); // backtracking
      });
    }
  };

  DFS(target, changed, dependencyGraph, [target]);

  const packages = Object.values(deps)
    .sort((a, b) => b.depth - a.depth)
    .map((dep) => dep.package);

  build(packages.slice(0, packages.length - 1));
};

/**
 * Have nodemon watch over source code and ignore tests
 * Watch for restart events to trigger rebuilds
 */
nodemon({
  exec: 'echo "started IoTAppKit hot workspace"',
  watch: [
    './packages/core/src',
    './packages/related-table/src',
    './packages/source-iotsitewise/src',
    './packages/components',
  ],
  ignore: [],
  ext: 'ts, tsx, js',
  delay: 500,
});

nodemon.on('restart', function (files) {
  // kill running process
  currentProcess && currentProcess.kill();

  // this is "files", but seems to only return 1 file at a time
  // we can readily change this to support multiple simultaneous changed files
  const file = files[0];

  console.log('File changed: ', file);

  // get package name
  const package = file.match(/iot-app-kit\/(.*)\/src/)[1];

  rebuild(targetWorkspace, package);
});
