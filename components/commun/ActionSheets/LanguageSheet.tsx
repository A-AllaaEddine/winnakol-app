import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { PreferencesAr } from '@/locales/ar/preferences';
import { PreferencesEn } from '@/locales/en/preferences';
import { PreferencesFr } from '@/locales/fr/preferences';
import { trpc } from '@/trpc/client';
import { useSession } from '@fullauth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { useContext, useState } from 'react';
import { I18nManager, Pressable, Text, View } from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import { FlashList } from 'react-native-actions-sheet/dist/src/views/FlashList';

function LanguageSheet(props: SheetProps<'language-sheet'>) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    props.payload?.currentLanguage ?? 'en'
  );

  const { colorScheme } = useColorScheme();
  const { update, session } = useSession();
  const context = useContext(languageContext);
  const { i18n } = context?.translation({
    translations: { en: PreferencesEn, fr: PreferencesFr, ar: PreferencesAr },
  });

  const { mutateAsync: updateLanguage, isLoading } =
    trpc.user.update.useMutation();

  const changeLanguage = async (lang: string) => {
    try {
      setSelectedLanguage(lang);
      if (context?.currentLanguage !== lang) {
        await AsyncStorage.setItem('language', lang);
        SheetManager.hide('language-sheet');
        if (session?.user?.id) {
          updateLanguage({ deviceLang: lang });
          update({ deviceLang: lang });
        }
        context?.setCurrentLanguage(lang);
        if (lang === 'ar') {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
          // DevSettings.reload();
          Updates.reloadAsync();
          return;
        }
        I18nManager.allowRTL(false);
        I18nManager.forceRTL(false);
        // DevSettings.reload();
        Updates.reloadAsync();
      }
    } catch (error: any) {
      console.log('error: ', error);
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
      gestureEnabled
      CustomHeaderComponent={
        <View className="w-full h-16 flex flex-row justify-center items-center">
          <Text className="text-lg text-black dark:text-dark font-bold font-oswald">
            {i18n.t('selectLanguageTxt')}
          </Text>
        </View>
      }
    >
      <View className="h-[220px] bg-transparent">
        <FlashList
          data={props.payload?.data}
          contentContainerStyle={{
            paddingHorizontal: 25,
          }}
          renderItem={({
            item,
          }: {
            item: { value: string; label: string };
          }) => {
            return (
              <Pressable
                className={`w-full h-10 flex flex-row justify-center items-center rounded-full my-2 ${
                  selectedLanguage === item.value
                    ? 'bg-main'
                    : 'bg-white dark:bg-dark'
                }`}
                onPress={() => {
                  changeLanguage(item.value);
                }}
              >
                <Text
                  className={`${
                    selectedLanguage === item.value
                      ? 'text-white'
                      : 'text-black dark:text-dark'
                  }  text-lg font-nunito-semi`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
          estimatedItemSize={10}
        />
      </View>
    </ActionSheet>
  );
}

export default LanguageSheet;
