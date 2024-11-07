import CloudscapeHeader from '@cloudscape-design/components/header';

export interface ResourceTableTitleProps {
  selectedResourceCount: number;
  totalResourceCount: number;
  pluralResourceName: string;
  titleExtension?: React.ReactNode;
  description?: string;
}

export function ResourceTableTitle({
  selectedResourceCount,
  totalResourceCount,
  pluralResourceName,
  titleExtension,
  description,
}: ResourceTableTitleProps) {
  return (
    <>
      <CloudscapeHeader
        variant='h3'
        counter={
          selectedResourceCount > 0
            ? `(${selectedResourceCount}/${totalResourceCount})`
            : `(${totalResourceCount})`
        }
        description={description}
      >
        {pluralResourceName}
      </CloudscapeHeader>

      {titleExtension}
    </>
  );
}
