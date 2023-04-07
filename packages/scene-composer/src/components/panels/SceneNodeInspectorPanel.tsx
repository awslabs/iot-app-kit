import { debounce } from 'lodash';
import * as THREE from 'three';
import React, { useContext } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Box, Checkbox, FormField, TextContent } from '@awsui/components-react';

import useLifecycleLogging from '../../logger/react-logger/hooks/useLifecycleLogging';
import { COMPOSER_FEATURES, IDataOverlayComponent, KnownComponentType } from '../../interfaces';
import { RecursivePartial } from '../../utils/typeUtils';
import { ISceneNodeInternal, useEditorState, useSceneDocument } from '../../store';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { useSnapObjectToFloor } from '../../three/transformUtils';
import { toNumber } from '../../utils/stringUtils';
import { isLinearPlaneMotionIndicator } from '../../utils/sceneComponentUtils';
import LogProvider from '../../logger/react-logger/log-provider';
import { findComponentByType, isEnvironmentNode } from '../../utils/nodeUtils';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { Component } from '../../models/SceneModels';
import { Divider } from '../Divider';

import { ComponentEditor } from './ComponentEditor';
import { ExpandableInfoSection, Matrix3XInputGrid, Triplet, TextInput } from './CommonPanelComponents';
import DebugInfoPanel from './scene-components/debug/DebugPanel';
import { AddOrRemoveOverlayButton } from './AddOrRemoveOverlayButton';

