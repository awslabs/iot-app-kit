import { useContext, useEffect, useState } from 'react';
import { useTimeSeriesData, useViewport } from '@iot-app-kit/react-components';

import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { useStore } from '../store';
import { IDataBindingTemplate, IValueDataBinding, IValueDataBindingProvider } from '../interfaces';
import { isEmpty } from 'lodash';
import { Query } from '@iot-app-kit/core';
import { applyDataBindingTemplate } from '../utils/dataBindingTemplateUtils';

const createQueries = (valueDataBindings: IValueDataBinding[], valueDataBindingProviders: Record<string, IValueDataBindingProvider | undefined> | undefined, dataBindingTemplate: IDataBindingTemplate | undefined) => {
  if (isEmpty(valueDataBindings) || isEmpty(valueDataBindingProviders)) {
    return;
  }

  const results: Query<any>[] = [];

  valueDataBindings.forEach((binding) => {
    const provider = valueDataBindingProviders[binding.providerId];
    provider && results.push(provider.createQuery(applyDataBindingTemplate(binding, dataBindingTemplate)))
  })

  return results;
}

const useDataBindings = (valueDataBindings: IValueDataBinding[]) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const valueDataBindingProviders = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().valueDataBindingProviders,
  );
  const dataBindingTemplate = useStore(sceneComposerId)(state => state.dataBindingTemplate)
  const isEditing = useStore(sceneComposerId)(state => state.isEditing())

  const [queries, setQueries] = useState<any>(createQueries(valueDataBindings, valueDataBindingProviders, dataBindingTemplate));
  const { viewport } = useViewport();
  // TODO: any way to not query in editing mode?
  const { dataStreams } = useTimeSeriesData({ queries, viewport: viewport || {
    start: new Date(2022, 7, 1),
    end: new Date(2022, 10, 1),
  } });

  useEffect(() => {
    setQueries(createQueries(valueDataBindings, valueDataBindingProviders, dataBindingTemplate))
  }, [valueDataBindings, dataBindingTemplate]);

  if (isEditing) {
    return { queries: [], dataStreams: []}
  }

  return { queries, dataStreams };
};

export default useDataBindings;
