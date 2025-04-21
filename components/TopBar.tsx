import { View } from "react-native";
import { Text } from "./ui/text";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { useThemeColor } from "~/hooks/useThemeColor";
import { useRouter } from "expo-router";

export function TopBar({
  header,
  headerRight,
  showArrowBack = false
}: {
  header: string,
  headerRight?: React.ReactNode,
  showArrowBack?: boolean
}) {
  const { colorOptions } = useThemeColor();
  const router = useRouter();

  return (
    <View className="w-full flex flex-row gap-4 items-end">
      {showArrowBack &&
        <ArrowLeft
          onPress={() => router.back()}
          color={colorOptions.text} />}
      <Text className="text-xl font-bold">{header}</Text>
      <View className="ml-auto">
        {headerRight}
      </View>
    </View>
  );
}