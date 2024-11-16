import { fireEvent, render } from '@testing-library/react';

import { Direction } from '..';

import FoldableContainer from './FoldableContainer';

const setIsOpen = () => null;

describe('FoldableContainerSnap', () => {
  [Direction.Left, Direction.Right].forEach((direction) => {
    it(`should render a ${Direction[direction].toLowerCase()} fold correctly`, () => {
      const { container } = render(
        <FoldableContainer ref={<></>} open={false} setIsOpen={setIsOpen} direction={direction}>
          My Content
        </FoldableContainer>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should toggle when handle is clicked', () => {
    const { container, getByTestId } = render(
      <FoldableContainer ref={<></>} open={false} setIsOpen={setIsOpen} direction={Direction.Left}>
        My Content
      </FoldableContainer>,
    );

    const handle = getByTestId('handle');

    fireEvent.click(handle);

    expect(container).toMatchSnapshot();
  });
});
