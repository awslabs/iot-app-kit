import React, { useContext } from 'react';
import { useIntl } from 'react-intl';

import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { useEditorState } from '../../../../store';
import { ToolbarItem } from '../../common/ToolbarItem';

export function CancelMenuItem() {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { setAddingWidget } = useEditorState(sceneComposerId);
  const intl = useIntl();

  return (
    <ToolbarItem
      items={{
        label: intl.formatMessage({ defaultMessage: 'Cancel', description: 'Menu Item label' }),
        icon: { name: 'close' },
        uuid: 'cancel',
      }}
      type='button'
      onClick={() => setAddingWidget(undefined)}
    />
  );
}
