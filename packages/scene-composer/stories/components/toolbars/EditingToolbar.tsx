import { forceReRender } from '@storybook/react';
import React, { FC } from 'react';
import { useToolbarActions } from 'storybook-addon-toolbar-actions/dist';

import { ISceneDocumentSnapshot, SceneComposerApi } from '../../../src';

interface EditingToolbarProps {
  sceneComposerApi: SceneComposerApi;
  getScene(): ISceneDocumentSnapshot | undefined;
}

const EditingToolbar: FC<EditingToolbarProps> = ({ getScene, sceneComposerApi }) => {
  useToolbarActions('save', <div>Save Scene</div>, {
    onClick: () => {
      const scene = getScene();
      if (scene) {
        const data = scene.serialize('1.0', null, '\t');
        const file = new Blob([data], { type: 'application/json' });
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = 'scene.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }
    },
  });

  return null;
};

export default EditingToolbar;
