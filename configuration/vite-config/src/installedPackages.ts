import {
  type PackageConfig,
  type PackageName,
  type PackageScope,
} from './package';
import { type LocalPackageJson } from './packageJson';
import { packageRegistry } from './packageRegistry';

export interface InstalledPackage {
  name: PackageName;
  scope: PackageScope;
  dependencyType: 'dependencies' | 'devDependencies';
}

export function listInstalledPackages(
  packageJson: LocalPackageJson,
  options?: {
    filter?: {
      dependencyType?: InstalledPackage['dependencyType'];
      scope?: InstalledPackage['scope'];
    };
  }
): readonly InstalledPackage[] {
  const installedPackages: InstalledPackage[] = [
    ...Object.keys(packageJson.dependencies ?? {})
      .filter(isRegisteredPackage)
      .map(createInstalledPackage({ dependencyType: 'dependencies' })),
    ...Object.keys(packageJson.devDependencies ?? {})
      .filter(isRegisteredPackage)
      .map(createInstalledPackage({ dependencyType: 'devDependencies' })),
  ];
  return installedPackages
    .filter((installedPackage) => {
      const shouldListPackagesInDependencies =
        options?.filter?.dependencyType == null ||
        options.filter.dependencyType === 'dependencies';

      if (
        !shouldListPackagesInDependencies &&
        installedPackage.dependencyType === 'dependencies'
      ) {
        return false;
      } else {
        return true;
      }
    })
    .filter((installedPackage) => {
      const shouldListPackagesInDevDependencies =
        options?.filter?.dependencyType == null ||
        options.filter.dependencyType === 'devDependencies';

      if (
        !shouldListPackagesInDevDependencies &&
        installedPackage.dependencyType === 'devDependencies'
      ) {
        return false;
      } else {
        return true;
      }
    })
    .filter((installedPackage) => {
      const shouldListPublicScopePackages =
        options?.filter?.scope == null || options.filter.scope === 'public';

      if (
        !shouldListPublicScopePackages &&
        installedPackage.scope === 'public'
      ) {
        return false;
      } else {
        return true;
      }
    })
    .filter((installedPackage) => {
      const shouldListProtectedScopePackages =
        options?.filter?.scope == null || options.filter.scope === 'protected';

      if (
        !shouldListProtectedScopePackages &&
        installedPackage.scope === 'protected'
      ) {
        return false;
      } else {
        return true;
      }
    });
}

function createInstalledPackage(options: {
  dependencyType: InstalledPackage['dependencyType'];
}) {
  return function createInstalledPackageWithOptions(
    packageName: PackageName
  ): InstalledPackage {
    const packageConfig = getPackageConfig(packageName);

    return {
      name: packageName,
      scope: packageConfig.scope,
      dependencyType: options.dependencyType,
    };
  };
}

function isRegisteredPackage(
  packageName: string | PackageName
): packageName is PackageName {
  return packageRegistry[packageName as PackageName] != null;
}

function getPackageConfig(packageName: PackageName): PackageConfig {
  return packageRegistry[packageName];
}
