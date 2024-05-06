import React, { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { accessStore } from '../../../../store';
import { UndoStoreState } from '../../../../store/middlewares';
import { ToolbarItem } from '../../common/ToolbarItem';
import { ToolbarItemGroup } from '../../common/styledComponents';
import useDynamicScene from '../../../../hooks/useDynamicScene';
import { ToolbarOrientation } from '../../common/types';

interface HistoryItemGroupProps {
  toolbarOrientation: ToolbarOrientation;
}

export function HistoryItemGroup({ toolbarOrientation }: HistoryItemGroupProps) {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const [redo, undo] = accessStore(sceneComposerId)((state) => [state.redo, state.undo]);
  const undoStore = accessStore(sceneComposerId)((state) => state.undoStore);
  const [undoState, setUndoSate] = useState<UndoStoreState | undefined>(undoStore?.getState());
  const dynamicSceneEnabled = useDynamicScene();

  // Temporarily disable undo/redo when dynamic scene is enabled
  const isRedoEnabled = undoState?.futureStates && undoState.futureStates.length > 0 && !dynamicSceneEnabled;
  const isUndoEnabled = undoState?.prevStates && undoState.prevStates.length > 0 && !dynamicSceneEnabled;
  const intl = useIntl();

  useEffect(() => {
    return undoStore?.subscribe((state) => setUndoSate(state));
  }, [undoStore]);

  return (
    <ToolbarItemGroup isVertical={toolbarOrientation === ToolbarOrientation.Vertical}>
      <ToolbarItem
        items={[
          {
            label: intl.formatMessage({ defaultMessage: 'Undo', description: 'Menu Item label' }),
            icon: { name: 'undo' },
            uuid: 'undo',
            isDisabled: !isUndoEnabled,
          },
        ]}
        type='button'
        onSelect={() => undo && undo()}
      />
      <ToolbarItem
        items={[
          {
            label: intl.formatMessage({ defaultMessage: 'Redo', description: 'Menu Item label' }),
            icon: { isMirrored: true, name: 'undo' },
            uuid: 'redo',
            isDisabled: !isRedoEnabled,
          },
        ]}
        type='button'
        onSelect={() => redo && redo()}
      />
    </ToolbarItemGroup>
  );
}
