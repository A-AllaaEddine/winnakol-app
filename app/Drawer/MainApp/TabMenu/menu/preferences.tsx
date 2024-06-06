import BackButton from '@/components/commun/static/BackButton';
import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { PreferencesAr } from '@/locales/ar/preferences';
import { PreferencesEn } from '@/locales/en/preferences';
import { PreferencesFr } from '@/locales/fr/preferences';
import { trpc } from '@/trpc/client';
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useSession } from '@fullauth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { useContext, useState } from 'react';
import {
  Appearance,
  I18nManager,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

const Preferences = () => {
  const context = useContext(languageContext);
  const { i18n } = context?.translation({
    translations: { en: PreferencesEn, fr: PreferencesFr, ar: PreferencesAr },
  });

  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      <View className="w-full  h-16 flex flex-row justify-start items-end px-6">
        <View className=" h-16 flex justify-center items-center ">
          <BackButton />
        </View>
        <View className="w-full  h-16 mx-2 flex flex-row justify-start items-center">
          <Text className=" font-bold font-oswald text-black dark:text-dark text-2xl tracking-wider">
            {i18n.t('preferencesTitle')}
          </Text>
        </View>
      </View>
      <View className="w-full h-full flex pt-10 justify-start items-center px-6 gap-y-3">
        <View
          className="w-full h-20 flex flex-row justify-between items-center
           rounded-full py-2 px-4 bg-white dark:bg-dark-card shadow-md"
          style={{
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
          }}
        >
          <View className="h-full flex flex-row justify-start items-center">
            <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
              <Feather
                name="moon"
                size={24}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </View>
            <Text className="text-lg mx-2 font-nunito text-black dark:text-dark tracking-wide">
              {i18n.t('darkMode')}
            </Text>
          </View>

          {colorScheme === 'dark' ? (
            <Pressable
              onPress={async () => {
                setColorScheme('light');
                await AsyncStorage.setItem('theme', 'light');
              }}
            >
              <MaterialCommunityIcons
                name="toggle-switch"
                size={38}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </Pressable>
          ) : (
            <Pressable
              onPress={async () => {
                setColorScheme('dark');
                await AsyncStorage.setItem('theme', 'dark');
              }}
            >
              <MaterialCommunityIcons
                name="toggle-switch-off"
                size={38}
                color={colorScheme === 'light' ? 'black' : '#EDEBEB'}
              />
            </Pressable>
          )}
        </View>
        {/* <View
          className="w-full h-20 flex flex-row justify-between items-center
           rounded-full py-2 px-4 bg-white dark:bg-dark-card shadow-md"
          style={{
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
          }}
        >
          <View className="h-full flex flex-row justify-start items-center">
            <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
              <MaterialIcons
                name="language"
                size={22}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </View>
            <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
              {i18n.t('language')}
            </Text>
          </View>
          <View className="w-auto h-auto flex flex-row justify-end items-center gap-x-2">
            <Pressable
              onPress={() => {
                changeLanguage('en');
              }}
              className={`px-2 py-1 flex justify-center items-center border-2 rounded-full ${
                selectedLanguage === 'en'
                  ? 'border-main'
                  : 'border-black dark:border-dark'
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  selectedLanguage === 'en'
                    ? 'text-main'
                    : 'text-black dark:text-dark'
                }`}
              >
                En
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                changeLanguage('fr');
              }}
              className={`px-2 py-1 flex justify-center items-center border-2  rounded-full ${
                selectedLanguage === 'fr'
                  ? 'border-main'
                  : 'border-black dark:border-dark'
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  selectedLanguage === 'fr'
                    ? 'text-main'
                    : 'text-black dark:text-dark'
                }`}
              >
                Fr
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                changeLanguage('ar');
              }}
              className={`px-2 py-1 flex justify-center items-center border-2 rounded-full ${
                selectedLanguage === 'ar'
                  ? 'border-main'
                  : 'border-black dark:border-dark'
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  selectedLanguage === 'ar'
                    ? 'text-main'
                    : 'text-black dark:text-dark'
                }`}
              >
                Ar
              </Text>
            </Pressable>
          </View>
        </View> */}
        <Pressable
          // className="w-full h-20 flex flex-row justify-between items-center
          //    rounded-lg py-2 px-4 bg-sub"
          className="w-full h-20 flex flex-row justify-between items-center
          rounded-full py-2 px-4 bg-white dark:bg-dark-card shadow-md"
          onPress={() => {
            SheetManager.show('language-sheet', {
              payload: {
                data: [
                  { value: 'en', label: 'En' },
                  { value: 'fr', label: 'Fr' },
                  { value: 'ar', label: 'Ar' },
                ],
                currentLanguage: i18n.locale,
              },
            });
          }}
          style={{
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
          }}
        >
          <View className="h-full flex flex-row justify-start items-center">
            <View className="w-8 h-8 flex justify-center items-center rounded-lg">
              <MaterialIcons
                name="language"
                size={22}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </View>
            <Text className="text-lg mx-2 font-nunito text-black dark:text-dark tracking-wide">
              {i18n.t('language')}
            </Text>
          </View>

          {I18nManager.isRTL ? (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
            />
          ) : (
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
            />
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Preferences;
