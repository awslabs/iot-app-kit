import Box, { type BoxProps } from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import { type IconProps } from '@cloudscape-design/components/icon';
import {
  colorBackgroundLayoutMain,
  colorBackgroundSegmentActive,
  colorBorderDividerDefault,
  spaceContainerHorizontal,
  spaceStaticL,
  spaceStaticXs,
  spaceStaticXxxs,
} from '@cloudscape-design/design-tokens';
import { Tooltip } from '@iot-app-kit/react-components';
import { type ReactNode } from 'react';
import { DEFAULT_COLLAPSED_SIDE_PANE_WIDTH } from '../resizablePanes/constants';
import './index.css';

export interface CollapsiblePanelProps {
  isPanelCollapsed: boolean;
  panelWidth: number;
  onCollapsedPanelClick: VoidFunction;
  panelContent: ReactNode;
  icon: ReactNode;
  iconBackground?: string;
  side: 'right' | 'left';
  headerText: string;
  hideHeaderWhenExpanded?: boolean;
}

export function CollapsiblePanel(props: CollapsiblePanelProps) {
  // Used to set the borderRight or borderLeft prop of the pane
  const borderSide = props.side === 'right' ? 'Left' : 'Right';

  // Used to set the side of the icon in the top level box
  const iconSide = borderSide.toLowerCase() as BoxProps.Float;

  // Used to set the iconName of the collapsible button
  const iconName = `angle-${props.side}` as IconProps.Name;

  const Divider = () => (
    <div
      className='collapsible-panel-vertical-divider'
      style={{ backgroundColor: colorBorderDividerDefault }}
    />
  );

  const expandedPanel = (
    <div className='collapsible-panel'>
      {props.hideHeaderWhenExpanded ? null : (
        <div
          className='collapsible-panel-header-container'
          style={{ borderColor: colorBorderDividerDefault }}
        >
          <Box>
            <Box
              float={iconSide}
              padding={{ [iconSide]: 'xs', vertical: 'xs' }}
            >
              <Button
                iconName={iconName}
                variant='icon'
                onClick={props.onCollapsedPanelClick}
                data-testid={`expanded-${props.side}-panel-button`}
                ariaLabel={`Collapse panel ${props.side}`}
              />
            </Box>
            <Box
              float={iconSide}
              padding={{ [iconSide]: 'xs', vertical: 'xs' }}
            >
              <Divider />
            </Box>
            <Box float={props.side}>
              <Box variant='h4' padding='m'>
                {props.headerText}
              </Box>
            </Box>
          </Box>
        </div>
      )}
      <div
        className='collapsible-panel-content'
        style={
          props.hideHeaderWhenExpanded
            ? { overflowY: 'hidden', padding: spaceStaticXs }
            : { paddingBottom: spaceStaticL }
        }
      >
        {props.panelContent}
      </div>
    </div>
  );

  const collapsedPanel = (
    <Tooltip
      content={props.headerText}
      position={borderSide === 'Left' ? 'left' : 'right'}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        style={{
          backgroundColor: props.iconBackground
            ? props.iconBackground
            : colorBackgroundSegmentActive,
          margin: spaceContainerHorizontal,
        }}
        className='side_panels_collapsed_style'
        onClick={props.onCollapsedPanelClick}
        data-testid={`collapsed-${props.side}-panel-icon`}
      >
        {props.icon}
      </div>
    </Tooltip>
  );

  const panel = props.isPanelCollapsed ? collapsedPanel : expandedPanel;
  const styles =
    props.panelContent === null
      ? {
          width: '0px',
        }
      : {
          minHeight: '100%',
          width: props.isPanelCollapsed
            ? `${DEFAULT_COLLAPSED_SIDE_PANE_WIDTH}px`
            : `${props.panelWidth}px`,
          ...(props.isPanelCollapsed && {
            [`border${borderSide}`]: `${spaceStaticXxxs} solid ${colorBorderDividerDefault}`,
          }),
          backgroundColor: colorBackgroundLayoutMain,
        };

  return (
    <div
      className={`collapsible-panel collapsible-panel-${props.side}`}
      style={styles}
    >
      {props.panelContent === null ? null : panel}
    </div>
  );
}
