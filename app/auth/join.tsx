import LogoText from '@/assets/images/logo_text.svg';
import { languageContext } from '@/context/LanguageContext';
// import usePushNotification from '@/hooks/usePushNotification';

import { trpc } from '@/trpc/client';
import { MaterialIcons } from '@expo/vector-icons';
import { signIn, useSession } from '@fullauth/react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  I18nManager,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import z from 'zod';
import { JoinEn } from '@/locales/en/join';
import { JoinFr } from '@/locales/fr/join';
import { JoinAr } from '@/locales/ar/join';

const Join = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const { expoPushToken, notification } = usePushNotification();
  const { update } = useSession();

  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: {
      en: JoinEn,
      fr: JoinFr,
      ar: JoinAr,
    },
  });

  const schema = z.object({
    email: z
      .string()
      .min(1, { message: i18n.t('emailRequired') })
      .email({
        message: i18n.t('errorEmail'),
      }),
    password: z.string().min(8, { message: i18n.t('errorPassword') }),
  });
  type joinSchema = z.infer<typeof schema>;

  const defaultFormFields: joinSchema = {
    email: '',
    password: '',
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<joinSchema>({
    defaultValues: defaultFormFields,
    resolver: zodResolver(schema),
  });
  const email = watch('email');

  const {
    mutateAsync: createUser,
    isError,
    error,
  } = trpc.user.create.useMutation();

  // const { mutate: saveExpoPushToken } = trpc.user.update.useMutation();

  const onSubmit: SubmitHandler<joinSchema> = async (data) => {
    try {
      setIsLoading(true);
      await createUser({
        email: data.email,
        password: data.password,
        platform: 'mobile',
        locale: i18n.locale ?? 'ar',
      });

      await signIn({
        baseUrl: `${process.env.EXPO_PUBLIC_FULLAUTH_URL}`,
        provider: 'user',
        credentials: {
          email: data.email,
          password: data.password,
        },
      });
      // saveExpoPushToken({ expoPushToken: expoPushToken?.data! });
      await update();
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: i18n.t('accountCreatedText'),
      });
      // TODO: add navigation to step one
      reset();
      router.push({
        pathname: '/Drawer/MainApp/TabMenu/home',
        params: {
          isNewUser: 'true',
        },
      });
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      switch (error.message) {
        case 'Email already exist':
          return Toast.show({
            type: 'error',
            text1: i18n.t('emailExistTxt'),
          });
        case 'Username taken':
          return Toast.show({
            type: 'error',
            text1: i18n.t('usernameTaken'),
          });
        case 'Unauthorised':
          return Toast.show({
            type: 'error',
            text1: i18n.t('UnauthorisedTxt'),
          });
        default:
          return Toast.show({
            type: 'error',
            text1: i18n.t('errorCratingAccountTxt'),
          });
      }
    }
  };
  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      <View className="w-full  font-poppins h-20 flex flex-row justify-center items-center">
        <LogoText width="120" height="120" />
      </View>
      <ScrollView
        className="w-full font-poppins h-screen flex  px-8"
        // automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 50,
        }}
      >
        <View className="w-full h-auto  flex flex-col justify-start items-center">
          <Text className=" text-start text-2xl text-black dark:text-dark font-bold">
            {i18n.t('createAccountText')}
          </Text>
          <View className="w-full h-auto flex flex-col justify-start items-start mt-2">
            {/* <Text className="w-auto text-start  font-poppins text-lg">
              {i18n.t('emailLabel')}
            </Text> */}
            <Controller
              defaultValue=""
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={(v) => {
                    onChange(v);
                  }}
                  value={value}
                  keyboardType="email-address"
                  defaultValue=""
                  className={`w-full h-14 text-black dark:text-dark ${
                    I18nManager.isRTL ? 'text-right' : 'text-left'
                  }  text-lg border-[1px] border-gray-400 rounded-full px-3 mt-3`}
                  placeholder={i18n.t('emailLabel')}
                  placeholderTextColor={'gray'}
                  inputMode="email"
                />
              )}
            />
          </View>
          {errors.email?.message?.length! > 0 ? (
            <View className="w-full flex flex-row justify-start items-center">
              <MaterialIcons
                name="error-outline"
                size={24}
                color={'red'}
                className="bg-red-500"
              />
              <Text className="w-full  font-poppins text-red-700 mx-2">
                {errors.email?.message}
              </Text>
            </View>
          ) : null}

          <View className="w-full h-auto flex flex-col justify-start items-start mt-2">
            {/* <Text className="w-auto text-start text-black dark:text-dark font-poppins text-lg">
              {i18n.t('passwordLabel')}
            </Text> */}
            <Controller
              defaultValue=""
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  secureTextEntry
                  onChangeText={(v) => onChange(v)}
                  value={value}
                  defaultValue=""
                  className={`w-full h-14 text-black dark:text-dark ${
                    I18nManager.isRTL ? 'text-right' : 'text-left'
                  }  text-lg border-[1px] border-gray-400 rounded-full px-3 mt-3`}
                  placeholder={i18n.t('passwordLabel')}
                  placeholderTextColor={'gray'}
                />
              )}
            />
          </View>
          {errors.password?.message?.length! > 0 ? (
            <View className="w-full flex flex-row justify-start items-center">
              <MaterialIcons
                name="error-outline"
                size={24}
                color={'red'}
                className="bg-red-500"
              />
              <Text className="w-full  font-poppins text-red-700 mx-2">
                {errors.password?.message}
              </Text>
            </View>
          ) : null}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="w-full h-14 p-2 rounded-full bg-black dark:bg-dark-btn flex justify-center items-center mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <Text className="text-lg  font-poppins-bold text-white">
                {i18n.t('joiningTxt')}
              </Text>
            ) : (
              <Text className="text-lg  font-poppins-bold text-white">
                {i18n.t('signUpBtn')}
              </Text>
            )}
          </Pressable>
          <View className="w-full h-1 bg-gray-200 rounded-md mt-5" />
          <View className="w-full h-10 flex flex-row justify-center items-center gap-x-2 mt-4">
            <View className="w-auto h-full flex justify-center items-center">
              <Text className="text-lg text-black dark:text-dark font-poppins ">
                {i18n.t('alreadyAmemberText')}{' '}
              </Text>
            </View>
            <Pressable
              className="w-auto h-10 flex justify-center items-center"
              onPress={() => router.replace('/auth/login')}
            >
              <Text className=" font-bold text-black dark:text-dark text-lg">
                {i18n.t('signInText')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Join;
