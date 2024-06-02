import BackButton from '@/components/commun/static/BackButton';
import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { shopsContext } from '@/context/shopsContext';
import { ShopSettingsAr } from '@/locales/ar/shopSettings';
import { ShopSettingsEn } from '@/locales/en/shopSettings';
import { ShopSettingsFr } from '@/locales/fr/shopSettings';
import { trpc } from '@/trpc/client';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

const Phones = () => {
  const shopsCxt = useContext(shopsContext);
  const [phones, setPhones] = useState<string[]>(
    shopsCxt?.currentShop?.phones ?? ['']
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
    mutateAsync: updateRestaurantInfo,
    isLoading,
    isError,
    error,
  } = trpc.shop.update.useMutation();

  const handleSubmit = async () => {
    const phoneNumberRegex = /^\d{10}$/;

    if (!phones.length) {
      //   toast.error(t('stepThree:errorPhoneTxt'));
      Toast.show({
        type: 'error',
        text1: i18n.t('invalidPhoneTxt'),
      });
      return;
    }
    for (let i = 0; i < phones.length; i++) {
      if (!phoneNumberRegex.test(phones[i])) {
        // toast.error(t('stepThree:errorValidPhoneTxt'));
        Toast.show({
          type: 'error',
          text1: i18n.t('invalidPhoneTxt'),
        });
        return;
      }

      try {
        await updateRestaurantInfo({
          shopId: shopsCxt?.currentShop?.id!,
          data: { phones: phones },
        });
        Toast.show({
          type: 'success',
          text1: i18n.t('savedTxt'),
        });
        shopsCxt?.refrechCxtData();
      } catch (error: any) {
        console.log(error);
        // setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: i18n.t('errorSavingPhoneTxt'),
        });
      }
    }
  };

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      <View className="w-full h-16 flex flex-row justify-start items-end px-4">
        <View className=" h-16 flex justify-center items-center ">
          <BackButton />
        </View>
        <View className="w-full h-16 mx-2 flex flex-row justify-start items-center">
          <Text className=" font-poppins-bold text-black dark:text-dark  text-2xl tracking-wider">
            {i18n.t('phonesTitle')}
          </Text>
        </View>
      </View>
      <ScrollView
        className="h-full w-full font-poppins flex flex-col pb-40 px-6"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 30,
        }}
      >
        <View className="w-full h-full  flex justify-start items-center gap-y-5">
          <View className="w-full h-auto flex justify-start items-start gap-y-3">
            {phones?.map((phone, index) => {
              return (
                <View
                  key={index}
                  className="w-full h-16  flex flex-row justify-start items-center gap-x-2"
                >
                  <TextInput
                    onChangeText={(v) => {
                      setPhones((prev) => {
                        return prev?.map((phone, idx) => {
                          if (idx === index) {
                            return v;
                          }
                          return phone;
                        });
                      });
                    }}
                    value={phone}
                    defaultValue=""
                    className="w-5/6 h-14  text-lg border-[1px] text-black dark:text-dark border-gray-400 rounded-md px-2 mt-3"
                    placeholder="Phone Number"
                  />
                  {phones?.length! > 1 ? (
                    <Pressable
                      onPress={() => {
                        setPhones((prev) => {
                          return prev?.filter((__, idx) => idx !== index);
                        });
                      }}
                      className="w-auto h-auto  flex justify-center items-center"
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        size={32}
                        color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                        className="w-8 h-8 hover:cursor-pointer"
                      />
                    </Pressable>
                  ) : null}
                </View>
              );
            })}
            {phones.length < 3 ? (
              <Pressable
                className="w-full  h-8  flex flex-row justify-start items-center"
                onPress={() => {
                  setPhones((prev) => {
                    return [...prev, ''];
                  });
                }}
              >
                <Text className="w-auto  text-black dark:text-dark font-poppins  text-sm">
                  {i18n.t('addPhoneLabel')}
                </Text>
              </Pressable>
            ) : null}
          </View>
          <Pressable
            onPress={handleSubmit}
            className="w-full h-14 p-2 rounded-md bg-black dark:bg-dark-btn flex justify-center items-center my-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <Text className="text-lg  font-poppins-bold text-white">
                {i18n.t('savingTxt')}
              </Text>
            ) : (
              <Text className="text-lg  font-poppins-bold text-white">
                {i18n.t('saveBtn')}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Phones;
