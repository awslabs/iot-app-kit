import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  SpaceBetween,
  Box,
  ExpandableSection,
  Checkbox,
  Toggle,
  FormField,
  Input,
} from '@cloudscape-design/components';
import ColorPicker from '../shared/colorPicker';
import type { FC } from 'react';

import './propertyComponent.css';
import { StyledAssetPropertyQuery, YAxisOptions } from '~/customization/widgets/types';
import { getPropertyDisplay } from './getPropertyDisplay';
import type { AssetSummary } from '~/hooks/useAssetDescriptionQueries';
import {
  StatusEyeHidden,
  StatusEyeVisible,
} from '~/customization/propertiesSections/propertiesAndAlarmsSettings/icons';
import { ClickDetail, NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import Tooltip from '~/components/tooltip/tooltip';
import { spaceStaticXxs } from '@cloudscape-design/design-tokens';

const numberOrUndefined = (number: string) => {
  const parsed = Number(number);
  return isNaN(parsed) || number.length === 0 ? undefined : parsed;
};

const YAxisPropertyConfig = ({
  resetStyles,
  property,
  onUpdate,
}: {
  resetStyles: (reset: object) => void;
  property: StyledAssetPropertyQuery;
  onUpdate: (newStyles: object) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [useGlobalStyle, setUseGlobalStyle] = useState(Object.keys(property.yAxis ?? {}).length == 0);

  const onToggleUseGlobalStyles = (isChecked: boolean) => {
    setUseGlobalStyle(isChecked);
    isChecked && resetStyles({ yAxis: undefined });
  };

  const onToggleControls = (hasControls: boolean) => {
    onToggleUseGlobalStyles(false);
    onUpdate({ yAxis: { ...property.yAxis, visible: hasControls } });
  };

  const onUpdateYAxis = (newYAxis: YAxisOptions) => {
    onToggleUseGlobalStyles(false);
    onUpdate({ yAxis: newYAxis });
  };

  return (
    <ExpandableSection expanded={expanded} onChange={({ detail }) => setExpanded(detail.expanded)} headerText='Y-axis'>
      <SpaceBetween size='m'>
        <Checkbox onChange={({ detail }) => onToggleUseGlobalStyles(detail.checked)} checked={useGlobalStyle}>
          Use default style
        </Checkbox>
        <Toggle checked={!!property.yAxis?.visible} onChange={({ detail }) => onToggleControls(detail.checked)}>
          Show Y-axis controls
        </Toggle>
        <FormField description='Leave empty to auto-calculate based on all the values' label='Range'>
          <SpaceBetween size='m' direction='horizontal'>
            <SpaceBetween size='s' direction='horizontal'>
              <label htmlFor='y-axis-min'>Min</label>
              <Input
                disabled={!property.yAxis?.visible}
                placeholder='Auto'
                controlId='y-axis-min'
                value={`${property.yAxis?.yMin ?? ''}`}
                type='number'
                onChange={({ detail }) => onUpdateYAxis({ ...property.yAxis, yMin: numberOrUndefined(detail.value) })}
              />
            </SpaceBetween>
            <SpaceBetween size='s' direction='horizontal'>
              <label htmlFor='y-axis-max'>Max</label>
              <Input
                disabled={!property.yAxis?.visible}
                placeholder='Auto'
                controlId='y-axis-max'
                value={`${property.yAxis?.yMax ?? ''}`}
                type='number'
                onChange={({ detail }) => onUpdateYAxis({ ...property.yAxis, yMax: numberOrUndefined(detail.value) })}
              />
            </SpaceBetween>
          </SpaceBetween>
        </FormField>
      </SpaceBetween>
    </ExpandableSection>
  );
};

export type StyledPropertyComponentProps = {
  updateStyle: (newStyles: object) => void;
  assetSummary: AssetSummary;
  property: StyledAssetPropertyQuery;
  onHideAssetQuery: () => void;
  onDeleteAssetQuery?: () => void;
  colorable: boolean;
  isPropertyVisible: boolean;
};

export const StyledPropertyComponent: FC<StyledPropertyComponentProps> = ({
  assetSummary,
  property,
  updateStyle,
  onHideAssetQuery,
  onDeleteAssetQuery,
  colorable,
  isPropertyVisible,
}) => {
  const { display, label } = getPropertyDisplay(property.propertyId, assetSummary);
  const [onMouseOver, setOnMouseOver] = useState(false);
  const isAssetQueryVisible = !onMouseOver ? isPropertyVisible : !isPropertyVisible;
  const propertyVisibilityIcon = isAssetQueryVisible ? StatusEyeVisible : StatusEyeHidden;
  const labelRef = useRef<HTMLDivElement | null>(null);
  const [isNameTruncated, setIsNameTruncated] = useState(false);

  const onToggleAssetQuery: NonCancelableEventHandler<ClickDetail> = (e) => {
    e.stopPropagation();
    onHideAssetQuery();
  };

  const handleMouseEnter = () => {
    setOnMouseOver(true);
  };

  const handleMouseLeave = () => {
    setOnMouseOver(false);
  };

  const resetStyles = (styleToReset: object) => {
    updateStyle(styleToReset); // as we add more sections, reset style values here
  };

  useEffect(() => {
    if (labelRef.current) {
      setIsNameTruncated(labelRef.current.scrollWidth > labelRef.current.clientWidth);
    }
  }, [label]);

  const YAxisHeader = (
    <SpaceBetween size='s' direction='horizontal'>
      {colorable && display === 'property' && (
        <ColorPicker color={property.color || ''} updateColor={(newColor) => updateStyle({ color: newColor })} />
      )}
      <Tooltip content={isNameTruncated ? label : ''} position='top'>
        <div className='property-display-label' style={{ marginBlock: spaceStaticXxs }} ref={labelRef}>
          {label}
        </div>
      </Tooltip>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Tooltip content={onMouseOver && isPropertyVisible ? 'hide' : 'unhide'} position='top'>
          <Button onClick={onToggleAssetQuery} variant='icon' iconSvg={propertyVisibilityIcon} />
        </Tooltip>
      </div>

      <Button onClick={onDeleteAssetQuery} variant='icon' iconName='remove' />
    </SpaceBetween>
  );

  return (
    <div className='property-display'>
      <div className='property-display-summary'>
        <SpaceBetween size='xxxs'>
          <Box padding={{ top: 'xxs' }}>
            <SpaceBetween size='xs' direction='horizontal'>
              <ExpandableSection headerText={YAxisHeader}>
                <div style={{ padding: '0 24px', backgroundColor: '#fbfbfb' }}>
                  <YAxisPropertyConfig resetStyles={resetStyles} onUpdate={updateStyle} property={property} />
                </div>
              </ExpandableSection>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </div>
    </div>
  );
};
