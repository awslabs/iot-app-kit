import { default as GaugeSvg } from './gauge.svg';
import { default as GaugeSvgDark } from './gauge-dark.svg';
import WidgetIcon from '../components/widgetIcon';

const GaugeIcon = () => {
  return (
    <WidgetIcon widget='gauge' defaultIcon={GaugeSvg} darkIcon={GaugeSvgDark} />
  );
};

export default GaugeIcon;
