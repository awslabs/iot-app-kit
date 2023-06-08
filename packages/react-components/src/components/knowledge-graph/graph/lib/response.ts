// TODO: Get rid of this
// istanbul ignore file
export const response = {
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
};

export const response2 = {
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
};

export const response3 = {
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
};
export const response4 = {
  columnDescriptions: [
    {
      name: 'e1',
      type: 'NODE',
    },
    {
      name: 'r1',
      type: 'EDGE',
    },
    {
      name: 'e2',
      type: 'NODE',
    },
    {
      name: 'r2',
      type: 'EDGE',
    },
    {
      name: 'e3',
      type: 'NODE',
    },
  ],
  rows: [
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'building_fa4c3103-26c1-3643-a592-5142336c8994',
          sourceComponentName: 'FloorComponent',
          sourceEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentTypeId: 'com.example.query.construction.floor',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/building_fa4c3103-26c1-3643-a592-5142336c8994',
          creationDate: 1660021324285,
          entityId: 'building_fa4c3103-26c1-3643-a592-5142336c8994',
          entityName: 'building_0',
          lastUpdateDate: 1660021325414,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'BuildingComponent',
              componentTypeId: 'com.example.query.construction.building',
              properties: [
                {
                  propertyName: 'isLocationOf',
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'building_fa4c3103-26c1-3643-a592-5142336c8994',
          sourceComponentName: 'FloorComponent',
          sourceEntityId: 'floor_31589e0d-5c11-3b5b-a085-74808a555318',
          sourceComponentTypeId: 'com.example.query.construction.floor',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_31589e0d-5c11-3b5b-a085-74808a555318',
          creationDate: 1660021324982,
          entityId: 'floor_31589e0d-5c11-3b5b-a085-74808a555318',
          entityName: 'floor_2',
          lastUpdateDate: 1660021326155,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 2,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'building_fa4c3103-26c1-3643-a592-5142336c8994',
          sourceComponentName: 'FloorComponent',
          sourceEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentTypeId: 'com.example.query.construction.floor',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/building_fa4c3103-26c1-3643-a592-5142336c8994',
          creationDate: 1660021324285,
          entityId: 'building_fa4c3103-26c1-3643-a592-5142336c8994',
          entityName: 'building_0',
          lastUpdateDate: 1660021325414,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'BuildingComponent',
              componentTypeId: 'com.example.query.construction.building',
              properties: [
                {
                  propertyName: 'isLocationOf',
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'building_fa4c3103-26c1-3643-a592-5142336c8994',
          sourceComponentName: 'FloorComponent',
          sourceEntityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
          sourceComponentTypeId: 'com.example.query.construction.floor',
        },
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
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'building_fa4c3103-26c1-3643-a592-5142336c8994',
          sourceComponentName: 'FloorComponent',
          sourceEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentTypeId: 'com.example.query.construction.floor',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/building_fa4c3103-26c1-3643-a592-5142336c8994',
          creationDate: 1660021324285,
          entityId: 'building_fa4c3103-26c1-3643-a592-5142336c8994',
          entityName: 'building_0',
          lastUpdateDate: 1660021325414,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'BuildingComponent',
              componentTypeId: 'com.example.query.construction.building',
              properties: [
                {
                  propertyName: 'isLocationOf',
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'building_fa4c3103-26c1-3643-a592-5142336c8994',
          sourceComponentName: 'FloorComponent',
          sourceEntityId: 'floor_8515ece3-a53c-3726-9963-07766b039ab1',
          sourceComponentTypeId: 'com.example.query.construction.floor',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_8515ece3-a53c-3726-9963-07766b039ab1',
          creationDate: 1660021324779,
          entityId: 'floor_8515ece3-a53c-3726-9963-07766b039ab1',
          entityName: 'floor_1',
          lastUpdateDate: 1660021325772,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 1,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'building_fa4c3103-26c1-3643-a592-5142336c8994',
          sourceComponentName: 'FloorComponent',
          sourceEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentTypeId: 'com.example.query.construction.floor',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/building_fa4c3103-26c1-3643-a592-5142336c8994',
          creationDate: 1660021324285,
          entityId: 'building_fa4c3103-26c1-3643-a592-5142336c8994',
          entityName: 'building_0',
          lastUpdateDate: 1660021325414,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'BuildingComponent',
              componentTypeId: 'com.example.query.construction.building',
              properties: [
                {
                  propertyName: 'isLocationOf',
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'building_fa4c3103-26c1-3643-a592-5142336c8994',
          sourceComponentName: 'FloorComponent',
          sourceEntityId: 'floor_e0370116-560f-305d-a050-4134a03e207f',
          sourceComponentTypeId: 'com.example.query.construction.floor',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_e0370116-560f-305d-a050-4134a03e207f',
          creationDate: 1660021325174,
          entityId: 'floor_e0370116-560f-305d-a050-4134a03e207f',
          entityName: 'floor_3',
          lastUpdateDate: 1660021326084,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 3,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_12c93e44-ca82-3c85-bf2c-4da8338e5465',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_12c93e44-ca82-3c85-bf2c-4da8338e5465',
          creationDate: 1660021329573,
          entityId: 'room_12c93e44-ca82-3c85-bf2c-4da8338e5465',
          entityName: 'room_21',
          lastUpdateDate: 1660021330410,
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
                  propertyValue: 21,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_12c93e44-ca82-3c85-bf2c-4da8338e5465',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'hvac_zone_ac499c31-96af-3001-b0ad-6c7aa40cd62c',
          sourceComponentTypeId: 'com.example.query.zone.hvac',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/hvac_zone_ac499c31-96af-3001-b0ad-6c7aa40cd62c',
          creationDate: 1660021338383,
          entityId: 'hvac_zone_ac499c31-96af-3001-b0ad-6c7aa40cd62c',
          entityName: 'hvac_zone_21',
          lastUpdateDate: 1660021339201,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'ZoneComponent',
              componentTypeId: 'com.example.query.zone.hvac',
              properties: [],
            },
          ],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_12c93e44-ca82-3c85-bf2c-4da8338e5465',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_12c93e44-ca82-3c85-bf2c-4da8338e5465',
          creationDate: 1660021329573,
          entityId: 'room_12c93e44-ca82-3c85-bf2c-4da8338e5465',
          entityName: 'room_21',
          lastUpdateDate: 1660021330410,
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
                  propertyValue: 21,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_12c93e44-ca82-3c85-bf2c-4da8338e5465',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'lighting_zone_a729f8ac-ca96-3944-948a-8a7ecf0190b1',
          sourceComponentTypeId: 'com.example.query.zone.lighting',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/lighting_zone_a729f8ac-ca96-3944-948a-8a7ecf0190b1',
          creationDate: 1660021334146,
          entityId: 'lighting_zone_a729f8ac-ca96-3944-948a-8a7ecf0190b1',
          entityName: 'lighting_zone_21',
          lastUpdateDate: 1660021334903,
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
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_12c93e44-ca82-3c85-bf2c-4da8338e5465',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_12c93e44-ca82-3c85-bf2c-4da8338e5465',
          creationDate: 1660021329573,
          entityId: 'room_12c93e44-ca82-3c85-bf2c-4da8338e5465',
          entityName: 'room_21',
          lastUpdateDate: 1660021330410,
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
                  propertyValue: 21,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isChildOf',
          targetEntityId: 'room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          sourceEntityId: 'room_12c93e44-ca82-3c85-bf2c-4da8338e5465',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          creationDate: 1660021325574,
          entityId: 'room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          entityName: 'parent_room',
          lastUpdateDate: 1660021325574,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_30617bab-53a0-3618-b0db-621b1acdbd36',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_30617bab-53a0-3618-b0db-621b1acdbd36',
          creationDate: 1660021330080,
          entityId: 'room_30617bab-53a0-3618-b0db-621b1acdbd36',
          entityName: 'room_24',
          lastUpdateDate: 1660021330863,
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
                  propertyValue: 24,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_30617bab-53a0-3618-b0db-621b1acdbd36',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'hvac_zone_4bd1c336-caf2-3786-be44-acd09ae324ef',
          sourceComponentTypeId: 'com.example.query.zone.hvac',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/hvac_zone_4bd1c336-caf2-3786-be44-acd09ae324ef',
          creationDate: 1660021338839,
          entityId: 'hvac_zone_4bd1c336-caf2-3786-be44-acd09ae324ef',
          entityName: 'hvac_zone_24',
          lastUpdateDate: 1660021339629,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'ZoneComponent',
              componentTypeId: 'com.example.query.zone.hvac',
              properties: [],
            },
          ],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_30617bab-53a0-3618-b0db-621b1acdbd36',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_30617bab-53a0-3618-b0db-621b1acdbd36',
          creationDate: 1660021330080,
          entityId: 'room_30617bab-53a0-3618-b0db-621b1acdbd36',
          entityName: 'room_24',
          lastUpdateDate: 1660021330863,
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
                  propertyValue: 24,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_30617bab-53a0-3618-b0db-621b1acdbd36',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'lighting_zone_eeff449f-1f96-3860-8e8a-c91a38912dfd',
          sourceComponentTypeId: 'com.example.query.zone.lighting',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/lighting_zone_eeff449f-1f96-3860-8e8a-c91a38912dfd',
          creationDate: 1660021334670,
          entityId: 'lighting_zone_eeff449f-1f96-3860-8e8a-c91a38912dfd',
          entityName: 'lighting_zone_24',
          lastUpdateDate: 1660021335620,
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
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_30617bab-53a0-3618-b0db-621b1acdbd36',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_30617bab-53a0-3618-b0db-621b1acdbd36',
          creationDate: 1660021330080,
          entityId: 'room_30617bab-53a0-3618-b0db-621b1acdbd36',
          entityName: 'room_24',
          lastUpdateDate: 1660021330863,
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
                  propertyValue: 24,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isChildOf',
          targetEntityId: 'room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          sourceEntityId: 'room_30617bab-53a0-3618-b0db-621b1acdbd36',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          creationDate: 1660021325574,
          entityId: 'room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          entityName: 'parent_room',
          lastUpdateDate: 1660021325574,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_4e86b165-975b-3d4f-8a7a-f53b274e8830',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_4e86b165-975b-3d4f-8a7a-f53b274e8830',
          creationDate: 1660021329927,
          entityId: 'room_4e86b165-975b-3d4f-8a7a-f53b274e8830',
          entityName: 'room_23',
          lastUpdateDate: 1660021330782,
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
                  propertyValue: 23,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_4e86b165-975b-3d4f-8a7a-f53b274e8830',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'hvac_zone_86bb8ca2-ae3f-3c08-aca9-4962993da5b2',
          sourceComponentTypeId: 'com.example.query.zone.hvac',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/hvac_zone_86bb8ca2-ae3f-3c08-aca9-4962993da5b2',
          creationDate: 1660021338687,
          entityId: 'hvac_zone_86bb8ca2-ae3f-3c08-aca9-4962993da5b2',
          entityName: 'hvac_zone_23',
          lastUpdateDate: 1660021339526,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'ZoneComponent',
              componentTypeId: 'com.example.query.zone.hvac',
              properties: [],
            },
          ],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_4e86b165-975b-3d4f-8a7a-f53b274e8830',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_4e86b165-975b-3d4f-8a7a-f53b274e8830',
          creationDate: 1660021329927,
          entityId: 'room_4e86b165-975b-3d4f-8a7a-f53b274e8830',
          entityName: 'room_23',
          lastUpdateDate: 1660021330782,
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
                  propertyValue: 23,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_4e86b165-975b-3d4f-8a7a-f53b274e8830',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'lighting_zone_b980cfe1-4263-3e5b-9a56-c76693d8995a',
          sourceComponentTypeId: 'com.example.query.zone.lighting',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/lighting_zone_b980cfe1-4263-3e5b-9a56-c76693d8995a',
          creationDate: 1660021334461,
          entityId: 'lighting_zone_b980cfe1-4263-3e5b-9a56-c76693d8995a',
          entityName: 'lighting_zone_23',
          lastUpdateDate: 1660021335278,
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
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_4e86b165-975b-3d4f-8a7a-f53b274e8830',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_4e86b165-975b-3d4f-8a7a-f53b274e8830',
          creationDate: 1660021329927,
          entityId: 'room_4e86b165-975b-3d4f-8a7a-f53b274e8830',
          entityName: 'room_23',
          lastUpdateDate: 1660021330782,
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
                  propertyValue: 23,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isChildOf',
          targetEntityId: 'room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          sourceEntityId: 'room_4e86b165-975b-3d4f-8a7a-f53b274e8830',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          creationDate: 1660021325574,
          entityId: 'room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          entityName: 'parent_room',
          lastUpdateDate: 1660021325574,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_c596c0e5-3cff-3139-959f-1dafb5a74b54',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_c596c0e5-3cff-3139-959f-1dafb5a74b54',
          creationDate: 1660021329387,
          entityId: 'room_c596c0e5-3cff-3139-959f-1dafb5a74b54',
          entityName: 'room_20',
          lastUpdateDate: 1660021330171,
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
                  propertyValue: 20,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_c596c0e5-3cff-3139-959f-1dafb5a74b54',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'hvac_zone_1ecbff68-5efe-3582-94a8-e186e283d630',
          sourceComponentTypeId: 'com.example.query.zone.hvac',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/hvac_zone_1ecbff68-5efe-3582-94a8-e186e283d630',
          creationDate: 1660021338221,
          entityId: 'hvac_zone_1ecbff68-5efe-3582-94a8-e186e283d630',
          entityName: 'hvac_zone_20',
          lastUpdateDate: 1660021339000,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'ZoneComponent',
              componentTypeId: 'com.example.query.zone.hvac',
              properties: [],
            },
          ],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_c596c0e5-3cff-3139-959f-1dafb5a74b54',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_c596c0e5-3cff-3139-959f-1dafb5a74b54',
          creationDate: 1660021329387,
          entityId: 'room_c596c0e5-3cff-3139-959f-1dafb5a74b54',
          entityName: 'room_20',
          lastUpdateDate: 1660021330171,
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
                  propertyValue: 20,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_c596c0e5-3cff-3139-959f-1dafb5a74b54',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'lighting_zone_736053de-fd79-34cd-83a1-3178522c28ce',
          sourceComponentTypeId: 'com.example.query.zone.lighting',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/lighting_zone_736053de-fd79-34cd-83a1-3178522c28ce',
          creationDate: 1660021333987,
          entityId: 'lighting_zone_736053de-fd79-34cd-83a1-3178522c28ce',
          entityName: 'lighting_zone_20',
          lastUpdateDate: 1660021334721,
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
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_c596c0e5-3cff-3139-959f-1dafb5a74b54',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_c596c0e5-3cff-3139-959f-1dafb5a74b54',
          creationDate: 1660021329387,
          entityId: 'room_c596c0e5-3cff-3139-959f-1dafb5a74b54',
          entityName: 'room_20',
          lastUpdateDate: 1660021330171,
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
                  propertyValue: 20,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isChildOf',
          targetEntityId: 'room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          sourceEntityId: 'room_c596c0e5-3cff-3139-959f-1dafb5a74b54',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          creationDate: 1660021325574,
          entityId: 'room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          entityName: 'parent_room',
          lastUpdateDate: 1660021325574,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_d6612418-a7e4-3fe5-8a02-08da8eb7b319',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_d6612418-a7e4-3fe5-8a02-08da8eb7b319',
          creationDate: 1660021329758,
          entityId: 'room_d6612418-a7e4-3fe5-8a02-08da8eb7b319',
          entityName: 'room_22',
          lastUpdateDate: 1660021330556,
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
                  propertyValue: 22,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_d6612418-a7e4-3fe5-8a02-08da8eb7b319',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'hvac_zone_0393033c-dd85-38d6-bf42-381c97c48012',
          sourceComponentTypeId: 'com.example.query.zone.hvac',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/hvac_zone_0393033c-dd85-38d6-bf42-381c97c48012',
          creationDate: 1660021338536,
          entityId: 'hvac_zone_0393033c-dd85-38d6-bf42-381c97c48012',
          entityName: 'hvac_zone_22',
          lastUpdateDate: 1660021339344,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'ZoneComponent',
              componentTypeId: 'com.example.query.zone.hvac',
              properties: [],
            },
          ],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_d6612418-a7e4-3fe5-8a02-08da8eb7b319',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_d6612418-a7e4-3fe5-8a02-08da8eb7b319',
          creationDate: 1660021329758,
          entityId: 'room_d6612418-a7e4-3fe5-8a02-08da8eb7b319',
          entityName: 'room_22',
          lastUpdateDate: 1660021330556,
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
                  propertyValue: 22,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'hasPart',
          targetEntityId: 'room_d6612418-a7e4-3fe5-8a02-08da8eb7b319',
          sourceComponentName: 'ZoneComponent',
          sourceEntityId: 'lighting_zone_99a4c213-c191-30bb-95f6-e62d10d6fb07',
          sourceComponentTypeId: 'com.example.query.zone.lighting',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/lighting_zone_99a4c213-c191-30bb-95f6-e62d10d6fb07',
          creationDate: 1660021334306,
          entityId: 'lighting_zone_99a4c213-c191-30bb-95f6-e62d10d6fb07',
          entityName: 'lighting_zone_22',
          lastUpdateDate: 1660021335074,
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
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isLocationOf',
          targetEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          sourceComponentName: 'RoomComponent',
          sourceEntityId: 'room_d6612418-a7e4-3fe5-8a02-08da8eb7b319',
          sourceComponentTypeId: 'com.example.query.construction.room',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_d6612418-a7e4-3fe5-8a02-08da8eb7b319',
          creationDate: 1660021329758,
          entityId: 'room_d6612418-a7e4-3fe5-8a02-08da8eb7b319',
          entityName: 'room_22',
          lastUpdateDate: 1660021330556,
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
                  propertyValue: 22,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isChildOf',
          targetEntityId: 'room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          sourceEntityId: 'room_d6612418-a7e4-3fe5-8a02-08da8eb7b319',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          creationDate: 1660021325574,
          entityId: 'room_bdd8d392-e275-3f7f-b0d5-c2f26c6531dc',
          entityName: 'parent_room',
          lastUpdateDate: 1660021325574,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isChildOf',
          targetEntityId: 'floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          sourceEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          creationDate: 1660021324475,
          entityId: 'floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          entityName: 'parent_floor',
          lastUpdateDate: 1660021324475,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [],
        },
        {
          relationshipName: 'isChildOf',
          targetEntityId: 'floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          sourceEntityId: 'floor_31589e0d-5c11-3b5b-a085-74808a555318',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_31589e0d-5c11-3b5b-a085-74808a555318',
          creationDate: 1660021324982,
          entityId: 'floor_31589e0d-5c11-3b5b-a085-74808a555318',
          entityName: 'floor_2',
          lastUpdateDate: 1660021326155,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 2,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isChildOf',
          targetEntityId: 'floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          sourceEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          creationDate: 1660021324475,
          entityId: 'floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          entityName: 'parent_floor',
          lastUpdateDate: 1660021324475,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [],
        },
        {
          relationshipName: 'isChildOf',
          targetEntityId: 'floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          sourceEntityId: 'floor_3b577379-0cd4-32c9-8e9d-6dbd2d898c61',
        },
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
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isChildOf',
          targetEntityId: 'floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          sourceEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          creationDate: 1660021324475,
          entityId: 'floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          entityName: 'parent_floor',
          lastUpdateDate: 1660021324475,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [],
        },
        {
          relationshipName: 'isChildOf',
          targetEntityId: 'floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          sourceEntityId: 'floor_8515ece3-a53c-3726-9963-07766b039ab1',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_8515ece3-a53c-3726-9963-07766b039ab1',
          creationDate: 1660021324779,
          entityId: 'floor_8515ece3-a53c-3726-9963-07766b039ab1',
          entityName: 'floor_1',
          lastUpdateDate: 1660021325772,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 1,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      rowData: [
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          creationDate: 1660021325376,
          entityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
          entityName: 'floor_4',
          lastUpdateDate: 1660021326263,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 4,
                },
              ],
            },
          ],
        },
        {
          relationshipName: 'isChildOf',
          targetEntityId: 'floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          sourceEntityId: 'floor_1b226758-43f4-3ca2-b9d9-10d5288142e2',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          creationDate: 1660021324475,
          entityId: 'floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          entityName: 'parent_floor',
          lastUpdateDate: 1660021324475,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [],
        },
        {
          relationshipName: 'isChildOf',
          targetEntityId: 'floor_1a5e6701-2ac1-3da6-9306-af014ab354ca',
          sourceEntityId: 'floor_e0370116-560f-305d-a050-4134a03e207f',
        },
        {
          arn: 'arn:aws:iottwinmaker:us-east-1:638842452100:workspace/SmartBuilding/entity/floor_e0370116-560f-305d-a050-4134a03e207f',
          creationDate: 1660021325174,
          entityId: 'floor_e0370116-560f-305d-a050-4134a03e207f',
          entityName: 'floor_3',
          lastUpdateDate: 1660021326084,
          workspaceId: 'SmartBuilding',
          description: '',
          components: [
            {
              componentName: 'FloorComponent',
              componentTypeId: 'com.example.query.construction.floor',
              properties: [
                {
                  propertyName: 'floorNumber',
                  propertyValue: 3,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
