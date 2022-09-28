/* eslint-disable import/first */
import React from 'react';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { useStore } from '../../../store';
import { useMockedValueDataBindingProvider } from '../../../../stories/useMockedValueDataBindingProvider';

import { SceneDataBindingTemplateEditor } from './SceneDataBindingTemplateEditor';

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

const sleep = async (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

describe('SceneDataBindingTemplateEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should change the selection from icon to color', async () => {
    const store = useStore('default').getState();
    const setScenePropertySpy = jest.spyOn(store, 'setSceneProperty');
    const clearTemplatizedDataBindingsSpy = jest.spyOn(store, 'clearTemplatizedDataBindings');
    const mockValueDataBindingProvider = useMockedValueDataBindingProvider();
    const { container } = render(
      <SceneDataBindingTemplateEditor valueDataBindingProvider={mockValueDataBindingProvider} />,
    );
    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect();

    await sleep(1500); // TODO: What are we waiting for? Why is this so slow?

    select!.openDropdown();
    select!.selectOption(1);

    expect(setScenePropertySpy).toBeCalled();
    expect(clearTemplatizedDataBindingsSpy).toBeCalled();
  });
});
