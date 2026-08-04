import { useState } from 'react'

export const useFilter = <T extends object>(
  initial: T = {} as T,
) => {
  const [filters, setFilters] = useState<T>(initial);

  // TODO
  // useEffect(() => {
  //   setFilters(initial);
  // }, [initial]);

  const onChange = (key: keyof T, value: T[keyof T]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    filters,
    onChange,
  };
};
