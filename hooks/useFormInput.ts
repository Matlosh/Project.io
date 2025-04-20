import { useState } from "react";

export function useFormInput<T>(defaultValue: T, name: string) {
  const [value, setValue] = useState<T>(defaultValue);

  return {
    value,
    setValue,
    name
  };
}