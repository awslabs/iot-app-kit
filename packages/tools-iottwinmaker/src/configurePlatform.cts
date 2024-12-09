import { exec, type ExecException } from 'child_process';
import * as os from 'os';

function puts(_error: ExecException | null, stdout: string, _stderr: string) {
  console.log(stdout);
}

// Run command depending on the OS
console.log('OS detected: ' + os.type());

if (os.type() === 'Linux') {
  exec('npm run package-linux', puts);
} else if (os.type() === 'Darwin') {
  exec('npm run package-mac', puts);
} else {
  throw new Error('Unsupported OS found: ' + os.type());
}
