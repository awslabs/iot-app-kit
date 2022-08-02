/* eslint-disable import/first */
import React from 'react';
import { render } from '@testing-library/react';

import { Direction } from '..';

import FoldableContainer from './FoldableContainer';

describe('FoldableContainerSnap', () => {
  [Direction.Left, Direction.Right].forEach((direction) => {
    it(`should render a ${Direction[direction].toLowerCase()} fold correctly`, () => {
      const { container } = render(<FoldableContainer direction={direction}>My Content</FoldableContainer>);
      expect(container).toMatchSnapshot();
    });
  });
});
