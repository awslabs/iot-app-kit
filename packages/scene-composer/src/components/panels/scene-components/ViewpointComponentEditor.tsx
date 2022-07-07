import React from 'react';
import { SpaceBetween, TextContent } from '@awsui/components-react';
import { MathUtils } from 'three';
import * as awsui from '@awsui/design-tokens';

import { IComponentEditorProps } from '../ComponentEditor';
import { IViewpointComponentInternal } from '../../../store';
import { Matrix3XInputGrid, SectionBorder, Triplet } from '../CommonPanelComponents';
import { toNumber } from '../../../utils/stringUtils';

export interface IViewpointComponentEditorProps extends IComponentEditorProps {}

export const ViewpointComponentEditor: React.FC<IViewpointComponentEditorProps> = ({
  node,
  component,
}: IViewpointComponentEditorProps) => {
  const viewpointComponent = component as IViewpointComponentInternal;
  const isSixSided = viewpointComponent.skyboxImageFormat === 'SixSided';
  const cameraRotation: Triplet<number> = viewpointComponent.cameraRotation
    ? [
        MathUtils.radToDeg(viewpointComponent.cameraRotation[0]),
        MathUtils.radToDeg(viewpointComponent.cameraRotation[1]),
        MathUtils.radToDeg(viewpointComponent.cameraRotation[2]),
      ]
    : [0, 0, 0];

  const images = isSixSided
    ? [
        ['Left:', viewpointComponent.skyboxImages[1]],
        ['Right:', viewpointComponent.skyboxImages[0]],
        ['Top:', viewpointComponent.skyboxImages[2]],
        ['Bottom:', viewpointComponent.skyboxImages[3]],
        ['Front:', viewpointComponent.skyboxImages[4]],
        ['Back:', viewpointComponent.skyboxImages[5]],
      ]
    : [['Image:', viewpointComponent.skyboxImages[0]]];

  const tripletData = [
    ['Camera position', viewpointComponent.cameraPosition],
    ['Camera rotation', cameraRotation],
  ];

  const imagesUI: JSX.Element[] = [];
  const cameraPositionRotationUI: JSX.Element[] = [];
  imagesUI.push(<TextContent key={'skybox-header'}>Skybox image</TextContent>);

  images.forEach((image, index) =>
    imagesUI.push(
      <TextContent key={index}>
        <TextContent>
          <div style={{ color: awsui.colorTextLabel, fontSize: '14px' }}>{image[0]}</div>
        </TextContent>
        <TextContent>
          <div style={{ fontSize: '12px', lineHeight: '1em' }}>{image[1]}</div>
        </TextContent>
      </TextContent>,
    ),
  );

  tripletData.forEach((data, index) => {
    cameraPositionRotationUI.push(
      <Matrix3XInputGrid
        name={data[0] as string}
        key={index}
        readonly={[true, true, true]}
        fromStr={toNumber}
        onChange={() => {}}
        labels={['X', 'Y', 'Z']}
        values={data[1] as Triplet<number>}
        toStr={(a) => a.toFixed(3)}
      />,
    );
  });

  return (
    <TextContent>
      <SpaceBetween size='s'>
        <TextContent>Skybox image format: {viewpointComponent.skyboxImageFormat}</TextContent>
        <SpaceBetween size='xxs'>{imagesUI}</SpaceBetween>
      </SpaceBetween>
      <SectionBorder />
      <SpaceBetween size='s'>{cameraPositionRotationUI}</SpaceBetween>
    </TextContent>
  );
};
