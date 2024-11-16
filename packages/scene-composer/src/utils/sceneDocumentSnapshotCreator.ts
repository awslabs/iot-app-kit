import { type ISceneDocumentSnapshot } from '../interfaces';
import { type ISceneDocumentInternal } from '../store/internalInterfaces';
import { type RootState } from '../store/Store';
import serializationHelpers from '../store/helpers/serializationHelpers';

/**
 * A SceneDocumentSnapshot should be immutable when the scene state changes.
 * Currently this is achieved by the fact that all state objects are immutable,
 * so that we can simply store the pointer to those objects.
 */
class SceneDocumentSnapshotImpl implements ISceneDocumentSnapshot {
  private readonly document: ISceneDocumentInternal;

  constructor(state: Pick<RootState, 'document'>) {
    this.document = state.document;
  }

  serialize(specVersion: string, ...stringifyArgs): string {
    return serializationHelpers.document.serialize(this.document, specVersion, ...stringifyArgs);
  }
}

export default {
  create(state: Pick<RootState, 'document'>): ISceneDocumentSnapshot {
    return new SceneDocumentSnapshotImpl(state);
  },
};
