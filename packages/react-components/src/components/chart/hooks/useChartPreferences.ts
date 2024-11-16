import { useEffect, useState } from 'react';
import { type ChartDataQuality, type ChartOptions } from '../types';

type ChartPreferencesOptions = ChartDataQuality &
  Pick<ChartOptions, 'onChartOptionsChange'> & {
    showAlarmIcons?: boolean;
  };
export const useChartPreferences = ({
  showBadDataIcons,
  showUncertainDataIcons,
  showAlarmIcons = true,
  onChartOptionsChange,
}: ChartPreferencesOptions) => {
  const [badDataIconsVisible, setBadDataIconsVisibility] =
    useState(showBadDataIcons);
  const [uncertainDataIconsVisible, setUncertainDataIconsVisibility] = useState(
    showUncertainDataIcons
  );
  const [alarmIconsVisible, setAlarmIconsVisibility] = useState(showAlarmIcons);

  useEffect(() => {
    setBadDataIconsVisibility(showBadDataIcons);
    setUncertainDataIconsVisibility(showUncertainDataIcons);
  }, [
    showBadDataIcons,
    showUncertainDataIcons,
    setBadDataIconsVisibility,
    setUncertainDataIconsVisibility,
  ]);

  const handleUpdateChartOptions = (dataQuality: ChartDataQuality) => {
    if (!onChartOptionsChange) return;
    onChartOptionsChange({ dataQuality });
  };

  const handleChangeBadDataIconsVisibility = (showBadDataIcons: boolean) => {
    setBadDataIconsVisibility(showBadDataIcons);
    handleUpdateChartOptions({
      showBadDataIcons,
      showUncertainDataIcons: uncertainDataIconsVisible,
    });
  };
  const handleChangeUncertainDataIconsVisibility = (
    showUncertainDataIcons: boolean
  ) => {
    setUncertainDataIconsVisibility(showUncertainDataIcons);
    handleUpdateChartOptions({
      showBadDataIcons: badDataIconsVisible,
      showUncertainDataIcons,
    });
  };

  const handleChangeAlarmIconsVisibility = (showAlarmIcons: boolean) => {
    setAlarmIconsVisibility(showAlarmIcons);
  };

  return {
    showBadDataIcons: badDataIconsVisible,
    showUncertainDataIcons: uncertainDataIconsVisible,
    showAlarmIcons: alarmIconsVisible,
    handleChangeBadDataIconsVisibility,
    handleChangeUncertainDataIconsVisibility,
    handleChangeAlarmIconsVisibility,
  };
};
