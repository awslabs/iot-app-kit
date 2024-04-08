import { useMemo } from 'react';

export const useTitle = ({ title }: { title?: string }) => {
  return useMemo(() => {
    return { title: [{ id: 'widget-title', text: title }] };
  }, [title]);
};
