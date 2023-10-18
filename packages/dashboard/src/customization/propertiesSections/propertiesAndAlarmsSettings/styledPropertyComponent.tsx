import React, { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
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
import { spaceStaticXxs } from '@cloudscape-design/design-tokens';
import { ClickDetail, NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';

import ColorPicker from '../shared/colorPicker';
import { LineStyles, StyledAssetPropertyQuery, YAxisOptions } from '~/customization/widgets/types';
import { getPropertyDisplay } from './getPropertyDisplay';
import type { AssetSummary } from '~/hooks/useAssetDescriptionQueries';
import {
  StatusEyeHidden,
  StatusEyeVisible,
} from '~/customization/propertiesSections/propertiesAndAlarmsSettings/icons';
import Tooltip from '~/components/tooltip/tooltip';
import { LineStyleDropdown } from '../components/lineStyleDropdown';
import { LineThicknessDropdown } from '../components/lineThicknessDropdown';

import './propertyComponent.css';

const LineStylePropertyConfig = ({
  resetStyles,
  property,
  onUpdate,
}: {
  resetStyles: (reset: object) => void;
  property: StyledAssetPropertyQuery;
  onUpdate: (newStyles: object) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [useGlobalStyle, setUseGlobalStyle] = useState<boolean>(!property.line?.style); //make useGlobalStyle true if no line style
  const [lineStyle, setLineStyle] = useState<LineStyles['style']>(property.line?.style ?? 'solid');

  const onToggleUseGlobalStyles = (isChecked: boolean) => {
    setUseGlobalStyle(isChecked);
    setLineStyle('solid');
    if (isChecked) {
      resetStyles({ line: { style: undefined } });
    } else {
      onUpdate({ line: { style: lineStyle } });
    }
  };

  const updateLineStyle = (style: LineStyles['style']) => {
    setLineStyle(style);
    onUpdate({ line: { style } });
  };

  return (
    <ExpandableSection
      expanded={expanded}
      onChange={({ detail }) => setExpanded(detail.expanded)}
      headerText='Line style'
    >
      <SpaceBetween size='m'>
        <Checkbox onChange={({ detail }) => onToggleUseGlobalStyles(detail.checked)} checked={useGlobalStyle}>
          Use default style
        </Checkbox>
        <LineStyleDropdown
          disabled={useGlobalStyle}
          lineStyle={lineStyle}
          updatelineStyle={(style) => updateLineStyle(style as LineStyles['style'])}
        />
        <LineThicknessDropdown disabled={useGlobalStyle} /> {/* TODO */}
      </SpaceBetween>
    </ExpandableSection>
  );
};

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
                  <LineStylePropertyConfig resetStyles={resetStyles} onUpdate={updateStyle} property={property} />
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
