import { Viewport } from '@iot-app-kit/core';
import { IDataBindingTemplate } from '@iot-app-kit/scene-composer';
import { TwinMakerEntityHistoryQuery, TwinMakerQuery } from '@iot-app-kit/source-iottwinmaker';
import { getEnvCredentials } from './getEnvCredentials';

export const awsCredentials = getEnvCredentials();

// The pre-configured values below is based on the sample workspace created from
// https://github.com/aws-samples/aws-iot-twinmaker-samples, update them for your own workspace.
export const region = 'us-east-1';
export const workspaceId = 'CookieFactory';

// SceneViewer
export const sceneId = 'Mixer';
export const viewport: Viewport = {
  start: new Date('<your-start-time>'), // the start time to query data from your workspace
  end: new Date('<your-end-time>'), // the end time to query data from your workspace
};
export const componentTypeQueries: TwinMakerQuery[] = [
  {
    componentTypeId: 'com.example.cookiefactory.alarm',
    properties: [{ propertyName: 'alarm_status' }],
  },
];
export const entityQueries: TwinMakerQuery[] = [
  {
    entityId: 'Mixer_0_cd81d9fd-3f74-437a-802b-9747ff240837',
    componentName: 'MixerComponent',
    properties: [{ propertyName: 'RPM' }],
  },
  {
    entityId: 'Mixer_0_cd81d9fd-3f74-437a-802b-9747ff240837',
    componentName: 'AlarmComponent',
    properties: [{ propertyName: 'alarm_status' }],
  },
];
export const dataBindingTemplate: IDataBindingTemplate = {
  'sel_entity': (entityQueries[0] as TwinMakerEntityHistoryQuery).entityId
}

// Video Player

/**
 * Simple Mode
 * Specify the video stream name to stream video directly from Kinesis Video Streams
 */
 export const kvsStreamName = '<your-kvs-stream-name>';

 /**
  * AWS IoT TwinMaker Mode
  * Specify videoEntityId and videoComponentName from AWS IoT TwinMaker workspace
  */
 export const videoEntityId = undefined;
 export const videoComponentName = undefined;
 
 /**
  * Specify time range for the video player
  */
 export const videoViewport: Viewport = {
   // Live video playback - use duration
   duration: '0',
   // On-Demand video playback - specify start and end time for video
   /*
   start: new Date('<your-start-time>'),
   end: new Date('<your-end-time>'),
   */
 };
