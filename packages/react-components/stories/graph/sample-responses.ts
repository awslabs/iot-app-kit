import { type ExecuteQueryCommandOutput } from '@aws-sdk/client-iottwinmaker';

export const response: ExecuteQueryCommandOutput = {
  columnDescriptions: [
    {
      name: 'floor',
      type: 'NODE',
    },
    {
      name: 'room',
      type: 'NODE',
    },
    {
      name: 'r',
      type: 'EDGE',
    },
  ],
  rows: [
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          creationDate: 1660021324601,
          entityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          entityName: 'floor_0',
          lastUpdateDate: 1660021325780,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 0,
                },
              ],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_016bb5bd-d097-3e3a-83c2-54e3c9134f96',
          creationDate: 1660021325694,
          entityId: 'room_016bb5bd-d097-3e3a-83c2-54e3c9134f96',
          entityName: 'room_0',
          lastUpdateDate: 1660021326733,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'RoomComponent',
              componentTypeId: 'com.example.query.construction.room',
              properties: [
                {
                  propertyName: 'roomFunction',
                  propertyValue: 'meeting',
                },
                {
                  propertyName: 'roomNumber',
                  propertyValue: 0,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_016bb5bd-d097-3e3a-83c2-54e3c9134f96',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          creationDate: 1660021324601,
          entityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          entityName: 'floor_0',
          lastUpdateDate: 1660021325780,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 0,
                },
              ],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_e77f1506-c506-3b0a-b69c-b0b7449005ce',
          creationDate: 1660021325877,
          entityId: 'room_e77f1506-c506-3b0a-b69c-b0b7449005ce',
          entityName: 'room_1',
          lastUpdateDate: 1660021326683,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'RoomComponent',
              componentTypeId: 'com.example.query.construction.room',
              properties: [
                {
                  propertyName: 'roomFunction',
                  propertyValue: 'meeting',
                },
                {
                  propertyName: 'roomNumber',
                  propertyValue: 1,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_e77f1506-c506-3b0a-b69c-b0b7449005ce',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
      ],
    },
  ],
  $metadata: {},
};

export const response2: ExecuteQueryCommandOutput = {
  columnDescriptions: [
    {
      name: 'EntityName',
      type: 'VALUE',
    },
  ],
  rows: [
    {
      rowData: ['room_0'],
    },
    {
      rowData: ['room_1'],
    },
    {
      rowData: ['room_10'],
    },
    {
      rowData: ['room_11'],
    },
    {
      rowData: ['room_12'],
    },
    {
      rowData: ['room_13'],
    },
    {
      rowData: ['room_14'],
    },
    {
      rowData: ['room_15'],
    },
    {
      rowData: ['room_16'],
    },
    {
      rowData: ['room_17'],
    },
    {
      rowData: ['room_18'],
    },
    {
      rowData: ['room_19'],
    },
    {
      rowData: ['room_2'],
    },
    {
      rowData: ['room_20'],
    },
    {
      rowData: ['room_21'],
    },
    {
      rowData: ['room_22'],
    },
    {
      rowData: ['room_23'],
    },
    {
      rowData: ['room_24'],
    },
    {
      rowData: ['room_3'],
    },
    {
      rowData: ['room_4'],
    },
    {
      rowData: ['room_5'],
    },
    {
      rowData: ['room_6'],
    },
    {
      rowData: ['room_7'],
    },
    {
      rowData: ['room_8'],
    },
    {
      rowData: ['room_9'],
    },
  ],
  $metadata: {},
};

