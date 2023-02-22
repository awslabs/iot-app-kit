import React, { useCallback } from 'react';
import { Checkbox, FormField } from '@awsui/components-react';
import { useIntl } from 'react-intl';

import { IDataOverlayComponentInternal } from '../../../../store';
import { Component } from '../../../../models/SceneModels';

interface IDataOverlayPanelConfigEditorProps {
  config: Component.OverlayPanelConfig | undefined;
  onUpdateCallback: (componentPartial: Partial<IDataOverlayComponentInternal>, replace?: boolean | undefined) => void;
}

export const DataOverlayPanelConfigEditor: React.FC<IDataOverlayPanelConfigEditorProps> = ({
  config,
  onUpdateCallback,
}) => {
  const { formatMessage } = useIntl();

  const onPinnedChange = useCallback(
    ({ detail: { checked } }) => {
      onUpdateCallback({ config: { isPinned: checked } }, false);
    },
    [onUpdateCallback],
  );

  return (
    <FormField label={formatMessage({ defaultMessage: 'Panel Config', description: 'FormField label' })}>
      <Checkbox data-testid='pinned-checkbox' checked={config?.isPinned === true} onChange={onPinnedChange}>
        {formatMessage({ defaultMessage: 'Open by default', description: 'checkbox option' })}
      </Checkbox>
    </FormField>
  );
};
