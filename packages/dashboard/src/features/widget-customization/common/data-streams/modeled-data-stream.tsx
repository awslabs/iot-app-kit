export interface ModeledDataStreamProps {
  assetId: string;
  propertyId: string;
  color?: string | undefined;
  setColor?: (color?: string | undefined) => void;
  name?: string | undefined;
  setName: (name?: string | undefined) => void;
  onDelete: VoidFunction;
}

export const ModeledDataStream = (_props: ModeledDataStreamProps) => {
  return null;
  /*
  const { modeledDataStream } = useModeledDataStream({ assetId, propertyId });

  return (
    <DataStreamListItem
      key={`${assetId}-${propertyId}`}
      onDelete={onDelete}
      color={color}
      setColor={setColor}
      name={name}
      setName={setName}
      defaultName={modeledDataStream?.assetProperty?.name ?? ''}
    />
  );

   */
};
