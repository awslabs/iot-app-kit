import { Core } from 'cytoscape';
import { RefObject, useEffect } from 'react';

// Custom hook to handle cytoscape events, make sure they are cleaned up.
const useCyEvent = (evt: string, target: string, callback: cytoscape.EventHandler, cy: RefObject<Core>) => {
  useEffect(() => {
    cy.current?.on(evt, target, callback);

    return () => {
      cy.current?.off(evt, target, callback);
    };
  }, [callback]);
};

export default useCyEvent;
