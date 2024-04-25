import '~/global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, Text } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '~/components/primitives/portal';
import { ThemeToggle } from '~/components/ThemeToggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import languagesList from './services/languageList.json';
import { useTranslation } from 'react-i18next';
import i18next, { languageResources } from './services/i18next';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const { t } = useTranslation();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (Platform.OS === 'web') {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
      }
      if (!theme) {
        AsyncStorage.setItem('theme', colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === 'dark' ? 'dark' : 'light';
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  const changeLng = lng => {
    i18next.changeLanguage(lng);
    setVisible(false);
  };

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen
          name='index'
          options={({ navigation }) => ({
            title: 'Portfolio',
            headerRight: () => (
              <Select defaultValue={{ value: i18next.language, label: languagesList[i18next.language].nativeName }} onValueChange={(value) => changeLng(value?.value)}>
                <SelectTrigger style={{ width: 120, paddingHorizontal: 10 }}>
                  <SelectValue
                    style={{ color: 'gray', fontSize: 14 }}
                    placeholder={t('select_language')}
                  />
                </SelectTrigger>
                <SelectContent style={{ width: 120 }}>
                  {Object.keys(languageResources).map((item) => (
                    <SelectItem key={item} label={languagesList[item].nativeName} value={item}>
                      <Text>
                        {languagesList[item].nativeName}
                      </Text>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
            headerTitleAlign: 'center',
            headerLeft: () => (
              <ThemeToggle />
            )
          })}
        />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
