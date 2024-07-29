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
import {
  spaceScaledXl,
  spaceStaticXl,
  spaceStaticXxs,
} from '@cloudscape-design/design-tokens';

import ColorPicker from '../shared/colorPicker';
import {
  LineStyles,
  StyledAssetPropertyQuery,
  YAxisOptions,
} from '~/customization/widgets/types';
import { getPropertyDisplay } from './getPropertyDisplay';
import type { AssetSummary } from '~/hooks/useAssetDescriptionQueries';
import { Tooltip } from '@iot-app-kit/react-components';
import { LineTypeSection } from '../components/lineTypeDropdown';
import { LineStyleDropdown } from '../components/lineStyleDropdown';
import { LineThicknessDropdown } from '../components/lineThicknessDropdown';

import './propertyComponent.css';
import { DataStreamLabelComponent } from '../components/dataStreamLabelComponent';

const propertiesPadding = {
  paddingLeft: spaceScaledXl,
};

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
  const [useGlobalStyle, setUseGlobalStyle] = useState<boolean>(
    !property.line?.style
  ); //make useGlobalStyle true if no line style
  const [connectionStyle, setConnectionStyle] = useState<
    LineStyles['connectionStyle']
  >(property.line?.connectionStyle ?? 'linear');

  const [lineStyle, setLineStyle] = useState<LineStyles['style']>(
    connectionStyle !== 'none' ? property.line?.style ?? 'solid' : undefined
  );
  const [lineThickness, setLinethickness] = useState<string | undefined>(
    property.line?.thickness?.toString() ?? '2'
  );

  const [isPrevLineStyleNone, setIsPrevLineStyleNone] = useState(
    connectionStyle === 'none'
  );

  const getLineThicknessNumber = (thickness?: string) =>
    thickness ? parseInt(thickness) : undefined;

  const onToggleUseGlobalStyles = (isChecked: boolean) => {
    setUseGlobalStyle(isChecked);
    setConnectionStyle('linear');
    setLineStyle('solid');
    setLinethickness('2');
    if (isChecked) {
      resetStyles({
        line: {
          connectionStyle: undefined,
          style: undefined,
          thickness: undefined,
        },
      });
    } else {
      onUpdate({
        line: {
          connectionStyle: connectionStyle,
          style: lineStyle,
          thickness: getLineThicknessNumber(lineThickness),
        },
      });
    }
  };

  const updateConnectionStyle = (
    connectionStyle: LineStyles['connectionStyle']
  ) => {
    if (connectionStyle === 'none') {
      setLineStyle(undefined);
      setIsPrevLineStyleNone(true);
    }
    if (isPrevLineStyleNone && connectionStyle !== 'none') {
      setLineStyle('solid');
      setIsPrevLineStyleNone(false);
    }
    setConnectionStyle(connectionStyle);
    onUpdate({
      line: {
        connectionStyle,
        style: lineStyle,
        thickness: getLineThicknessNumber(lineThickness),
      },
    });
  };

  const updateLineStyle = (style: LineStyles['style']) => {
    setLineStyle(style);
    onUpdate({
      line: {
        connectionStyle: connectionStyle,
        style,
        thickness: getLineThicknessNumber(lineThickness),
      },
    });
  };

  const handleUpdateLineThickness = (thickness: string) => {
    setLinethickness(thickness);
    onUpdate({
      line: {
        connectionStyle: connectionStyle,
        style: lineStyle,
        thickness: getLineThicknessNumber(thickness),
      },
    });
  };

  return (
    <ExpandableSection
      expanded={expanded}
      onChange={({ detail }) => setExpanded(detail.expanded)}
      headerText='Style'
      variant='footer'
    >
      <div style={propertiesPadding}>
        <SpaceBetween size='m'>
          <Checkbox
            onChange={({ detail }) => onToggleUseGlobalStyles(detail.checked)}
            checked={useGlobalStyle}
          >
            Use default style
          </Checkbox>
          <LineTypeSection
            disabled={useGlobalStyle}
            type={connectionStyle}
            updateType={(type) =>
              updateConnectionStyle(type as LineStyles['connectionStyle'])
            }
          />
          <LineStyleDropdown
            disabled={useGlobalStyle || connectionStyle === 'none'}
            lineStyle={lineStyle}
            updatelineStyle={(style) =>
              updateLineStyle(style as LineStyles['style'])
            }
          />
          <LineThicknessDropdown
            disabled={useGlobalStyle}
            lineThickness={lineThickness}
            updateLineThickness={(thickness) =>
              handleUpdateLineThickness(thickness)
            }
          />
        </SpaceBetween>
      </div>
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
  const [useGlobalStyle, setUseGlobalStyle] = useState(
    Object.keys(property.yAxis ?? {}).length == 0
  );

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
    <ExpandableSection
      expanded={expanded}
      onChange={({ detail }) => setExpanded(detail.expanded)}
      headerText='Y-axis'
      variant='footer'
    >
      <div style={propertiesPadding}>
        <SpaceBetween size='m'>
          <Checkbox
            onChange={({ detail }) => onToggleUseGlobalStyles(detail.checked)}
            checked={useGlobalStyle}
          >
            Use default style
          </Checkbox>
          <Toggle
            checked={!!property.yAxis?.visible}
            onChange={({ detail }) => onToggleControls(detail.checked)}
          >
            Show Y-axis controls
          </Toggle>
          <FormField
            description='Leave empty to auto-calculate based on all the values'
            label='Range'
          >
            <SpaceBetween size='m' direction='horizontal'>
              <SpaceBetween size='s' direction='horizontal'>
                <label htmlFor='y-axis-min'>Min</label>
                <Input
                  disabled={!property.yAxis?.visible}
                  placeholder='Auto'
                  controlId='y-axis-min'
                  value={`${property.yAxis?.yMin ?? ''}`}
                  type='number'
                  onChange={({ detail }) =>
                    onUpdateYAxis({
                      ...property.yAxis,
                      yMin: numberOrUndefined(detail.value),
                    })
                  }
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
                  onChange={({ detail }) =>
                    onUpdateYAxis({
                      ...property.yAxis,
                      yMax: numberOrUndefined(detail.value),
                    })
                  }
                />
              </SpaceBetween>
            </SpaceBetween>
          </FormField>
        </SpaceBetween>
      </div>
    </ExpandableSection>
  );
};

