import SpaceBetween from '@cloudscape-design/components/space-between';
import { DataStreamListItem } from '~/customization/propertiesSections/propertiesAndAlarmsSettings/propertyComponent';
import { WidgetSetting } from '~/features/widget-customization/settings/widget-setting';
import type { DataStreamSettingsComponentProps } from '~/features/widget-customization/types';
import { ModeledDataStreamList } from '~/features/widget-customization/common/data-streams/modeled-data-stream-list';

export function DataStreamSettings({
  widget,
}: DataStreamSettingsComponentProps<'kpi'>) {
  return (
    <WidgetSetting
      widget={widget}
      settingPath='properties.styleSettings'
      render={({
        settingValue: styleSettings = {},
        setSettingValue: setStyleSettings,
      }) => (
        <ul>
          <SpaceBetween size='m' direction='vertical'>
            <WidgetSetting
              widget={widget}
              settingPath='properties.queryConfig.query.assets'
              render={({
                settingValue: assetQueries = [],
                setSettingValue: setAssetQueries,
              }) => (
                <ModeledDataStreamList
                  assetQueries={assetQueries}
                  setAssetQueries={setAssetQueries}
                />
              )}
            />

            <WidgetSetting
              widget={widget}
              settingPath='properties.queryConfig.query.properties'
              render={({
                settingValue: unmodeledDataStreams = [],
                setSettingValue: setUnmodeledDataStreams,
              }) => {
                return unmodeledDataStreams.map(
                  ({ propertyAlias, refId = propertyAlias }) => (
                    <DataStreamListItem
                      key={propertyAlias}
                      onDelete={() => {
                        setUnmodeledDataStreams((current = []) =>
                          current.filter(
                            (ds) => ds.propertyAlias !== propertyAlias
                          )
                        );
                      }}
                      // TODO: Cannot color KPI properties - move this
                      color={styleSettings[refId].color}
                      setColor={(color) => {
                        setStyleSettings((current = {}) => {
                          return {
                            ...current,
                            [refId]: {
                              ...current[refId],
                              color,
                            },
                          };
                        });
                      }}
                      name={styleSettings[refId].name}
                      setName={(name) => {
                        setStyleSettings((current = {}) => {
                          return {
                            ...current,
                            [refId]: {
                              ...current[refId],
                              name,
                            },
                          };
                        });
                      }}
                    />
                  )
                );
              }}
            />

            <WidgetSetting
              widget={widget}
              settingPath='properties.queryConfig.query.assetModels'
              render={({
                settingValue: assetModelQueries,
                setSettingValue: setAssetModelQueries,
              }) => {
                return assetModelQueries?.flatMap(
                  ({ assetModelId, properties }) => {
                    return properties.map(
                      ({ propertyId, refId = propertyId }) => {
                        return (
                          <DataStreamListItem
                            key={`${assetModelId}-${propertyId}`}
                            onDelete={() => {
                              setAssetModelQueries((current = []) => {
                                return current
                                  .map((assetModelQuery) => {
                                    return {
                                      ...assetModelQuery,
                                      properties:
                                        assetModelQuery.properties.filter(
                                          (property) => {
                                            return (
                                              property.propertyId !== propertyId
                                            );
                                          }
                                        ),
                                    };
                                  })
                                  .filter(
                                    ({ properties }) => properties.length > 0
                                  );
                              });
                            }}
                            // TODO: Cannot color KPI properties - move this
                            color={styleSettings[refId].color}
                            setColor={(color) => {
                              setStyleSettings((current = {}) => {
                                return {
                                  ...current,
                                  [refId]: {
                                    ...current[refId],
                                    color,
                                  },
                                };
                              });
                            }}
                            name={styleSettings[refId].name}
                            setName={(name) => {
                              setStyleSettings((current = {}) => {
                                return {
                                  ...current,
                                  [refId]: {
                                    ...current[refId],
                                    name,
                                  },
                                };
                              });
                            }}
                          />
                        );
                      }
                    );
                  }
                );
              }}
            />

            <WidgetSetting
              widget={widget}
              settingPath='properties.queryConfig.query.alarms'
              render={({
                settingValue: alarmQueries = [],
                setSettingValue: setAlarmQueries,
              }) => {
                return alarmQueries.flatMap(({ assetId, alarmComponents }) => {
                  return alarmComponents.map(({ assetCompositeModelId }) => {
                    return (
                      <DataStreamListItem
                        key={`${assetId}-${assetCompositeModelId}`}
                        onDelete={() => {
                          setAlarmQueries((current = []) => {
                            return current
                              .map((alarmQuery) => {
                                return {
                                  ...alarmQuery,
                                  properties: alarmQuery.alarmComponents.filter(
                                    (component) => {
                                      return (
                                        component.assetCompositeModelId !==
                                        assetCompositeModelId
                                      );
                                    }
                                  ),
                                };
                              })
                              .filter(
                                ({ alarmComponents }) =>
                                  alarmComponents.length > 0
                              );
                          });
                        }}
                      />
                    );
                  });
                });
              }}
            />

            <WidgetSetting
              widget={widget}
              settingPath='properties.queryConfig.query.alarmModels'
              render={({
                settingValue: alarmModelQueries = [],
                setSettingValue: setAlarmModelQueries,
              }) => {
                return alarmModelQueries.flatMap(
                  ({ assetModelId, alarmComponents }) => {
                    return alarmComponents.map(({ assetCompositeModelId }) => {
                      return (
                        <DataStreamListItem
                          key={`${assetModelId}-${assetCompositeModelId}`}
                          onDelete={() => {
                            setAlarmModelQueries((current = []) => {
                              return current
                                .map((alarmModelQuery) => {
                                  return {
                                    ...alarmModelQuery,
                                    properties:
                                      alarmModelQuery.alarmComponents.filter(
                                        (component) => {
                                          return (
                                            component.assetCompositeModelId !==
                                            assetCompositeModelId
                                          );
                                        }
                                      ),
                                  };
                                })
                                .filter(
                                  ({ alarmComponents }) =>
                                    alarmComponents.length > 0
                                );
                            });
                          }}
                        />
                      );
                    });
                  }
                );
              }}
            />
          </SpaceBetween>
        </ul>
      )}
    />
  );
}
