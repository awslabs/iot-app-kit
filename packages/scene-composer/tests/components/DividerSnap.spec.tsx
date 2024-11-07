import { create } from 'react-test-renderer';

import { Divider } from '../../src/components/Divider';

describe('Divider', () => {
  it('should render correctly', () => {
    const container = create(<Divider />);
    expect(container).toMatchSnapshot();
  });
});
