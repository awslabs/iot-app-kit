import { GetDataEndpointCommand, KinesisVideoClient } from '@aws-sdk/client-kinesis-video';
import {
  GetHLSStreamingSessionURLCommand,
  GetHLSStreamingSessionURLInput,
  HLSFragmentSelector,
  KinesisVideoArchivedMediaClient,
} from '@aws-sdk/client-kinesis-video-archived-media';
import { Endpoint } from '@aws-sdk/types';
import { parseUrl } from '@aws-sdk/url-parser';
import {
  GET_HLS_STREAMING_SESSION_URL,
  PLAYBACKMODE_LIVE,
  PLAYBACKMODE_ON_DEMAND,
  PRODUCER_TIMESTAMP,
} from '../constants';
import { GetLiveHLSStreamingSessionURLRequest, GetOnDemandHLSStreamingSessionURLRequest } from '../types';

const expireSessionInSeconds = 1800; // 30 minutes

export const getKVSDataEndpoint = async (
  kvsStreamName: string,
  kinesisVideoClient: KinesisVideoClient
): Promise<Endpoint> => {
  const endpointResponse = await kinesisVideoClient.send(
    new GetDataEndpointCommand({
      StreamName: kvsStreamName,
      APIName: GET_HLS_STREAMING_SESSION_URL,
    })
  );
  return parseUrl(endpointResponse.DataEndpoint as string);
};

export const getOnDemandHLSStreamingSessionURL = async (
  getOnDemandHLSStreamingSessionURLRequest: GetOnDemandHLSStreamingSessionURLRequest,
  kinesisVideoArchivedMediaClient: KinesisVideoArchivedMediaClient
): Promise<string> => {
  const hlsFragmentSelector: HLSFragmentSelector = {
    FragmentSelectorType: PRODUCER_TIMESTAMP,
    TimestampRange: {
      StartTimestamp: getOnDemandHLSStreamingSessionURLRequest.startTimestamp,
      EndTimestamp: getOnDemandHLSStreamingSessionURLRequest.endTimestamp,
    },
  };
  const request: GetHLSStreamingSessionURLInput = {
    StreamName: getOnDemandHLSStreamingSessionURLRequest.kvsStreamName,
    PlaybackMode: PLAYBACKMODE_ON_DEMAND,
    HLSFragmentSelector: hlsFragmentSelector,
    Expires: expireSessionInSeconds,
  };

  kinesisVideoArchivedMediaClient.config.endpoint = () =>
    Promise.resolve(getOnDemandHLSStreamingSessionURLRequest.kvsDataEndpoint);
  const result = await kinesisVideoArchivedMediaClient.send(new GetHLSStreamingSessionURLCommand(request));
  return result.HLSStreamingSessionURL as string;
};

export const getLiveHLSStreamingSessionURL = async (
  getLiveHLSStreamingSessionURLRequest: GetLiveHLSStreamingSessionURLRequest,
  kinesisVideoArchivedMediaClient: KinesisVideoArchivedMediaClient
): Promise<string> => {
  const request: GetHLSStreamingSessionURLInput = {
    StreamName: getLiveHLSStreamingSessionURLRequest.kvsStreamName,
    PlaybackMode: PLAYBACKMODE_LIVE,
    Expires: expireSessionInSeconds,
  };

  kinesisVideoArchivedMediaClient.config.endpoint = () =>
    Promise.resolve(getLiveHLSStreamingSessionURLRequest.kvsDataEndpoint);
  const result = await kinesisVideoArchivedMediaClient.send(new GetHLSStreamingSessionURLCommand(request));
  return result.HLSStreamingSessionURL as string;
};
