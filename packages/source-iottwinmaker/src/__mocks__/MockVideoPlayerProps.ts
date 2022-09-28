import { GetDataEndpointOutput } from '@aws-sdk/client-kinesis-video';
import {
  BatchPutAssetPropertyValueResponse,
  GetAssetPropertyValueRequest,
  GetAssetPropertyValueResponse,
  GetInterpolatedAssetPropertyValuesResponse
} from "@aws-sdk/client-iotsitewise";
import { GetEntityCommandOutput, GetPropertyValueHistoryCommandOutput, GetPropertyValueHistoryRequest } from '@aws-sdk/client-iottwinmaker';
import { Credentials } from "@aws-sdk/types";
import { parseUrl } from '@aws-sdk/url-parser';
import { CachedVideoAgeOutOnEdge, VideoUploadedTimeRange } from '../video-data/constants';
import { Primitive } from "../common/types";

export const mockWorkspaceId = 'mockWorkspaceId';
export const mockEntityId = 'mockEntityId';
export const mockComponentName = 'mockComponentName';
export const mockKVSStreamName = 'mockKVSStream';
export const mockAssetId = 'mockAssetId';
export const mockPropertyId = 'mockPropertyId';
export const mockGetDataEndpointResponse: GetDataEndpointOutput = { DataEndpoint: 'https://mockEndpoint.xyz' };
export const mockDataEndpoint = parseUrl('https://mockEndpoint.xyz');
export const mockLiveURL = 'mockLiveURL';
export const mockOnDemandURL = 'mockOnDemandURL';
export const mockLiveGetHLSStreamingSessionURLResponse = { HLSStreamingSessionURL: mockLiveURL };
export const mockOnDemandGetHLSStreamingSessionURLResponse = { HLSStreamingSessionURL: mockOnDemandURL };
export const mockSitewiseAssetId = 'mockSitewiseAssetId';
export const mockVideoUploadRequestPropertyId = 'mockVideoUploadRequestPropertyId';
export const batchPutAssetPropertyResponse: BatchPutAssetPropertyValueResponse = {
  errorEntries: [{ entryId: 'test', errors: [] }],
};
export const mockGetAssetPropertyValueRequest: GetAssetPropertyValueRequest = {
  assetId: mockAssetId,
  propertyId: mockPropertyId,
};
export const mockGetAssetPropertyValue: Primitive | undefined = 'test-video-stream';
export const mockGetAssetPropertyValueResponse: GetAssetPropertyValueResponse = {
  propertyValue: {
    value: {
      stringValue: 'test-video-stream',
    },
    timestamp: {
      timeInSeconds: 1234567890,
    },
  },
};
export const mockGetInterpolatedAssetPropertyValuesResponse: GetInterpolatedAssetPropertyValuesResponse = {
  interpolatedAssetPropertyValues: [
    {
      timestamp: {
        timeInSeconds: 1630004199,
        offsetInNanos: 0,
      },
      value: {
        doubleValue: 1630005400.0,
      },
    },
  ],
};

export const mockAWSCredentials: Credentials = {
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey',
  sessionToken: 'sessionToken',
};

export const mockEntityPropertyReference = {
  externalIdProperty: {},
  entityId: mockEntityId,
  componentName: mockComponentName,
  propertyName: mockPropertyId,
};

export const mockEntityPropertyReferenceWithExtId = {
  externalIdProperty: {
    'random-key': 'random-value',
  },
  propertyName: mockPropertyId,
};

