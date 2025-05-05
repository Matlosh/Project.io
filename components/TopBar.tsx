import { View } from "react-native";
import { Text } from "./ui/text";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { useThemeColor } from "~/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { cn } from "~/lib/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

  return (
    <View className="w-full flex flex-row gap-4 items-end">
      {showArrowBack &&
        <ArrowLeft
          onPress={() => router.back()}
          color={colorOptions.text} />}
      <Text className={
        cn("text-xl font-bold leading-[100%] pr-4",
          !headerRight || headerRight.toString().trim().length < 1 ? "w-full" : "w-4/5")}>{header}</Text>
      <View className="ml-auto">
        {headerRight}
      </View>
    </View>
  );
}