import React, { useCallback, useContext } from 'react';
import { FormField, Multiselect, SpaceBetween } from '@awsui/components-react';
import { useIntl } from 'react-intl';

import { IComponentEditorProps } from '../ComponentEditor';
import { IAnimationComponentInternal, ISceneComponentInternal, useStore } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { OptionDefinition } from '@awsui/components-react/internal/components/option/interfaces';
import { getClip } from '../../three-fiber/AnimationComponent/AnimationComponent';

export type AnimationComponentEditorProps = IComponentEditorProps;

export const AnimationComponentEditor: React.FC<AnimationComponentEditorProps> = ({
  node,
  component,
}: AnimationComponentEditorProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const AnimationComponent = component as IAnimationComponentInternal;
  const animationList = getClip(AnimationComponent.uri);
  const intl = useIntl();

  
  var selectedOptions =  AnimationComponent.currentAnimations?.map(animation => ({ label: animation, value: animation})) as OptionDefinition[]
  const animationOptions = animationList?.map(animation => ({ label: animation.name, value: animation.name}))
    
  const onUpdateCallback = useCallback(
    (componentPartial: any, replace?: boolean) => {
      const componentPartialWithRef: ISceneComponentInternal = { ref: component.ref, ...componentPartial };
      updateComponentInternal(node.ref, componentPartialWithRef);
    },
    [node.ref, component.ref],
  );

function updateAnimations(detail){
    if(selectedOptions == undefined){
      selectedOptions = detail.selectedOptions.map(animation => ({ label: animation, value: animation})) as OptionDefinition[]
    }
    while(selectedOptions.length > 0){
        selectedOptions?.pop();
    }    
    detail.selectedOptions?.forEach((element) => {
        selectedOptions?.push(element)
    });
    
    const currentAnimations = [] as string[]
    
    selectedOptions?.forEach( (element) => {
        currentAnimations.push(element?.value as string)
    });
    
    const updatedComponent = { ...AnimationComponent, currentAnimations }
    onUpdateCallback(updatedComponent, true);
}

  return (
    <SpaceBetween size='s'>
      <FormField label={intl.formatMessage({ defaultMessage: 'Choose Animations', description: 'FormField label' })}>
      <Multiselect
      selectedOptions={selectedOptions}
      onChange={({ detail }) =>
        updateAnimations(detail)
      }
      options= {animationOptions}
      placeholder="Choose an Animation"
    />
      </FormField>
    </SpaceBetween>
  );
};
