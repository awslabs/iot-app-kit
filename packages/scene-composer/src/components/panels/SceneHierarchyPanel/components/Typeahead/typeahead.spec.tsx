import React from 'react';
import { render } from '@testing-library/react';

import Typeahead from '.';

jest.mock('@awsui/components-react/autosuggest', () => (props) => <div data-mocked={'Autosuggest'} {...props} />);

describe('<Typeahead />', () => {
  it('should match snapshot', () => {
    const { container } = render(<Typeahead />);
    expect(container).toMatchSnapshot();
  });
});
