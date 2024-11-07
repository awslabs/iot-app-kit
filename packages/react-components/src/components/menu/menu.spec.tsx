import { render, screen } from '@testing-library/react';
import { Menu } from './menu';
import { MenuOption } from './option';

it('renders', () => {
  render(
    <Menu>
      <MenuOption label='test option' />
    </Menu>
  );

  expect(screen.queryByText('test option')).not.toBeNull();
});
