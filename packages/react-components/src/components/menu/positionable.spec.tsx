import { render, screen } from '@testing-library/react';
import { MenuOption } from './option';
import { PositionableMenu } from './positionable';

it('can toggle visibility', () => {
  const position = { x: 10, y: 10 };

  const { rerender } = render(
    <PositionableMenu open={true} position={position}>
      <MenuOption label='test option' />
    </PositionableMenu>
  );

  expect(screen.queryByText('test option')).not.toBeNull();
  const [placed] = document.body.getElementsByClassName('menu-placement');
  expect(placed.getAttribute('style')).toBe('left: 10px; top: 10px;');

  rerender(
    <PositionableMenu open={false} position={position}>
      <MenuOption label='test option' />
    </PositionableMenu>
  );

  expect(screen.queryByText('test option')).toBeNull();
});
