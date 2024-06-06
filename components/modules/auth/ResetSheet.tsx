import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { ResetAr } from '@/locales/ar/reset';
import { ResetEn } from '@/locales/en/reset';
import { ResetFr } from '@/locales/fr/reset';
import { trpc } from '@/trpc/client';
import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

const ResetSheet = (props: SheetProps<'reset-sheet'>) => {
  const context = useContext(languageContext);
  const { colorScheme } = useColorScheme();

  const { i18n } = context?.translation({
    translations: {
      en: ResetEn,
      fr: ResetFr,
      ar: ResetAr,
    },
  });

  const schema = z.object({
    email: z
      .string()
      .min(1, { message: i18n.t('emailRequired') })
      .email({
        message: i18n.t('validEmail'),
      }),
  });

  type resetSchema = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<resetSchema>({
    defaultValues: { email: '' },
    resolver: zodResolver(schema),
  });

  const {
    mutateAsync: sendEmail,
    isLoading,
    isError,
    error,
  } = trpc.user.reset.email.useMutation();

  const onSubmit: SubmitHandler<resetSchema> = async (data) => {
    try {
      await sendEmail({ email: data.email });
      Toast.show({
        type: 'success',
        text1: i18n.t('emailSentTxt'),
      });
      // router.push({
      //   pathname: '/auth/code',
      //   params: { email: data.email },
      // });
      await SheetManager.hide('reset-sheet');
      await SheetManager.show('code-sheet', {
        payload: {
          email: data.email as string,
        },
      });
    } catch (error: any) {
      console.log('error: ', error);
      if ('No User') {
        return Toast.show({
          type: 'error',
          text1: i18n.t('noUserErrorTxt'),
        });
      }
      Toast.show({
        type: 'error',
        text1: i18n.t('errorSendingEmail'),
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
          <Text className="text-lg text-black dark:text-dark font-bold font-oswald">
            {i18n.t('resetText')}
          </Text>
        </View>
      }
    >
      <View className="h-[250px] bg-transparent">
        <View className="w-full h-auto flex flex-col justify-start items-start py-2">
          {/* <Text className="w-auto text-start text-black dark:text-dark text-lg  font-poppins">
            {i18n.t('emailLabel')}
          </Text> */}
          {/* <Text className="w-full text-center text-2xl  font-bold text-black dark:text-dark">
            {i18n.t('resetText')}
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
                inputMode="email"
                value={value}
                defaultValue=""
                className="w-full h-14 text-black font-nunito dark:text-dark text-lg border-[1px] border-gray-400 rounded-full px-3 mt-6"
                placeholder={i18n.t('emailLabel')}
                placeholderTextColor={'gray'}
              />
            )}
          />

          {errors.email?.message?.length! > 0 ? (
            <View className="w-full h-8 flex flex-row justify-start items-center">
              <MaterialIcons
                name="error-outline"
                size={24}
                color={'red'}
                className="bg-red-500"
              />
              <Text className="w-full text-red-700 mx-2  font-nunito-semi">
                {errors.email?.message}
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
            <Text className="text-lg  font-nunito-semi text-white">
              {i18n.t('sendingTxt')}
            </Text>
          ) : (
            <Text className="text-lg  font-nunito-semi text-white">
              {i18n.t('sendEmailBtn')}
            </Text>
          )}
        </Pressable>
        {/* <Pressable
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
              {i18n.t('backTologinTxt')}
            </Text>
          </View>
        </Pressable> */}
      </View>
    </ActionSheet>
  );
};

export default ResetSheet;
