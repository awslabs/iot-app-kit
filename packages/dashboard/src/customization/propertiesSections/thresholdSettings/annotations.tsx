import { Toggle } from '@cloudscape-design/components';

export type AnnotationsSettingsProps = {
  colorBreachedData: boolean;
  toggleColorBreachedData: (colorBreachedData: boolean) => void;
};
export const AnnotationsSettings: React.FC<AnnotationsSettingsProps> = ({
  colorBreachedData,
  toggleColorBreachedData,
}) => (
  <Toggle
    checked={colorBreachedData}
    onChange={(e) => toggleColorBreachedData(e.detail.checked)}
  >
    Apply threshold color across all data
  </Toggle>
);
