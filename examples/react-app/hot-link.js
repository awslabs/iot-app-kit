const nodemon = require('nodemon');
const { spawn } = require('node:child_process');

// killable process
let currentProcess;

/**
 * Run build commands via node process
 */
const build = () => {
  currentProcess = spawn(`npm run link`, { shell: true });

  currentProcess.stdout.on('data', (data) => console.log(data.toString()));

  currentProcess.stderr.on('data', (data) => console.error(data.toString()));
};

/**
 * Have nodemon watch over source code and ignore tests
 * Watch for restart events to trigger rebuilds
 */
nodemon({
  exec: 'echo "started hot linker"',
  watch: [
    '../../packages/components/src',
    '../../packages/core/src',
    '../../packages/react-components/src',
    '../../packages/related-table/src',
    '../../packages/scene-composer/src',
    '../../packages/source-iotsitewise/src',
    '../../packages/source-iottwinmaker/src',
    '../../packages/table/src',
  ],
  ignore: ['../../packages/scene-composer/src/assets/auto-gen'],
  ext: 'ts, tsx, js',
  delay: 1000,
});

build();

nodemon.on('restart', function (files) {
  currentProcess && currentProcess.kill();

  console.log('Files changed: ', files);

  build();
});
