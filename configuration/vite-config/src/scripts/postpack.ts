#!/usr/bin/env -S npx tsx
import fse from 'fs-extra';
import { listRegisteredPackages } from '../packageRegistry';

function postpack() {
  revertReferencesToCopiedProtectedPackages();
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

postpack();
