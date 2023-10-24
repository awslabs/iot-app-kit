import { useThree } from "@react-three/fiber";
import { sceneComposerIdContext } from "../common/sceneComposerIdContext";
import { useContext } from "react";
import { useStore } from "../store";

export const CanvasTestHook = () => {
  const { scene } = useThree();
  const sceneComposerId = useContext(sceneComposerIdContext);

// PalletJack
  const getObjectByName = (name: string) => {
    return scene.getObjectByName(name)
  }
  const lookAtRef = (ref: string) => {
      const setCameraTarget = useStore(sceneComposerId).getState().setCameraTarget;
      setCameraTarget(ref, 'teleport');
  };

  window['TMGetObject'] = (typeof window === 'undefined') ? undefined : getObjectByName;
  window['TMlookAt'] = (typeof window === 'undefined') ? undefined : lookAtRef;
  window['TwinMakerScene'] = (typeof window === 'undefined') ? undefined : scene;

  return null;
}

/*

const ref = window[0].TMGetObject("PalletJack").userData.componentRef

window[0].TMlookAt(ref)

*/