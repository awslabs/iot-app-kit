import Typeahead from '.';

import { render } from '@/tests/testing-library';

vi.mock('@cloudscape-design/components/autosuggest', () => ({
  default: (props) => <div data-mocked='Autosuggest' {...props} />,
}));

describe('<Typeahead />', () => {
  it('should match snapshot', () => {
    const { container } = render(<Typeahead />);
    expect(container).toMatchSnapshot();
  });
});
