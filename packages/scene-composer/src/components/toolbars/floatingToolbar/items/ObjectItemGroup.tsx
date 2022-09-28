import React, { useContext, useMemo } from 'react';
import { useIntl, IntlShape } from 'react-intl';

import { DeleteSvg, RotateIconSvg, ScaleIconSvg, TranslateIconSvg } from '../../../../assets/svgs';
import { KnownComponentType, TransformControlMode } from '../../../../interfaces';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { useEditorState, useSceneDocument } from '../../../../store';
import { ToolbarItem } from '../../common/ToolbarItem';
import { ToolbarItemGroup } from '../../common/styledComponents';
import { ToolbarItemOptions } from '../../common/types';

const transformSelectorItems = (intl: IntlShape): (ToolbarItemOptions & { mode: TransformControlMode })[] => [
  {
    icon: { scale: 1.06, svg: TranslateIconSvg },
    label: intl.formatMessage({ defaultMessage: 'Translate', description: 'Menu label' }),
    mode: 'translate',
    text: intl.formatMessage({ defaultMessage: 'Translate object', description: 'Menu Item' }),
    uuid: 'transform-translate',
  },
  {
    icon: { scale: 1.06, svg: RotateIconSvg },
    label: intl.formatMessage({ defaultMessage: 'Rotate', description: 'Menu label' }),
    mode: 'rotate',
    text: intl.formatMessage({ defaultMessage: 'Rotate object', description: 'Menu Item' }),
    uuid: 'transform-rotate',
  },
  {
    icon: { scale: 1.06, svg: ScaleIconSvg },
    label: intl.formatMessage({ defaultMessage: 'Scale', description: 'Menu label' }),
    mode: 'scale',
    text: intl.formatMessage({ defaultMessage: 'Scale object', description: 'Menu Item' }),
    uuid: 'transform-scale',
  },
];

export function ObjectItemGroup() {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const intl = useIntl();
  const { selectedSceneNodeRef, transformControlMode, setTransformControlMode } = useEditorState(sceneComposerId);
  const { getSceneNodeByRef, removeSceneNode } = useSceneDocument(sceneComposerId);

  const isTagComponent = useMemo(() => {
    const selectedSceneNode = getSceneNodeByRef(selectedSceneNodeRef);
    return selectedSceneNode?.components.some((component) => component.type === KnownComponentType.Tag) === true;
  }, [selectedSceneNodeRef]);

  const initialSelectedItem = useMemo(() => {
    return (
      transformSelectorItems(intl).find((item) => item.mode === transformControlMode) ?? transformSelectorItems(intl)[0]
    );
  }, [transformSelectorItems(intl), transformControlMode, isTagComponent]);

  const isDeleteDisabled = selectedSceneNodeRef === undefined;

  const translatedItems = useMemo(() => {
    return transformSelectorItems(intl);
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
