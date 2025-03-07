import { DataStreamListItem } from '~/customization/propertiesSections/propertiesAndAlarmsSettings/propertyComponent';

export interface UnmodeledDataStreamProps {
  propertyAlias: string;
  color?: string | undefined;
  setColor?: (color?: string | undefined) => void;
  name?: string | undefined;
  setName: (name?: string | undefined) => void;
  onDelete: VoidFunction;
}

export const UnmodeledDataStream = ({
  propertyAlias,
  color,
  setColor,
  name,
  setName,
  onDelete,
}: UnmodeledDataStreamProps) => {
  return (
    <DataStreamListItem
      key={propertyAlias}
      onDelete={onDelete}
      color={color}
      setColor={setColor}
      name={name}
      setName={setName}
      defaultName={propertyAlias}
    />
  );
};
