import BackButton from '@/components/commun/static/BackButton';
import Skeleton from '@/components/commun/static/Skeleton';
import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { shopsContext } from '@/context/shopsContext';
import { ShopSettingsAr } from '@/locales/ar/shopSettings';
import { ShopSettingsEn } from '@/locales/en/shopSettings';
import { ShopSettingsFr } from '@/locales/fr/shopSettings';
import { trpc } from '@/trpc/client';
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import {
  I18nManager,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const Shop = () => {
  const shopsCxt = useContext(shopsContext);
  const [toggle, setToggle] = useState<boolean>(
    shopsCxt?.currentShop?.status === 'open' ? true : false
  );

  const context = useContext(languageContext);
  const { colorScheme } = useColorScheme();

  const { i18n } = context?.translation({
    translations: {
      en: ShopSettingsEn,
      fr: ShopSettingsFr,
      ar: ShopSettingsAr,
    },
  });

  const {
    mutateAsync: updateShopInfo,
    isLoading,
    isError,
    error,
  } = trpc.shop.update.useMutation();

  const setStatusOpen = async () => {
    try {
      await updateShopInfo({
        shopId: shopsCxt?.currentShop?.id!,
        data: {
          status: 'open',
        },
      });
      shopsCxt?.refrechCxtData();
      setToggle(!toggle);
    } catch (error: any) {
      console.log('error: ', error);
    }
  };

  const setStatusClose = async () => {
    try {
      await updateShopInfo({
        shopId: shopsCxt?.currentShop?.id!,
        data: {
          status: 'close',
        },
      });
      shopsCxt?.refrechCxtData();
      setToggle(!toggle);
    } catch (error: any) {
      console.log('error: ', error);
    }
  };

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      <View className="w-full h-16 flex flex-row justify-start items-end px-6">
        <View className=" h-16 flex justify-center items-center ">
          <BackButton />
        </View>
        <View className="w-full h-16 mx-2 flex flex-row justify-start items-center">
          <Text className="  text-2xl text-black dark:text-dark tracking-wider">
            {i18n.t('restaurantSettingsTitle')}
          </Text>
        </View>
      </View>
      <ScrollView
        className="w-full h-full px-6 py-3 gap-y-3"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
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
              <AntDesign
                name="poweroff"
                size={18}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </View>
            <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
              {i18n.t('status')}
            </Text>
          </View>

          <View className="w-auto h-full flex flex-row justify-end items-center">
            <View
              className={`rounded-full mx-2 w-2 h-2 ${
                toggle ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {/* <Text className="text-xs font-bold">
                {toggle ? 'Opened' : 'Closed'}
              </Text> */}
            </View>
            {toggle ? (
              I18nManager.isRTL ? (
                isLoading ? (
                  <Skeleton classname="w-8 dark:bg-slate-300 rounded-full" />
                ) : (
                  <Pressable onPress={setStatusOpen}>
                    <MaterialCommunityIcons
                      name="toggle-switch-off"
                      size={38}
                      color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                    />
                  </Pressable>
                )
              ) : isLoading ? (
                <Skeleton classname="w-8 dark:bg-slate-300 rounded-full" />
              ) : (
                <Pressable onPress={setStatusClose}>
                  <MaterialCommunityIcons
                    name="toggle-switch"
                    size={38}
                    color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                  />
                </Pressable>
              )
            ) : I18nManager.isRTL ? (
              isLoading ? (
                <Skeleton classname="w-8 dark:bg-slate-300 rounded-full" />
              ) : (
                <Pressable onPress={setStatusClose}>
                  <MaterialCommunityIcons
                    name="toggle-switch"
                    size={38}
                    color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                  />
                </Pressable>
              )
            ) : isLoading ? (
              <Skeleton classname="w-8 dark:bg-slate-300 rounded-full" />
            ) : (
              <Pressable onPress={setStatusOpen}>
                <MaterialCommunityIcons
                  name="toggle-switch-off"
                  size={38}
                  color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                />
              </Pressable>
            )}
          </View>
        </View>
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
            router.push({
              pathname: '/Drawer/MainApp/TabMenu/menu/shop/hours',
              params: {
                shop: JSON.stringify(shopsCxt?.currentShop!),
              },
            });
          }}
        >
          <View className="h-full flex flex-row justify-start items-center">
            <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
              <MaterialCommunityIcons
                name="clock-time-eight-outline"
                size={24}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </View>
            <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
              {i18n.t('WorkingHours')}
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
            router.push({
              pathname: '/Drawer/MainApp/TabMenu/menu/shop/dishes',
              params: {
                shop: JSON.stringify(shopsCxt?.currentShop!),
              },
            });
          }}
        >
          <View className="h-full flex flex-row justify-start items-center">
            <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
              <Ionicons
                name="fast-food"
                size={20}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </View>
            <Text className="text-lg mx-2 font-poppins text-black dark:text-dark">
              {i18n.t('dishes')}
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
            router.push('/Drawer/MainApp/TabMenu/menu/shop/name');
          }}
        >
          <View className="h-full flex flex-row justify-start items-center">
            <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
              <Ionicons
                name="reader-outline"
                size={22}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </View>
            <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
              {i18n.t('RestaurantName')}
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
            router.push({
              pathname: '/Drawer/MainApp/TabMenu/menu/shop/pictures',
              params: {
                shopId: shopsCxt?.currentShop?.id,
              },
            });
          }}
        >
          <View className="h-full flex flex-row justify-start items-center">
            <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
              {/* <Ionicons name="reader-outline" size={22} color="black" /> */}
              <FontAwesome
                name="picture-o"
                size={20}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </View>
            <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
              {i18n.t('pictures')}
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
            router.push('/Drawer/MainApp/TabMenu/menu/shop/localisation');
          }}
        >
          <View className="h-full flex flex-row justify-start items-center">
            <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
              <Ionicons
                name="location-outline"
                size={22}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </View>
            <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
              {i18n.t('localisation')}
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
            router.push('/Drawer/MainApp/TabMenu/menu/shop/phones');
          }}
        >
          <View className="h-full flex flex-row justify-start items-center">
            <View className="w-8 h-8 flex justify-center items-center  rounded-lg">
              <FontAwesome
                name="phone"
                size={22}
                color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
              />
            </View>
            <Text className="text-lg mx-2 font-poppins text-black dark:text-dark tracking-wide">
              {i18n.t('phoneNumbers')}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Shop;

const styles = StyleSheet.create({
  container: { padding: 1, maxHeight: 100, minHeight: 200 },
  dropdown: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#BCBCBC',

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
