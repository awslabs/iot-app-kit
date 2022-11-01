import * as React from 'react';
import { act } from 'react-dom/test-utils';
import * as ReactDOM from 'react-dom';

import { ResizablePanes } from './index';

const leftPaneContent = `Warp core monitor`;
const centerPaneContent = `Forward viewscreen`;
const rightPaneContent = `Phaser controls`;

describe('ResizablePanes', () => {
  it('should render panes', function () {
    const container = document.createElement('div');
    document.body.appendChild(container);

    act(() => {
      ReactDOM.render(
        <ResizablePanes
          leftPane={<p>{leftPaneContent}</p>}
          centerPane={<p>{centerPaneContent}</p>}
          rightPane={<p>{rightPaneContent}</p>}
        />
        , container
      );
    });

    const paraEls = document.querySelectorAll('p');
    expect(paraEls[0].textContent).toEqual(leftPaneContent);
    expect(paraEls[1].textContent).toEqual(centerPaneContent);
    expect(paraEls[2].textContent).toEqual(rightPaneContent);
  });
});
