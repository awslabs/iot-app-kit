import { ISceneNodeInternal } from "@iot-app-kit/scene-composer/dist/src/store";
import React, { createContext, FC, ReactNode, useContext, useState } from "react";

interface SceneNode {
  node: ISceneNodeInternal,
  entityId?: string,
  targetName?: string
};

interface IDashboardManagerContext {
  selectedNode?: SceneNode,
  setSelectedNode: (node: SceneNode | undefined) => void
}

interface DashboardManagerProps {
  children: ReactNode;
}

const DashboardManagerContext = createContext<IDashboardManagerContext>({
  setSelectedNode: () => {},
});



export const useDashboardContext = () => {
  return useContext(DashboardManagerContext);
}

const DashboardManager: FC<DashboardManagerProps> = ({ children }) => {
  const [selectedNode, setSelectedNode] = useState<SceneNode | undefined>();

  return (
    <DashboardManagerContext.Provider value={{
      selectedNode,
      setSelectedNode
    }}>
      {children}
    </DashboardManagerContext.Provider>
  )
}

export default DashboardManager;
