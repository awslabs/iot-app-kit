export interface UnmodeledDataStreamProps {
  propertyAlias: string;
  color?: string | undefined;
  setColor?: (color?: string | undefined) => void;
  name?: string | undefined;
  setName: (name?: string | undefined) => void;
  onDelete: VoidFunction;
}

export const UnmodeledDataStream = (_props: UnmodeledDataStreamProps) => {
  return null;
  /*
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

   */
};
