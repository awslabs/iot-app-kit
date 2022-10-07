import React, { useContext, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { DeleteSvg, RotateIconSvg, ScaleIconSvg, TranslateIconSvg } from '../../../../assets/svgs';
import { COMPOSER_FEATURES, KnownComponentType, TransformControlMode } from '../../../../interfaces';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { useEditorState, useSceneDocument } from '../../../../store';
import { ToolbarItem } from '../../common/ToolbarItem';
import { ToolbarItemGroup } from '../../common/styledComponents';
import { ToolbarItemOptions } from '../../common/types';
import { getGlobalSettings } from '../../../../common/GlobalSettings';

enum TransformTypes {
  Translate = 'transform-translate',
  Rotate = 'transform-rotate',
  Scale = 'transform-scale',
}

const labelStrings = defineMessages({
  [TransformTypes.Translate]: { defaultMessage: 'Translate', description: 'Menu label' },
  [TransformTypes.Rotate]: { defaultMessage: 'Rotate', description: 'Menu label' },
  [TransformTypes.Scale]: { defaultMessage: 'Translate', description: 'Menu label' },
});

const textStrings = defineMessages({
  [TransformTypes.Translate]: { defaultMessage: 'Translate object', description: 'Menu Item' },
  [TransformTypes.Rotate]: { defaultMessage: 'Rotate object', description: 'Menu Item' },
  [TransformTypes.Scale]: { defaultMessage: 'Scale object', description: 'Menu Item' },
});

export function ObjectItemGroup() {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const intl = useIntl();
  const { selectedSceneNodeRef, transformControlMode, setTransformControlMode } = useEditorState(sceneComposerId);
  const { getSceneNodeByRef, removeSceneNode } = useSceneDocument(sceneComposerId);
  const { formatMessage } = useIntl();

  const tagResizeEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.TagResize];

  const isTagComponent = useMemo(() => {
    const selectedSceneNode = getSceneNodeByRef(selectedSceneNodeRef);
    return selectedSceneNode?.components.some((component) => component.type === KnownComponentType.Tag) === true;
  }, [selectedSceneNodeRef]);

  const transformSelectorItems = [
    {
      icon: { scale: 1.06, svg: TranslateIconSvg },
      uuid: TransformTypes.Translate,
      mode: 'translate',
    },
    {
      icon: { scale: 1.06, svg: RotateIconSvg },
      uuid: TransformTypes.Rotate,
      mode: 'rotate',
    },
    {
      icon: { scale: 1.06, svg: ScaleIconSvg },
      uuid: TransformTypes.Scale,
      mode: 'scale',
      isDisabled: isTagComponent && !tagResizeEnabled,
    },
  ].map(
    (item) =>
      ({
        ...item,
        label: labelStrings[item.uuid] ? formatMessage(labelStrings[item.uuid]) : undefined, // If there's a label string, show label
        text: textStrings[item.uuid] ? formatMessage(textStrings[item.uuid]) : undefined, // if there's a text string, show text
      } as ToolbarItemOptions & { mode: TransformControlMode }),
  );

  const initialSelectedItem = useMemo(() => {
    return transformSelectorItems.find((item) => item.mode === transformControlMode) ?? transformSelectorItems[0];
  }, [transformSelectorItems, transformControlMode, isTagComponent]);

  const isDeleteDisabled = selectedSceneNodeRef === undefined;

  const translatedItems = useMemo(() => {
    return transformSelectorItems;
  }, [intl, isTagComponent]);

  return (
    <ToolbarItemGroup>
      <ToolbarItem
        items={{
          label: intl.formatMessage({ defaultMessage: 'Delete', description: 'Toolbar label' }),
          icon: { svg: DeleteSvg },
          uuid: 'delete',
        }}
        type='button'
        isDisabled={isDeleteDisabled}
        onClick={() => {
          if (removeSceneNode && selectedSceneNodeRef) {
            removeSceneNode(selectedSceneNodeRef);
          }
        }}
      />
      <ToolbarItem
        items={translatedItems}
        type='mode-select'
        initialSelectedItem={initialSelectedItem}
        onClick={(selectedItem) => setTransformControlMode(selectedItem.mode)}
      />
    </ToolbarItemGroup>
  );
}
