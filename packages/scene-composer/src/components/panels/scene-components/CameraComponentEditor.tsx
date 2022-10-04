import React, { useCallback, useEffect, useState } from 'react';
import { PerspectiveCamera } from 'three';
import { Button, FormField, Grid, Select, SpaceBetween, TextContent } from '@awsui/components-react';
import { useIntl } from 'react-intl';

import { IComponentEditorProps } from '../ComponentEditor';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { ICameraBasics } from '../../../interfaces';
import { parseFloatOrDefault } from '../../../utils/mathUtils';
import { ICameraComponentInternal, useStore } from '../../../store';
import { DynamicSelect, NumericInput } from '../CommonPanelComponents';
import useActiveCamera from '../../../hooks/useActiveCamera';
import { Divider } from '../../Divider';
import { createNodeWithTransform } from '../../../utils/nodeUtils';

import './CameraComponentEditor.scss';

export interface ICameraComponentEditorProps extends IComponentEditorProps {}

interface CameraEditorSettings extends ICameraBasics {
  focalLength: number;
}

const CameraComponentEditor: React.FC<ICameraComponentEditorProps> = ({
  node,
  component,
}: ICameraComponentEditorProps) => {
  const sceneComposerId = useSceneComposerId();
  const intl = useIntl();
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const updateSceneNodeInternal = useStore(sceneComposerId)((state) => state.updateSceneNodeInternal);
  const getObject3DBySceneNodeRef = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);

  const cameraComponent = component as ICameraComponentInternal;

  const focalLengthIntlMessages = {
    fifteenMilliMeters: intl.formatMessage({
      defaultMessage: '15mm',
      description: '15mm lens',
    }),
    twentyMilliMeters: intl.formatMessage({
      defaultMessage: '20mm',
      description: '20mm lens',
    }),
    thirtyFiveMilliMeters: intl.formatMessage({
      defaultMessage: '35mm',
      description: '35mm lens',
    }),
    fortyFiveMilliMeters: intl.formatMessage({
      defaultMessage: '45mm',
      description: '45mm lens',
    }),
    fiftyMilliMeters: intl.formatMessage({
      defaultMessage: '50mm',
      description: '50mm lens',
    }),
    sixtyMilliMeters: intl.formatMessage({
      defaultMessage: '60mm',
      description: '60mm lens',
    }),
    seventyFiveMilliMeters: intl.formatMessage({
      defaultMessage: '75mm',
      description: '75mm lens',
    }),
  };

  const { mainCameraObject } = useActiveCamera();

  const [cameraSettings, setCameraSettings] = useState<ICameraBasics>({
    cameraType: cameraComponent.cameraType,
    fov: cameraComponent.fov,
    far: cameraComponent.far,
    near: cameraComponent.near,
    zoom: cameraComponent.zoom,
  });

  const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);

  const focalLengthOptions = [
    {
      label: focalLengthIntlMessages.fifteenMilliMeters,
      value: '15',
    },
    {
      label: focalLengthIntlMessages.twentyMilliMeters,
      value: '20',
    },
    {
      label: focalLengthIntlMessages.thirtyFiveMilliMeters,
      value: '35',
    },
    {
      label: focalLengthIntlMessages.fortyFiveMilliMeters,
      value: '45',
    },
    {
      label: focalLengthIntlMessages.fiftyMilliMeters,
      value: '50',
    },
    {
      label: focalLengthIntlMessages.sixtyMilliMeters,
      value: '60',
    },
    {
      label: focalLengthIntlMessages.seventyFiveMilliMeters,
      value: '75',
    },
  ];

  const zoomOptions = [
    {
      label: '0.25',
      value: '0.25',
    },
    {
      label: '0.5',
      value: '0.5',
    },
    {
      label: '1',
      value: '1',
    },
    {
      label: '2',
      value: '2',
    },
    {
      label: '4',
      value: '4',
    },
  ];

  const recalculateCameraSettings = useCallback(
    (updatedSettings: {
      fov?: number;
      focalLength?: number;
      zoom?: number;
      near?: number;
      far?: number;
    }): CameraEditorSettings => {
      const aspectDefault = 1;
      const tempCamera = new PerspectiveCamera(
        cameraSettings.fov,
        aspectDefault,
        cameraSettings.near,
        cameraSettings.far,
      );

      if (updatedSettings.far) {
        tempCamera.far = updatedSettings.far;
      }

      if (updatedSettings.near) {
        tempCamera.near = updatedSettings.near;
      }

      if (updatedSettings.fov) {
        tempCamera.fov = updatedSettings.fov;
      }

      if (updatedSettings.focalLength) {
        tempCamera.setFocalLength(updatedSettings.focalLength);
      }

      if (updatedSettings.zoom) {
        tempCamera.zoom = updatedSettings.zoom;
      }

      return {
        cameraType: cameraSettings.cameraType,
        focalLength: tempCamera.getFocalLength(),
        fov: tempCamera.getEffectiveFOV(),
        far: tempCamera.far,
        near: tempCamera.near,
        zoom: tempCamera.zoom,
      };
    },
    [cameraSettings],
  );

  const toFixedOrTruncated = (value: number) => {
    const truncated = Math.trunc(value);
    const fixed = Number.parseFloat(value.toFixed(2));
    return truncated === fixed ? truncated : fixed;
  };

  const initialFocalLength = recalculateCameraSettings({
    fov: cameraSettings.fov,
    far: cameraSettings.far,
    near: cameraSettings.near,
    zoom: cameraSettings.zoom,
  }).focalLength;

  const [selectedFocalLengthOption, setSelectedFocalLengthOption] = useState({
    label: `${toFixedOrTruncated(initialFocalLength)}mm`,
    value: initialFocalLength.toString(),
  });

  const [selectedZoomOption, setSelectedZoomOption] = useState({
    label: cameraSettings.zoom.toString(),
    value: cameraSettings.zoom.toString(),
  });

  const updateFocalLength = (value: number) => {
    const focalLengthOptionIndex = focalLengthOptions.findIndex((option) => option.value === value.toString());
    if (focalLengthOptionIndex > -1) {
      setSelectedFocalLengthOption(focalLengthOptions[focalLengthOptionIndex]);
    } else {
      setSelectedFocalLengthOption({
        label: `${toFixedOrTruncated(value)}mm`,
        value: value.toString(),
      });
    }
  };

  const updateZoom = (value: number) => {
    const zoomOptionIndex = zoomOptions.findIndex((option) => option.value === value.toString());
    if (zoomOptionIndex > 1) {
      setSelectedZoomOption(zoomOptions[zoomOptionIndex]);
    } else {
      setSelectedZoomOption({
        label: '1',
        value: '1',
      });
    }
  };

  useEffect(() => {
    const updatedSettings = recalculateCameraSettings({
      fov: cameraComponent.fov,
      far: cameraComponent.far,
      near: cameraComponent.near,
      zoom: cameraComponent.zoom,
    });
    updateFocalLength(updatedSettings.focalLength);
    updateZoom(updatedSettings.zoom);
    setCameraSettings({
      cameraType: cameraComponent.cameraType,
      fov: updatedSettings.fov,
      far: updatedSettings.far,
      near: updatedSettings.near,
      zoom: updatedSettings.zoom,
    });
  }, [cameraComponent.ref]);

  const updateSettings = (updatedSettings: CameraEditorSettings) => {
    const updatedCameraSettings = {
      cameraType: updatedSettings.cameraType,
      fov: updatedSettings.fov,
      far: updatedSettings.far,
      near: updatedSettings.near,
      zoom: updatedSettings.zoom,
    };

    setCameraSettings(updatedCameraSettings);
    updateFocalLength(updatedSettings.focalLength);
    updateZoom(updatedSettings.zoom);
    setNeedsUpdate(true);
  };

  useEffect(() => {
    if (needsUpdate) {
      const updatedComponent: ICameraComponentInternal = {
        ...component,
        ...cameraSettings,
      };

      updateComponentInternal(node.ref, updatedComponent, true);
      setNeedsUpdate(false);
    }
  }, [needsUpdate]);

  return (
    <SpaceBetween size='m'>
      <SpaceBetween size='xs'>
        <TextContent>
          <strong>{intl.formatMessage({ defaultMessage: 'Lens', description: 'Form section header' })}</strong>
        </TextContent>
        <FormField label={intl.formatMessage({ defaultMessage: 'Focal length', description: 'Form field label' })}>
          <DynamicSelect
            data-testid={'camera-focal-length-select'}
            selectedOption={selectedFocalLengthOption} // Find this by value
            onChange={useCallback((e) => {
              if (e.detail.selectedOption.value) {
                const updatedSettings = recalculateCameraSettings({
                  focalLength: Number.parseFloat(e.detail.selectedOption.value),
                });

                updateSettings(updatedSettings);
              }
            }, [])}
            options={focalLengthOptions}
            selectedAriaLabel={intl.formatMessage({
              defaultMessage: 'Selected',
              description:
                'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
            })}
            placeholder={intl.formatMessage({ defaultMessage: 'Choose a focal length', description: 'placeholder' })}
          />
        </FormField>
      </SpaceBetween>
      <SpaceBetween size='s'>
        <Grid gridDefinition={[{ colspan: 2 }, { colspan: 8 }, { colspan: 2 }]}>
          <TextContent>
            <div className={'tm-camera-sub-form-label'}>
              {intl.formatMessage({ defaultMessage: 'FOV', description: 'Form field label' })}
            </div>
          </TextContent>
          <FormField data-testid={'camera-fov-field'}>
            <NumericInput
              value={cameraSettings.fov!}
              toStr={(val) => val.toFixed(2)}
              fromStr={(str) => parseFloatOrDefault(str, 1)}
              setValue={useCallback((value) => {
                if (value) {
                  const updatedSettings = recalculateCameraSettings({
                    fov: value,
                  });

                  updateSettings(updatedSettings);
                }
              }, [])}
            />
          </FormField>
          <TextContent>
            <div className={'tm-camera-sub-form-label'}>
              {intl.formatMessage({ defaultMessage: 'deg', description: 'degrees' })}
            </div>
          </TextContent>
        </Grid>
      </SpaceBetween>
      <SpaceBetween size='s'>
        <Grid gridDefinition={[{ colspan: 2 }, { colspan: 8 }, { colspan: 2 }]}>
          <TextContent>
            <div className={'tm-camera-sub-form-label'}>
              {intl.formatMessage({ defaultMessage: 'Zoom', description: 'Form field label' })}
            </div>
          </TextContent>
          <FormField data-testid={'camera-zoom-field'}>
            <Select
              data-testid={'camera-zoom-select'}
              selectedOption={selectedZoomOption} // Find this by value
              onChange={useCallback((e) => {
                if (e.detail.selectedOption.value) {
                  const updatedSettings = recalculateCameraSettings({
                    zoom: Number.parseFloat(e.detail.selectedOption.value),
                  });

                  updateSettings(updatedSettings);
                }
              }, [])}
              options={zoomOptions}
              selectedAriaLabel={intl.formatMessage({
                defaultMessage: 'Selected',
                description:
                  'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
              })}
              placeholder={intl.formatMessage({
                defaultMessage: 'Choose a zoom level',
                description: 'placeholder',
              })}
            />
          </FormField>
          <TextContent>
            <div className={'tm-camera-sub-form-label'}>
              {intl.formatMessage({ defaultMessage: 'x', description: 'times' })}
            </div>
          </TextContent>
        </Grid>
      </SpaceBetween>
      <SpaceBetween size='xs'>
        <Divider />
        <TextContent>
          <strong>
            {intl.formatMessage({ defaultMessage: 'Clipping Planes', description: 'Form section header' })}
          </strong>
        </TextContent>
        <FormField
          data-testid={'camera-far-field'}
          label={intl.formatMessage({ defaultMessage: 'Far', description: 'Form field label' })}
        >
          <NumericInput
            value={cameraSettings.far!}
            toStr={(val) => val.toFixed(2)}
            fromStr={(str) => parseFloatOrDefault(str, 1)}
            setValue={useCallback((value) => {
              if (value) {
                const updatedSettings = recalculateCameraSettings({
                  far: value,
                });

                updateSettings(updatedSettings);
              }
            }, [])}
          />
        </FormField>
      </SpaceBetween>
      <SpaceBetween size='s'>
        <FormField
          data-testid={'camera-near-field'}
          label={intl.formatMessage({ defaultMessage: 'Near', description: 'Form field label' })}
        >
          <NumericInput
            value={cameraSettings.near!}
            toStr={(val) => val.toFixed(2)}
            fromStr={(str) => parseFloatOrDefault(str, 1)}
            setValue={useCallback((value) => {
              if (value) {
                const updatedSettings = recalculateCameraSettings({
                  near: value,
                });

                updateSettings(updatedSettings);
              }
            }, [])}
          />
        </FormField>
      </SpaceBetween>
      <Divider />
      <SpaceBetween size='s'>
        <FormField
          label={intl.formatMessage({
            defaultMessage: 'Fix camera to current view',
            description: 'Form field label',
          })}
        >
          <Button
            data-testid={'fix-camera-from-current-button'}
            onClick={useCallback(() => {
              if (mainCameraObject) {
                const parent = getObject3DBySceneNodeRef(node.parentRef);
                const newNode = createNodeWithTransform(
                  node,
                  mainCameraObject.position,
                  mainCameraObject.rotation,
                  mainCameraObject.scale,
                  parent,
                );
                const updatedNodePartial = {
                  transform: newNode.transform,
                };

                updateSceneNodeInternal(node.ref, updatedNodePartial);
              }
            }, [mainCameraObject, node])}
          >
            {intl.formatMessage({ defaultMessage: 'Fix view', description: 'Form button text' })}
          </Button>
        </FormField>
      </SpaceBetween>
    </SpaceBetween>
  );
};
CameraComponentEditor.displayName = 'CameraComponentEditor';

export default CameraComponentEditor;