export const mockEdgeVideoEntity: GetEntityCommandOutput = {
  entityId: mockEntityId,
  entityName: mockEntityId,
  arn: 'MockEntityArn',
  status: { state: 'CREATING' },
  description: 'MockEntityDescription',
  creationDateTime: new Date('1970-01-01'),
  updateDateTime: new Date('1970-01-01'),
  workspaceId: mockWorkspaceId,
  components: {
    [mockComponentName]: {
      componentName: mockComponentName,
      description: 'Description',
      componentTypeId: 'com.amazon.iotsitewise.connector.edgevideo',
      status: { state: 'CREATING' },
      properties: {
        VideoUploadedTimeRange: {
          definition: {
            configuration: {
              sitewisePropertyId: '00255d83-4477-46f1-9dce-41bd80d3a80b',
            },
            dataType: {
              type: 'DOUBLE',
            },
            isTimeSeries: true,
            isExternalId: false,
            isFinal: false,
            isImported: false,
            isInherited: false,
            isRequiredInEntity: false,
            isStoredExternally: false,
          },
          value: {},
        },
        CachedVideoAgeOutOnEdge: {
          definition: {
            configuration: {
              sitewisePropertyId: '00255d83-4477-46f1-9dce-41bd80d3a81a',
            },
            dataType: {
              type: 'DOUBLE',
            },
            isTimeSeries: true,
            isExternalId: false,
            isFinal: false,
            isImported: false,
            isInherited: false,
            isRequiredInEntity: false,
            isStoredExternally: false,
          },
          value: {},
        },
        KinesisVideoStreamName: {
          definition: {
            dataType: {
              type: 'STRING',
            },
            configuration: {
              sitewisePropertyId: '123487b8-9e03-4e5e-9306-7828a6d536a2',
            },
            isTimeSeries: true,
            isExternalId: false,
            isFinal: false,
            isImported: false,
            isInherited: false,
            isRequiredInEntity: false,
            isStoredExternally: false,
          },
          value: {},
        },
        VideoUploadRequest: {
          definition: {
            dataType: {
              type: 'STRING',
            },
            configuration: {
              sitewisePropertyId: '0bc6a8d6-9f01-4481-afe4-09c923c58104',
            },
            isTimeSeries: true,
            isExternalId: false,
            isFinal: false,
            isImported: false,
            isInherited: false,
            isRequiredInEntity: false,
            isStoredExternally: false,
          },
          value: {},
        },
        sitewiseAssetId: {
          definition: {
            dataType: {
              type: 'STRING',
            },
            isTimeSeries: false,
            isExternalId: false,
            isFinal: false,
            isImported: false,
            isInherited: false,
            isRequiredInEntity: false,
            isStoredExternally: false,
          },
          value: {
            stringValue: '63675fb1-d30c-4eb8-9ff5-291aa27d004e',
          },
        },
      },
    },
  },
  parentEntityId: '',
  hasChildEntities: false,
  $metadata: {},
};

export const mockKVSEntity: GetEntityCommandOutput = {
  entityId: mockEntityId,
  entityName: mockEntityId,
  arn: 'MockEntityArn',
  status: { state: 'CREATING' },
  description: 'MockEntityDescription',
  creationDateTime: new Date('1970-01-01'),
  updateDateTime: new Date('1970-01-01'),
  workspaceId: mockWorkspaceId,
  components: {
    [mockComponentName]: {
      componentName: mockComponentName,
      description: 'Description',
      componentTypeId: 'com.amazon.kvs.video',
      status: { state: 'CREATING' },
      properties: {
        KinesisVideoStreamName: {
          definition: {
            dataType: {
              type: 'STRING',
            },
            isTimeSeries: false,
            isRequiredInEntity: true,
            isExternalId: false,
            isStoredExternally: false,
            isImported: false,
            isFinal: false,
            isInherited: false,
          },
          value: {
            stringValue: 'test-kvs-video-stream',
          },
        },
      },
    },
  },
  parentEntityId: '',
  hasChildEntities: false,
  $metadata: {},
};

export const mockVideoUploadedTimeRange: GetPropertyValueHistoryCommandOutput = {
  propertyValues: [
    {
      entityPropertyReference: {
        componentName: mockComponentName,
        entityId: mockEntityId,
        propertyName: VideoUploadedTimeRange,
      },
      values: [
        {
          value: {
            stringValue: '1630005500',
          },
          time: new Date(1630005400000).toISOString(),
        },
        {
          value: {
            stringValue: '1630005850',
          },
          time: new Date(1630005800000).toISOString(),
        },
      ],
    },
  ],
  $metadata: {},
};

export const mockCachedVideoAgeOutOnEdge: GetPropertyValueHistoryCommandOutput = {
  propertyValues: [
    {
      entityPropertyReference: {
        componentName: mockComponentName,
        entityId: mockEntityId,
        propertyName: CachedVideoAgeOutOnEdge,
      },
      values: [
        {
          value: {
            stringValue: '1630005600',
          },
          time: new Date(1630005400000).toISOString(),
        },
        {
          value: {
            stringValue: '1630005900',
          },
          time: new Date(1630005800000).toISOString(),
        },
      ],
    },
  ],
  $metadata: {},
};

export const mockGetAvailableTimeRangeResponse = [
  [
    { start: 1630005300000, end: 1630005400000, src: 'mockOnDemandURL' },
    { start: 1630005400000, end: 1630005500000, src: 'mockOnDemandURL' },
    { start: 1630005800000, end: 1630005850000, src: 'mockOnDemandURL' },
  ],
  [
    { start: 1630005400000, end: 1630005600000 },
    { start: 1630005800000, end: 1630005900000 },
  ],
];

export const mockGetPropertyValueHistoryRequest: GetPropertyValueHistoryRequest = {
  workspaceId: mockWorkspaceId,
  entityId: mockEntityId,
  componentName: mockComponentName,
  selectedProperties: [mockPropertyId],
  startTime: (new Date()).toISOString(),
  endTime: (new Date()).toISOString(),
};
