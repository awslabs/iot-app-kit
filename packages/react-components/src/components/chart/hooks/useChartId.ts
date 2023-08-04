import { useEffect, useRef } from "react";

import { v4 as uuid } from 'uuid';

const generateId = (id?: string) => id ?? `chart-${uuid()}`;

export const useChartId = (id?: string) => {
  const idRef = useRef(generateId(id));

  const chartId = useMemo(() => idRef.current, [id])

  useEffect(() => {
    // use the same function incase id changes from defined -> undefined
    idRef.current = generateId(id);
  }, [id]);

  return idRef;
};
