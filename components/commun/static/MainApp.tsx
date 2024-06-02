import { useColorScheme } from '@/context/ColorSchemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ShopsProvider } from '@/context/shopsContext';
import TrpcProvider from '@/trpc/TrpcProvider';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { SessionProvider } from '@fullauth/react-native';
import { StatusBar } from 'expo-status-bar';
import { Platform, SafeAreaView } from 'react-native';
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';
import AppNavigator from './AppNavigator';
import { SheetProvider } from 'react-native-actions-sheet';
import '@/components/commun/static/sheets';

const MainApp = ({ lang }: { lang: string | null }) => {
  const { colorScheme } = useColorScheme();

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        text1NumberOfLines={3}
        style={{ borderLeftColor: '#03fc1c' }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        text1NumberOfLines={3}
        style={{ borderLeftColor: '#fc3903' }}
      />
    ),
    info: (props: any) => (
      <InfoToast
        {...props}
        text1NumberOfLines={3}
        style={{ borderLeftColor: '#fcf403' }}
      />
    ),
  };

  return (
    <>
      <TrpcProvider>
        <SessionProvider baseUrl={`${process.env.EXPO_PUBLIC_FULLAUTH_URL}`}>
          <SafeAreaView
            style={{
              flex: 1,
              paddingTop: Platform.OS === 'android' ? 30 : 0,
              // backgroundColor: colorScheme === 'light' ? 'white' : '#141414',
            }}
            className="bg-white dark:bg-dark"
          >
            <ActionSheetProvider>
              <ShopsProvider>
                <LanguageProvider lang={lang}>
                  <SheetProvider>
                    <AppNavigator />
                    <Toast position="top" config={toastConfig} />
                  </SheetProvider>
                </LanguageProvider>
              </ShopsProvider>
            </ActionSheetProvider>
          </SafeAreaView>
        </SessionProvider>
      </TrpcProvider>
      <StatusBar
        style={
          Platform.OS === 'android'
            ? 'auto'
            : colorScheme === 'light'
            ? 'dark'
            : 'light'
        }
      />
    </>
  );
};

export default MainApp;
