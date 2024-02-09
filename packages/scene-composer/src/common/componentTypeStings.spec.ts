import { useIntl } from 'react-intl';

import { KnownComponentType } from '../interfaces';
import { Component } from '../models/SceneModels';
import { IDataOverlayComponentInternal, ISceneComponentInternal } from '../store';

import { getLocalizedComponentType } from './componentTypeStings';

describe('getLocalizedComponentType', () => {
  const intl = useIntl();

  it('should get correct string for EntityBinding', () => {
    const component: ISceneComponentInternal = { ref: 'entity-binding-ref', type: KnownComponentType.EntityBinding };
    expect(getLocalizedComponentType(component, intl)).toEqual('Entity data binding');
  });

  it('should get correct string for Overlay', () => {
    const component: IDataOverlayComponentInternal = {
      ref: 'overlay-ref',
      type: KnownComponentType.DataOverlay,
      subType: Component.DataOverlaySubType.OverlayPanel,
      dataRows: [],
      valueDataBindings: [],
    };
    expect(getLocalizedComponentType(component, intl)).toEqual('Overlay');
  });

  it('should get correct string for Annotation', () => {
    const component: IDataOverlayComponentInternal = {
      ref: 'annotation-ref',
      type: KnownComponentType.DataOverlay,
      subType: Component.DataOverlaySubType.TextAnnotation,
      dataRows: [],
      valueDataBindings: [],
    };
    expect(getLocalizedComponentType(component, intl)).toEqual('Annotation');
  });
});
