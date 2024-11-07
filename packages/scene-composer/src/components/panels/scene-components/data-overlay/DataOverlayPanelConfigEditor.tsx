import { Checkbox, FormField } from '@cloudscape-design/components';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import { type Component } from '../../../../models/SceneModels';
import { type IDataOverlayComponentInternal } from '../../../../store';

interface IDataOverlayPanelConfigEditorProps {
  config: Component.OverlayPanelConfig | undefined;
  onUpdateCallback: (
    componentPartial: Partial<IDataOverlayComponentInternal> | object,
    replace?: boolean | undefined,
  ) => void;
  // TODO: change back to this type when supporting overlay panel config
  // onUpdateCallback: (componentPartial: Partial<IDataOverlayComponentInternal>, replace?: boolean | undefined) => void;
}

// TODO: Not used in Data Overlay milestone 1.
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
