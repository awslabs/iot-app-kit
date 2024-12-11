#!/usr/bin/env -S npx tsx
import { validateBuildArtifacts } from '../validation/validateBuildArtifacts';

postbuild();

function postbuild(): void | never {
  console.info('*** Starting postbuild. ***');
  validateBuildArtifacts();
  console.info('*** Ending postbuild. ***');
}
