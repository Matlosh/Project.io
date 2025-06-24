import { useState } from "react";
import { Pressable, View } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";

export type SwitchMenuEntry = {
  label: string;
  onPress: () => void;
};

export function SwitchMenu({
  entries
}: {
  entries: SwitchMenuEntry[];
}) {
  const [offset, setOffset] = useState(0);

  return (
    <View className="w-full flex flex-row items-center justify-center my-4 bg-border rounded-full">
        {entries.map((entry, index) => (
          <Pressable
          key={index}
          onPress={() => {
            setOffset(index);
            entry.onPress();
          }}
          className={cn(
            "w-1/2 px-4 py-2 rounded-full flex items-center justify-center",
            offset === index
              ? "bg-primary"
              : "bg-border"
          )}
        >
          <Text
           className={cn(
              "font-semibold",
              offset === index
                ? "text-white"
                : "text-foreground"
            )} 
          >
            {entry.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}