'use client';

import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { ShopAr } from '@/locales/ar/shop';
// import { UsernameAr } from '@/locales/ar/username';
import { ShopEn } from '@/locales/en/shop';
import { ShopFr } from '@/locales/fr/shop';
// import { UsernameFr } from '@/locales/fr/username';
import { trpc } from '@/trpc/client';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import Toast from 'react-native-toast-message';

const ShopReportModal = (props: SheetProps<'shop-report-sheet'>) => {
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const shopId = props.payload?.shopId as string;

  const { colorScheme } = useColorScheme();

  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: {
      en: ShopEn,
      fr: ShopFr,
      ar: ShopAr,
    },
  });
  const { mutateAsync: saveReport, isLoading } =
    trpc.reports.shop.add.useMutation({
      onError: (error) => {
        console.log(error);
      },
    });

  const tags = Object.entries(i18n.t('tags', { returnObjects: true })).map(
    ([key, value]) => {
      return { value: key, label: value };
    }
  );

  const handleSubmit = async () => {
    if (!selectedTag.length) {
      Toast.show({
        type: 'error',
        text1: i18n.t('selectTagTxt'),
      });
      return;
    }
    if (!reason.length) {
      Toast.show({
        type: 'error',
        text1: i18n.t('selectReasonTxt'),
      });
      return;
    }

    try {
      await saveReport({
        shopId: shopId,
        tag: selectedTag,
        type: 'shop',
        reason,
      });
      setSelectedTag('');
      Toast.show({
        type: 'success',
        text1: i18n.t('ReportSubmittedTxt'),
      });
      // router.dismiss();
      await SheetManager.hide('shop-repor-sheet');
    } catch (error: any) {
      // router.dismiss();
      console.log(error.message);
      if (error.message === 'already reported') {
        Toast.show({
          type: 'error',
          text1: i18n.t('alreadyReportedTxt'),
        });
        return;
      }
      Toast.show({
        type: 'error',
        text1: i18n.t('errorSubmittingReportTxt'),
      });
    }
  };

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 50,
        backgroundColor: colorScheme === 'light' ? 'white' : '#141414',
        minHeight: 500,
      }}
      headerAlwaysVisible={true}
      gestureEnabled
      CustomHeaderComponent={
        <View className="w-full h-16 flex flex-row justify-center items-center">
          <Text className="text-lg text-black dark:text-dark font-bold">
            {i18n.t('reportTitle')}
          </Text>
        </View>
      }
    >
      <ScrollView
        className="w-full h-auto  bg-white dark:bg-dark px-4  "
        scrollEnabled={false}
        automaticallyAdjustKeyboardInsets
      >
        {/* {Platform.OS === 'android' ? (
        <View className="w-full h-16 flex flex-row justify-start items-end">
          <View className="w-16   h-16 ">
            <Back />
          </View>
        </View>
      ) : (
        <View className="w-full h-12  flex flex-row justify-center items-center px-3">
          <View className="w-36 h-2 bg-slate-300 rounded-full" />
        </View>
      )} */}
        <View
          // dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
          className="w-full rounded-md gap-y-4"
        >
          {/* <View>
            <Text className="text-3xl text-start mt-5 font-poppins-bold">
              {i18n.t('reportTitle')}
            </Text>
          </View> */}
          <View className="w-full h-auto flex justify-start items-start gap-y-4 mt-3">
            <Text className="text-black dark:text-dark text-lg font-bold">
              {i18n.t('whyTxt')}
            </Text>
            <Text className=" text-slate-400 text-sm">
              {i18n.t('anonymouysTxt')}
            </Text>
            <View className="h-auto  flex flex-row flex-wrap gap-3 mt-4">
              {tags.map((tag, idx) => {
                return (
                  <Pressable
                    key={idx}
                    className={`flex justify-center items-center w-auto h-8
                     font-bold  px-3 rounded-full 
                    ${
                      selectedTag === tag.value
                        ? ' bg-main'
                        : ' bg-slate-100 dark:bg-dark-card'
                    }`}
                    onPress={() =>
                      setSelectedTag((prev) => {
                        if (prev === tag.value) {
                          return '';
                        }
                        return tag.value;
                      })
                    }
                  >
                    <Text
                      className={`w-auto  text-sm ${
                        selectedTag === tag.value
                          ? 'text-white'
                          : 'text-slate-500 dark:text-dark'
                      }`}
                    >
                      {tag.label as string}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View className="flex justify-start items-start gap-y-3">
            <Text className="text-lg text-black dark:text-dark font-bold">
              {i18n.t('reasonTxt')}
            </Text>
            <Text className=" text-slate-400 text-sm">
              {i18n.t('helpUsTxt')}
            </Text>
            <TextInput
              className="w-full h-32 text-black dark:text-dark  bg-slate-200 dark:bg-dark-card rounded-lg px-2"
              // placeholder="Describe the reason..."
              placeholderTextColor={
                colorScheme === 'light' ? 'black' : '#EDEBEB'
              }
              numberOfLines={4}
              multiline
              textAlignVertical="top"
              onChangeText={(e) => setReason(e)}
              value={reason}
            />
          </View>
          <View className="">
            <Pressable
              className="w-auto h-12 flex justify-center items-center text-white text-lg
            font-bold bg-black dark:bg-dark-btn rounded-lg"
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text className="text-white font-bold text-lg">
                {isLoading ? i18n.t('submittingTxt') : i18n.t('submitBtn')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

export default ShopReportModal;
