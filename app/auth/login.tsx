import { languageContext } from '@/context/LanguageContext';

import Logo from '@/assets/images/logo.svg';
import LogoText from '@/assets/images/logo_text.svg';
import { MaterialIcons } from '@expo/vector-icons';
import { signIn, useSession } from '@fullauth/react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
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
import { z } from 'zod';
// import usePushNotification from '@/hooks/usePushNotification';
import { LoginAr } from '@/locales/ar/login';
import { LoginEn } from '@/locales/en/login';
import { LoginFr } from '@/locales/fr/login';
import { SheetManager } from 'react-native-actions-sheet';

const defaultFormFields = {
  email: '',
  password: '',
};

const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingSession, setIsChecingSession] = useState<boolean>(true);
  const { update, session, status } = useSession();
  // const { expoPushToken, notification } = usePushNotification();

  const context = useContext(languageContext);
  // SplashScreen.hideAsync();

  useEffect(() => {
    if (status !== 'authenticating') {
      if (session?.user) {
        // If the app is under maintenance, redirect to the maintenance page
        router.push('/Drawer/MainApp/TabMenu/home');
      } else {
        setIsChecingSession(false);
        // setTimeout(() => {
        //   SplashScreen.hideAsync();
        // }, 1000);
      }
    }
  }, [status, session]);

  const { i18n } = context?.translation({
    translations: {
      en: LoginEn,
      fr: LoginFr,
      ar: LoginAr,
    },
  });

  // useEffect(() => {
  //   console.log('session: ', session);
  //   setTimeout(() => {
  //     if (session) {
  //       router.push('/Drawer/MainApp/TabMenu/home');
  //       SplashScreen.hideAsync();
  //     } else {
  //       SplashScreen.hideAsync();
  //     }
  //   }, 500);
  // }, [session]);

  const schema = z.object({
    email: z
      .string()
      .min(1, { message: i18n.t('emailRequired') })
      .email({
        message: i18n.t('validEmail'),
      }),
    password: z.string().min(8, { message: i18n.t('shortPassword') }),
  });
  type loginSchema = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<loginSchema>({
    defaultValues: defaultFormFields,
    resolver: zodResolver(schema),
  });

  // const { mutate: saveExpoPushToken } = trpc.user.update.useMutation();

  const onSubmit: SubmitHandler<loginSchema> = async (data) => {
    try {
      setIsLoading(true);
      const resp = await signIn({
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
        text1: i18n.t('loggedInTxt'),
      });
      reset();
      router.push('/Drawer/MainApp/TabMenu/home');
    } catch (error: any) {
      setIsLoading(false);
      console.log('error: ', error);
      switch (error.message) {
        case 'No User':
          return Toast.show({
            type: 'error',
            text1: i18n.t('noUserErrorTxt'),
          });
        case 'Wrong Password':
          return Toast.show({
            type: 'error',
            text1: i18n.t('wrongPassword'),
          });
        case 'suspended':
          return Toast.show({
            type: 'error',
            text1: i18n.t('suspendedErrorTxt'),
          });
        case 'banned':
          return Toast.show({
            type: 'error',
            text1: i18n.t('bannedErrorTxt'),
          });
        case 'Unauthorised':
          return Toast.show({
            type: 'error',
            text1: i18n.t('UnauthorisedTxt'),
          });
        default:
          Toast.show({
            type: 'error',
            text1: i18n.t('errorLogginInTxt'),
          });
      }
    }
  };

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      {isCheckingSession ? (
        <View className="w-full h-full flex justify-center items-center gap-y-3 px-6">
          <View className="w-full h-20 flex justify-center items-center">
            <Logo width="150" height="150" />
          </View>
          <Text className="text-lg text-center text-black dark:text-dark">
            {i18n.t('gettingSessionTxt')}
          </Text>
        </View>
      ) : (
        <>
          <View className="w-full h-20 font-poppins flex flex-row justify-center items-center">
            <LogoText width="120" height="120" />
            {/* <Text className="w-auto flex text-black dark:text-dark font-bold">
              <Text className="w-auto flex text-main font-bold">
                {i18n.t('win')}
              </Text>{' '}
              {i18n.t('nakol')}
            </Text> */}
          </View>
          <ScrollView
            className="w-full h-screen font-poppins flex  px-8"
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 50,
            }}
          >
            <View className="w-full h-auto flex flex-col justify-start items-center">
              <Text className="w-full text-center text-2xl  font-bold text-black dark:text-dark">
                {i18n.t('signInText')}
              </Text>
              <View className="w-full h-auto flex flex-col justify-start items-start mt-2">
                {/* <Text className="w-auto text-start text-lg  font-poppins text-black dark:text-dark">
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
                      placeholderTextColor={'gray'}
                      className={`w-full h-14 text-black dark:text-dark ${
                        I18nManager.isRTL ? 'text-right' : 'text-left'
                      }  text-lg border-[1px] border-gray-400 rounded-full px-3 mt-3`}
                      placeholder={i18n.t('emailLabel')}
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
                  <Text className="w-full text-red-700 mx-2  font-poppins">
                    {errors.email?.message}
                  </Text>
                </View>
              ) : null}
              <View className="w-full h-auto flex flex-col justify-start items-start mt-2">
                {/* <Text className="w-auto text-start text-lg text-black dark:text-dark font-poppins">
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
                  <Text className="w-full text-red-700 mx-2  font-poppins">
                    {errors.password?.message}
                  </Text>
                </View>
              ) : null}
              <Pressable
                onPress={() => {
                  // router.push('/auth/reset')
                  SheetManager.show('reset-sheet');
                }}
              >
                <Text className="text-lg mt-4 text-black dark:text-dark font-poppins-bold">
                  {i18n.t('forgotPasswordText')}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit(onSubmit)}
                className="w-full h-14 p-2 rounded-full bg-black dark:bg-dark-btn flex justify-center items-center mt-5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text className="text-lg  font-poppins-bold text-white">
                    {i18n.t('loggingInTxt')}
                  </Text>
                ) : (
                  <Text className="text-lg  font-poppins-bold text-white">
                    {i18n.t('loginBtn')}
                  </Text>
                )}
              </Pressable>
              <View className="w-full h-1 bg-gray-200 rounded-md mt-5" />
              <View className="w-full h-10 flex flex-row justify-center items-center gap-x-2 mt-4">
                <View className="w-auto h-full flex justify-center items-center">
                  <Text className="text-lg text-black dark:text-dark font-poppins">
                    {i18n.t('dontHaveAnAccountText')}{' '}
                  </Text>
                </View>
                <Pressable
                  className="w-auto h-10 flex justify-center items-center"
                  onPress={() => router.replace('/auth/join')}
                >
                  <Text className=" font-bold text-black dark:text-dark text-lg">
                    {i18n.t('createText')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default Login;
