import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomDrawerContent from './CustonDrawerContent';
import { Entypo } from '@expo/vector-icons';
import { useContext } from 'react';
import { languageContext } from '@/context/LanguageContext';
import { useColorScheme } from '@/context/ColorSchemeContext';
import { MainColor } from '@/constants/colors';

const CustomDrawer = () => {
  const context = useContext(languageContext);

  const { colorScheme } = useColorScheme();
  const { i18n } = context?.translation({
    translations: {
      en: {},
      fr: {},
      ar: {},
    },
  });

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
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
            drawerLabel: i18n.t('homeTxt'),
            title: 'overview',
            // headerLeft: () => <Entypo name="menu" size={36} color="black" />,
          }}
        />
        {/* <Drawer.Screen
          name="about" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: i18n.t('aboutTxt'),
            title: 'About',
            headerLeft: () => <Entypo name="menu" size={36} color="black" />,
          }}
        />
        <Drawer.Screen
          name="terms" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: i18n.t('termsTxt'),
            title: 'Terms And Conditions',
            headerLeft: () => <Entypo name="menu" size={36} color="black" />,
          }}
        />
        <Drawer.Screen
          name="privacy" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: i18n.t('privacyText'),
            title: 'Privacy',
            headerLeft: () => <Entypo name="menu" size={36} color="black" />,
          }}
        /> */}
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default CustomDrawer;
