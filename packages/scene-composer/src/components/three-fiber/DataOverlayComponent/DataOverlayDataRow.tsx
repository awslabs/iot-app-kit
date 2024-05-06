import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Primitive } from '@iot-app-kit/core';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { ITwinMakerEntityDataBindingContext } from '../../../interfaces';
import { Component } from '../../../models/SceneModels';
import { accessStore } from '../../../store';
import { dataBindingValuesProvider } from '../../../utils/dataBindingUtils';
import { replaceBindingVariables } from '../../../utils/dataBindingVariableUtils';
import { ReactMarkdownWrapper } from '../../wrappers/ReactMarkdownWrapper';
import useBindingData from '../../../hooks/useBindingData';

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
  const dataInput = accessStore(sceneComposerId)((state) => state.dataInput);
  const dataBindingTemplate = accessStore(sceneComposerId)((state) => state.dataBindingTemplate);
  const isEditing = accessStore(sceneComposerId)((state) => state.isEditing());
  const isAnnotation = overlayType === Component.DataOverlaySubType.TextAnnotation;
  const bindings = useMemo(() => valueDataBindings.map((b) => b.valueDataBinding ?? {}), [valueDataBindings]);
  const bindingData = useBindingData(bindings);

  const [stringContent, setStringContent] = useState<string>('');

  const bindingValuesMap: Record<string, string> = useMemo(() => {
    const result = {};
    valueDataBindings.forEach((binding, index) => {
      if (!binding.valueDataBinding) {
        return;
      }
      const values: Record<string, Primitive> =
        bindingData.data?.at(index) ??
        dataBindingValuesProvider(dataInput, binding.valueDataBinding, dataBindingTemplate);
      result[binding.bindingName] =
        values[(binding.valueDataBinding.dataBindingContext as ITwinMakerEntityDataBindingContext).propertyName];
    });

    return result;
  }, [valueDataBindings, dataInput, dataBindingTemplate, bindingData]);

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
