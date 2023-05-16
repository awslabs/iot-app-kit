import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AssetExplorer } from "./asset-explorer";
import { AssetModelExplorer } from "./asset-model-explorer";
import { AssetPropertyExplorer } from "./asset-property-explorer";
import { TimeSeriesExplorer } from "./time-series-explorer";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/*
      <AssetExplorer />
      <AssetModelExplorer />
      <AssetPropertyExplorer assetId="d909f152-502e-4b65-aac0-9b8a5003b696" />
        */}
      <TimeSeriesExplorer />
    </QueryClientProvider>
  );
}

export default App;