export type StyledPropertyComponentProps = {
  index: number;
  updateStyle: (newStyles: object) => void;
  assetSummary: AssetSummary;
  property: StyledAssetPropertyQuery;
  onDeleteAssetQuery?: () => void;
  colorable: boolean;
};

export const StyledPropertyComponent: FC<StyledPropertyComponentProps> = ({
  index,
  assetSummary,
  property,
  updateStyle,
  onDeleteAssetQuery,
  colorable,
}) => {
  const { display, label, assetName } = getPropertyDisplay(
    property.propertyId,
    assetSummary
  );

  const name = property.name;
  const labelRef = useRef<HTMLDivElement | null>(null);
  const [isNameTruncated, setIsNameTruncated] = useState(false);
  const resetStyles = (styleToReset: object) => {
    updateStyle(styleToReset); // as we add more sections, reset style values here
  };

  useEffect(() => {
    if (labelRef.current) {
      setIsNameTruncated(
        labelRef.current.scrollWidth > labelRef.current.clientWidth
      );
    }
  }, [label]);

  const YAxisHeader = (
    <div style={{ display: 'flex', width: '100%' }}>
      <SpaceBetween size='xs' direction='horizontal'>
        {colorable && display === 'property' && (
          <ColorPicker
            color={property.color || ''}
            updateColor={(newColor) => updateStyle({ color: newColor })}
          />
        )}
        <Tooltip
          content={isNameTruncated ? label : ''}
          position={index == 0 ? 'bottom' : 'top'}
        >
          <div
            className='property-display-label'
            style={{ marginBlock: spaceStaticXxs }}
            ref={labelRef}
          >
            {name ?? label} ({assetName})
          </div>
        </Tooltip>
        <div style={{ float: 'right' }}>
          <Button
            ariaLabel='delete property'
            onClick={onDeleteAssetQuery}
            variant='icon'
            iconName='remove'
          />
        </div>
      </SpaceBetween>
    </div>
  );

  return (
    <div className='property-display'>
      <div className='property-display-summary'>
        <Box color='text-body-secondary'>
          <ExpandableSection
            headerText={YAxisHeader}
            disableContentPaddings={true}
          >
            <div style={{ padding: `0 ${spaceStaticXl}` }}>
              <DataStreamLabelComponent
                name={name}
                propertyName={label}
                updateName={(newName) => updateStyle({ name: newName })}
              />
              <LineStylePropertyConfig
                resetStyles={resetStyles}
                onUpdate={updateStyle}
                property={property}
              />
              <YAxisPropertyConfig
                resetStyles={resetStyles}
                onUpdate={updateStyle}
                property={property}
              />
            </div>
          </ExpandableSection>
        </Box>
      </div>
    </div>
  );
};
