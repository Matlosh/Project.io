import { View } from "react-native";
import { Text } from "../ui/text";
import { Switch } from "../ui/switch";
import { useColorScheme } from "~/hooks/useColorScheme";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { useSQLiteContext } from "expo-sqlite";

export function ThemeSettings() {
  const db = useSQLiteContext();
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);

    (async () => {
      await db.runAsync(`
        UPDATE settings SET value = ? WHERE key = ?
      `, [newTheme, 'colorScheme']);
    })();
  }

  return (
    <View className="flex flex-col gap-4">
      <View className="flex flex-row justify-between">
        <Text>Dark mode</Text>
        <Switch
          checked={isDarkColorScheme}
          onCheckedChange={toggleColorScheme} />
      </View>

      <View className="flex flex-row justify-between">
        <Text>24 hour clock</Text>
        <Switch
          checked={true}
          onCheckedChange={() => {}} />
      </View>
    </View>
  );
}