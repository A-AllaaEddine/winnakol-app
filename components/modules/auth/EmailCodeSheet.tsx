import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { CodeAr } from '@/locales/ar/code';
import { CodeEn } from '@/locales/en/code';
import { CodeFr } from '@/locales/fr/code';
import { trpc } from '@/trpc/client';
import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useContext } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

const EmailCodeSheet = (props: SheetProps<'code-sheet'>) => {
  const context = useContext(languageContext);
  const { colorScheme } = useColorScheme();

  const { i18n } = context?.translation({
    translations: {
      en: CodeEn,
      fr: CodeFr,
      ar: CodeAr,
    },
  });

  const schema = z.object({
    email: z
      .string()
      .min(1, { message: i18n.t('emailRequired') })
      .email({
        message: i18n.t('validEmail'),
      }),
    code: z.string().min(1, { message: i18n.t('codeRequired') }),
  });

  type codeSchema = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<codeSchema>({
    defaultValues: { email: props.payload?.email ?? '', code: '' },
    resolver: zodResolver(schema),
  });

  const {
    mutateAsync: verifyCode,
    isLoading,
    isError,
    error,
  } = trpc.user.verify.code.useMutation();

  const onSubmit: SubmitHandler<codeSchema> = async (data) => {
    try {
      await verifyCode({ email: data.email, code: data.code });
      Toast.show({
        type: 'success',
        text1: i18n.t('validCodeTxt'),
      });
      await SheetManager.hide('email-code-sheet');
      //   router.push({
      //     pathname: '/auth/password',
      //     params: { email: data.email },
      //   });
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
    <ActionSheet
      id={props.sheetId}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 30,
        backgroundColor: colorScheme === 'light' ? 'white' : '#141414',
        maxHeight: '90%',
        paddingHorizontal: 20,
      }}
      closable={!isLoading}
      headerAlwaysVisible={true}
      gestureEnabled
      CustomHeaderComponent={
        <View className="w-full h-16 flex flex-row justify-center items-center">
          <Text className="text-lg text-black dark:text-dark font-bold">
            {i18n.t('enterCodeText')}
          </Text>
        </View>
      }
    >
      <View className="h-[250px] bg-transparent">
        <Text className="text-black dark:text-dark text-sm">
          {i18n.t('enterEmailCode')}
        </Text>
        <View className="w-full h-auto flex flex-col justify-start items-start py-2">
          {/* <Text className="w-full text-center text-2xl  font-bold text-black dark:text-dark">
            {i18n.t('enterCodeText')}
          </Text> */}
          <Controller
            name="code"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={(v) => {
                  onChange(v);
                }}
                inputMode="numeric"
                value={value}
                maxLength={6}
                defaultValue=""
                className="w-full h-14 text-black dark:text-dark text-lg border-[1px] border-gray-400 rounded-full px-3 mt-6"
                placeholder={i18n.t('codeLabel')}
                placeholderTextColor={'gray'}
              />
            )}
          />

          {errors.code?.message?.length! > 0 ? (
            <View className="w-full h-8 flex flex-row justify-start items-center">
              <MaterialIcons
                name="error-outline"
                size={24}
                color={'red'}
                className="bg-red-500"
              />
              <Text className="w-full text-red-700 mx-2  font-poppins">
                {errors.code?.message}
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
              {i18n.t('verifyingTxt')}
            </Text>
          ) : (
            <Text className="text-lg  font-poppins-bold text-white">
              {i18n.t('verifyEmailBtn')}
            </Text>
          )}
        </Pressable>
        {/* <Pressable
          onPress={() => router.back()}
          className="w-full h-10 flex flex-row justify-center items-center gap-x-2 mt-5"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <View className="w-auto h-10 flex justify-center items-center">
            <Text className=" font-bold text-black dark:text-dark text-lg">
              {i18n.t('backToResetTxt')}
            </Text>
          </View>
        </Pressable> */}
      </View>
    </ActionSheet>
  );
};

export default EmailCodeSheet;
