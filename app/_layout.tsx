import MainApp from '@/components/commun/static/MainApp';
import '@/components/commun/static/sheets';
import { ColorSchemeProvider } from '@/context/ColorSchemeContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-gesture-handler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: '(tabs)',
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [languageFetched, setLanguageFetched] = useState<boolean>(false);

  const [lang, setLang] = useState<string | null>(null);

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    async function getLangs() {
      try {
        const language = await AsyncStorage.getItem('language');
        setLang(language);
        // if (language === 'ar') {
        //   I18nManager.allowRTL(true);
        //   I18nManager.forceRTL(true);
        // } else {
        //   I18nManager.allowRTL(false);
        //   I18nManager.forceRTL(false);
        // }
        setLanguageFetched(true);
      } catch (e) {
        console.log(e);
      } finally {
        setLanguageFetched(true);
      }
    }

    getLangs();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && languageFetched) {
      // SplashScreen.hideAsync();
      router.push('/maintenance');
    }
  }, [loaded]);

  if (!loaded || !languageFetched) {
    return null;
  }

  return (
    <ColorSchemeProvider>
      <MainApp lang={lang} />
    </ColorSchemeProvider>
  );
}
