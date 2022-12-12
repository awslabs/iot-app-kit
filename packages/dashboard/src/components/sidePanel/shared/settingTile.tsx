import React, { FC, PropsWithChildren } from 'react';
import { FormField, Grid, GridProps } from '@cloudscape-design/components';
import './styles.css';

type SettingTileProps = GridProps & { title: string };
const SettingTile: FC<PropsWithChildren<SettingTileProps>> = ({ gridDefinition, title, children }) => {
  return (
    <FormField label={title}>
      <Grid gridDefinition={gridDefinition}>{children}</Grid>
    </FormField>
  );
};

export default SettingTile;
