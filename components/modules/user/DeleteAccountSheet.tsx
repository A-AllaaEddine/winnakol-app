import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { accountAr } from '@/locales/ar/account';
import { accountEn } from '@/locales/en/account';
import { accountFr } from '@/locales/fr/account';
import { trpc } from '@/trpc/client';
import { signOut, useSession } from '@fullauth/react-native';
import { router } from 'expo-router';
import { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import Toast from 'react-native-toast-message';

const DeleteAccountSheet = (props: SheetProps<'account-delete-sheet'>) => {
  const {
    mutateAsync: deleteUser,
    isLoading,
    isError,
    error,
  } = trpc.user.delete.account.useMutation();

  const { colorScheme } = useColorScheme();
  const context = useContext(languageContext);
  const { session, update } = useSession();

  const { i18n } = context?.translation({
    translations: {
      en: accountEn,
      fr: accountFr,
      ar: accountAr,
    },
  });

  const handleDelete = async () => {
    // delete account logic
    try {
      await deleteUser();
      if (isError) {
        throw error;
      }
      await signOut({ baseUrl: `${process.env.EXPO_PUBLIC_FULLAUTH_URL}` });
      await update();
      await SheetManager.hide('account-delete-sheet');
      router.push('/auth/login');
      Toast.show({
        type: 'success',
        text1: i18n.t('accountDeleted'),
      });
    } catch (error: any) {
      //   router.dismiss();
      console.log('error: ', error);
      Toast.show({
        type: 'error',
        text1: i18n.t('errorDeletingAccountTxt'),
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
      closable={!isLoading}
      headerAlwaysVisible={true}
      snapPoints={[40]}
      gestureEnabled
    >
      <View className="w-full h-full flex pt-10 justify-start items-center px-6 gap-y-10">
        <View className="w-full h-auto flex justify-start items-start gap-y-1">
          <Text className="w-full  font-poppins text-[#6e6e6e] dark:text-dark text-start text-xl">
            {i18n.t('areYouSureDeleteTxt')}
          </Text>
          {session?.user.isShopOwner && (
            <Text className="text-slate-300">
              {i18n.t('deleteAllShopsTxt')}
            </Text>
          )}
        </View>
        <Pressable
          onPress={handleDelete}
          className="w-full h-14 p-2 rounded-full bg-[#ff5e52] flex justify-center items-center my-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <Text className="text-lg  font-bold text-black dark:text-white">
              {i18n.t('deletingTxt')}
            </Text>
          ) : (
            <Text className="text-lg  font-bold text-black dark:text-white">
              {i18n.t('deleteBtn')}
            </Text>
          )}
        </Pressable>
      </View>
    </ActionSheet>
  );
};

export default DeleteAccountSheet;
