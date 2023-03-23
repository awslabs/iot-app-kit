import React from 'react';
import { render } from '@testing-library/react';

import { ResizablePanes } from './index';

const leftPaneContent = `Warp core monitor`;
const centerPaneContent = `Forward viewscreen`;
const rightPaneContent = `Phaser controls`;

it('renders panes', () => {
  const { container } = render(
    <ResizablePanes
      leftPane={<p>{leftPaneContent}</p>}
      centerPane={<p>{centerPaneContent}</p>}
      rightPane={<p>{rightPaneContent}</p>}
    />
  );

  const paraEls = container.querySelectorAll('p');
  expect(paraEls[0].textContent).toEqual(leftPaneContent);
  expect(paraEls[1].textContent).toEqual(centerPaneContent);
  expect(paraEls[2].textContent).toEqual(rightPaneContent);
});
