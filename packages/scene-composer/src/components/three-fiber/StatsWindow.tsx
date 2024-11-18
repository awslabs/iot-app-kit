import { addAfterEffect, addEffect } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useState } from 'react';
import StatsImpl from 'stats.js';
import styled from 'styled-components';

type Props = {
  showPanel?: number;
  className?: string;
  parent?: React.RefObject<HTMLElement>;
};

/**
 * A simple StatsWindow based on ThreeJS's example stats window
 * The below implementation is borrowed from drei's Stats implementation.
 *
 * The implementation modifies the open source version to be compatible with
 * styled-component for styling.
 *
 * @see https://github.com/mrdoob/stats.js
 * @see https://github.com/pmndrs/drei/blob/master/src/core/Stats.tsx
 */
function Stats({ showPanel = 0, className, parent }: Props): null {
  const [stats, setStats] = useState<StatsImpl>();
  useLayoutEffect(() => {
    const value = new StatsImpl();
    setStats(value);
  }, []);
  useEffect(() => {
    if (stats) {
      const node = (parent && parent.current) || document.body;
      stats.showPanel(showPanel);
      node?.appendChild(stats.dom);
      if (className) {
        stats.dom.style = undefined;
        className.split(' ').forEach((c) => {
          stats.dom.classList.add(c);
        });
      }
      const begin = addEffect(() => stats.begin());
      const end = addAfterEffect(() => stats.end());
      return () => {
        node?.removeChild(stats.dom);
        begin();
        end();
      };
    }
  }, [parent, stats, className, showPanel]);
  return null;
}

export const StatsWindow = styled(Stats)`
  position: absolute;
  right: 0;
  top: 0;
`;
