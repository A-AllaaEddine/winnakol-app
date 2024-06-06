import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CustomDrawerContent from '@/components/modules/drawer/CustonDrawerContent';
import { Entypo } from '@expo/vector-icons';
import { MainColor } from '@/constants/colors';
import { useColorScheme } from '@/context/ColorSchemeContext';
import { useContext } from 'react';
import { languageContext } from '@/context/LanguageContext';
import { SideMenuEn } from '@/locales/en/sidemenu';
import { SideMenuFr } from '@/locales/fr/sidemenu';
import { SideMenuAr } from '@/locales/ar/sidemenu';
import { Text } from 'react-native';

const DrawerLayout = () => {
  const context = useContext(languageContext);

  const { colorScheme } = useColorScheme();
  const { i18n } = context?.translation({
    translations: {
      en: SideMenuEn,
      fr: SideMenuFr,
      ar: SideMenuAr,
    },
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="MainApp"
        screenOptions={{
          headerShown: false,
          swipeEnabled: false,
          drawerLabelStyle: {
            fontSize: 16,
          },
          drawerActiveBackgroundColor: MainColor,
          drawerActiveTintColor: '#fff',
        }}
        drawerContent={CustomDrawerContent}
      >
        <Drawer.Screen
          name="MainApp" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: ({ color, focused }) => (
              <Text
                className={`text-black dark:text-dark ${
                  focused ? 'font-bold' : 'font-normal'
                }`}
              >
                {i18n.t('homeTxt')}
              </Text>
            ),
            title: 'home',
            drawerLabelStyle: {
              color: colorScheme === 'light' ? 'white' : '#EDEBEB',
            },
          }}
        />
        <Drawer.Screen
          name="about"
          options={{
            drawerLabel: ({ color, focused }) => (
              <Text
                className={`text-black dark:text-dark ${
                  focused ? 'font-bold' : 'font-normal'
                }`}
              >
                {i18n.t('aboutTxt')}
              </Text>
            ),
            title: 'About',
            drawerLabelStyle: {
              color: colorScheme === 'light' ? 'white' : '#EDEBEB',
            },
          }}
        />
        <Drawer.Screen
          name="terms"
          options={{
            drawerLabel: ({ color, focused }) => (
              <Text
                className={`text-black dark:text-dark ${
                  focused ? 'font-bold' : 'font-normal'
                }`}
              >
                {i18n.t('termsTxt')}
              </Text>
            ),
            title: 'Terms',
            drawerLabelStyle: {
              color: colorScheme === 'light' ? 'white' : '#EDEBEB',
            },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
