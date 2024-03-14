import { useEffect, useState } from 'react';
import { ChartDataQuality, ChartOptions } from '../types';

type DataQualityOptions = ChartDataQuality &
  Pick<ChartOptions, 'onChartOptionsChange'>;
export const useDataQuality = ({
  showBadDataIcons,
  showUncertainDataIcons,
  onChartOptionsChange,
}: DataQualityOptions) => {
  const [badDataIconsVisible, setBadDataIconsVisibility] =
    useState(showBadDataIcons);
  const [uncertainDataIconsVisible, setUncertainDataIconsVisibility] = useState(
    showUncertainDataIcons
  );

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

  return {
    showBadDataIcons: badDataIconsVisible,
    showUncertainDataIcons: uncertainDataIconsVisible,
    handleChangeBadDataIconsVisibility,
    handleChangeUncertainDataIconsVisibility,
  };
};
