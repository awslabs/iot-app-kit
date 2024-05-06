import React, { useCallback, useContext } from 'react';
import { useIntl } from 'react-intl';

import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { accessStore } from '../../store';
import { getLocalizedComponentType } from '../../common/componentTypeStings';

import DeleteConfirmationModal from './DeleteConfirmationModal';

const DeleteComponentModal: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const intl = useIntl();
  const getSceneNodeByRef = accessStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const setDeleteConfirmationModalVisible = accessStore(sceneComposerId)(
    (state) => state.setDeleteConfirmationModalVisible,
  );
  const deleteConfirmationModalParams = accessStore(sceneComposerId)((state) => state.deleteConfirmationModalParams);
  const removeComponent = accessStore(sceneComposerId)((state) => state.removeComponent);

  const nodeRef = deleteConfirmationModalParams?.nodeRef;
  const node = getSceneNodeByRef(nodeRef);
  const nodeName = node?.name ?? '';
  const component = node?.components.find((c) => c.ref === deleteConfirmationModalParams?.componentRef);
  const componentName = (component && getLocalizedComponentType(component, intl)) ?? '';

  const title = intl.formatMessage(
    {
      defaultMessage: "Delete {nodeName}'s {componentName} component",
      description: 'Delete component confirmation header text',
    },
    { nodeName, componentName },
  );

  const onDelete = useCallback(() => {
    if (nodeRef && component?.ref) {
      removeComponent(nodeRef, component.ref);
    }
    setDeleteConfirmationModalVisible(false);
  }, [nodeRef, removeComponent, component?.ref]);

  const contentMessage = useCallback(() => {
    return intl.formatMessage(
      {
        defaultMessage:
          "Delete {nodeName}'s {componentName} component? While this action may be undone, it may not return to its original state.",
        description: 'Delete action confirmation message',
      },
      { componentName, nodeName },
    );
  }, [componentName, intl.formatMessage, nodeName]);

  return (
    <DeleteConfirmationModal
      title={title}
      contentBody={contentMessage()}
      warningMessage={intl.formatMessage(
        {
          defaultMessage:
            'If you attempt to undo this action after {componentName} is deleted, it may have issues such as some properties still being deleted or disconnection from data.',
          description: 'Delete action confirmation warning message',
        },
        { componentName },
      )}
      deleteButtonDisabled={!nodeRef || !component?.ref}
      onDelete={onDelete}
    />
  );
};

DeleteComponentModal.displayName = 'DeleteComponentModal';

export default DeleteComponentModal;
