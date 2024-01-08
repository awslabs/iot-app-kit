import * as path from 'path';
import { watch } from 'turbowatch';

void watch({
  project: path.resolve(__dirname, '../'),
  triggers: [
    {
      expression: [
        'anyof',
        [
          'anyof',
          ['allof', ['dirname', 'dashboard'], ['match', '*.tsx', 'basename']],
          ['allof', ['dirname', 'dashboard'], ['match', '*.ts', 'basename']],
        ],
        [
          'anyof',
          [
            'allof',
            ['dirname', 'react-components'],
            ['match', '*.tsx', 'basename'],
          ],
          [
            'allof',
            ['dirname', 'react-components'],
            ['match', '*.ts', 'basename'],
          ],
        ],
        ['allof', ['dirname', 'core'], ['match', '*.ts', 'basename']],
        ['allof', ['dirname', 'core-util'], ['match', '*.ts', 'basename']],
      ],
      // Because of this setting, Turbowatch will kill the processes that spawn starts
      // when it detects changes when it detects a change.
      interruptible: true,
      name: 'turbo-run-start',
      onChange: async ({ spawn }) => {
        await spawn`turbo run start --include-dependencies`;
      },
    },
  ],
});
