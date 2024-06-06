import BackButton from '@/components/commun/static/BackButton';
import { languageContext } from '@/context/LanguageContext';
import { accountAr } from '@/locales/ar/account';
import { accountEn } from '@/locales/en/account';
import { accountFr } from '@/locales/fr/account';
import { trpc } from '@/trpc/client';
import { MaterialIcons } from '@expo/vector-icons';
import { useSession } from '@fullauth/react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

const Security = () => {
  const { update, session } = useSession();

  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: { en: accountEn, fr: accountFr, ar: accountAr },
  });

  const schema = z
    .object({
      currentPassword: z
        .string()
        .min(8, { message: i18n.t('passwordShortTxt') }),
      newPassword: z.string().min(8, { message: i18n.t('passwordShortTxt') }),
      ConfirmPassword: z
        .string()
        .min(8, { message: i18n.t('passwordShortTxt') }),
    })
    .refine((data) => data.newPassword === data.ConfirmPassword, {
      message: i18n.t('passwordsDontMatch'),
      path: ['ConfirmPassword'],
    });

  type loginSchema = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<loginSchema>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      ConfirmPassword: '',
    },
    resolver: zodResolver(schema),
  });

  const currentPassword = watch('currentPassword');

  const {
    mutateAsync: updatePassword,
    isError,
    error,
    isLoading,
  } = trpc.user.password.change.useMutation();

  const onSubmit: SubmitHandler<loginSchema> = async (data) => {
    const changes =
      JSON.stringify({
        name: session?.user?.name || '',
        username: session?.user?.username || '',
        email: session?.user?.email || '',
      }) !== JSON.stringify(data);

    if (!changes) return;

    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      await update();
      Toast.show({
        type: 'success',
        text1: i18n.t('savedTxt'),
      });
      //   navigation.navigate('Home');
    } catch (error: any) {
      console.log('error: ', error.message);
      Toast.show({
        type: 'error',
        text1: i18n.t('errorSavingPasswordTxt'),
      });
    }
  };

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      <View className="w-full h-16 flex flex-row justify-start items-end px-6">
        <View className=" h-16 flex justify-center items-center ">
          <BackButton />
        </View>
        <View className="w-full h-16 mx-2 flex flex-row justify-start items-center">
          <Text className=" font-bold font-oswald  text-black dark:text-dark text-3xl tracking-wider">
            {i18n.t('passwordTitle')}
          </Text>
        </View>
      </View>
      <View className="w-full h-full flex pt-10 justify-start items-center px-6 gap-y-5">
        <View className="w-full h-auto flex flex-col justify-start items-start ">
          <Text className="w-auto text-start text-lg text-black dark:text-dark  font-nunito">
            {i18n.t('currentPasswordLabel')}
          </Text>
          <Controller
            defaultValue=""
            name={'currentPassword'}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                secureTextEntry
                onChangeText={(v) => {
                  onChange(v);
                }}
                value={value}
                defaultValue=""
                className="w-full h-14 font-nunito text-black dark:text-dark text-lg border-[1px] border-gray-400 rounded-full px-2 mt-3"
                placeholder={i18n.t('currentPasswordLabel')}
                placeholderTextColor={'gray'}
              />
            )}
          />
        </View>
        {errors.currentPassword?.message?.length! > 0 ? (
          <View className="w-full flex flex-row justify-start items-center">
            <MaterialIcons
              name="error-outline"
              size={24}
              color={'red'}
              className="bg-red-500"
            />
            <Text className="w-full text-red-700 mx-2  font-nunito">
              {errors.currentPassword?.message}
            </Text>
          </View>
        ) : null}
        {currentPassword.length > 0 ? (
          <>
            <View className="w-full h-auto flex flex-col justify-start items-start py-2">
              <Text className="w-auto text-start text-lg text-black dark:text-dark font-nunito-semi">
                {i18n.t('newPasswordLabel')}
              </Text>
              <Controller
                defaultValue=""
                name="newPassword"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    secureTextEntry
                    onChangeText={(v) => {
                      onChange(v);
                    }}
                    value={value}
                    defaultValue=""
                    className="w-full h-14 font-nunito text-black dark:text-dark text-lg border-[1px] border-gray-400 rounded-full px-2 mt-3"
                    placeholder={i18n.t('newPasswordLabel')}
                  />
                )}
              />
            </View>
            {errors.newPassword?.message?.length! > 0 ? (
              <View className="w-full flex flex-row justify-start items-center">
                <MaterialIcons
                  name="error-outline"
                  size={24}
                  color={'red'}
                  className="bg-red-500"
                />
                <Text className="w-full text-red-700 mx-2  font-nunito">
                  {errors.newPassword?.message}
                </Text>
              </View>
            ) : null}
            <View className="w-full h-auto flex flex-col justify-start items-start py-2">
              <Text className="w-auto text-start text-lg text-black dark:text-dark font-nunito-semi">
                {i18n.t('confirmPasswordLabel')}
              </Text>
              <Controller
                defaultValue=""
                name="ConfirmPassword"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    secureTextEntry
                    onChangeText={(v) => {
                      onChange(v);
                    }}
                    value={value}
                    defaultValue=""
                    className="w-full h-14 font-nunito text-black dark:text-dark text-lg border-[1px] border-gray-400 rounded-full px-2 mt-3"
                    placeholder={i18n.t('confirmPasswordLabel')}
                  />
                )}
              />
            </View>
            {errors.ConfirmPassword?.message?.length! > 0 ? (
              <View className="w-full flex flex-row justify-start items-center">
                <MaterialIcons
                  name="error-outline"
                  size={24}
                  color={'red'}
                  className="bg-red-500"
                />
                <Text className="w-full text-red-700 mx-2  font-nunito">
                  {errors.ConfirmPassword?.message}
                </Text>
              </View>
            ) : null}
          </>
        ) : null}
        <Pressable
          onPress={handleSubmit(onSubmit)}
          className="w-full h-14 p-2 rounded-full bg-black dark:bg-dark-btn flex justify-center items-center my-3"
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

export default Security;
