import { IntlShape, defineMessages } from 'react-intl';

import { IDataOverlayComponent, KnownComponentType } from '../interfaces';
import { Component } from '../models/SceneModels';
import { ISceneComponentInternal } from '../store';

export const i18nKnownComponentTypesStrings = defineMessages({
  [KnownComponentType.ModelRef]: {
    defaultMessage: 'Model Reference',
    description: 'Expandable Section title',
  },
  [KnownComponentType.SubModelRef]: {
    defaultMessage: 'Model Reference',
    description: 'Expandable Section Title',
  },
  [KnownComponentType.Camera]: {
    defaultMessage: 'Camera',
    description: 'Expandable Section title',
  },
  [KnownComponentType.Light]: {
    defaultMessage: 'Light',
    description: 'Expandable Section title',
  },
  [KnownComponentType.Tag]: {
    defaultMessage: 'Tag',
    description: 'Expandable Section title',
  },
  [KnownComponentType.EntityBinding]: {
    defaultMessage: 'Entity data binding',
    description: 'Expandable Section title',
  },
  [KnownComponentType.ModelShader]: {
    defaultMessage: 'Model Shader',
    description: 'Expandable Section title',
  },
  [KnownComponentType.MotionIndicator]: {
    defaultMessage: 'Motion Indicator',
    description: 'Expandable Section title',
  },
  [Component.DataOverlaySubType.TextAnnotation]: {
    defaultMessage: 'Annotation',
    description: 'Expandable Section title',
  },
  [Component.DataOverlaySubType.OverlayPanel]: {
    defaultMessage: 'Overlay',
    description: 'Expandable Section title',
  },
  [KnownComponentType.Animation]: {
    defaultMessage: 'Animation',
    description: 'Expandable Section title',
  },
  [KnownComponentType.PlaneGeometry]: {
    defaultMessage: 'Plane Geometry',
    description: 'Expandable Section title',
  },
});

export const getLocalizedComponentType = (component: ISceneComponentInternal, intl: IntlShape): string => {
  return (
    (component.type === KnownComponentType.DataOverlay
      ? intl.formatMessage(i18nKnownComponentTypesStrings[(component as IDataOverlayComponent).subType]) ||
        (component as IDataOverlayComponent).subType
      : intl.formatMessage(i18nKnownComponentTypesStrings[component.type])) || component.type
  );
};
