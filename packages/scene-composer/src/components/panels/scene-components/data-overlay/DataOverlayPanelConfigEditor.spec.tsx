import wrapper from '@cloudscape-design/components/test-utils/dom';
import { act, render } from '@/tests/testing-library';

import { DataOverlayPanelConfigEditor } from './DataOverlayPanelConfigEditor';

vi.mock('@cloudscape-design/components', async () => ({
  ...(await vi.importActual('@cloudscape-design/components')),
}));

describe('DataOverlayPanelConfigEditor', () => {
  const config = {
    isPinned: true,
  };
  const onUpdateCallbackMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update when clicking checkbox', async () => {
    const { container } = render(
      <DataOverlayPanelConfigEditor config={config} onUpdateCallback={onUpdateCallbackMock} />,
    );
    const polarisWrapper = wrapper(container);

    const pinnedCheckbox = polarisWrapper.findCheckbox('[data-testid="pinned-checkbox"]');
    expect(pinnedCheckbox).not.toBeNull();

    act(() => {
      pinnedCheckbox!.findNativeInput().click();
    });

    expect(onUpdateCallbackMock).toBeCalledTimes(1);
    expect(onUpdateCallbackMock).toBeCalledWith(
      {
        config: { isPinned: false },
      },
      false,
    );
  });
});
