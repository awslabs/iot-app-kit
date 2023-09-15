import React, { ReactNode } from 'react';

import './index.css';
import {
  colorBackgroundButtonPrimaryDefault,
  colorBorderDividerDefault,
  spaceContainerHorizontal,
  spaceStaticXxxs,
} from '@cloudscape-design/design-tokens';
import Box, { BoxProps } from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import { IconProps } from '@cloudscape-design/components/icon';
import { DEFAULT_COLLAPSED_SIDE_PANE_WIDTH } from '../resizablePanes/constants';

type CollapsiblePanelProps = {
  isPanelCollapsed: boolean;
  panelWidth: number;
  onCollapsedPanelClick: () => void;
  panelContent: ReactNode;
  icon: string;
  side: 'right' | 'left';
  headerText: string;
};

export function CollapsiblePanel(props: CollapsiblePanelProps) {
  // Used to set the borderRight or borderLeft prop of the pane
  const borderSide = props.side === 'right' ? 'Left' : 'Right';

  // Used to set the side of the icon in the top level box
  const iconSide = borderSide.toLowerCase() as BoxProps.Float;

  // Used to set the iconName of the collapsible button
  const iconName = `angle-${props.side}` as IconProps.Name;

  const Divider = () => (
    <div className='collapsible-panel-vertical-divider' style={{ backgroundColor: colorBorderDividerDefault }} />
  );

  const expandedPanel = (
    <div className='collapsible-panel'>
      <div className='collapsible-panel-header-container' style={{ borderColor: colorBorderDividerDefault }}>
        <Box>
          <Box float={iconSide} padding={{ [iconSide]: 'xs', vertical: 'xs' }}>
            <Button
              iconName={iconName}
              variant='icon'
              onClick={props.onCollapsedPanelClick}
              data-testid={`expanded-${props.side}-panel-button`}
            />
          </Box>
          <Box float={iconSide} padding={{ [iconSide]: 'xs', vertical: 'xs' }}>
            <Divider />
          </Box>
          <Box float={props.side}>
            <Box variant='h4' padding='m'>
              {props.headerText}
            </Box>
          </Box>
        </Box>
      </div>
      {props.panelContent}
    </div>
  );

  const collapsedPanel = (
    <div
      style={{
        backgroundColor: colorBackgroundButtonPrimaryDefault,
        margin: spaceContainerHorizontal,
      }}
      className='side_panels_collapsed_style'
    >
      <img
        src={props.icon}
        alt={props.icon}
        onClick={props.onCollapsedPanelClick}
        data-testid={`collapsed-${props.side}-panel-icon`}
      />
    </div>
  );

  return (
    <div
      className={`collapsible-panel collapsible-panel-${props.side}`}
      style={{
        width: props.isPanelCollapsed ? `${DEFAULT_COLLAPSED_SIDE_PANE_WIDTH}px` : `${props.panelWidth}px`,
        ...(props.isPanelCollapsed && {
          [`border${borderSide}`]: `${spaceStaticXxxs} solid ${colorBorderDividerDefault}`,
        }),
      }}
    >
      {props.isPanelCollapsed ? collapsedPanel : expandedPanel}
    </div>
  );
}
