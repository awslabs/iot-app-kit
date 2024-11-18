import { render } from '@testing-library/react';

import RadioButton from '../index';

describe('RadioButton', () => {
  [
    [
      'First Option',
      {
        testId: 'one',
        selected: false,
        toggle: () => {
          return null;
        },
        label: 'radio one',
      },
    ],
    [
      'Second Option',
      {
        testId: 'two',
        selected: true,
        toggle: () => {
          return null;
        },
        label: 'radio two',
      },
    ],
    [
      'Third Option',
      {
        testId: 'three',
        selected: false,
        toggle: () => {
          return null;
        },
        label: 'radio three',
      },
    ],
    [
      'Fourth Option',
      {
        testId: 'four',
        selected: false,
        toggle: () => {
          return null;
        },
        label: 'radio four',
      },
    ],
    [
      'Fifth Option',
      {
        testId: 'five',
        selected: false,
        toggle: () => {
          return null;
        },
        label: 'radio five',
      },
    ],
  ].forEach((item) => {
    it(`it should render the ${item[0]} as a radio button`, () => {
      const data = item[1] as {
        testId: string;
        selected: boolean;
        toggle: () => null;
        label: string;
      };
      const { selected, testId, toggle, label } = data;

      const { getByTestId } = render(<RadioButton selected={selected} testId={testId} toggle={toggle} label={label} />);
      const radioBtn = getByTestId(testId);

      expect(radioBtn).toMatchSnapshot();
    });
  });
});
