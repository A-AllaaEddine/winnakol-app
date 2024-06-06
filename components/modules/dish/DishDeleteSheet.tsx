import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { ShopSettingsAr } from '@/locales/ar/shopSettings';
import { ShopSettingsEn } from '@/locales/en/shopSettings';
import { ShopSettingsFr } from '@/locales/fr/shopSettings';
import { trpc } from '@/trpc/client';
import { router } from 'expo-router';
import { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import Toast from 'react-native-toast-message';

const DishDeleteSheet = (props: SheetProps<'dish-delete-sheet'>) => {
  const dishId = props.payload?.dishId as string;
  const shopId = props.payload?.shopId as string;

  const {
    mutateAsync: deleteDish,
    isLoading,
    isError,
    error,
  } = trpc.dish.delete.useMutation();

  const { colorScheme } = useColorScheme();
  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: {
      en: ShopSettingsEn,
      fr: ShopSettingsFr,
      ar: ShopSettingsAr,
    },
  });

  const handleDelete = async () => {
    // delete account logic
    try {
      await deleteDish({ shopId: shopId, dishId: dishId });
      if (isError) {
        throw error;
      }
      Toast.show({
        type: 'success',
        text1: i18n.t('dishDeleted'),
      });
      await SheetManager.hide('dish-delete-sheet');
      router.back();
    } catch (error: any) {
      //   router.dismiss();
      console.log('error: ', error);
      Toast.show({
        type: 'error',
        text1: i18n.t('errorDeletingDishTxt'),
      });
    }
  };

  return (
    <ActionSheet
      id={props.sheetId}
      useBottomSafeAreaPadding
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: colorScheme === 'light' ? 'white' : '#141414',
      }}
      headerAlwaysVisible={true}
      snapPoints={[40]}
      gestureEnabled
    >
      <View className="w-full h-full flex pt-10 justify-start items-center px-6 gap-y-10">
        <View className="w-full h-auto flex justify-start items-start gap-y-1">
          <Text className="w-full  font-nunito-semi text-[#6e6e6e] dark:text-dark text-start text-lg">
            {i18n.t('areYouSureDeleteTxt')}
          </Text>
        </View>
        <Pressable
          onPress={handleDelete}
          className="w-full h-14 p-2 rounded-full bg-[#ff5e52] flex justify-center items-center my-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <Text className="text-lg  font-nunito-semi text-black dark:text-white">
              {i18n.t('deletingTxt')}
            </Text>
          ) : (
            <Text className="text-lg  font-nunito-semi text-black dark:text-white">
              {i18n.t('deleteBtn')}
            </Text>
          )}
        </Pressable>
      </View>
    </ActionSheet>
  );
};

export default DishDeleteSheet;
