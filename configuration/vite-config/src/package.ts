import type { Split } from 'type-fest';

export type PackageName = `@iot-app-kit/${string}`;
export type PackageShortName = Split<PackageName, '/'>[1];
export type PackageScope = 'public' | 'protected';
export interface PackageConfig {
  scope: PackageScope;
}

export function getShortName(packageName: PackageName): PackageShortName {
  return packageName.split('/')[1];
}
