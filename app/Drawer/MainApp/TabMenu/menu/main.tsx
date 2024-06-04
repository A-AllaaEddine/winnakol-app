import PictureComponent from '@/components/commun/static/PictureComponent';
import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { shopsContext } from '@/context/shopsContext';
import { MainMenuAr } from '@/locales/ar/mainmenu';
import { MainMenuEn } from '@/locales/en/mainmenu';
import { MainMenuFr } from '@/locales/fr/mainmenu';
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { signOut, useSession } from '@fullauth/react-native';
import { router } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import {
  I18nManager,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

const Main = () => {
  const { session, update } = useSession();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { colorScheme } = useColorScheme();

  const context = useContext(languageContext);
  const shopsCxt = useContext(shopsContext);

  const { i18n } = context?.translation({
    translations: { en: MainMenuEn, fr: MainMenuFr, ar: MainMenuAr },
  });

  const logOut = async () => {
    try {
      await signOut({ baseUrl: `${process.env.EXPO_PUBLIC_FULLAUTH_URL}` });
      await update();
      router.push('/auth/login');
    } catch (error: any) {
      console.log('error: ', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await update();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      <ScrollView
        className="w-full h-full flex px-4"
        contentContainerStyle={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          // paddingTop: 50,
        }}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      >
        <View className="w-full h-36 flex flex-row justify-start items-center px-1 mt-5">
          {refreshing ? (
            <>
              <View className="w-24 h-24  rounded-full">
                <View className="w-full h-full rounded-full bg-gray-200 animate-pulse" />
              </View>
              <View className="w-5/6 h-full flex justify-center items-start gap-y-5 mx-5">
                <View className="w-36 h-5 rounded-lg bg-gray-200 animate-bounce" />
                <View className="w-28 h-4 rounded-lg bg-gray-200 animate-bounce" />
              </View>
            </>
          ) : (
            <>
              {/* TODO add redirection to .settings/profile */}
              <Pressable
                // onPress={() => {
                //   router.push('/Drawer/MainApp/TabMenu/menu/settings/profile');
                // }}
                className="w-24 h-24 border-2 border-main rounded-full"
              >
                <PictureComponent
                  url={session?.user?.profilePicture?.url!}
                  className="w-5"
                  rounded="rounded-full"
                />
              </Pressable>
              <View className="w-5/6 h-full flex justify-center items-start mx-3">
                <Text
                  className="w-4/6  text-left text-black dark:text-dark font-bold truncate whitespace-nowrap text-2xl my-1"
                  numberOfLines={2}
                >
                  {session?.user?.name}
                </Text>
                <Text className="w-4/6 h-7 runcate whitespace-break-spaces text-left  text-sm text-[#a1a1a1] dark:text-dark">
                  Joined on: {new Date(session?.user?.createdAt!).getDay()}-
                  {new Date(session?.user?.createdAt!).getMonth()}-
                  {new Date(session?.user?.createdAt!).getFullYear()}
                </Text>
              </View>
            </>
          )}
        </View>
        <View className="w-full h-full px-2 py-3 gap-y-3 ">
          {session?.user.isShopOwner && shopsCxt?.currentShop ? (
            <Pressable
              // className="w-full h-20 flex flex-row justify-between items-center
              //    rounded-lg py-2 px-4 bg-sub"
              className="w-full h-20 flex flex-row justify-between items-center
          rounded-full py-2 px-4 bg-white dark:bg-dark-card shadow-md"
              onPress={() => {
                router.push('/Drawer/MainApp/TabMenu/menu/shop/main');
              }}
              style={{
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
              }}
              disabled={refreshing}
            >
              <View className="h-full flex flex-row justify-start items-center">
                <View className="w-8 h-8 flex justify-center items-center rounded-lg">
                  <Ionicons
                    name="restaurant"
                    size={20}
                    color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                  />
                </View>
                <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
                  {i18n.t('shop')}
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
          ) : null}
          <Pressable
            className="w-full h-20 flex flex-row justify-between items-center
             rounded-full py-2 px-4 bg-white dark:bg-dark-card shadow-md"
            onPress={() => {
              router.push('/Drawer/MainApp/TabMenu/menu/account/main');
            }}
            style={{
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            }}
            disabled={refreshing}
          >
            <View className="h-full flex flex-row justify-start items-center">
              <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
                <MaterialCommunityIcons
                  name="account-outline"
                  size={24}
                  color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                />
              </View>
              <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
                {i18n.t('account')}
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
            onPress={() => {
              router.push('/Drawer/MainApp/TabMenu/menu/preferences');
            }}
            style={{
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            }}
            disabled={refreshing}
          >
            <View className="h-full flex flex-row justify-start items-center">
              <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
                <AntDesign
                  name="setting"
                  size={22}
                  color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                />
              </View>
              <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
                {i18n.t('appPreferences')}
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
            onPress={logOut}
            disabled={refreshing}
          >
            <View className="h-full flex flex-row justify-start items-center">
              <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
                <AntDesign
                  name="logout"
                  size={18}
                  color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                />
              </View>
              <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
                {i18n.t('logOut')}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Main;
