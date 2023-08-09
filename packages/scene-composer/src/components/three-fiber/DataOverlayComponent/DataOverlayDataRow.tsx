import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Primitive } from '@iot-app-kit/core';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { ITwinMakerEntityDataBindingContext } from '../../../interfaces';
import { Component } from '../../../models/SceneModels';
import { useStore } from '../../../store';
import { dataBindingValuesProvider } from '../../../utils/dataBindingUtils';
import { replaceBindingVariables } from '../../../utils/dataBindingVariableUtils';
import { ReactMarkdownWrapper } from '../../wrappers/ReactMarkdownWrapper';

import { tmAnnotationRow } from './styles';

export interface DataOverlayDataRowProps {
  rowData: Component.DataOverlayRow;
  overlayType: Component.DataOverlaySubType;
  valueDataBindings: Component.ValueDataBindingNamedMap[];
}

export const DataOverlayDataRow = ({
  rowData,
  overlayType,
  valueDataBindings,
}: DataOverlayDataRowProps): ReactElement => {
  const sceneComposerId = useSceneComposerId();
  const dataInput = useStore(sceneComposerId)((state) => state.dataInput);
  const dataBindingTemplate = useStore(sceneComposerId)((state) => state.dataBindingTemplate);
  const isEditing = useStore(sceneComposerId)((state) => state.isEditing());
  const isAnnotation = overlayType === Component.DataOverlaySubType.TextAnnotation;

  const [stringContent, setStringContent] = useState<string>('');

  const bindingValuesMap: Record<string, string> = useMemo(() => {
    const result = {};
    valueDataBindings.forEach((binding) => {
      if (!binding.valueDataBinding) {
        return;
      }
      const values: Record<string, Primitive> = dataBindingValuesProvider(
        dataInput,
        binding.valueDataBinding,
        dataBindingTemplate,
      );
      result[binding.bindingName] =
        values[(binding.valueDataBinding.dataBindingContext as ITwinMakerEntityDataBindingContext).propertyName];
    });

    return result;
  }, [valueDataBindings, dataInput, dataBindingTemplate]);

  const updateContentWithBindingVariables = useCallback(
    (content: string) => {
      // Show original content in editing mode
      if (isEditing) {
        setStringContent(content);
        return;
      }

      setStringContent(replaceBindingVariables(content, bindingValuesMap));
    },
    [bindingValuesMap],
  );

  useEffect(() => {
    switch (rowData.rowType) {
      case Component.DataOverlayRowType.Markdown: {
        updateContentWithBindingVariables((rowData as Component.DataOverlayMarkdownRow).content);
        break;
      }
      default:
        break;
    }
  }, [bindingValuesMap, rowData]);

  switch (rowData.rowType) {
    case Component.DataOverlayRowType.Markdown: {
      return <ReactMarkdownWrapper style={isAnnotation ? tmAnnotationRow : undefined} content={stringContent} />;
    }
    default:
      return <></>;
  }
};
