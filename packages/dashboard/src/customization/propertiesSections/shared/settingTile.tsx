import React from 'react';
import Grid from '@cloudscape-design/components/grid';
import FormField from '@cloudscape-design/components/form-field';
import type { FC, PropsWithChildren } from 'react';
import type { FormFieldProps } from '@cloudscape-design/components/form-field';
import type { GridProps } from '@cloudscape-design/components/grid';
import './styles.css';

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
