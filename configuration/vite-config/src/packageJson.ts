import fse from 'fs-extra';
import invariant from 'tiny-invariant';
import type { PackageJson as BasePackageJson } from 'type-fest';
import { type PackageConfig } from './package';

export type LocalPackageJson = BasePackageJson & {
  iotAppKit: PackageConfig;
  // We validate these, so we override these to remove their default annoation.
  name: string;
  version: string;
};

export function readPackageJson(packageJsonPath: string): LocalPackageJson {
  try {
    // Casted to replace any type with strong typing
    const packageJson = fse.readJSONSync(packageJsonPath) as
      | BasePackageJson
      | unknown;

    invariant(
      isValidPackageJson(packageJson),
      `[iot-app-kit] Expected valid package.json: ${packageJsonPath}`
    );

    return packageJson;
  } catch (error) {
    console.error(
      `*** Failed to read package.json file from path: ${packageJsonPath} ***`
    );

    throw error;
  }
}

export function hasPackageJson(packageJsonPath: string): boolean {
  try {
    return fse.readJSONSync(`../${packageJsonPath}/package.json`) != null;
  } catch (error) {
    return false;
  }
}

function isValidPackageJson(
  maybePackageJson: LocalPackageJson | unknown
): maybePackageJson is LocalPackageJson {
  const asPackageJson = maybePackageJson as LocalPackageJson;

  // Protect ourselves from an exceptions when reading untrusted data.
  try {
    // TODO: Use more robust validation solution.
    return (
      Boolean(asPackageJson.name) &&
      Boolean(asPackageJson.version) &&
      asPackageJson.iotAppKit != null &&
      (asPackageJson.iotAppKit.scope === 'public' ||
        asPackageJson.iotAppKit.scope === 'protected')
    );
  } catch {
    return false;
  }
}
