import set from 'lodash-es/set';
import clone from 'lodash-es/cloneDeep';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';
import { type WidgetInstance } from '~/features/widget-instance/instance';
import { onUpdateWidgetsAction } from '~/store/actions';
import type {
  SetWidgetSetting,
  WidgetSetting,
  WidgetSettingPath,
} from '~/features/widget-customization/settings/types';
import { getWidgetSetting } from '~/features/widget-customization/settings/get-widget-setting';

export type UseWidgetSettingResult<
  WidgetType extends RegisteredWidgetType,
  SettingPath extends WidgetSettingPath<WidgetType>
> = readonly [
  WidgetSetting<WidgetType, SettingPath>,
  SetWidgetSetting<WidgetType, SettingPath>
];

export function useWidgetSetting<
  const WidgetType extends RegisteredWidgetType,
  const SettingPath extends WidgetSettingPath<WidgetType>
>(
  widget: WidgetInstance<WidgetType>,
  settingPath: SettingPath
): UseWidgetSettingResult<WidgetType, SettingPath> {
  const dispatch = useDispatch();

  const settingValue: WidgetSetting<WidgetType, SettingPath> = useMemo(
    () => getWidgetSetting(widget, settingPath),
    [widget, settingPath]
  ) as WidgetSetting<WidgetType, SettingPath>;

  const setSetting: SetWidgetSetting<WidgetType, SettingPath> = useCallback(
    (update) => {
      const updatedWidget = set(
        clone(widget),
        settingPath,
        update instanceof Function ? update(settingValue) : update
      );
      dispatch(onUpdateWidgetsAction({ widgets: [updatedWidget] }));
    },
    [dispatch, widget, settingValue, settingPath]
  );

  return [settingValue, setSetting] as const;
}
