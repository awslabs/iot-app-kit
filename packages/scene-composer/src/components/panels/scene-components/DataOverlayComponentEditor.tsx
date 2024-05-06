import { FormField, SpaceBetween, Textarea } from '@cloudscape-design/components';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { debounce } from 'lodash';

import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { Component } from '../../../models/SceneModels';
import { IDataOverlayComponentInternal, ISceneComponentInternal, accessStore } from '../../../store';
import { IComponentEditorProps } from '../ComponentEditor';
import { isDynamicScene } from '../../../utils/entityModelUtils/sceneUtils';

import { ComponentWithDataBindings, DataBindingMapEditor } from './common/DataBindingMapEditor';

export interface IDataOverlayComponentEditorProps extends IComponentEditorProps {
  component: IDataOverlayComponentInternal;
}

export const DataOverlayComponentEditor: React.FC<IDataOverlayComponentEditorProps> = ({
  node,
  component,
}: IDataOverlayComponentEditorProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const document = accessStore(sceneComposerId)((state) => state.document);
  const updateComponentInternal = accessStore(sceneComposerId)((state) => state.updateComponentInternal);
  const valueDataBindingProvider = accessStore(sceneComposerId)(
    (state) => state.getEditorConfig().valueDataBindingProvider,
  );
  const [newRows, setNewRows] = useState<Component.DataOverlayMarkdownRow[]>(component.dataRows);

  const isDynamic = isDynamicScene(document);

  const { formatMessage } = useIntl();
  const onUpdateCallback = useCallback(
    debounce(
      (componentPartial: Partial<IDataOverlayComponentInternal>, replace?: boolean) => {
        const componentPartialWithRef = { ref: component.ref, ...componentPartial };
        updateComponentInternal(node.ref, componentPartialWithRef as ISceneComponentInternal, replace);
      },
      isDynamic ? 1000 : 100,
    ), // TODO: Temporary solution for the error when updating entity too frequent. Will implement a better solution for GA.
    [node.ref, component.ref],
  );

  useEffect(() => {
    setNewRows(component.dataRows);
  }, [component.dataRows]);

  return (
    <SpaceBetween size='s'>
      {newRows.length > 0 &&
        newRows.map(
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
                    const changedRows = [...newRows];
                    changedRows[index] = { ...changedRows[index], content: e.detail.value };
                    setNewRows(changedRows);
                    onUpdateCallback({ dataRows: changedRows });
                  }}
                />
              </FormField>
            ),
        )}

      <DataBindingMapEditor
        hasBindingName
        hasRemoveButton={true}
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
