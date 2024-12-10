import { resolve } from 'path';
import copy from 'rollup-plugin-copy';
import type { Plugin } from 'vite';
import { listInstalledPackages } from './installedPackages';
import { type PackageName, type PackageShortName } from './package';
import { type LocalPackageJson } from './packageJson';

export interface CopyPackagePluginOptions {
  dir: string;
  packageJson: LocalPackageJson;
}

export function copyProtectedPackagesPlugin({
  dir,
  packageJson,
}: CopyPackagePluginOptions): Plugin {
  const packagesToCopy = listInstalledPackages(packageJson, {
    filter: { dependencyType: 'dependencies', scope: 'protected' },
  });

  // To enable installation of unpublished shared packages when an
  // external consumer is installing an iot-app-kit package, the
  // compiled code and the package.json file of each shared package is
  // copied into the consuming package. The result of the copy is a
  // something resembling what is installed into the external consumers
  // node_modules.
  return copy({
    // Copy after the code is transformed.
    hook: 'writeBundle',
    targets: packagesToCopy.flatMap((iotAppKitPackage) => {
      const packageShortName = getPackageShortName(iotAppKitPackage.name);

      const packagePath = getSiblingPackagePath(packageShortName, dir);
      const artifactsSrc = resolve(packagePath, 'dist');
      const packageJSONSrc = resolve(packagePath, 'package.json');
      const copyDest = resolve(dir, `dist/${packageShortName}`);

      return [
        { src: artifactsSrc, dest: copyDest },
        { src: packageJSONSrc, dest: copyDest },
      ];
    }),
  });
}

function getPackageShortName(packageName: PackageName): PackageShortName {
  return packageName.split('/')[1] as PackageShortName;
}

function getSiblingPackagePath(
  siblingPackageShortName: string,
  dirname: string
): string {
  return resolve(dirname, `../${siblingPackageShortName}`);
}
