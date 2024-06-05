import BackButton from '@/components/commun/static/BackButton';
import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { accountAr } from '@/locales/ar/account';
import { accountEn } from '@/locales/en/account';
import { accountFr } from '@/locales/fr/account';
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { router } from 'expo-router';
import { useContext } from 'react';
import { I18nManager, Pressable, SafeAreaView, Text, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

const Main = () => {
  const context = useContext(languageContext);

  const { colorScheme } = useColorScheme();

  const { i18n } = context?.translation({
    translations: { en: accountEn, fr: accountFr, ar: accountAr },
  });

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      <View className="w-full h-16 flex flex-row justify-start items-end px-6">
        <View className=" h-16 flex justify-center items-center ">
          <BackButton />
        </View>
        <View className="w-full h-16 mx-2 flex flex-row justify-start items-center">
          <Text className="  text-2xl text-black dark:text-dark tracking-wider">
            {i18n.t('accountTitle')}
          </Text>
        </View>
      </View>
      <View className="w-full h-full flex pt-10 justify-start items-center px-6 gap-y-3">
        <Pressable
          className="w-full h-20 flex flex-row justify-between items-center
          rounded-full py-2 px-4 bg-white dark:bg-dark-card shadow-md"
          style={{
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
          }}
          onPress={() => {
            router.push('/Drawer/MainApp/TabMenu/menu/account/details');
          }}
        >
          <View className="h-full flex flex-row justify-start items-center">
            <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
              <MaterialCommunityIcons
                name="account-details"
                size={22}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </View>
            <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
              {i18n.t('details')}
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
        <Pressable
          className="w-full h-20 flex flex-row justify-between items-center
         rounded-full py-2 px-4 bg-white dark:bg-dark-card shadow-md"
          style={{
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
          }}
          onPress={() => {
            router.push('/Drawer/MainApp/TabMenu/menu/account/password');
          }}
        >
          <View className="h-full flex flex-row justify-start items-center">
            <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
              <MaterialCommunityIcons
                name="lock-outline"
                size={22}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </View>
            <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
              {i18n.t('password')}
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
        <Pressable
          className="w-full h-20 flex flex-row justify-between items-center
          rounded-full py-2 px-4 bg-white dark:bg-dark-card shadow-md"
          style={{
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
          }}
          onPress={() => {
            router.push('/Drawer/MainApp/TabMenu/menu/account/picture');
          }}
        >
          <View className="h-full flex flex-row justify-start items-center">
            <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
              <FontAwesome
                name="picture-o"
                size={20}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </View>
            <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
              {i18n.t('PorfilePicture')}
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
        <Pressable
          className="w-full h-20 flex flex-row justify-between items-center
          rounded-full py-2 px-4 bg-white dark:bg-dark-card shadow-md"
          style={{
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
          }}
          onPress={() => {
            SheetManager.show('account-delete-sheet');
          }}
        >
          <View className="h-full flex flex-row justify-start items-center">
            <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
              <AntDesign
                name="delete"
                size={20}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </View>
            <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
              {i18n.t('deleteAccount')}
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

export default Main;
