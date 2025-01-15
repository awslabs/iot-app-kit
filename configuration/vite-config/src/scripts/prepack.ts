#!/usr/bin/env -S npx tsx
import fse from 'fs-extra';
import { listRegisteredPackages } from '../packageRegistry';
import { getShortName, type PackageName } from '../package';
import type { PackageJson } from 'type-fest';
import { validateBuildArtifacts } from '../validation/validateBuildArtifacts';
import { LocalPackageJson, readPackageJson } from '../packageJson';
import { listInstalledPackages } from '../installedPackages';

prepack();

function prepack() {
  console.info('*** Starting prepack. ***');
  referenceCopiedProtectedPackages();
  validateBuildArtifacts();
  removeDevDependenciesFromProtectedPackages();
  validatePrepack();
  console.info('*** Ending prepack. ***');
}

/**
 * @remarks
 * 
 * Remove the devDependencies for the copied protected packages.
 * This is to fix a bug where subsequent installs of the consuming
 * package fail because it tries to read the devDependencies
 */
function removeDevDependenciesFromProtectedPackages () {
  const packageJson = fse.readJSONSync('./package.json') as LocalPackageJson;

  const protectedPackageNames = listInstalledPackages(
    packageJson,
    {
      filter: { scope: 'protected', dependencyType: 'dependencies' },
    }
  ).map(installedPackage => installedPackage.name);

  protectedPackageNames.forEach(protectedPackageName => {
    const protectedPackageShortName = getShortName(
      protectedPackageName
    );
    const jsonPath = `./dist/${protectedPackageShortName}/package.json`;
    const json = fse.readJSONSync(jsonPath) as PackageJson;
    json.devDependencies = {};
    fse.writeJSONSync(jsonPath, json, { spaces: 2 });
  });
}

/**
 * @remarks
 *
 * Before we create a tarball of a package (i.e., run `npm pack`), if a package
 * is consuming a protected package as a runtime dependency (i.e., in
 * `dependencies` not `devDependencies`), we update the package's package.json
 * file to reference the copied protected package with a file reference. When
 * a consumer of the package runs `npm install`, the protected package will be
 * installed using the copied files.
 *
 * This mutation of the package's package.json file is temporary and is
 * reverted in ./postpack.ts.
 */
function referenceCopiedProtectedPackages() {
  const packageJsonPath = './package.json';
  const packageJson = fse.readJSONSync(packageJsonPath) as PackageJson;
  const protectedPackageNames = listRegisteredPackages({
    filter: { scope: 'protected' },
  }).map((protectedPackage) => protectedPackage.name);

  protectedPackageNames.forEach((packageName) => {
    if (packageJson.dependencies?.[packageName]) {
      packageJson.dependencies[packageName] = `file:./dist/${getShortName(
        packageName
      )}`;
    }
  });

  fse.writeJSONSync(packageJsonPath, packageJson, { spaces: 2 });
}

function validatePrepack() {
  console.info(`*** Starting validating package.json file. ***`);
  const packageJson = readPackageJson('./package.json');
  const protectedPackagesInstalledAsRuntimeDependencies = listInstalledPackages(
    packageJson,
    {
      filter: { scope: 'protected', dependencyType: 'dependencies' },
    }
  );

  protectedPackagesInstalledAsRuntimeDependencies.forEach((p) => {
    if (
      packageJson.dependencies?.[p.name] !==
      `file:./dist/${getShortName(p.name as PackageName)}`
    ) {
      console.error(
        '*** Failure: Local dependency has incorrect version setting. ***'
      );
      throw new Error(
        `[iot-app-kit] Expected local dependency version to use file reference. Found: ${
          packageJson.dependencies?.[p.name] ?? 'No version found'
        }.`
      );
    }
  });

  console.info(`*** Finished validating package.json file. ***`);
}
