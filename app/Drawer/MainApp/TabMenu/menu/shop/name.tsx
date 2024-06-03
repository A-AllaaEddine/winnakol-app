import BackButton from '@/components/commun/static/BackButton';
import { languageContext } from '@/context/LanguageContext';
import { shopsContext } from '@/context/shopsContext';
import { ShopSettingsAr } from '@/locales/ar/shopSettings';
import { ShopSettingsEn } from '@/locales/en/shopSettings';
import { ShopSettingsFr } from '@/locales/fr/shopSettings';
import { trpc } from '@/trpc/client';
import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

const RestaurantName = () => {
  const shopsCxt = useContext(shopsContext);
  const context = useContext(languageContext);

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

  const schema = z.object({
    name: z.string().min(1, { message: i18n.t('nameIsRequired') }),
  });

  type nameSchema = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<nameSchema>({
    defaultValues: {
      name: shopsCxt?.currentShop?.name ?? '',
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<nameSchema> = async (data) => {
    try {
      await updateShopInfo({
        shopId: shopsCxt?.currentShop?.id!,
        data: data,
      });
      if (isError) {
        throw error;
      }

      Toast.show({
        type: 'success',
        text1: i18n.t('savedTxt'),
      });
      shopsCxt?.refrechCxtData();
    } catch (error: any) {
      console.log('error: ', error);
      Toast.show({
        type: 'error',
        text1: i18n.t('errorSavingNameTxt'),
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
          <Text className=" font-poppins-bold text-black dark:text-dark  text-2xl tracking-wider">
            {i18n.t('RestaurantName')}
          </Text>
        </View>
      </View>
      <View className="w-full h-full flex pt-10 justify-start items-center px-6 gap-y-3">
        {/* {session?.user?.id && !session?.user.emailVerified && !sent && (
          <View className="w-full h-auto flex flex-row justify-between items-center ">
            <View className="w-auto flex flex-col justify-start items-center gap-3">
              <Text className="text-sm font-poppins md:text-sm text-black">
                {i18n.t('verifyEmailTxt')}{' '}
              </Text>
            </View>
            <Pressable
              onPress={async () => {
                try {
                  await sendEmail();
                  setSent(true);
                  // context?.setIsDelayed(true);
                  Toast.show({ type: 'success', text1: i18n.t('emailSent') });
                } catch (error: any) {
                  console.log('error: ', error);
                  Toast.show({
                    type: 'error',
                    text1: i18n.t('errorSendingEmail'),
                  });
                }
              }}
              className="bg-black rounded-lg p-2"
              disabled={isLoading}
            >
              <Text className="text-xs font-poppins-bold text-white">
                {isLoadingEmail ? i18n.t('sendingTxt') : i18n.t('verifyTxt')}
              </Text>
            </Pressable>
          </View>
        )} */}
        <View className="w-full h-auto  ">
          <View className="w-full h-auto flex flex-col justify-start items-start ">
            <Text className="w-auto text-start text-lg text-black dark:text-dark  font-poppins">
              {i18n.t('nameLabel')}
            </Text>
            <Controller
              defaultValue=""
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={(v) => {
                    onChange(v);
                  }}
                  value={value}
                  defaultValue=""
                  className="w-full h-14  text-lg border-[1px] text-black dark:text-dark border-gray-400 rounded-full px-2 mt-3"
                  placeholder={i18n.t('nameLabel')}
                />
              )}
            />
          </View>
          {errors.name?.message?.length! > 0 ? (
            <View className="w-full flex flex-row justify-start items-center">
              <MaterialIcons
                name="error-outline"
                size={24}
                color={'red'}
                className="bg-red-500"
              />
              <Text className="w-full text-red-700 mx-2  font-poppins">
                {errors.name?.message}
              </Text>
            </View>
          ) : null}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="w-full h-14 p-2 rounded-full bg-black dark:bg-dark-btn flex justify-center items-center my-6"
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
      </View>
    </SafeAreaView>
  );
};

export default RestaurantName;
