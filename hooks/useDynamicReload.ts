import { useContext, useEffect } from "react";
import { UpdateContext, UpdateEntry } from "~/components/providers/UpdateProvider";

// onUpdate function is called only if all of the updateKeys are available
// in the updateEntries
export function useDynamicReload(
  onUpdate?: (entry: UpdateEntry[]) => void,
  updateKeys?: string[]
) {
  const { updateEntries, setUpdateEntries } = useContext(UpdateContext);

  useEffect(() => {
    if(onUpdate && updateKeys && updateKeys.length > 0) {
      if(updateKeys.every(key => updateEntries.some(entry => entry.key === key))) {
        const entries = updateEntries.filter(entry => updateKeys.includes(entry.key));
        onUpdate(entries);
      } 
    }
  }, [updateEntries]);

  const sendDynamicReload = (reloadEntries: UpdateEntry | UpdateEntry[]) => {
    if(Array.isArray(reloadEntries)) {
      setUpdateEntries(reloadEntries);
    } else {
      setUpdateEntries([reloadEntries]);
    }
  };

  return {
    reloadEntries: updateEntries,
    sendDynamicReload
  };
}