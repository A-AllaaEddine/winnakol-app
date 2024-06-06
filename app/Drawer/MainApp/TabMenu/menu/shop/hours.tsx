import BackButton from '@/components/commun/static/BackButton';
import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { shopsContext } from '@/context/shopsContext';
import { ShopSettingsAr } from '@/locales/ar/shopSettings';
import { ShopSettingsEn } from '@/locales/en/shopSettings';
import { ShopSettingsFr } from '@/locales/fr/shopSettings';
import { trpc } from '@/trpc/client';
import { MaterialIcons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import Toast from 'react-native-toast-message';

const WorkingHours = () => {
  const shopsCxt = useContext(shopsContext);
  const [startingHour, setStartingHour] = useState<string>(
    shopsCxt?.currentShop?.workingHours[0] ?? '09:00'
  );
  const [endingHour, setEndingHour] = useState<string>(
    shopsCxt?.currentShop?.workingHours[1] ?? '00:00'
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

  const handleSubmit = async () => {
    try {
      await updateShopInfo({
        shopId: shopsCxt?.currentShop?.id!,
        data: { workingHours: [startingHour, endingHour] },
      });
      Toast.show({
        type: 'success',
        text1: i18n.t('savedTxt'),
      });
      shopsCxt?.refrechCxtData();
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: i18n.t('errorSavingHoursTxt'),
      });
    }
  };

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      <View className="w-full h-16 flex flex-row justify-start items-end px-4">
        <View className=" h-16 flex justify-center items-center ">
          <BackButton />
        </View>
        <View className="w-full h-16 mx-2 flex flex-row justify-start items-center">
          <Text className=" font-oswald font-bold text-black dark:text-dark  text-2xl tracking-wider">
            {i18n.t('WorkingHours')}
          </Text>
        </View>
      </View>
      <View className="h-full w-full flex flex-col justify-start items-center pb-40 px-6">
        <Text className="w-full text-start text-lg text-black dark:text-dark  font-nunito-semi mb-2">
          {i18n.t('startingHour')}
        </Text>
        <Pressable
          onPress={() =>
            SheetManager.show('hours-sheet', {
              payload: {
                header: i18n.t('startingHour'),
                hour: startingHour,
                setHour: setStartingHour,
              },
            })
          }
          className="w-full h-12 rounded-full bg-white dark:bg-dark-card border-[1px] border-slate-300 dark:border-none dark:border-dark flex flex-row justify-between items-center py-2 px-4"
        >
          <Text className="text-lg text-black dark:text-dark">
            {startingHour}
          </Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={colorScheme === 'light' ? 'black' : 'white'}
          />
        </Pressable>

        <Text className="w-full text-start text-lg text-black dark:text-dark font-nunito-semi mb-2 mt-5">
          {i18n.t('endingHour')}
        </Text>
        <Pressable
          onPress={() =>
            SheetManager.show('hours-sheet', {
              payload: {
                header: i18n.t('endingHour'),
                hour: endingHour,
                setHour: setEndingHour,
              },
            })
          }
          className="w-full h-12 rounded-full bg-white dark:bg-dark-card border-[1px] border-slate-300 dark:border-none dark:border-dark flex flex-row justify-between items-center py-2 px-4"
        >
          <Text className="text-lg text-black dark:text-dark">
            {endingHour}
          </Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={colorScheme === 'light' ? 'black' : 'white'}
          />
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          className="w-full h-14 p-2 rounded-full bg-black dark:bg-dark-btn flex justify-center items-center my-6"
        >
          {isLoading ? (
            <Text className="text-lg  font-nunito-semi text-white">
              {i18n.t('savingTxt')}
            </Text>
          ) : (
            <Text className="text-lg  font-nunito-semi text-white">
              {i18n.t('saveBtn')}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default WorkingHours;

const styles = StyleSheet.create({
  container: { padding: 1, maxHeight: 100, minHeight: 200 },
  dropdown: {
    width: '100%',
    height: 60,
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
