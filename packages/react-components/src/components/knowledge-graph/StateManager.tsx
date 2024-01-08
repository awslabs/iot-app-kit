import React, { ReactNode, createContext, useContext, useState } from 'react';
import { ExecuteQueryCommandOutput } from '@aws-sdk/client-iottwinmaker';
export interface KnowledgeGraphContext {
  selectedGraphNodeEntityId?: string | null;
  setSelectedGraphNodeEntityId: (entityId?: string | null) => void;
  queryResult?: ExecuteQueryCommandOutput | null;
  setQueryResult: (result: ExecuteQueryCommandOutput | null) => void;
  clearGraphResults: (clear: boolean) => void;
}
export interface StateManagerProps {
  children: ReactNode;
}

export const context = createContext<KnowledgeGraphContext>(
  {} as KnowledgeGraphContext
);
export function useKnowledgeGraphState() {
  return useContext(context);
}
const StateManager: React.FC<StateManagerProps> = ({ children }) => {
  const [selectedGraphNodeEntityId, setSelectedGraphNodeEntityId] = useState<
    string | null
  >();
  const [queryResult, setQueryResult] =
    useState<ExecuteQueryCommandOutput | null>();
  const clearGraphResults = (clear: boolean) => {
    if (clear) {
      setQueryResult(null);
      setSelectedGraphNodeEntityId(null);
    }
  };
  return (
    <context.Provider
      value={{
        selectedGraphNodeEntityId,
        setSelectedGraphNodeEntityId,
        queryResult,
        setQueryResult,
        clearGraphResults,
      }}
    >
      {children}
    </context.Provider>
  );
};
export default StateManager;
