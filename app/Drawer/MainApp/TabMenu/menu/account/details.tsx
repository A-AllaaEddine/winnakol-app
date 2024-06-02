import Back from '@/components/commun/static/Back';
import BackButton from '@/components/commun/static/BackButton';
import { languageContext } from '@/context/LanguageContext';
import { accountAr } from '@/locales/ar/account';
import { accountEn } from '@/locales/en/account';
import { accountFr } from '@/locales/fr/account';
import { trpc } from '@/trpc/client';
import { MaterialIcons } from '@expo/vector-icons';
import { useSession } from '@fullauth/react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  Appearance,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

const Account = () => {
  const { update, session } = useSession();
  const [sent, setSent] = useState<boolean>(false);

  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: { en: accountEn, fr: accountFr, ar: accountAr },
  });

  const schema = z.object({
    name: z.string().min(1, { message: i18n.t('nameIsRequired') }),
    username: z
      .string()
      .min(1, { message: i18n.t('usernameIsRequired') })
      .regex(new RegExp('^[a-zA-Z0-9_]+$'), {
        message: i18n.t('forbiddenCharacter'),
      }),
    email: z
      .string()
      .min(1, { message: i18n.t('emailIsRequired') })
      .email({
        message: i18n.t('validEmailRequired'),
      }),
  });

  type loginSchema = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<loginSchema>({
    defaultValues: {
      name: session?.user?.name,
      username: session?.user?.username,
      email: session?.user?.email,
    },
    resolver: zodResolver(schema),
  });

  const {
    mutateAsync: updateUserInfo,
    isLoading,
    isError,
    error,
  } = trpc.user.update.useMutation();

  const { mutateAsync: sendEmail, isLoading: isLoadingEmail } =
    trpc.user.verify.email.useMutation();

  const onSubmit: SubmitHandler<loginSchema> = async (data) => {
    const changes =
      JSON.stringify({
        name: session?.user?.name || '',
        username: session?.user?.username || '',
        email: session?.user?.email || '',
      }) !== JSON.stringify(data);

    if (!changes) return;

    if (session?.user?.email !== data?.email && !session?.user?.emailVerified) {
      Toast.show({
        type: 'info',
        text1: i18n.t('verifyEmailTxt'),
      });
      return;
    }

    try {
      await updateUserInfo({
        ...data,
        username: data.username.toLowerCase().replace(/\s/g, '_'),
      });
      if (isError) {
        throw error;
      }
      await update({
        name: data.name,
        username: data.username,
        email: data.email,
      });
      Toast.show({
        type: 'success',
        text1: i18n.t('savedTxt'),
      });
    } catch (error: any) {
      console.log('error: ', error.message);
      if (error.message === 'Same username') {
        // return t('stepTwo:sameUsernameTxt');
        Toast.show({
          type: 'error',
          text1: i18n.t('newUsernameError'),
        });
        return;
      }
      if (error.message === 'Username taken') {
        // return t('stepTwo:usernameTakenTxt');
        Toast.show({
          type: 'error',
          text1: i18n.t('usernameTaken'),
        });
        return;
      }
      //   return t('settings:errorSavingTxt');
      Toast.show({
        type: 'error',
        text1: i18n.t('errorSavingTxt'),
      });
      return;
    }
  };
  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      <View className="w-full h-16 flex flex-row justify-start items-end px-6">
        <View className=" h-16 flex justify-center items-center ">
          <BackButton />
        </View>
        <View className="w-full h-16 mx-2 flex flex-row justify-start items-center">
          <Text className=" font-poppins-bold text-black dark:text-dark text-3xl tracking-wider">
            {i18n.t('details')}
          </Text>
        </View>
      </View>
      <View className="w-full h-full flex pt-10 justify-start items-center px-6 gap-y-3">
        {session?.user?.id && !session?.user.emailVerified && !sent && (
          <View className="w-full h-auto flex flex-row justify-between items-center ">
            <View className="w-auto flex flex-col justify-start items-center gap-3">
              <Text className="text-sm font-poppins md:text-sm text-black dark:text-dark">
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
        )}
        <View className="w-full h-auto">
          {session?.user.type === 'user' ? (
            <>
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
                      className="w-full h-14  text-lg border-[1px] text-black dark:text-dark border-gray-400 rounded-md px-2 mt-3"
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
            </>
          ) : null}
          <View className="w-full h-auto flex flex-col justify-start items-start py-2">
            <Text className="w-auto text-start text-lg text-black dark:text-dark  font-poppins">
              {i18n.t('usernameLabel')}
            </Text>
            <Controller
              defaultValue=""
              name="username"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={(v) => {
                    onChange(v);
                  }}
                  value={value}
                  defaultValue=""
                  className="w-full h-14  text-lg border-[1px] text-black dark:text-dark border-gray-400 rounded-md px-2 mt-3"
                  placeholder={i18n.t('usernameLabel')}
                />
              )}
            />
          </View>
          {errors.username?.message?.length! > 0 ? (
            <View className="w-full flex flex-row justify-start items-center">
              <MaterialIcons
                name="error-outline"
                size={24}
                color={'red'}
                className="bg-red-500"
              />
              <Text className="w-full text-red-700 mx-2  font-poppins">
                {errors.username?.message}
              </Text>
            </View>
          ) : null}
          <View className="w-full h-auto flex flex-col justify-start items-start py-2">
            <Text className="w-auto text-start text-lg text-black dark:text-dark  font-poppins">
              {i18n.t('emailLabel')}
            </Text>
            <Controller
              defaultValue=""
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={(v) => {
                    onChange(v);
                  }}
                  keyboardType="email-address"
                  value={value}
                  defaultValue=""
                  className="w-full h-14  text-lg border-[1px] text-black dark:text-dark border-gray-400 rounded-md px-2 mt-3"
                  placeholder={i18n.t('emailLabel')}
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
          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="w-full h-14 p-2 rounded-md bg-black dark:bg-dark-btn flex justify-center items-center my-3"
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

export default Account;
