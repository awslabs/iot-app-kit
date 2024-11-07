import { FormField, Grid } from '@cloudscape-design/components';
import './styles.css';
import type { FC, PropsWithChildren } from 'react';
import type { FormFieldProps, GridProps } from '@cloudscape-design/components';

type SettingTileProps = GridProps & FormFieldProps;
const SettingTile: FC<PropsWithChildren<SettingTileProps>> = ({
  gridDefinition,
  label,
  description,
  children,
}) => {
  return (
    <FormField label={label} description={description}>
      <Grid gridDefinition={gridDefinition}>{children}</Grid>
    </FormField>
  );
};

export default SettingTile;
