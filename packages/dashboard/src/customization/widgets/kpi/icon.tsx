import { default as KPISvg } from './KPI.svg';
import { default as KPISvgDark } from './KPI-dark.svg';
import WidgetIcon from '../components/widgetIcon';

const KPIIcon = () => {
  return <WidgetIcon widget='KPI' defaultIcon={KPISvg} darkIcon={KPISvgDark} />;
};

export default KPIIcon;
