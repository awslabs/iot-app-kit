import { useDrop } from 'react-dnd';

import useDropMonitor from './useDropMonitor';

vi.mock('react-dnd', () => ({
  useDrop: vi.fn(),
}));

describe('useDropMonitor', () => {
  it('should return the useful monitor properties on drop', () => {
    const onDrop = vi.fn();

    const fakeMonitor = {
      didDrop: vi.fn(() => true),
      isOver: vi.fn((opts?) => opts?.shallow || false),
    };

    const fakeItem = { item: 'value' };

    (useDrop as any).mockImplementation((closure) => {
      const { drop } = closure();
      drop(fakeItem, fakeMonitor);

      return [
        { isOver: fakeMonitor.isOver({ shallow: false }), isOverCurrent: fakeMonitor.isOver({ shallow: true }) },
        vi.fn(),
      ];
    });

    useDropMonitor('Fake', onDrop);

    expect(onDrop).toHaveBeenCalledWith(fakeItem, { isOver: false, isOverCurrent: true, beenHandled: true });
  });
});
