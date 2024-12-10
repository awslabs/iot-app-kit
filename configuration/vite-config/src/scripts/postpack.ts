#!/usr/bin/env -S npx tsx
import fse from 'fs-extra';
import fs from 'fs';
import { listRegisteredPackages } from '../packageRegistry';
import { type LocalPackageJson, readPackageJson } from '../packageJson';
import { listInstalledPackages } from '../installedPackages';
import { extract } from 'tar-fs';
import { getShortName, type PackageName } from '../package';
import zlib from 'zlib';

await postpack();

async function postpack() {
  console.info('*** Starting postpack. ***');
  revertReferencesToCopiedProtectedPackages();
  await validatePostpack();
  console.info('*** Ending postpack. ***');
}

function revertReferencesToCopiedProtectedPackages() {
  const packageJsonPath = './package.json';
  const packageJson = fse.readJSONSync(packageJsonPath);
  const protectedPackageNames = listRegisteredPackages({
    filter: { scope: 'protected' },
  }).map((protectedPackage) => protectedPackage.name);

  protectedPackageNames.forEach((packageName) => {
    if (packageJson.dependencies?.[packageName]) {
      packageJson.dependencies[packageName] = '*';
    }
  });

  fse.writeJSONSync(packageJsonPath, packageJson, { spaces: 2 });
}

async function validatePostpack() {
  console.info(`*** Validating package.json. ***`);

  const packageJson = readPackageJson('./package.json');

  listInstalledPackages(packageJson, {
    filter: { scope: 'protected', dependencyType: 'dependencies' },
  }).forEach((p) => {
    if (packageJson.dependencies?.[p.name] !== '*') {
      console.error(
        '*** Failure: Local dependency has incorrect version setting. ***'
      );
      throw new Error(
        `[iot-app-kit] Expected local dependency version to be '*'. Found: ${
          packageJson.dependencies?.[p.name] ?? 'No version found'
        }.`
      );
    }
  });

  try {
    console.info(`*** Validating package tarball contents. ***`);

    const tarballContentsDest = './package-tarball-contents';
    const packageContents = `${tarballContentsDest}/package`;

    await extractPackageTarball(packageJson, tarballContentsDest);

    const packedPackageJson = readPackageJson(
      `./${packageContents}/package.json`
    );

    listInstalledPackages(packedPackageJson, {
      filter: { scope: 'protected', dependencyType: 'dependencies' },
    }).forEach((p) => {
      if (
        packedPackageJson.dependencies?.[p.name] !==
        `file:./dist/${getShortName(p.name as PackageName)}`
      ) {
        console.error(
          '*** Failure: Packed local dependency has incorrect version setting. ***'
        );
        throw new Error(
          `[iot-app-kit] Expected packed local dependency version to use file reference. Found: ${
            packedPackageJson.dependencies?.[p.name] ?? 'No version found'
          }.`
        );
      }
    });

    fse.readFileSync(`./${packageContents}/README.md`);
    fse.readFileSync(`./${packageContents}/LICENSE`);
    fse.readFileSync(`./${packageContents}/NOTICE`);
    fse.readFileSync(`./${packageContents}/dist/cjs/index.cjs.js`);
    fse.readFileSync(`./${packageContents}/dist/cjs/index.cjs.js.map`);
    fse.readFileSync(`./${packageContents}/dist/cjs/index.d.ts`);
    fse.readFileSync(`./${packageContents}/dist/cjs/index.d.ts.map`);
    fse.readFileSync(`./${packageContents}/dist/esm/index.js`);
    fse.readFileSync(`./${packageContents}/dist/esm/index.js.map`);
    fse.readFileSync(`./${packageContents}/dist/esm/index.d.ts`);
    fse.readFileSync(`./${packageContents}/dist/esm/index.d.ts.map`);

    listInstalledPackages(packedPackageJson, {
      filter: { scope: 'protected', dependencyType: 'dependencies' },
    })
      .map(({ name, ...protectedPackage }) => ({
        shortName: getShortName(name),
        name,
        ...protectedPackage,
      }))
      .forEach(({ name, shortName }) => {
        console.info(
          `*** Validating tarball contents for runtime dependency on protected package ${name}. ***`
        );
        fse.readFileSync(`./${packageContents}/dist/${shortName}/package.json`);
        fse.readFileSync(
          `./${packageContents}/dist/${shortName}/dist/cjs/index.cjs.js`
        );
        fse.readFileSync(
          `./${packageContents}/dist/${shortName}/dist/cjs/index.cjs.js.map`
        );
        fse.readFileSync(
          `./${packageContents}/dist/${shortName}/dist/cjs/index.d.ts`
        );
        fse.readFileSync(
          `./${packageContents}/dist/${shortName}/dist/cjs/index.d.ts.map`
        );
        fse.readFileSync(
          `./${packageContents}/dist/${shortName}/dist/esm/index.js`
        );
        fse.readFileSync(
          `./${packageContents}/dist/${shortName}/dist/esm/index.js.map`
        );
        fse.readFileSync(
          `./${packageContents}/dist/${shortName}/dist/esm/index.d.ts`
        );
        fse.readFileSync(
          `./${packageContents}/dist/${shortName}/dist/esm/index.d.ts.map`
        );
      });

    // clean up extracted tarball
    fse.removeSync(tarballContentsDest);

    console.info('*** Success: Package tarball contents are valid. ***');
  } catch (error) {
    console.error(
      'Failure: Validation of package tarball contents failed. Package tarball is invalid.'
    );
    throw error;
  }
}

async function extractPackageTarball(
  packageJson: LocalPackageJson,
  dest: string
) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      `./iot-app-kit-${getShortName(packageJson.name as PackageName)}-${
        packageJson.version
      }.tgz`
    )
      .pipe(zlib.createGunzip())
      .pipe(
        extract(dest)
          .on('error', (error) => {
            reject(error);
          })
          .on('finish', () => {
            resolve(undefined);
          })
      );
  });
}
