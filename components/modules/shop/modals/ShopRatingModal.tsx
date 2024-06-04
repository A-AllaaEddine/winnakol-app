'use client';

import { MainColor } from '@/constants/colors';
import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { ShopAr } from '@/locales/ar/shop';
// import { UsernameAr } from '@/locales/ar/username';
import { ShopEn } from '@/locales/en/shop';
import { ShopFr } from '@/locales/fr/shop';
// import { UsernameFr } from '@/locales/fr/username';
import { trpc } from '@/trpc/client';
import { useContext, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import ActionSheet, {
  ScrollView,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import RadioGroup from 'react-native-radio-buttons-group';
import { Rating } from 'react-native-ratings';
import Toast from 'react-native-toast-message';

const ShopRatingModal = (props: SheetProps<'shop-rating-sheet'>) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [isRecommended, setIsRecommended] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<string>('1');

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
  const { mutateAsync: saveReview, isLoading } =
    trpc.reviews.shop.add.useMutation({
      onError: (error) => {
        console.log(error);
      },
    });

  const handleSubmit = async () => {
    if (rating === 0) {
      Toast.show({
        type: 'error',
        text1: i18n.t('selectRatingTxt'),
      });
      return;
    }
    if (!review.length) {
      Toast.show({
        type: 'error',
        text1: i18n.t('leaveReviewTxt'),
      });
      return;
    }

    try {
      await saveReview({
        rating,
        review,
        isRecommended,
        shopId: shopId,
      });
      setReview('');
      Toast.show({
        type: 'success',
        text1: i18n.t('reviewSubmittedText'),
      });
      // router.dismiss(2);
      await SheetManager.hide('shop-rating-sheet');
    } catch (error: any) {
      // router.dismiss(2);
      console.log(error.message);
      if (error.message === 'Review exists already.') {
        return Toast.show({
          type: 'error',
          text1: i18n.t('alreadyReviewedTxt'),
        });
      }
      i18n.t('errorSubmittingReviewTxt')!;
      Toast.show({
        type: 'error',
        text1: i18n.t('errorSubmittingReviewTxt'),
      });
    }
  };

  const selectRecommendation = (selectedId: string) => {
    setSelectedId(selectedId);
    if (selectedId === '1') {
      setIsRecommended(true);
      return;
    }
    setIsRecommended(false);
  };
  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 30,
        backgroundColor: colorScheme === 'light' ? 'white' : '#141414',
        minHeight: 500,
      }}
      closable={!isLoading}
      headerAlwaysVisible={true}
      gestureEnabled
      CustomHeaderComponent={
        <View className="w-full h-16 flex flex-row justify-center items-center">
          <Text className="text-lg text-black dark:text-dark font-bold">
            {i18n.t('leaveReviewTitle')}
          </Text>
        </View>
      }
    >
      <ScrollView className="w-full h-auto  bg-white dark:bg-dark px-6  ">
        {/* <View className="w-full h-12  flex flex-row justify-center items-center px-3">
          <View className="w-36 h-2 bg-slate-300 rounded-full" />
        </View> */}
        <View
          className="w-full gap-y-4 rounded-md"
          // dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}s
        >
          {/* <View>
            <Text className="text-xl text-start mt-5 font-bold text-black dark:text-dark">
              {i18n.t('leaveReviewTitle')}
            </Text>
          </View> */}
          <View className="w-full h-auto items-start">
            <Rating
              type="custom"
              startingValue={0}
              ratingColor={MainColor}
              imageSize={40}
              onFinishRating={setRating}
              ratingBackgroundColor="#EDEBEB"
              style={{ paddingVertical: 10, width: 'auto' }}
              tintColor={colorScheme === 'dark' ? '#141414' : '#fff'}
            />
          </View>
          <TextInput
            numberOfLines={4}
            multiline
            textAlignVertical="top"
            className="w-full h-32 text-black dark:text-dark  bg-slate-200 dark:bg-dark-card rounded-lg px-2"
            placeholder={i18n.t('writeReviewPlaceholder')}
            placeholderTextColor={colorScheme === 'light' ? 'black' : '#EDEBEB'}
            onChangeText={(e) => setReview(e)}
            value={review}
          />
          <Text className="hover:cursor-pointer font-poppins text-black dark:text-dark">
            {i18n.t('recommandLabel')}
          </Text>

          <View className="w-full flex justify-start items-start">
            <RadioGroup
              radioButtons={[
                {
                  id: '1',
                  label: (
                    <Text className="text-black dark:text-dark px-2">
                      {i18n.t('yesTxt')}
                    </Text>
                  ),
                  value: 'yes',
                  color: colorScheme === 'light' ? 'black' : '#EDEBEB',
                },
                {
                  id: '2',
                  label: (
                    <Text className="text-black dark:text-dark px-2">
                      {i18n.t('noTxt')}
                    </Text>
                  ),
                  value: 'no',
                  color: colorScheme === 'light' ? 'black' : '#EDEBEB',
                },
              ]}
              onPress={selectRecommendation}
              selectedId={selectedId}
              containerStyle={{
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            />
          </View>
          <View className="mt-4 ">
            <Pressable
              className="w-auto h-12 flex justify-center items-center  text-lg
              font-bold bg-black dark:bg-dark-btn rounded-full"
              onPress={handleSubmit}
              // disabled={isLoading}
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

export default ShopRatingModal;
