import fse from 'fs-extra';
import { listInstalledPackages } from '../installedPackages';
import { readPackageJson } from '../packageJson';
import { getShortName } from '../package';

export function validateBuildArtifacts(): void | never {
  console.info(`*** Validating build artifacts. ***`);

  try {
    const packageJson = readPackageJson('./package.json');

    console.info(`*** Validating CJS build artifacts. ***`);
    fse.readFileSync('./dist/cjs/index.cjs.js');
    fse.readFileSync('./dist/cjs/index.cjs.js.map');
    fse.readFileSync('./dist/cjs/index.d.ts');
    fse.readFileSync('./dist/cjs/index.d.ts.map');

    console.info(`*** Validating ESM build artifacts. ***`);
    fse.readFileSync('./dist/esm/index.js');
    fse.readFileSync('./dist/esm/index.js.map');
    fse.readFileSync('./dist/esm/index.d.ts');
    fse.readFileSync('./dist/esm/index.d.ts.map');

    console.info(`*** Validating dependencies on protected packages. ***`);

    const protectedPackagesInstalledAsRuntimeDependencies =
      listInstalledPackages(packageJson, {
        filter: { scope: 'protected', dependencyType: 'dependencies' },
      });

    if (protectedPackagesInstalledAsRuntimeDependencies.length > 0) {
      console.info(
        '*** Runtime dependencies on protected package detected. ***'
      );

      protectedPackagesInstalledAsRuntimeDependencies
        .map(({ name, ...protectedPackage }) => ({
          shortName: getShortName(name),
          name,
          ...protectedPackage,
        }))
        .forEach(({ name, shortName }) => {
          console.info(`*** Validating build artifacts for ${name}. ***`);
          fse.readFileSync(`./dist/${shortName}/package.json`);

          console.info(`*** Validating CJS build artifacts for ${name}. ***`);
          fse.readFileSync(`./dist/${shortName}/dist/cjs/index.cjs.js`);
          fse.readFileSync(`./dist/${shortName}/dist/cjs/index.cjs.js.map`);
          fse.readFileSync(`./dist/${shortName}/dist/cjs/index.d.ts`);
          fse.readFileSync(`./dist/${shortName}/dist/cjs/index.d.ts.map`);

          console.info(`*** Validating ESM build artifacts for ${name}. ***`);
          fse.readFileSync(`./dist/${shortName}/dist/esm/index.js`);
          fse.readFileSync(`./dist/${shortName}/dist/esm/index.js.map`);
          fse.readFileSync(`./dist/${shortName}/dist/esm/index.d.ts`);
          fse.readFileSync(`./dist/${shortName}/dist/esm/index.d.ts.map`);
        });
    }

    console.info('*** Success: Build artifacts are valid. ***');
  } catch (error) {
    console.error(
      '*** Failure: Validation of build artifacts failed. Build artifacts are invalid. ***'
    );
    throw error;
  }
}
