import set from 'lodash-es/set';
import clone from 'lodash-es/cloneDeep';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';
import { type WidgetInstance } from '~/features/widget-instance/instance';
import { onUpdateWidgetsAction } from '../../../store/actions';
import type {
  SetWidgetSetting,
  WidgetSetting,
  WidgetSettingPath,
} from '~/features/widget-customization/settings/types';
import { getWidgetSetting } from './get-widget-setting';

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
  widget: WidgetInstance<WidgetType> | undefined,
  settingPath: SettingPath
): UseWidgetSettingResult<WidgetType, SettingPath> {
  const dispatch = useDispatch();

  const settingValue: WidgetSetting<WidgetType, SettingPath> = (
    widget ? getWidgetSetting(widget, settingPath) : undefined
  ) as WidgetSetting<WidgetType, SettingPath>;

  const setSetting: SetWidgetSetting<WidgetType, SettingPath> = useCallback(
    (update) => {
      if (!widget) return;

      const updatedWidget = set(
        clone(widget),
        settingPath,
        update instanceof Function ? update(settingValue) : update
      );

      dispatch(onUpdateWidgetsAction({ widgets: [updatedWidget] }));
    },
    [dispatch, widget, settingValue, settingPath]
  );

  console.info('useWidgetSetting', [settingValue, settingPath]);

  return [settingValue, setSetting] as const;
}
