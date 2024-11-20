import { useRef } from 'react';
import {
  type RenderResult,
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import type { Mock } from 'vitest';
import ChartContextMenu from './ChartContextMenu';

type ActionStub = Mock;

const TestChartContextMenu = ({
  action1,
  action2,
}: {
  action1: ActionStub;
  action2: ActionStub;
}) => {
  const trigger = useRef(null);
  return (
    <div>
      <div id='trigger' ref={trigger}></div>
      <ChartContextMenu
        targetTrigger={trigger}
        options={[
          {
            label: 'Action 1',
            action: (offsetX) => action1(offsetX),
          },
          {
            label: 'Action 2',
            action: (offsetX) => action2(offsetX),
          },
        ]}
      />
    </div>
  );
};

describe('ChartContextMenu', () => {
  const action1Stub = vi.fn();
  const action2Stub = vi.fn();

  let component: RenderResult;
  let trigger: Element;
  beforeEach(() => {
    component = render(
      <TestChartContextMenu action1={action1Stub} action2={action2Stub} />
    );
    const triggerElement = component.baseElement.querySelector('#trigger');
    if (!triggerElement) {
      throw new Error('triggerElement could not be found for test.');
    }
    trigger = triggerElement;
  });

  it('renders', () => {
    act(() => {
      fireEvent(trigger, new Event('contextmenu'));
    });

    expect(screen.getByText('Action 1')).not.toBeNull();
    expect(component.baseElement.querySelector('.chart-menu')).not.toBeNull();
  });

  it('does not show options when hidden', () => {
    expect(component.baseElement.querySelector('.chart-menu')).toBeNull();
  });

  it('calls an action when clicked', () => {
    act(() => {
      fireEvent(trigger, new Event('contextmenu'));
    });
    act(() => {
      screen.getByText('Action 1').click();
    });

    expect(action1Stub).toBeCalled();

    expect(component.baseElement.querySelector('.chart-menu')).toBeNull();
  });

  it('closes when a user presses escape', () => {
    act(() => {
      fireEvent(trigger, new Event('contextmenu'));
    });

    expect(screen.getByText('Action 1')).not.toBeNull();

    act(() => {
      fireEvent.keyDown(component.baseElement, { key: 'escape' });
    });

    expect(component.baseElement.querySelector('.chart-menu')).toBeNull();
  });
});
