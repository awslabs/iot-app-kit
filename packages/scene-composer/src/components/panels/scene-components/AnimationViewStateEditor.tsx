import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormField, Button, SpaceBetween, Autosuggest } from '@cloudscape-design/components';
import { useIntl } from 'react-intl';

import { IAnimationComponentInternal, useEditorState, ISceneNodeInternal } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { animationObjectKey } from '../../three-fiber/AnimationComponent/AnimationComponent';

export type AnimationViewStateEditorProps = {
  node: ISceneNodeInternal;
  component: IAnimationComponentInternal;
  onUpdate: (currentAnimations: string[], noderef: string, component: IAnimationComponentInternal) => void;
};
export const AnimationViewStateEditor: React.FC<AnimationViewStateEditorProps> = ({
  node,
  component: animationComponent,
  onUpdate,
}: AnimationViewStateEditorProps) => {
  const { formatMessage } = useIntl();

  const sceneComposerId = useSceneComposerId();
  const { getObject3DBySceneNodeRef } = useEditorState(sceneComposerId);
  const object = getObject3DBySceneNodeRef(node.ref);
  const animationObject3D = object?.getObjectByName(animationObjectKey);
  const [selectedAnimations, setSelectedAnimations] = useState<string[] | undefined>();
  const animationPanelList = useRef<string[]>([]); // '' on end for next animation

  const animationOptions = useMemo(
    () =>
      animationObject3D?.animations.map((animation) => ({
        value: animation.name,
      })),
    [animationObject3D],
  );

  const updateAnimations = useCallback(
    (animation: string, i: number) => {
      if (selectedAnimations) {
        const currentAnimations = [...selectedAnimations];
        currentAnimations[i] = animation;
        setSelectedAnimations(currentAnimations);
        animationPanelList.current = [...currentAnimations, ''];
      }
    },
    [selectedAnimations],
  );

  const removeAnimation = useCallback(
    (i: number) => {
      if (selectedAnimations) {
        const currentAnimations = [...selectedAnimations];
        currentAnimations.splice(i, 1);
        setSelectedAnimations(currentAnimations);
        animationPanelList.current = [...currentAnimations, ''];
      }
    },
    [selectedAnimations],
  );

  useEffect(() => {
    const currentAnimations: string[] = [...animationComponent.currentAnimations] || [];
    setSelectedAnimations(currentAnimations);
    animationPanelList.current = [...currentAnimations, ''];
  }, [node.ref]);

  useEffect(() => {
    if (selectedAnimations && selectedAnimations != animationComponent.currentAnimations) {
      onUpdate(selectedAnimations, node.ref, animationComponent);
    }
  }, [selectedAnimations]);

  return (
    <SpaceBetween size='xs'>
      {animationPanelList.current.map((animation, i) => (
        <FormField
          key={`${i}-formField`}
          label={formatMessage({ defaultMessage: 'Choose Animations', description: 'FormField label' })}
        >
          {!!animation && (
            <Button
              key={`${i}-remove`}
              variant='link'
              data-testid={'removeButton' + i}
              onClick={() => removeAnimation(i)}
            >
              {formatMessage({
                defaultMessage: 'remove',
                description: 'label for the remove animation button',
              })}
            </Button>
          )}
          <Autosuggest
            key={`${i}-suggest`}
            onChange={({ detail }) => updateAnimations(detail.value, i)}
            value={animation}
            options={animationOptions}
            ariaLabel={formatMessage({
              defaultMessage: 'Autosuggest example with suggestions',
              description: 'Specifies the animation thats being selected',
            })}
            placeholder={formatMessage({
              defaultMessage: 'Enter Value',
              description: 'Default Message for before an animation is selected',
            })}
            empty={formatMessage({
              defaultMessage: 'No matches found',
              description: 'label for when the user searches for a nonexistent animation',
            })}
            enteredTextLabel={function (): string {
              return formatMessage({
                defaultMessage: 'No matches found',
                description: 'label for when the user searches for a nonexistent animation',
              });
            }}
          />
        </FormField>
      ))}
    </SpaceBetween>
  );
};
