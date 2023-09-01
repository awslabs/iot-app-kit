import React from 'react';

import './index.css';
import { colorBackgroundButtonPrimaryDefault, spaceContainerHorizontal } from '@cloudscape-design/design-tokens';

export function CollapsiblePanel(props: { icon: string; dataCy: string }) {
  return (
    <div
      data-testid={props.dataCy}
      style={{
        backgroundColor: colorBackgroundButtonPrimaryDefault,
        margin: spaceContainerHorizontal,
      }}
      className='side_panels_collapsed_style'
    >
      <img src={props.icon} alt={props.icon} />
    </div>
  );
}
