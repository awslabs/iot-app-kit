import { debounce } from 'lodash';
import * as THREE from 'three';
import React, { useContext, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Checkbox, FormField, Input, TextContent } from '@awsui/components-react';

import useLifecycleLogging from '../../logger/react-logger/hooks/useLifecycleLogging';
import { KnownComponentType } from '../../interfaces';
import { RecursivePartial } from '../../utils/typeUtils';
import { ISceneNodeInternal, useEditorState, useSceneDocument } from '../../store';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { useSnapObjectToFloor } from '../../three/transformUtils';
import { toNumber } from '../../utils/stringUtils';
import { isLinearPlaneMotionIndicator } from '../../utils/sceneComponentUtils';
import LogProvider from '../../logger/react-logger/log-provider';
import { findComponentByType, isEnvironmentNode } from '../../utils/nodeUtils';

import { ComponentEditor } from './ComponentEditor';
import { Matrix3XInputGrid, ExpandableInfoSection, Triplet } from './CommonPanelComponents';
import DebugInfoPanel from './scene-components/debug/DebugPanel';

export const SceneNodeInspectorPanel: React.FC = () => {
  const log = useLifecycleLogging('SceneNodeInspectorPanel');
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { selectedSceneNodeRef } = useEditorState(sceneComposerId);
  const { getSceneNodeByRef, updateSceneNodeInternal } = useSceneDocument(sceneComposerId);
  const selectedSceneNode = getSceneNodeByRef(selectedSceneNodeRef);
  const intl = useIntl();

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
    Viewpoint: {
      defaultMessage: 'Viewpoint',
      description: 'Expandable Section title',
    },
  });

  log?.verbose('render inspect panel with selected scene node ', selectedSceneNodeRef, selectedSceneNode);

  const applySnapToFloorConstraint = useSnapObjectToFloor((position, sceneNode) => {
    updateSceneNodeInternal(sceneNode.ref, { transform: { position } }, true);
  }, selectedSceneNode);

  const isModelComponent = useMemo(() => {
    return selectedSceneNode?.components.some((component) => component.type === KnownComponentType.ModelRef) === true;
  }, [selectedSceneNode]);

  const isCameraComponent = useMemo(
    () => !!findComponentByType(selectedSceneNode, KnownComponentType.Camera),
    [selectedSceneNode],
  );

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
    return (
      <ExpandableInfoSection
        withoutSpaceBetween
        key={component.type + '_' + index}
        title={intl.formatMessage(i18nKnownComponentTypesStrings[component.type]) || component.type}
      >
        <ComponentEditor node={selectedSceneNode} component={component} />
      </ExpandableInfoSection>
    );
  });

  return (
    <LogProvider namespace={'SceneNodeInspectorPanel'}>
      <div style={{ overflow: 'auto' }}>
        <DebugInfoPanel />
        <ExpandableInfoSection
          title={intl.formatMessage({ defaultMessage: 'Properties', description: 'Section title' })}
          defaultExpanded
        >
          <FormField label={intl.formatMessage({ defaultMessage: 'Name', description: 'Form field label' })}>
            <Input value={selectedSceneNode.name} onChange={(e) => handleInputChanges({ name: e.detail.value })} />
          </FormField>
        </ExpandableInfoSection>
        {!isEnvironmentNode(selectedSceneNode) && (
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
              readonly={readonly}
              onChange={debounce((items) => {
                handleInputChanges({ transform: { rotation: items } });
                applySnapToFloorConstraint();
              }, 100)}
            />
            {!isCameraComponent && (
              <Matrix3XInputGrid
                name={intl.formatMessage({ defaultMessage: 'Scale', description: 'Input Grid title name' })}
                labels={['X', 'Y', 'Z']}
                disabled={[false, isLinearPlaneMotionIndicator(selectedSceneNode), false]}
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
