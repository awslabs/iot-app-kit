import { useDrop } from 'react-dnd';

import useDropMonitor from './useDropMonitor';

jest.mock('react-dnd', () => ({
  useDrop: jest.fn(),
}));

describe('useDropMonitor', () => {
  it('should return the useful monitor properties on drop', () => {
    const onDrop = jest.fn();

    const fakeMonitor = {
      didDrop: jest.fn(() => true),
      isOver: jest.fn((opts?) => opts?.shallow || false),
    };

    const fakeItem = { item: 'value' };

    (useDrop as any).mockImplementation((closure) => {
      const { drop } = closure();
      drop(fakeItem, fakeMonitor);

      return [
        { isOver: fakeMonitor.isOver({ shallow: false }), isOverCurrent: fakeMonitor.isOver({ shallow: true }) },
        jest.fn(),
      ];
    });

    useDropMonitor('Fake', onDrop);

    expect(onDrop).toHaveBeenCalledWith(fakeItem, { isOver: false, isOverCurrent: true, beenHandled: true });
  });
});
