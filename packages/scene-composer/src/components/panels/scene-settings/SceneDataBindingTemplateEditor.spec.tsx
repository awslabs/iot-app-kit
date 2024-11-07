import { render } from '@testing-library/react';

import { useMockedValueDataBindingProvider } from '../../../../stories/useMockedValueDataBindingProvider';

import { SceneDataBindingTemplateEditor } from './SceneDataBindingTemplateEditor';

describe('SceneDataBindingTemplateEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should change the selection from icon to color', async () => {
    const mockValueDataBindingProvider = useMockedValueDataBindingProvider();
    const { container } = render(
      <SceneDataBindingTemplateEditor valueDataBindingProvider={mockValueDataBindingProvider} />,
    );

    expect(container).toMatchSnapshot();
  });
});
