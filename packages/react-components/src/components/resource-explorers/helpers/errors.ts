import type { ResourceExplorerVariant } from '../types/common';
import { isDevelopmentEnv } from './development';

class DevelopmentError extends Error {
  constructor(...params: ConstructorParameters<typeof Error>) {
    super(...params);

    this.name = 'DevelopmentError';
  }
}

export function handleUnexpectedVariant(
  variant: ResourceExplorerVariant
): never {
  throw new DevelopmentError(
    `Unexpected resource explorer variant: ${variant}.`
  );
}

export function assertSearchConfiguration(): void {
  if (!isDevelopmentEnv()) return;

  throw new DevelopmentError(
    `ExecuteQuery must be defined if search is enabled.`
  );
}
