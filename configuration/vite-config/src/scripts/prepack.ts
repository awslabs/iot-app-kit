#!/usr/bin/env -S npx tsx
import fse from 'fs-extra';
import { listRegisteredPackages } from '../packageRegistry';
import { getShortName } from '../package';
import type { PackageJson } from 'type-fest';

function prepack() {
  referenceCopiedProtectedPackages();
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

prepack();
