import FormField from '@cloudscape-design/components/form-field';
import { useMemo } from 'react';
import {
  Select,
  type SelectOption,
} from '~/features/widget-customization/atoms/select';
import {
  AUTO_RESOLUTION,
  FIFTEEN_MINUTE_RESOLUTION,
  ONE_DAY_RESOLUTION,
  ONE_HOUR_RESOLUTION,
  ONE_MINUTE_RESOLUTION,
  RAW_RESOLUTION,
  type RawResolution,
  type Resolution,
} from '@iot-app-kit/source-iotsitewise';
import './aggregation-settings.css';
import { type SetSettingFn } from '~/features/widget-customization/settings/types';

export const RESOLUTION_OPTIONS = [
  { text: 'Auto-select', value: AUTO_RESOLUTION },
  { text: 'Raw', value: RAW_RESOLUTION },
  { text: '1 min', value: ONE_MINUTE_RESOLUTION },
  { text: '15 min', value: FIFTEEN_MINUTE_RESOLUTION },
  { text: '1 hour', value: ONE_HOUR_RESOLUTION },
  { text: '1 day', value: ONE_DAY_RESOLUTION },
] as const satisfies SelectOption<Resolution>[];

export type SupportedResolution<ExcludeRaw extends boolean> =
  ExcludeRaw extends true ? Exclude<Resolution, RawResolution> : Resolution;

export type ResolutionFieldProps<ExcludeRaw extends boolean> = {
  resolution?: SupportedResolution<ExcludeRaw> | undefined;
  setResolution: SetSettingFn<SupportedResolution<ExcludeRaw> | undefined>;
  excludeRaw?: ExcludeRaw;
};

export const ResolutionField = <ExcludeRaw extends boolean>({
  resolution,
  setResolution,
  excludeRaw,
}: ResolutionFieldProps<ExcludeRaw>) => {
  const resolutionOptions: SelectOption<SupportedResolution<ExcludeRaw>>[] =
    useMemo(() => {
      return excludeRaw
        ? RESOLUTION_OPTIONS.filter((option) => option.value !== RAW_RESOLUTION)
        : RESOLUTION_OPTIONS;
    }, [excludeRaw]) as SelectOption<SupportedResolution<ExcludeRaw>>[];

  return (
    <FormField label='Resolution'>
      <Select
        settingValue={resolution}
        setSettingValue={setResolution}
        options={resolutionOptions}
      />
    </FormField>
  );
};
