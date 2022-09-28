import { Box, Container, ProgressBar } from '@awsui/components-react';
import { Html } from '@react-three/drei/web/Html';
import React, { Fragment, useCallback } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import * as awsui from '@awsui/design-tokens';
import * as THREE from 'three';

import { humanFileSize } from '../../utils/mathUtils';
import { extractFileNameExtFromUrl } from '../../utils/pathUtils';

import useProgress from './hooks/useProgress';

const LoadingContainer = styled(Container)`
  width: 400px;
`;

const LoadingDescriptionBox = styled(Box)`
  color: ${awsui.colorTextBodySecondary}!important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const calculateCenterPosition = (
  _el: THREE.Object3D,
  _camera: THREE.Camera,
  size: { width: number; height: number },
) => {
  const widthHalf = size.width / 2;
  const heightHalf = size.height / 2;
  return [widthHalf, heightHalf];
};

export const LoadingProgress = () => {
  const progress = useProgress();
  const alwaysCenterLoadingPosition = useCallback(calculateCenterPosition, []);
  const intl = useIntl();

  return (
    <Html center calculatePosition={alwaysCenterLoadingPosition}>
      <LoadingContainer>
        <ProgressBar
          status='in-progress'
          value={progress.progress}
          additionalInfo={
            <Fragment>
              <LoadingDescriptionBox>
                {intl.formatMessage(
                  { defaultMessage: 'Downloading {fileName}', description: 'Progress Bar status' },
                  { fileName: extractFileNameExtFromUrl(progress.downloadItem).join('.') },
                )}
              </LoadingDescriptionBox>
              <LoadingDescriptionBox>
                {intl.formatMessage(
                  { defaultMessage: '{fileSize} downloaded', description: 'Progress Bar description' },
                  { fileSize: humanFileSize(progress.downloaded) },
                )}
              </LoadingDescriptionBox>
            </Fragment>
          }
          label={intl.formatMessage({ defaultMessage: 'Loading assets', description: 'Progress Bar label' })}
        />
      </LoadingContainer>
    </Html>
  );
};
