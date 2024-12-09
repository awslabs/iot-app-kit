#!/usr/bin/env -S npx tsx
import * as fse from 'fs-extra';

function postpack() {
  const sharedDependencies = process.argv.slice(2);

  revertSharedPackageVersions(sharedDependencies);
}

function revertSharedPackageVersions(sharedDependencies: string[]) {
  const packageJsonPath = './package.json';
  const packageJson = fse.readJSONSync(packageJsonPath);

  sharedDependencies.forEach((dep) => {
    packageJson.dependencies[`@iot-app-kit/${dep}`] = '*';
  });

  fse.writeJSONSync(packageJsonPath, packageJson, { spaces: 2 });
}

postpack();
