import React, { useState, Dispatch, SetStateAction } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import Checkbox from '@cloudscape-design/components/checkbox';

const checkboxOnChange = (setShowFn: Dispatch<SetStateAction<boolean>>) => {
  return ({ detail }: { detail: { checked: boolean } }) => setShowFn(detail.checked);
};

export const IotResourceExplorerSearchbar = () => {
  const [autosuggestValue, setAutosuggestValue] = useState('');
  const [showAssets, setShowAssets] = useState(true);
  const [showProperties, setShowProperties] = useState(false);
  const [showAlarms, setShowAlarms] = useState(false);

  return (
    <>
      <Autosuggest
        value={autosuggestValue}
        onChange={({ detail }) => setAutosuggestValue(detail.value)}
        options={[
          { value: 'Suggestion 1' },
          { value: 'Suggestion 2' },
          { value: 'Suggestion 3' },
          { value: 'Suggestion 4' },
        ]}
        enteredTextLabel={(value) => `Use: "${value}"`}
        ariaLabel="Autosuggest example with suggestions"
        placeholder="Enter value"
        empty="No matches found"
      />

      <SpaceBetween direction="horizontal" size="xs">
        <Checkbox onChange={checkboxOnChange(setShowAssets)} checked={showAssets}>
          Assets
        </Checkbox>
        <Checkbox onChange={checkboxOnChange(setShowProperties)} checked={showProperties}>
          Properties
        </Checkbox>
        <Checkbox onChange={checkboxOnChange(setShowAlarms)} checked={showAlarms}>
          Alarms
        </Checkbox>
      </SpaceBetween>
    </>
  );
};
