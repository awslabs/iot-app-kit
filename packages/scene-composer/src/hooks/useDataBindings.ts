import { useContext, useEffect, useMemo, useState } from 'react';
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
  const { dataStreams } = useTimeSeriesData({ queries, viewport: viewport || {
  // const { dataStreams } = useTimeSeriesData({ queries: isEditing ? [] : queries, viewport: viewport || {
    start: new Date(2022, 7, 1),
    end: new Date(2022, 10, 1),
  } });

  const result = useMemo(() => {
    return { queries, dataStreams };
  }, [dataStreams, queries])

  useEffect(() => {
    console.log('xxxxyy valueDataBindings hook', valueDataBindings)

  }, [valueDataBindings])

  useEffect(() => {
    console.log('xxxxyy queries hook', queries)

  }, [queries])

  console.log('xxxx rerender hook')
  useEffect(() => {
    setQueries(createQueries(valueDataBindings, valueDataBindingProviders, dataBindingTemplate))
  }, [valueDataBindings, dataBindingTemplate]);

  return result;
};

export default useDataBindings;
