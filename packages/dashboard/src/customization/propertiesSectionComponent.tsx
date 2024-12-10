import { type DashboardWidget } from '../types';
import {
  type FilterPredicate,
  type RenderSection,
  useSelection,
} from './propertiesSection';

export type PropertiesSectionProps<W extends DashboardWidget> = {
  isVisible?: FilterPredicate<W> | undefined;
  render: RenderSection<W>;
};

export type DashboardSelection = NonNullable<ReturnType<typeof useSelection>>;

export const PropertiesSection = <W extends DashboardWidget>({
  isVisible,
  render,
}: PropertiesSectionProps<W>) => {
  const compositeSelection = useSelection({ filter: isVisible });

  if (!compositeSelection) return null;

  return render(compositeSelection);
};
