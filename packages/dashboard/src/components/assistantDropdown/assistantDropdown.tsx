import { FormField, Select } from '@cloudscape-design/components';
import React, { useEffect, useState } from 'react';
import { useClients } from '../dashboard/clientContext';

export const AssistantDropDown = () => {
  const defaultOption = { label: 'Select an assistant', value: '' };
  const [assistantId, updateAssistantId] = useState<string>('');

  // Fetch assistants
  const { iotSiteWisePrivateClient } = useClients();

  useEffect(() => {
    async function getAssistants() {
      if (iotSiteWisePrivateClient) {
        //const request = iotSiteWisePrivateClient?.getAssistant({ assistantId });
        //*
        const request = iotSiteWisePrivateClient?.invokeAssistant({
          conversationId: 'conversationId',
          message:
            'show alarm summary for alarm name FreshWaterHighTemperatureAlarm associated with asset id 40a84af9-34bb-4196-b993-0e2c1233653c?',
        });
        const response = await request.promise();
        console.log('response', response);
      }
    }
    getAssistants();
  }, []);

  const selectedOption = () => {
    return !assistantId ? defaultOption : { value: assistantId };
  };
  return (
    <>
      <FormField label='Assistants'>
        <Select
          selectedOption={selectedOption()}
          onChange={({
            detail: {
              selectedOption: { value },
            },
          }) => {
            updateAssistantId(value || '');
          }}
          options={[
            defaultOption,
            { label: 'myAssistant', value: 'myAssistantID' },
          ]}
        />
      </FormField>
    </>
  );
};
