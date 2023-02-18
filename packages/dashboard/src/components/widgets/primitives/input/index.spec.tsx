import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import InputWidget, { InputWidgetProps } from './index';
import {
  MOCK_INPUT_WIDGET,
  DESCRIBE_ASSET_PROPERTY_RESPONSE,
  DESCRIBE_ASSET_RESPONSE,
  BATCH_PUT_ASSET_PROPERTY_VALUE_RESPONSE,
  LIST_TAGS_FOR_RESOURCE_RESPONSE,
  STRING_ASSET_PROPERTY,
} from '../../../../../testing/mocks';
import { createMockSiteWiseSDK, MockSiteWiseSDKProps } from '../../../../../testing/iotsitewiseSDK';
import { ClientContext } from '~/components/dashboard/clientContext';

const describeAsset = jest.fn().mockResolvedValue(DESCRIBE_ASSET_RESPONSE);
const describeAssetProperty = jest.fn().mockResolvedValue(DESCRIBE_ASSET_PROPERTY_RESPONSE);
const putAssetPropertyValue = jest.fn().mockResolvedValue(BATCH_PUT_ASSET_PROPERTY_VALUE_RESPONSE);
const listTags = jest.fn().mockResolvedValue(LIST_TAGS_FOR_RESOURCE_RESPONSE);

const defaultSDKProps = { describeAsset, describeAssetProperty, listTags, putAssetPropertyValue };

const generateWidget = async (props: InputWidgetProps, sdkProps: MockSiteWiseSDKProps = defaultSDKProps) => {
  const ComponentWithClientContext = (props: InputWidgetProps) => (
    <ClientContext.Provider value={createMockSiteWiseSDK(sdkProps)}>
      <InputWidget {...props} />
    </ClientContext.Provider>
  );

  const { container, rerender } = render(<ComponentWithClientContext {...props} />);

  if (props.assets?.length) {
    await waitFor(() => {
      expect(describeAsset).toHaveBeenCalled();
      expect(listTags).toHaveBeenCalled();
    });
  }

  const widget = createWrapper(container);

  const rerenderWidget = (props: InputWidgetProps) => rerender(<ComponentWithClientContext {...props} />);

  return { container, widget, rerender: rerenderWidget };
};

const WITH_ASSET_PROPERTY = {
  ...MOCK_INPUT_WIDGET,
  assets: [
    { assetId: DESCRIBE_ASSET_RESPONSE.assetId as string, properties: [{ propertyId: STRING_ASSET_PROPERTY.id }] },
  ],
};

