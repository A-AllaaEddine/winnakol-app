import { languageContext } from '@/context/LanguageContext';
import { trpc } from '@/trpc/client';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useContext } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';
import { TextInput } from 'react-native';
import { ScrollView } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';
import { z } from 'zod';
import Logo from '@/assets/images/logo.svg';
import { PasswordEn } from '@/locales/en/password';
import { PasswordFr } from '@/locales/fr/password';
import { PasswordAr } from '@/locales/ar/password';
import { useColorScheme } from '@/context/ColorSchemeContext';

const Password = () => {
  const searchParams = useLocalSearchParams();
  const email = searchParams.email as string;
  const { colorScheme } = useColorScheme();
  const context = useContext(languageContext);
  const { i18n } = context?.translation({
    translations: {
      en: PasswordEn,
      fr: PasswordFr,
      ar: PasswordAr,
    },
  });

  const schema = z
    .object({
      email: z
        .string()
        .min(1, { message: i18n.t('emailRequired') })
        .email({
          message: i18n.t('validEmail'),
        }),
      newPassword: z.string().min(8, { message: i18n.t('passwordShortTxt') }),
      ConfirmPassword: z
        .string()
        .min(8, { message: i18n.t('passwordShortTxt') }),
    })
    .refine((data) => data.newPassword === data.ConfirmPassword, {
      message: i18n.t('passwordsDontMatch'),
      path: ['ConfirmPassword'],
    });

  type codeSchema = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<codeSchema>({
    defaultValues: { email: email ?? '', newPassword: '', ConfirmPassword: '' },
    resolver: zodResolver(schema),
  });

  const {
    mutateAsync: resetPassword,
    isLoading,
    isError,
    error,
  } = trpc.user.reset.password.useMutation();

  const onSubmit: SubmitHandler<codeSchema> = async (data) => {
    try {
      await resetPassword({ email: email, password: data.newPassword });
      Toast.show({
        type: 'success',
        text1: i18n.t('validCodeTxt'),
      });
      router.push({
        pathname: '/auth/password',
        params: { email: data.email },
      });
    } catch (error: any) {
      console.log('error: ', error);
      if (error.message === 'invalid code') {
        Toast.show({
          type: 'error',
          text1: i18n.t('invalidCodeTxt'),
        });
        return;
      }
      if (error.message === 'code expired') {
        Toast.show({
          type: 'error',
          text1: i18n.t('codeExpiredTxt'),
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: i18n.t('errorVerifyingCode'),
      });
    }
  };

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      <View className="w-full h-14 font-poppins flex flex-row justify-center items-center">
        <Logo width="300" height="150" />
        {/* <Text className="w-auto flex text-black dark:text-dark font-bold">
          <Text className="w-auto flex text-main font-bold">
            {i18n.t('win')}
          </Text>{' '}
          {i18n.t('nakol')}
        </Text> */}
      </View>
      <ScrollView
        className="w-full h-screen  pt-32 font-poppins flex  px-8"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 50,
        }}
      >
        <View className="w-full h-auto flex flex-col justify-start items-start py-2">
          {/* <Text className="w-auto text-start text-black dark:text-dark text-lg  font-poppins">
        {i18n.t('emailLabel')}
      </Text> */}
          <Text className="w-full text-center text-2xl  font-bold text-black dark:text-dark">
            {i18n.t('setText')}
          </Text>
          <Controller
            defaultValue=""
            name="newPassword"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={(v) => {
                  onChange(v);
                }}
                secureTextEntry
                value={value}
                defaultValue=""
                className="w-full h-14 text-black dark:text-dark text-lg border-[1px] border-gray-400 rounded-full px-3 mt-6"
                placeholder={i18n.t('newPasswordLabel')}
                placeholderTextColor={'gray'}
              />
            )}
          />
          {errors.newPassword?.message?.length! > 0 ? (
            <View className="w-full h-8 flex flex-row justify-start items-center">
              <MaterialIcons
                name="error-outline"
                size={24}
                color={'red'}
                className="bg-red-500"
              />
              <Text className="w-full text-red-700 mx-2  font-poppins">
                {errors.newPassword?.message}
              </Text>
            </View>
          ) : null}
          <Controller
            defaultValue=""
            name="ConfirmPassword"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={(v) => {
                  onChange(v);
                }}
                secureTextEntry
                value={value}
                defaultValue=""
                className="w-full h-14 text-black dark:text-dark text-lg border-[1px] border-gray-400 rounded-full px-3 mt-6"
                placeholder={i18n.t('confirmPasswordLabel')}
                placeholderTextColor={'gray'}
              />
            )}
          />
          {errors.ConfirmPassword?.message?.length! > 0 ? (
            <View className="w-full h-8 flex flex-row justify-start items-center">
              <MaterialIcons
                name="error-outline"
                size={24}
                color={'red'}
                className="bg-red-500"
              />
              <Text className="w-full text-red-700 mx-2  font-poppins">
                {errors.ConfirmPassword?.message}
              </Text>
            </View>
          ) : null}
        </View>
        <Pressable
          onPress={handleSubmit(onSubmit)}
          className="w-full h-14 p-2 rounded-full bg-black dark:bg-dark-btn flex justify-center items-center mt-3"
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
        <Pressable
          onPress={() => router.back()}
          className="w-full h-10 flex flex-row justify-center items-center gap-x-2 mt-5"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
          />
          <View className="w-auto h-10 flex justify-center items-center">
            <Text className=" font-bold text-black dark:text-dark text-lg">
              {i18n.t('backToCodeTxt')}
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Password;