export const SceneNodeInspectorPanel: React.FC = () => {
  const log = useLifecycleLogging('SceneNodeInspectorPanel');
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { selectedSceneNodeRef } = useEditorState(sceneComposerId);
  const { getSceneNodeByRef, updateSceneNodeInternal } = useSceneDocument(sceneComposerId);
  const selectedSceneNode = getSceneNodeByRef(selectedSceneNodeRef);
  const intl = useIntl();

  const subModelMovementEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.SubModelMovement];
  const overlayEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.Overlay];

  const i18nKnownComponentTypesStrings = defineMessages({
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
  });

  log?.verbose('render inspect panel with selected scene node ', selectedSceneNodeRef, selectedSceneNode);

  const applySnapToFloorConstraint = useSnapObjectToFloor((position, sceneNode) => {
    updateSceneNodeInternal(sceneNode.ref, { transform: { position } }, true);
  }, selectedSceneNode);

  const isModelComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.ModelRef);
  const isCameraComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.Camera);
  const isTagComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.Tag);
  const isOverlayComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.DataOverlay);
  const isSubModelComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.SubModelRef);

  const transformVisible = !isSubModelComponent || subModelMovementEnabled;

  const shouldShowScale = !(isTagComponent || isCameraComponent);

  const readonly: Triplet<boolean> = [false, false, false];

  const handleInputChanges = (value: RecursivePartial<ISceneNodeInternal>) => {
    if (selectedSceneNodeRef && selectedSceneNode) {
      updateSceneNodeInternal(selectedSceneNodeRef, value);
    }
  };

  if (!selectedSceneNode) {
    return (
      <ExpandableInfoSection
        title={intl.formatMessage({ defaultMessage: 'Properties', description: 'Section title' })}
        defaultExpanded
      >
        <TextContent>
          <p>
            {intl.formatMessage({
              defaultMessage: 'No node selected.',
              description: 'Placeholder one no node selected',
            })}
          </p>
        </TextContent>
      </ExpandableInfoSection>
    );
  }

  const componentViews = selectedSceneNode.components.map((component, index) => {
    const isTag = component.type === KnownComponentType.Tag;
    return (
      <React.Fragment key={component.type + '_' + index}>
        <ExpandableInfoSection
          withoutSpaceBetween
          key={component.type + '_' + index}
          title={
            (component.type === KnownComponentType.DataOverlay
              ? intl.formatMessage(i18nKnownComponentTypesStrings[(component as IDataOverlayComponent).subType]) ||
                (component as IDataOverlayComponent).subType
              : intl.formatMessage(i18nKnownComponentTypesStrings[component.type])) || component.type
          }
        >
          <ComponentEditor node={selectedSceneNode} component={component} />

          {/* If the component is an overlay panel, add remove overlay button */}
          {component.type === KnownComponentType.DataOverlay &&
            (component as IDataOverlayComponent).subType === Component.DataOverlaySubType.OverlayPanel && (
              <Box margin={{ top: 's' }}>
                <Divider />
                <AddOrRemoveOverlayButton />
              </Box>
            )}
        </ExpandableInfoSection>

        {/* If the component is a Tag and there is no overlay component in the selected node, then an empty
          overlay sections is added. */}
        {overlayEnabled && isTag && !isOverlayComponent && (
          <ExpandableInfoSection
            withoutSpaceBetween
            key={KnownComponentType.DataOverlay + '_' + index}
            title={intl.formatMessage(i18nKnownComponentTypesStrings[Component.DataOverlaySubType.OverlayPanel])}
          >
            {intl.formatMessage({
              defaultMessage: 'Currently no overlay',
              description: 'Expandable section content',
            })}
            <AddOrRemoveOverlayButton />
          </ExpandableInfoSection>
        )}
      </React.Fragment>
    );
  });

  return (
    <LogProvider namespace='SceneNodeInspectorPanel'>
      <div style={{ overflow: 'auto' }}>
        <DebugInfoPanel />
        <ExpandableInfoSection
          title={intl.formatMessage({ defaultMessage: 'Properties', description: 'Section title' })}
          defaultExpanded
        >
          <FormField label={intl.formatMessage({ defaultMessage: 'Name', description: 'Form field label' })}>
            <TextInput value={selectedSceneNode.name} setValue={(e) => handleInputChanges({ name: e?.toString() })} />
          </FormField>
        </ExpandableInfoSection>
        {!isEnvironmentNode(selectedSceneNode) && transformVisible && (
          <ExpandableInfoSection
            title={intl.formatMessage({ defaultMessage: 'Transform', description: 'Expandable section title' })}
            defaultExpanded
          >
            <Matrix3XInputGrid
              name={intl.formatMessage({ defaultMessage: 'Position', description: 'Input Grid title name' })}
              labels={['X', 'Y', 'Z']}
              values={selectedSceneNode.transform.position}
              disabled={[false, selectedSceneNode.transformConstraint.snapToFloor === true, false]}
              readonly={readonly}
              toStr={(a) => a.toFixed(3)}
              fromStr={toNumber}
              onChange={debounce((items) => {
                handleInputChanges({ transform: { position: items } });
                applySnapToFloorConstraint();
              }, 100)}
            />
            <Matrix3XInputGrid
              name={intl.formatMessage({ defaultMessage: 'Rotation', description: 'Input Grid title name' })}
              labels={['X', 'Y', 'Z']}
              values={selectedSceneNode.transform.rotation}
              toStr={(a) => THREE.MathUtils.radToDeg(a).toFixed(3)}
              fromStr={(s) => THREE.MathUtils.degToRad(toNumber(s))}
              disabled={isTagComponent || isOverlayComponent ? [true, true, true] : [false, false, false]}
              readonly={readonly}
              onChange={debounce((items) => {
                handleInputChanges({ transform: { rotation: items } });
                applySnapToFloorConstraint();
              }, 100)}
            />
            {shouldShowScale && (
              <Matrix3XInputGrid
                name={intl.formatMessage({ defaultMessage: 'Scale', description: 'Input Grid title name' })}
                labels={['X', 'Y', 'Z']}
                disabled={
                  isTagComponent || isOverlayComponent
                    ? [true, true, true]
                    : [false, isLinearPlaneMotionIndicator(selectedSceneNode), false]
                }
                readonly={readonly}
                values={selectedSceneNode.transform.scale}
                toStr={(a) => a.toFixed(3)}
                fromStr={toNumber}
                onChange={debounce((items) => {
                  handleInputChanges({ transform: { scale: items } });
                  applySnapToFloorConstraint();
                }, 100)}
              />
            )}
            {isModelComponent && (
              <FormField label={intl.formatMessage({ defaultMessage: 'Constraints', description: 'Form field label' })}>
                <Checkbox
                  checked={selectedSceneNode.transformConstraint.snapToFloor === true}
                  onChange={({ detail: { checked } }) => {
                    handleInputChanges({ transformConstraint: { snapToFloor: checked } });
                    applySnapToFloorConstraint();
                  }}
                >
                  {intl.formatMessage({ defaultMessage: 'Snap to floor', description: 'checkbox option' })}
                </Checkbox>
              </FormField>
            )}
          </ExpandableInfoSection>
        )}

        {componentViews}
      </div>
    </LogProvider>
  );
};