describe('edit mode', () => {
  it('add options if no options added', async () => {
    const props = { ...MOCK_INPUT_WIDGET, properties: { options: [] }, readOnly: false };
    const { widget } = await generateWidget(props);

    expect(widget.findButton('[data-test-id="input-widget-submit-btn"]')).not.toBeInTheDocument();
    expect(widget.findSelect('[data-test-id="input-widget-options"]')).not.toBeInTheDocument();
    expect(widget.getElement()).toHaveTextContent('Add input options');
  });

  it('add asset property if no asset property added', async () => {
    const props = { ...MOCK_INPUT_WIDGET, readOnly: false };
    const { widget } = await generateWidget(props);

    expect(widget.findButton('[data-test-id="input-widget-submit-btn"]')).not.toBeInTheDocument();
    expect(widget.findSelect('[data-test-id="input-widget-options"]')).not.toBeInTheDocument();
    expect(widget.getElement()).toHaveTextContent('Add asset property');
  });

  it('renders disabled submit and options when widget ready to be used', async () => {
    const props = { ...WITH_ASSET_PROPERTY, readOnly: false };
    const { widget } = await generateWidget(props);

    expect(widget.findButton('[data-test-id="input-widget-submit-btn"]').isDisabled()).toBeTruthy();
    expect(widget.findSelect('[data-test-id="input-widget-options"]').isDisabled()).toBeTruthy();
    expect(widget.getElement()).toHaveTextContent('Going to lunch');
  });

  it('only supports single asset property', async () => {
    const props = {
      ...MOCK_INPUT_WIDGET,
      assets: [{ assetId: '123', properties: [{ propertyId: '123' }, { propertyId: '456' }] }],
      readOnly: false,
    };
    const { widget } = await generateWidget(props);

    expect(widget.findButton('[data-test-id="input-widget-submit-btn"]').isDisabled()).toBeTruthy();
    expect(widget.findSelect('[data-test-id="input-widget-options"]').isDisabled()).toBeTruthy();
    expect(widget.getElement()).toHaveTextContent('Only supports single asset and property');
  });

  it('only supports single asset', async () => {
    const props = {
      ...MOCK_INPUT_WIDGET,
      assets: [
        { assetId: '123', properties: [{ propertyId: '123' }] },
        { assetId: '456', properties: [{ propertyId: '123' }] },
      ],
      readOnly: false,
    };
    const { widget } = await generateWidget(props);

    expect(widget.findButton('[data-test-id="input-widget-submit-btn"]').isDisabled()).toBeTruthy();
    expect(widget.findSelect('[data-test-id="input-widget-options"]').isDisabled()).toBeTruthy();
    expect(widget.getElement()).toHaveTextContent('Only supports single asset and property');
  });

  it('displays error if property is not writable', async () => {
    const props = { ...WITH_ASSET_PROPERTY, readOnly: false };
    const error = 'not writable';
    const { widget } = await generateWidget(props, {
      ...defaultSDKProps,
      listTags: jest.fn().mockRejectedValue(new Error(error)),
    });

    expect(widget.findButton('[data-test-id="input-widget-submit-btn"]').isDisabled()).toBeTruthy();
    expect(widget.findSelect('[data-test-id="input-widget-options"]').isDisabled()).toBeTruthy();
    expect(widget.getElement()).toHaveTextContent(error);
  });

  it('correctly renders translations', async () => {
    const submitLabel = 'lorem ipsum';
    const props = { ...WITH_ASSET_PROPERTY, messageOverrides: { submitLabel }, readOnly: false };
    const { widget } = await generateWidget(props);

    expect(widget.findButton('[data-test-id="input-widget-submit-btn"]').getElement()).toHaveTextContent(submitLabel);
  });

  it('correctly re-renders when option removed', async () => {
    const props = { ...WITH_ASSET_PROPERTY, readOnly: false };
    const { widget, rerender } = await generateWidget(props);
    const options = widget.findSelect('[data-test-id="input-widget-options"]');

    // first option is selected by default
    expect(options.findDropdown().getElement()).toHaveTextContent(MOCK_INPUT_WIDGET.properties.options[0].label);

    // if selected option is removed, set new selected option to first option
    rerender({
      ...props,
      properties: { options: [MOCK_INPUT_WIDGET.properties.options[1], MOCK_INPUT_WIDGET.properties.options[2]] },
    });
    expect(options.getElement()).toHaveTextContent(MOCK_INPUT_WIDGET.properties.options[1].label);
  });

  it('correctly re-renders when all options removed', async () => {
    const props = { ...WITH_ASSET_PROPERTY, readOnly: false };
    const { widget, rerender } = await generateWidget(props);
    const options = widget.findSelect('[data-test-id="input-widget-options"]');

    // if all options are removed, there is no selected option
    rerender({ ...props, properties: { options: [] } });
    expect(options.findDropdown().findSelectedOptions().length).toBe(0);
  });

  it('correctly re-renders when new option is added', async () => {
    const props = { ...WITH_ASSET_PROPERTY, properties: { options: [] }, readOnly: false };
    const { widget, rerender } = await generateWidget(props);

    expect(widget.findSelect('[data-test-id="input-widget-options"]')).not.toBeInTheDocument();

    const NEW_OPTION = {
      label: 'New option',
    };

    // if new options added, first option is selected
    rerender({ ...props, properties: { options: [NEW_OPTION] } });

    const options = widget.findSelect('[data-test-id="input-widget-options"]');

    expect(options.findDropdown().getElement()).toHaveTextContent(NEW_OPTION.label);
  });
});

