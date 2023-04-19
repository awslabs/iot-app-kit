import React, { useCallback, useContext } from 'react';
import { FormField, SpaceBetween, Textarea } from '@awsui/components-react';
import { useIntl } from 'react-intl';

import { IComponentEditorProps } from '../ComponentEditor';
import { IDataOverlayComponentInternal, ISceneComponentInternal, useStore } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { Component } from '../../../models/SceneModels';
import { getGlobalSettings } from '../../../common/GlobalSettings';
import { COMPOSER_FEATURES } from '../../../interfaces';

import { ComponentWithDataBindings, DataBindingMapEditor } from './common/DataBindingMapEditor';

export interface IDataOverlayComponentEditorProps extends IComponentEditorProps {
  component: IDataOverlayComponentInternal;
}

export const DataOverlayComponentEditor: React.FC<IDataOverlayComponentEditorProps> = ({
  node,
  component,
}: IDataOverlayComponentEditorProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const valueDataBindingProvider = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().valueDataBindingProvider,
  );
  const { formatMessage } = useIntl();
  const dataBindingComponentEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.DataBinding];

  const onUpdateCallback = useCallback(
    (componentPartial: Partial<IDataOverlayComponentInternal>, replace?: boolean) => {
      const componentPartialWithRef = { ref: component.ref, ...componentPartial };
      updateComponentInternal(node.ref, componentPartialWithRef as ISceneComponentInternal, replace);
    },
    [node.ref, component.ref],
  );

  return (
    <SpaceBetween size='s'>
      {component.dataRows.length > 0 &&
        component.dataRows.map(
          (row, index) =>
            row.rowType === Component.DataOverlayRowType.Markdown && (
              <FormField
                key={index}
                label={formatMessage({ defaultMessage: 'Markdown Content', description: 'FormField label' })}
              >
                <Textarea
                  value={row.content}
                  placeholder={formatMessage(
                    {
                      defaultMessage: 'Example: Current temperature {variable}',
                      description: 'Textarea placeholder text',
                    },
                    // Formatjs cannot parse the message when it has ${}, so created a variable for it
                    { variable: '${temperature-binding-name}' },
                  )}
                  onChange={(e) => {
                    const newRows = [...component.dataRows];
                    newRows[index] = { ...newRows[index], content: e.detail.value };
                    onUpdateCallback({ dataRows: newRows });
                  }}
                />
              </FormField>
            ),
        )}

      <DataBindingMapEditor
        hasAddButton={!dataBindingComponentEnabled} // TODO: remove this prop from the component
        hasBindingName
        valueDataBindingProvider={valueDataBindingProvider}
        component={component}
        onUpdateCallback={
          onUpdateCallback as (
            componentPartial: Partial<ComponentWithDataBindings>,
            replace?: boolean | undefined,
          ) => void
        }
      />

      {/* Not supported in Data Overlay milestone 1 */}
      {/* {subtype === Component.DataOverlaySubType.OverlayPanel && (
        <DataOverlayPanelConfigEditor config={component.config} onUpdateCallback={onUpdateCallback} />
      )} */}
    </SpaceBetween>
  );
};
