// import NotificationBadge from '@/components/commun/static/NotificationBadge';
// import PictureComponent from '@/components/commun/static/PictureComponent';
import PictureComponent from '@/components/commun/static/PictureComponent';
import { MainColor } from '@/constants/colors';
import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { tabMenuAr } from '@/locales/ar/tabMenu';
import { tabMenuEn } from '@/locales/en/tabMenu';
import { tabMenuFr } from '@/locales/fr/tabMenu';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSession } from '@fullauth/react-native';
import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { Platform, Text, View } from 'react-native';

export default function TabLayout() {
  const { session } = useSession();

  const { colorScheme } = useColorScheme();

  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: {
      en: tabMenuEn,
      fr: tabMenuFr,
      ar: tabMenuAr,
    },
  });

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'light' ? 'white' : '#141414',
          borderColor: '#BCBCBC',
          height: Platform.OS === 'android' ? 60 : 60,
          paddingBottom: 0,
        },
      }}
      initialRouteName="home"
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                className={`flex flex-row justify-center items-center gap-x-1 ${
                  focused ? 'bg-main/20' : ''
                } rounded-full px-3 py-2`}
              >
                <Ionicons
                  name="restaurant"
                  size={20}
                  color={
                    focused
                      ? MainColor
                      : colorScheme === 'light'
                      ? 'black'
                      : 'white'
                  }
                />
                {focused && (
                  <Text className="text-main font-semibold">
                    {i18n.t('home')}
                  </Text>
                )}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          href: '/Drawer/MainApp/TabMenu/favourites',
          tabBarIcon: ({ focused }) => {
            return (
              <View
                className={`flex flex-row justify-center items-center gap-x-1 ${
                  focused ? 'bg-main/20' : ''
                } rounded-full px-3 py-2`}
              >
                <MaterialIcons
                  name={focused ? 'favorite' : 'favorite-border'}
                  size={22}
                  color={
                    focused
                      ? MainColor
                      : colorScheme === 'light'
                      ? 'black'
                      : 'white'
                  }
                />
                {focused && (
                  <Text className="text-main font-semibold">
                    {i18n.t('favorites')}
                  </Text>
                )}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                className={`flex flex-row justify-center items-center gap-x-1 ${
                  focused ? 'bg-main/20' : ''
                } rounded-full px-3 py-2`}
              >
                <View
                  className={`relative rounded-full w-[22px] h-[22px] border-2  ${
                    focused ? 'border-main' : 'border-gray-200'
                  }`}
                >
                  <PictureComponent
                    url={session?.user?.profilePicture?.url!}
                    className="rounded-full"
                    rounded="rounded-full"
                  />
                </View>
                {focused && (
                  <Text className="text-main font-semibold">
                    {i18n.t('profile')}
                  </Text>
                )}
              </View>
            );
          },
          href: session?.user?.id ? '/Drawer/MainApp/TabMenu/menu' : null,
        }}
      />
    </Tabs>
  );
}
