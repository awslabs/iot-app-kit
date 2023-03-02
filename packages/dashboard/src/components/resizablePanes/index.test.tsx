import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';

import { ResizablePanes } from './index';

const leftPaneContent = `Warp core monitor`;
const centerPaneContent = `Forward viewscreen`;
const rightPaneContent = `Phaser controls`;

describe('ResizablePanes', () => {
  it('should render panes', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const root = createRoot(container);
    act(() => {
      root.render(
        <ResizablePanes
          leftPane={<p>{leftPaneContent}</p>}
          centerPane={<p>{centerPaneContent}</p>}
          rightPane={<p>{rightPaneContent}</p>}
        />
      );
    });

    const paraEls = document.querySelectorAll('p');
    expect(paraEls[0].textContent).toEqual(leftPaneContent);
    expect(paraEls[1].textContent).toEqual(centerPaneContent);
    expect(paraEls[2].textContent).toEqual(rightPaneContent);
  });
});
