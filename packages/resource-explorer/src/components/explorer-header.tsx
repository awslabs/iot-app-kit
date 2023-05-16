import React from "react";
import Header from "@cloudscape-design/components/header";

import type { PropsWithChildren } from "react";

interface ExplorerHeaderProps extends PropsWithChildren {
  selectedResourceCount: number;
  totalResourceCount: number;
}

export function ExplorerHeader({
  selectedResourceCount,
  totalResourceCount,
  children,
}: ExplorerHeaderProps) {
  return (
    <Header
      counter={
        selectedResourceCount > 0
          ? `${selectedResourceCount}/${totalResourceCount}`
          : `${totalResourceCount}`
      }
    >
      {children}
    </Header>
  );
}
