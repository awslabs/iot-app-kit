const { spawn } = require('node:child_process');

const nodemon = require('nodemon');

// killable process
let currentProcess;

/**
 * Run build commands via node process
 */
const build = () => {
  currentProcess = spawn(`npm run build`, { shell: true });

  currentProcess.stdout.on('data', (data) => console.log(data.toString()));

  currentProcess.stderr.on('data', (data) => console.error(data.toString()));

  currentProcess.on('exit', (exitCode) => {
    if (parseInt(exitCode) !== 0) {
      console.log('==== Finished build with error ==== \n');
    } else {
      console.log('==== Finished build successfully ==== \n');
    }
  });
};

/**
 * Have nodemon watch over source code and ignore tests
 * Watch for restart events to trigger rebuilds
 */
nodemon({
  watch: ['src'],
  ignore: ['*.spec.**', 'src/assets/auto-gen'],
  ext: 'ts, tsx, js, json, svg, scss',
  delay: 1000,
});

build();

nodemon.on('restart', function (files) {
  currentProcess && currentProcess.kill();

  console.log('Files changed: ', files);

  build();
});
