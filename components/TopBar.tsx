import { View } from "react-native";
import { Text } from "./ui/text";

export function TopBar({
  header,
  headerRight
}: {
  header: string,
  headerRight?: React.ReactNode
}) {
  return (
    <View className="w-full flex flex-row justify-between items-end">
      <Text className="text-xl font-bold">{header}</Text>
      {headerRight}
    </View>
  );
}