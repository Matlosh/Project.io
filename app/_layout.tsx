import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/hooks/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { migrateDbIfNeeded } from '~/lib/database';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "~/lib/i18n";
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { showToast } from '~/lib/utils';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};

const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Database is hosted locally, so there shouldn't be need to retry
      retry: 0
    }
  },
  queryCache: new QueryCache({
    onError: (error) => {
      showToast(error.message); 
    }
  })
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

function Loading() {
  return (
    <View className="w-full h-full justify-center items-center">
      <ActivityIndicator size="large" /> 
    </View>  
  )
}

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }

    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <QueryClientProvider client={queryClient}>
            <SQLiteProvider databaseName='project_io.db' onInit={migrateDbIfNeeded}>
              <React.Suspense fallback={<Loading />}>
                <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
                <Stack>
                  <Stack.Screen
                    name='(tabs)'
                    options={{
                      title: 'Project.io',
                      headerShown: false
                    }}
                  />
                </Stack>
                <PortalHost />
              </React.Suspense>
            </SQLiteProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;