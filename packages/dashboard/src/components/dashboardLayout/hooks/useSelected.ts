import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';

export const useSelected = () => {
  const selectedWidgets = useSelectedWidgets();
  const selectedCount = selectedWidgets.length;
  const selected = selectedWidgets[0];

  const type = selected ? selected.type : undefined;
  return { selected, type, selectedCount };
};
