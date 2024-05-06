import { isNumber } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Spinner } from '@cloudscape-design/components';

import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { useSceneDocument, accessStore } from '../../store';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { DEFAULT_PARENT_RELATIONSHIP_NAME, MAX_QUERY_HOP } from '../../common/entityModelConstants';

import DeleteConfirmationModal from './DeleteConfirmationModal';

const DeleteNodeModal: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { formatMessage } = useIntl();
  const getSceneNodeByRef = accessStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const setDeleteConfirmationModalVisible = accessStore(sceneComposerId)(
    (state) => state.setDeleteConfirmationModalVisible,
  );
  const deleteConfirmationModalParams = accessStore(sceneComposerId)((state) => state.deleteConfirmationModalParams);
  const { removeSceneNode } = useSceneDocument(sceneComposerId);

  const [childCount, setChildCount] = useState<number | undefined>();
  const [loadChildCountError, setLoadChildCountError] = useState<Error | undefined>();

  const nodeRef = deleteConfirmationModalParams?.nodeRef;
  const node = getSceneNodeByRef(nodeRef);
  const nodeName = node?.name ?? '';

  const title = formatMessage(
    { defaultMessage: 'Delete {nodeName}', description: 'Delete node confirmation header text' },
    { nodeName },
  );

  useEffect(() => {
    const executeQuery = getGlobalSettings().twinMakerSceneMetadataModule?.kgModule.executeQuery;
    if (executeQuery && nodeRef) {
      const statement = `SELECT COUNT(e) FROM EntityGraph MATCH (e)-[:${DEFAULT_PARENT_RELATIONSHIP_NAME}]->{1, ${MAX_QUERY_HOP}}(p) WHERE p.entityId = '${nodeRef}'`;

      executeQuery({ queryStatement: statement })
        .then((response) => {
          const count = response.rows?.at(0)?.rowData?.at(0);
          if (count !== undefined && isNumber(count)) {
            setChildCount(count);
          } else {
            setChildCount(-1);
          }
        })
        .catch((error) => {
          setLoadChildCountError(error);
        });
    }
  }, []);

  const onDelete = useCallback(() => {
    if (nodeRef) {
      removeSceneNode(nodeRef);
    }
    setDeleteConfirmationModalVisible(false);
  }, [nodeRef, removeSceneNode]);

  const contentMessage = useCallback(() => {
    if (childCount === undefined && loadChildCountError === undefined) {
      return <Spinner />;
    } else if (childCount !== undefined && childCount >= 0) {
      if (childCount === 0) {
        return formatMessage(
          {
            defaultMessage:
              'Delete {nodeName}? This will delete 1 entity. While this action may be undone, it may not return to its original state.',
            description: 'Delete action confirmation message',
          },
          { nodeName },
        );
      } else {
        return formatMessage(
          {
            defaultMessage:
              'Delete {nodeName}? This will delete 1 entity and its {childCount} children. While this action may be undone, it may not return to its original state.',
            description: 'Delete action confirmation message',
          },
          { childCount, nodeName },
        );
      }
    } else {
      return formatMessage(
        {
          defaultMessage:
            'Delete {nodeName}? Unable to load number of children. While this action may be undone, it may not return to its original state.',
          description: 'Delete action confirmation message',
        },
        { nodeName },
      );
    }
  }, [childCount, loadChildCountError, formatMessage, nodeName]);

  return (
    <DeleteConfirmationModal
      title={title}
      contentBody={contentMessage()}
      warningMessage={formatMessage(
        {
          defaultMessage:
            'If you attempt to undo this action after {nodeName} is deleted, it may have issues such as the children still being deleted or disconnection from data.',
          description: 'Delete action confirmation warning message',
        },
        { nodeName },
      )}
      deleteButtonDisabled={childCount === undefined && loadChildCountError === undefined}
      onDelete={onDelete}
    />
  );
};

DeleteNodeModal.displayName = 'DeleteNodeModal';

export default DeleteNodeModal;
