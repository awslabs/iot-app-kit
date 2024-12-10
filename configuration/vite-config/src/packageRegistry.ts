// eslint-disable-next-line import/default
import fse from 'fs-extra';
import {
  type PackageConfig,
  type PackageName,
  type PackageScope,
} from './package';
import {
  hasPackageJson,
  readPackageJson,
  type LocalPackageJson,
} from './packageJson';

export interface PackageRegistry {
  [name: PackageName]: PackageConfig;
}

export const packageRegistry: PackageRegistry = createPackageRegistry();

function createPackageRegistry(): PackageRegistry {
  const packageJsons = readAllPackageJsons();
  const packageRegistry: PackageRegistry = packageJsons.reduce(
    (acc, current) => {
      return {
        ...acc,
        [current.name]: current.iotAppKit,
      };
    },
    {}
  );

  return packageRegistry;
}

function readAllPackageJsons(): LocalPackageJson[] {
  const packagePaths = fse.readdirSync('../../packages');
  const packageJsons = packagePaths
    .filter(hasPackageJson)
    .map((packagePath) => readPackageJson(`../${packagePath}/package.json`));

  return packageJsons;
}

export interface RegisteredPackage {
  name: PackageName;
  scope: PackageScope;
}

export interface ListRegisteredPackagesOptions {
  filter?: {
    scope?: PackageScope;
  };
}

export function listRegisteredPackages(
  options: ListRegisteredPackagesOptions = {}
): readonly RegisteredPackage[] {
  const registeredPackages = (
    Object.keys(packageRegistry) as PackageName[]
  ).map(createRegisteredPackage);

  return registeredPackages
    .filter((registeredPackage) => {
      const shouldListPublicScopePackages =
        options.filter?.scope == null || options.filter.scope === 'public';

      if (
        !shouldListPublicScopePackages &&
        registeredPackage.scope === 'public'
      ) {
        return false;
      } else {
        return true;
      }
    })
    .filter((registeredPackage) => {
      const shouldListProtectedScopePackages =
        options.filter?.scope == null || options.filter.scope === 'protected';

      if (
        !shouldListProtectedScopePackages &&
        registeredPackage.scope === 'protected'
      ) {
        return false;
      } else {
        return true;
      }
    });
}

function createRegisteredPackage(packageName: PackageName): RegisteredPackage {
  const packageConfig = getPackageConfig(packageName);

  return {
    name: packageName,
    scope: packageConfig.scope,
  };
}

function getPackageConfig(packageName: PackageName): PackageConfig {
  return packageRegistry[packageName];
}
