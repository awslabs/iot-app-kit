import React, { useState, useEffect } from 'react';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { Button, Select, SelectProps, StatusIndicator } from '@cloudscape-design/components';
import { InputWidget as InputWidgetType } from '~/types';
import useWritableSiteWiseProperty from './hooks/useWritableSiteWiseProperty';
import isValidQuery from './util/isValidQuery';
import ConfirmationModal from './ConfirmationModal';
import './index.css';

export type InputWidgetProps = InputWidgetType & { readOnly: boolean };

const Input: React.FC<InputWidgetProps> = ({ readOnly, ...widget }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const options = widget.properties.options.map(({ label }) => ({ label, value: label }));
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option | null>(options[0]);
  const showSubmitAndOptions = options.length > 0 && !infoMessage && widget.assets?.[0]?.properties?.length;
  const isSelectedOptionValid = options.filter(({ label }) => selectedOption?.label === label).length > 0;
  const isWritable = useWritableSiteWiseProperty();

  const changeOption: NonCancelableEventHandler<SelectProps.ChangeDetail> = ({ detail: { selectedOption } }) => {
    setSelectedOption(selectedOption);
  };

  useEffect(() => {
    setInfoMessage(null);
    setErrorMessage(null);

    if (options.length === 0) {
      setInfoMessage('Add input options');
    } else if (!widget.assets?.[0]?.properties?.length) {
      setInfoMessage('Add asset property');
    } else if (!isValidQuery(widget.assets ?? [])) {
      setErrorMessage('Only supports single asset and property');
    } else {
      (async () => {
        const assetId = widget.assets?.[0]?.assetId;
        const propertyId = widget.assets?.[0]?.properties?.[0]?.propertyId;
        if (assetId && propertyId) {
          const { error } = await isWritable({ assetId, propertyId });
          if (error) {
            setErrorMessage(error);
          }
        }
      })();
    }
  }, [JSON.stringify(widget.assets), JSON.stringify(options)]);

  useEffect(() => {
    if (options.length === 0) {
      setSelectedOption(null);
    } else if (!isSelectedOptionValid) {
      setSelectedOption(options[0]);
    }
  }, [JSON.stringify(options)]);

  return (
    <>
      <ConfirmationModal
        showConfirmationModal={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
        submitLabel={widget.messageOverrides?.submitLabel ?? ''}
        input={selectedOption?.label ?? ''}
        setErrorMessage={setErrorMessage}
        assetId={widget.assets?.[0]?.assetId ?? ''}
        propertyId={widget.assets?.[0]?.properties?.[0]?.propertyId ?? ''}
        setSuccessMessage={setSuccessMessage}
        successMessage={successMessage}
        setIsSending={setIsSending}
      />
      <div className='input-widget-container'>
        {showSubmitAndOptions && (
          <>
            <Select
              data-test-id='input-widget-options'
              disabled={!readOnly || isSending}
              selectedOption={selectedOption}
              onChange={changeOption}
              options={options}
              className='input-widget-options'
            />
            <Button
              data-test-id='input-widget-submit-btn'
              disabled={!readOnly || isSending}
              onClick={() => setShowConfirmationModal(true)}
            >
              {isSending ? (
                <StatusIndicator type='loading'>{widget.messageOverrides?.submitLabel}</StatusIndicator>
              ) : (
                widget.messageOverrides?.submitLabel
              )}
            </Button>
          </>
        )}
      </div>
      {infoMessage && <StatusIndicator type='info'>{infoMessage}</StatusIndicator>}
      {errorMessage && <StatusIndicator type='error'>{errorMessage}</StatusIndicator>}
      {successMessage && <StatusIndicator>{successMessage}</StatusIndicator>}
    </>
  );
};

export default Input;