export const response3: ExecuteQueryCommandOutput = {
  columnDescriptions: [
    {
      name: 'floor',
      type: 'NODE',
    },
    {
      name: 'room',
      type: 'NODE',
    },
    {
      name: 'lightingZone',
      type: 'NODE',
    },
    {
      name: 'luminaire',
      type: 'NODE',
    },
    {
      name: 'r1',
      type: 'EDGE',
    },
    {
      name: 'r2',
      type: 'EDGE',
    },
    {
      name: 'r3',
      type: 'EDGE',
    },
  ],
  rows: [
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          creationDate: 1660021324601,
          entityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          entityName: 'floor_0',
          lastUpdateDate: 1660021325780,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 0,
                },
              ],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_016bb5bd-d097-3e3a-83c2-54e3c9134f96',
          creationDate: 1660021325694,
          entityId: 'room_016bb5bd-d097-3e3a-83c2-54e3c9134f96',
          entityName: 'room_0',
          lastUpdateDate: 1660021326733,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'RoomComponent',
              componentTypeId: 'com.example.query.construction.room',
              properties: [
                {
                  propertyName: 'roomFunction',
                  propertyValue: 'meeting',
                },
                {
                  propertyName: 'roomNumber',
                  propertyValue: 0,
                },
              ],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/lighting_zone_020b4a63-d42a-32be-a4ac-6fff4e35aed4',
          creationDate: 1660021330380,
          entityId: 'lighting_zone_020b4a63-d42a-32be-a4ac-6fff4e35aed4',
          entityName: 'lighting_zone_0',
          lastUpdateDate: 1660021331386,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'ZoneComponent',
              componentTypeId: 'com.example.query.zone.lighting',
              properties: [],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/luminaire_1ffdb93f-6c16-34cf-970b-05be18d1e71a',
          creationDate: 1660021339120,
          entityId: 'luminaire_1ffdb93f-6c16-34cf-970b-05be18d1e71a',
          entityName: 'luminaire_0',
          lastUpdateDate: 1660021339896,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'LuminaireComponent',
              componentTypeId: 'com.example.query.equipment.luminaire',
              properties: [],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_016bb5bd-d097-3e3a-83c2-54e3c9134f96',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_016bb5bd-d097-3e3a-83c2-54e3c9134f96',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'lighting_zone_020b4a63-d42a-32be-a4ac-6fff4e35aed4',
          sourceComponentTypeId: 'com.example.query.zone.lighting',
        },
        {
          relationshipName: 'feed',
          targetEntityId: 'lighting_zone_020b4a63-d42a-32be-a4ac-6fff4e35aed4',
          sourceComponentName: 'LuminaireComponent',
          sourceEntityId: 'luminaire_1ffdb93f-6c16-34cf-970b-05be18d1e71a',
          sourceComponentTypeId: 'com.example.query.equipment.luminaire',
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          creationDate: 1660021324601,
          entityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          entityName: 'floor_0',
          lastUpdateDate: 1660021325780,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 0,
                },
              ],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_7fb79c45-50d0-3b5d-9baf-f71d9658df64',
          creationDate: 1660021326061,
          entityId: 'room_7fb79c45-50d0-3b5d-9baf-f71d9658df64',
          entityName: 'room_2',
          lastUpdateDate: 1660021326847,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'RoomComponent',
              componentTypeId: 'com.example.query.construction.room',
              properties: [
                {
                  propertyName: 'roomFunction',
                  propertyValue: 'office',
                },
                {
                  propertyName: 'roomNumber',
                  propertyValue: 2,
                },
              ],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/lighting_zone_d1a9e1bc-6d62-3ca4-8dc1-16c25f95c849',
          creationDate: 1660021330718,
          entityId: 'lighting_zone_d1a9e1bc-6d62-3ca4-8dc1-16c25f95c849',
          entityName: 'lighting_zone_2',
          lastUpdateDate: 1660021331574,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'ZoneComponent',
              componentTypeId: 'com.example.query.zone.lighting',
              properties: [],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/luminaire_9dfc8a92-7786-3bf6-a184-2c2a2246636f',
          creationDate: 1660021339445,
          entityId: 'luminaire_9dfc8a92-7786-3bf6-a184-2c2a2246636f',
          entityName: 'luminaire_2',
          lastUpdateDate: 1660021340253,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'LuminaireComponent',
              componentTypeId: 'com.example.query.equipment.luminaire',
              properties: [],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_7fb79c45-50d0-3b5d-9baf-f71d9658df64',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_7fb79c45-50d0-3b5d-9baf-f71d9658df64',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'lighting_zone_d1a9e1bc-6d62-3ca4-8dc1-16c25f95c849',
          sourceComponentTypeId: 'com.example.query.zone.lighting',
        },
        {
          relationshipName: 'feed',
          targetEntityId: 'lighting_zone_d1a9e1bc-6d62-3ca4-8dc1-16c25f95c849',
          sourceComponentName: 'LuminaireComponent',
          sourceEntityId: 'luminaire_9dfc8a92-7786-3bf6-a184-2c2a2246636f',
          sourceComponentTypeId: 'com.example.query.equipment.luminaire',
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          creationDate: 1660021324601,
          entityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          entityName: 'floor_0',
          lastUpdateDate: 1660021325780,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 0,
                },
              ],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_c3d182ff-a37b-3724-a8d7-cca7bd51e512',
          creationDate: 1660021326493,
          entityId: 'room_c3d182ff-a37b-3724-a8d7-cca7bd51e512',
          entityName: 'room_4',
          lastUpdateDate: 1660021327451,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'RoomComponent',
              componentTypeId: 'com.example.query.construction.room',
              properties: [
                {
                  propertyName: 'roomFunction',
                  propertyValue: 'restroom',
                },
                {
                  propertyName: 'roomNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/lighting_zone_04cd9feb-7b70-38c9-90e1-b98f4c2fe62f',
          creationDate: 1660021331041,
          entityId: 'lighting_zone_04cd9feb-7b70-38c9-90e1-b98f4c2fe62f',
          entityName: 'lighting_zone_4',
          lastUpdateDate: 1660021331937,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'ZoneComponent',
              componentTypeId: 'com.example.query.zone.lighting',
              properties: [],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/luminaire_7aea00e2-d081-3177-8237-d144a7c0ff6b',
          creationDate: 1660021339780,
          entityId: 'luminaire_7aea00e2-d081-3177-8237-d144a7c0ff6b',
          entityName: 'luminaire_4',
          lastUpdateDate: 1660021340578,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'LuminaireComponent',
              componentTypeId: 'com.example.query.equipment.luminaire',
              properties: [],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_c3d182ff-a37b-3724-a8d7-cca7bd51e512',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_c3d182ff-a37b-3724-a8d7-cca7bd51e512',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'lighting_zone_04cd9feb-7b70-38c9-90e1-b98f4c2fe62f',
          sourceComponentTypeId: 'com.example.query.zone.lighting',
        },
        {
          relationshipName: 'feed',
          targetEntityId: 'lighting_zone_04cd9feb-7b70-38c9-90e1-b98f4c2fe62f',
          sourceComponentName: 'LuminaireComponent',
          sourceEntityId: 'luminaire_7aea00e2-d081-3177-8237-d144a7c0ff6b',
          sourceComponentTypeId: 'com.example.query.equipment.luminaire',
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          creationDate: 1660021324601,
          entityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          entityName: 'floor_0',
          lastUpdateDate: 1660021325780,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 0,
                },
              ],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_e77f1506-c506-3b0a-b69c-b0b7449005ce',
          creationDate: 1660021325877,
          entityId: 'room_e77f1506-c506-3b0a-b69c-b0b7449005ce',
          entityName: 'room_1',
          lastUpdateDate: 1660021326683,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'RoomComponent',
              componentTypeId: 'com.example.query.construction.room',
              properties: [
                {
                  propertyName: 'roomFunction',
                  propertyValue: 'meeting',
                },
                {
                  propertyName: 'roomNumber',
                  propertyValue: 1,
                },
              ],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/lighting_zone_db5249c8-1af7-3e6e-a3dc-f65438fbc73f',
          creationDate: 1660021330550,
          entityId: 'lighting_zone_db5249c8-1af7-3e6e-a3dc-f65438fbc73f',
          entityName: 'lighting_zone_1',
          lastUpdateDate: 1660021331445,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'ZoneComponent',
              componentTypeId: 'com.example.query.zone.lighting',
              properties: [],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/luminaire_18e634a2-1da0-39e2-bfb8-3a6fbe6713ca',
          creationDate: 1660021339285,
          entityId: 'luminaire_18e634a2-1da0-39e2-bfb8-3a6fbe6713ca',
          entityName: 'luminaire_1',
          lastUpdateDate: 1660021340077,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'LuminaireComponent',
              componentTypeId: 'com.example.query.equipment.luminaire',
              properties: [],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_e77f1506-c506-3b0a-b69c-b0b7449005ce',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_e77f1506-c506-3b0a-b69c-b0b7449005ce',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'lighting_zone_db5249c8-1af7-3e6e-a3dc-f65438fbc73f',
          sourceComponentTypeId: 'com.example.query.zone.lighting',
        },
        {
          relationshipName: 'feed',
          targetEntityId: 'lighting_zone_db5249c8-1af7-3e6e-a3dc-f65438fbc73f',
          sourceComponentName: 'LuminaireComponent',
          sourceEntityId: 'luminaire_18e634a2-1da0-39e2-bfb8-3a6fbe6713ca',
          sourceComponentTypeId: 'com.example.query.equipment.luminaire',
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          creationDate: 1660021324601,
          entityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          entityName: 'floor_0',
          lastUpdateDate: 1660021325780,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 0,
                },
              ],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_ea4be13f-ee11-3c35-8b79-ada57b500b4d',
          creationDate: 1660021326262,
          entityId: 'room_ea4be13f-ee11-3c35-8b79-ada57b500b4d',
          entityName: 'room_3',
          lastUpdateDate: 1660021327053,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'RoomComponent',
              componentTypeId: 'com.example.query.construction.room',
              properties: [
                {
                  propertyName: 'roomFunction',
                  propertyValue: 'office',
                },
                {
                  propertyName: 'roomNumber',
                  propertyValue: 3,
                },
              ],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/lighting_zone_76f9143b-9d49-340a-831d-b5e1ece86454',
          creationDate: 1660021330884,
          entityId: 'lighting_zone_76f9143b-9d49-340a-831d-b5e1ece86454',
          entityName: 'lighting_zone_3',
          lastUpdateDate: 1660021331753,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'ZoneComponent',
              componentTypeId: 'com.example.query.zone.lighting',
              properties: [],
            },
          ],
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/luminaire_35c2c19b-7143-3b89-bc82-7f39d7568147',
          creationDate: 1660021339615,
          entityId: 'luminaire_35c2c19b-7143-3b89-bc82-7f39d7568147',
          entityName: 'luminaire_3',
          lastUpdateDate: 1660021340353,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'LuminaireComponent',
              componentTypeId: 'com.example.query.equipment.luminaire',
              properties: [],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_ea4be13f-ee11-3c35-8b79-ada57b500b4d',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_ea4be13f-ee11-3c35-8b79-ada57b500b4d',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'lighting_zone_76f9143b-9d49-340a-831d-b5e1ece86454',
          sourceComponentTypeId: 'com.example.query.zone.lighting',
        },
        {
          relationshipName: 'feed',
          targetEntityId: 'lighting_zone_76f9143b-9d49-340a-831d-b5e1ece86454',
          sourceComponentName: 'LuminaireComponent',
          sourceEntityId: 'luminaire_35c2c19b-7143-3b89-bc82-7f39d7568147',
          sourceComponentTypeId: 'com.example.query.equipment.luminaire',
        },
      ],
    },
  ],
  $metadata: {},
};
