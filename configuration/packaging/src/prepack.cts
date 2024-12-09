#!/usr/bin/env -S npx tsx
import * as fse from 'fs-extra';

function prepack() {
  const sharedDependencies = process.argv.slice(2);

  setSharedPackageVersions(sharedDependencies);
}

function setSharedPackageVersions(sharedDependencies: string[]) {
  const packageJsonPath = './package.json';
  const packageJson = fse.readJSONSync(packageJsonPath);
  console.log(packageJson);

  sharedDependencies.forEach((dep) => {
    packageJson.dependencies[`@iot-app-kit/${dep}`] = `file:./dist/${dep}`;
  });

  fse.writeJSONSync(packageJsonPath, packageJson, { spaces: 2 });
}

prepack();
