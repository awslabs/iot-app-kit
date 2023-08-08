import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormField, Button, SpaceBetween, Autosuggest } from '@awsui/components-react';
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

  const [panelnumber, setPanelNumber] = useState(0);
  const sceneComposerId = useSceneComposerId();
  const { getObject3DBySceneNodeRef } = useEditorState(sceneComposerId);
  const object = getObject3DBySceneNodeRef(node.ref);
  //Scene is the name of the object3d of the model as given by the gltfLoader
  const animationList = object?.getObjectByName(animationObjectKey);
  const [selectedAnimations, setSelectedAnimations] = useState<string[] | undefined>();

  const animationOptions = useMemo(
    () =>
      animationList?.animations.map((animation) => ({
        value: animation.name,
      })),
    [animationList],
  );

  const updateAnimations = useCallback(
    (animation, i) => {
      if (selectedAnimations) {
        const currentAnimations = [...selectedAnimations];
        currentAnimations[i] = animation;
        setSelectedAnimations(currentAnimations);
      }
    },
    [selectedAnimations],
  );

  const removeAnimation = useCallback(
    (i) => {
      if (selectedAnimations) {
        const currentAnimations = [...selectedAnimations];
        currentAnimations.splice(i, 1);
        setSelectedAnimations(currentAnimations);
      }
    },
    [selectedAnimations],
  );
  useEffect(() => {
    const currentAnimations: string[] = [...animationComponent.currentAnimations] || [];
    if (animationComponent.selector) {
      if (animationComponent.selector > panelnumber) {
        for (let i = panelnumber; i < animationComponent.selector; i++) {
          currentAnimations.push('');
          setPanelNumber(panelnumber + 1);
        }
      }
    }
    setSelectedAnimations(currentAnimations);
  }, [node.ref, animationComponent.selector]);

  useEffect(() => {
    if (selectedAnimations) {
      onUpdate(selectedAnimations, node.ref, animationComponent);
    }
  }, [selectedAnimations]);

  return (
    <SpaceBetween size='xs'>
      {selectedAnimations?.map((animation, i) => (
        <FormField label={formatMessage({ defaultMessage: 'Choose Animations', description: 'FormField label' })}>
          <Button variant='link' data-testid={'removeButton' + i} onClick={() => removeAnimation(i)}>
            {formatMessage({
              defaultMessage: 'remove',
              description: 'label for the remove animation button',
            })}
          </Button>
          <Autosuggest
            key={i}
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
