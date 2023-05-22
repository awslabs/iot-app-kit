import React, { ReactNode, createContext, useContext, useState } from 'react';
import { ExecuteQueryCommandOutput } from '@aws-sdk/client-iottwinmaker';
interface KnowledgeGraphContext {
  selectedGraphNodeEntityId?: string;
  setSelectedGraphNodeEntityId: (entityId?: string) => void;
  queryStatement?: string;
  setQueryStatement: (query: string) => void;
  queryResult?: ExecuteQueryCommandOutput;
  setQueryResult: (result: ExecuteQueryCommandOutput) => void;
  clearGraphResults: (clear: boolean) => void;
}
export interface StateManagerProps {
  children: ReactNode;
}

const context = createContext<KnowledgeGraphContext>({} as KnowledgeGraphContext);
export function useKnowledgeGraphState() {
  return useContext(context);
}
const StateManager: React.FC<StateManagerProps> = ({ children }) => {
  const [selectedGraphNodeEntityId, setSelectedGraphNodeEntityId] = useState<string>();
  const [queryStatement, setQueryStatement] = useState<string>();
  const [queryResult, setQueryResult] = useState<ExecuteQueryCommandOutput>();
  const clearGraphResults = (clear: boolean) => {
    if (clear) setQueryResult(undefined);
  };
  return (
    <context.Provider
      value={{
        selectedGraphNodeEntityId,
        setSelectedGraphNodeEntityId,
        queryStatement,
        setQueryStatement,
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
