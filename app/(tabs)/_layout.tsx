import { Tabs } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useLayoutEffect } from "react";
import { Home } from "~/lib/icons/Home";
import { Rows3 } from "~/lib/icons/Rows3";
import { Settings } from "~/lib/icons/Settings";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useTranslation } from "react-i18next";

export default function TabsLayout() {
  const db = useSQLiteContext();
  const { colorScheme, setColorScheme } = useColorScheme();
  const { t } = useTranslation('menu');

  useLayoutEffect(() => {
    (async () => {
      const settings = await db.getAllAsync<{ key: string, value: string }>(`
        SELECT key, value FROM settings
      `);

      const colorSchemeSetting = settings.find(el => el.key === 'colorScheme');
      if(colorSchemeSetting?.value === 'dark' || colorSchemeSetting?.value === 'light') {
        setColorScheme(colorSchemeSetting.value);
      }
    })();
  });

  return (
    <Tabs>
      <Tabs.Screen 
        name="index"
        options={{
          title: t('Home'),
          headerShown: false,
          tabBarIcon: ({ color }) => <Home color={color} />
        }}/>

      <Tabs.Screen 
        name="projects"
        options={{
          title: t('Projects'),
          headerShown: false,
          tabBarIcon: ({ color }) => <Rows3 color={color} />
        }}/>

      <Tabs.Screen 
        name="settings"
        options={{
          title: t('Settings'),
          headerShown: false,
          tabBarIcon: ({ color }) => <Settings color={color} />
        }}/>
    </Tabs>
  );
}