describe('read-only mode', () => {
  it('renders enabled submit and options in read-only mode', async () => {
    const props = { ...WITH_ASSET_PROPERTY, readOnly: true };
    const { widget } = await generateWidget(props);

    expect(widget.findButton('[data-test-id="input-widget-submit-btn"]').isDisabled()).toBeFalsy();
    expect(widget.findSelect('[data-test-id="input-widget-options"]').isDisabled()).toBeFalsy();
    expect(widget.getElement()).toHaveTextContent('Going to lunch');
  });

  it('can select option', async () => {
    const props = { ...WITH_ASSET_PROPERTY, readOnly: true };
    const { widget } = await generateWidget(props);
    const options = widget.findSelect('[data-test-id="input-widget-options"]');

    options.openDropdown();

    // finds all options
    MOCK_INPUT_WIDGET.properties.options.forEach(({ label }) => {
      expect(options.getElement()).toHaveTextContent(label);
    });

    // first option is selected by default
    expect(options.findDropdown().findSelectedOptions()[0].getElement()).toHaveTextContent(
      MOCK_INPUT_WIDGET.properties.options[0].label
    );

    options.selectOption(2);
    options.openDropdown();

    // new option is selected
    expect(options.findDropdown().findSelectedOptions()[0].getElement()).toHaveTextContent(
      MOCK_INPUT_WIDGET.properties.options[1].label
    );
  });

  it('opens modal after clicking send', async () => {
    const props = { ...WITH_ASSET_PROPERTY, messageOverrides: { submitLabel: 'send' }, readOnly: true };
    const { widget } = await generateWidget(props);
    const submitButton = widget.findButton('[data-test-id="input-widget-submit-btn"]');
    expect(screen.queryByTestId('input-widget-confirmation-modal')).not.toBeInTheDocument();

    submitButton.click();

    await waitFor(() => {
      expect(describeAssetProperty).toHaveBeenCalled();

      const modalWindow = screen.queryByTestId('input-widget-confirmation-modal');
      expect(modalWindow).toBeInTheDocument();
      expect(modalWindow).toHaveTextContent('Send "Going to lunch" to LOGSTREAM?');
    });
  });

  it('shows success message if input sent successfully', async () => {
    const props = { ...WITH_ASSET_PROPERTY, readOnly: true };
    const { widget } = await generateWidget(props);
    const submitButton = widget.findButton('[data-test-id="input-widget-submit-btn"]');

    submitButton.click();

    await waitFor(() => {
      const modalWindow = screen.queryByTestId('input-widget-confirmation-modal');
      expect(modalWindow).toBeInTheDocument();

      const modalSubmitButton = screen.queryByTestId('input-widget-confirmation-btn');
      expect(modalSubmitButton).toBeInTheDocument();

      modalSubmitButton.click();

      expect(putAssetPropertyValue).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(widget.getElement()).toHaveTextContent('Sent successfully!');
    });
  });

  it('shows error message if input request failed', async () => {
    const props = { ...WITH_ASSET_PROPERTY, readOnly: true };
    const error = 'New error';
    const putAssetPropertyValueRejected = jest.fn().mockRejectedValue(new Error(error));
    const { widget } = await generateWidget(props, {
      ...defaultSDKProps,
      putAssetPropertyValue: putAssetPropertyValueRejected,
    });
    const submitButton = widget.findButton('[data-test-id="input-widget-submit-btn"]');

    submitButton.click();

    await waitFor(() => {
      const modalWindow = screen.queryByTestId('input-widget-confirmation-modal');
      expect(modalWindow).toBeInTheDocument();

      const modalSubmitButton = screen.queryByTestId('input-widget-confirmation-btn');
      expect(modalSubmitButton).toBeInTheDocument();

      modalSubmitButton.click();

      expect(putAssetPropertyValueRejected).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(widget.getElement()).toHaveTextContent(error);
    });
  });
});
