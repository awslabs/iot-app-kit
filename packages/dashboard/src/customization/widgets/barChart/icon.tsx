import { default as barSvg } from './bar.svg';
import { default as barSvgDark } from './bar-dark.svg';
import WidgetIcon from '../components/widgetIcon';

const BarIcon = () => {
  return <WidgetIcon widget='Bar' defaultIcon={barSvg} darkIcon={barSvgDark} />;
};
export default BarIcon;
