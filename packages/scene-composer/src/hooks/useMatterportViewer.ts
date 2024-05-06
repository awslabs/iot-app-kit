import { isEmpty } from 'lodash';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { KnownSceneProperty } from '../interfaces';
import { accessStore, useViewOptionState } from '../store';
import { OPTIONS_PLACEHOLDER_VALUE } from '../common/internalConstants';

const useMatterportViewer = (): { enableMatterportViewer: boolean } => {
  const sceneComposerId = useSceneComposerId();
  const { connectionNameForMatterportViewer } = useViewOptionState(sceneComposerId);
  const matterportModelId = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty(KnownSceneProperty.MatterportModelId),
  );
  const enableMatterportViewer =
    !isEmpty(matterportModelId) &&
    !isEmpty(connectionNameForMatterportViewer) &&
    connectionNameForMatterportViewer !== OPTIONS_PLACEHOLDER_VALUE;

  return { enableMatterportViewer };
};

export default useMatterportViewer;
