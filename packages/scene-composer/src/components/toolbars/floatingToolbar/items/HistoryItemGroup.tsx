import React, { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { useStore } from '../../../../store';
import { UndoStoreState } from '../../../../store/middlewares';
import { ToolbarItem } from '../../common/ToolbarItem';
import { ToolbarItemGroup } from '../../common/styledComponents';

export function HistoryItemGroup() {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const [redo, undo] = useStore(sceneComposerId)((state) => [state.redo, state.undo]);
  const undoStore = useStore(sceneComposerId)((state) => state.undoStore);
  const [undoState, setUndoSate] = useState<UndoStoreState>();
  const isRedoEnabled = (undoState?.futureStates && undoState.futureStates.length > 0) || false;
  const isUndoEnabled = (undoState?.prevStates && undoState.prevStates.length > 0) || false;
  const intl = useIntl();

  useEffect(() => {
    return undoStore?.subscribe((state) => setUndoSate(state));
  }, [undoStore]);

  return (
    <ToolbarItemGroup>
      <ToolbarItem
        items={{
          label: intl.formatMessage({ defaultMessage: 'Undo', description: 'Menu Item label' }),
          icon: { name: 'undo' },
          uuid: 'undo',
        }}
        type='button'
        isDisabled={!isUndoEnabled}
        onClick={() => undo && undo()}
      />
      <ToolbarItem
        items={{
          label: intl.formatMessage({ defaultMessage: 'Redo', description: 'Menu Item label' }),
          icon: { isMirrored: true, name: 'undo' },
          uuid: 'redo',
        }}
        type='button'
        isDisabled={!isRedoEnabled}
        onClick={() => redo && redo()}
      />
    </ToolbarItemGroup>
  );
}
