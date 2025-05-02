import { createContext, useState } from "react";

export type UpdateEntry = {
  key: string,
  state: 'create' | 'update' | 'delete',
  values: string[]
};

export const UpdateContext = createContext<{
  updateEntries: UpdateEntry[],
  setUpdateEntries: React.Dispatch<React.SetStateAction<UpdateEntry[]>>
}>({
  updateEntries: [],
  setUpdateEntries: () => {}
});

export function UpdateProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [updateEntries, setUpdateEntries] = useState<UpdateEntry[]>([]);

  return (
    <UpdateContext.Provider value={{ updateEntries, setUpdateEntries }}>
      {children}
    </UpdateContext.Provider>
  );
}