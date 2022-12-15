import React, { FC, PropsWithChildren } from 'react';
import { FormField, FormFieldProps, Grid, GridProps } from '@cloudscape-design/components';
import './styles.css';

type SettingTileProps = GridProps & FormFieldProps;
const SettingTile: FC<PropsWithChildren<SettingTileProps>> = ({ gridDefinition, label, description, children }) => {
  return (
    <FormField label={label} description={description}>
      <Grid gridDefinition={gridDefinition}>{children}</Grid>
    </FormField>
  );
};

export default SettingTile;
