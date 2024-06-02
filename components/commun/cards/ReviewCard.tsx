import { useColorScheme } from '@/context/ColorSchemeContext';
import { Review } from '@/types/types';
import { Image, Pressable, Text, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import { formatDistanceToNow } from 'date-fns';
import { enUS, fr, ar } from 'date-fns/locale';
import { useContext } from 'react';
import { languageContext } from '@/context/LanguageContext';
import { useSession } from '@fullauth/react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { ShopSettingsEn } from '@/locales/en/shopSettings';
import { ShopSettingsFr } from '@/locales/fr/shopSettings';
import { ShopSettingsAr } from '@/locales/ar/shopSettings';
import PictureComponent from '../static/PictureComponent';
import { MainColor } from '@/constants/colors';

const ReviewCard = ({ review }: { review: Review }) => {
  const { colorScheme } = useColorScheme();
  const { session } = useSession();
  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: {
      en: ShopSettingsEn,
      fr: ShopSettingsFr,
      ar: ShopSettingsAr,
    },
  });

  const getLocale = (language: string) => {
    switch (language) {
      case 'en':
        return enUS;
      case 'ar':
        return ar;
      case 'fr':
        return fr;
      default:
        return enUS;
    }
  };

  return (
    <View className="w-[350px]  h-auto  flex  justify-start items-start ">
      <View className="w-full h-auto flex flex-row justify-start items-center gap-x-2">
        <View className="w-14 h-14 bg-slate-200  rounded-full border-2 border-gray-200">
          <PictureComponent url={review.reviewer?.profilePicture?.url!} />
        </View>
        <View className="h-auto w-full">
          <Text
            numberOfLines={1}
            className="w-[230px]  text-black dark:text-dark text-left text-sm font-bold truncate whitespace-nowrap"
          >
            {review.reviewer?.name}
          </Text>
          <View className="w-auto h-auto flex flex-row justify-start items-center gap-x-1">
            <Rating
              type="custom"
              startingValue={review.rating}
              ratingColor={MainColor}
              imageSize={14}
              ratingBackgroundColor="#fff"
              tintColor={colorScheme === 'dark' ? '#141414' : '#fff'}
              readonly
            />
            <Text className="text-xs text-left text-black dark:text-dark">
              {review.rating.toFixed(1)}
            </Text>
            <Text className="text-xs text-left text-black dark:text-dark">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
                locale: getLocale(context?.currentLanguage),
              })}
            </Text>
          </View>
        </View>
      </View>
      <View className="w-full min-h-[70px] p-2 mt-2 bg-sub dark:bg-dark-card rounded-xl">
        <Text className="text-sm  text-left text-black dark:text-dark">
          {review.review}
        </Text>
      </View>
      <View className="w-full h-auto flex flex-row justify-end items-center mt-2">
        {review.reviewer?.id !== session?.user.id && (
          <Pressable
            onPress={() => {
              SheetManager.show('review-report-sheet', {
                payload: {
                  reviewId: review.id,
                },
              });
            }}
            className="w-auto h-full px-2 py-1 rounded-full bg-sub dark:bg-dark-card"
          >
            <Text className="text-xs text-black dark:text-dark font-semibold">
              {i18n.t('reportReviewTxt')}
            </Text>
          </Pressable>
        )}
        {review.reviewer?.id === session?.user.id && (
          <>
            {new Date().getTime() <
              new Date(review.updatedAt!).getTime() + 60 * 60 * 60 * 24 && (
              <Pressable
                onPress={() => {
                  SheetManager.show('review-edit-sheet', {
                    payload: {
                      review: JSON.stringify(review),
                    },
                  });
                }}
                className="w-auto h-full px-2 py-1 rounded-full bg-sub dark:bg-dark-card mx-2"
              >
                <Text className="text-xs text-black dark:text-dark font-semibold">
                  {i18n.t('editReviewTxt')}
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                SheetManager.show('review-delete-sheet', {
                  payload: {
                    reviewId: review.id,
                  },
                });
              }}
              className="w-auto h-full px-2 py-1 rounded-full bg-sub dark:bg-dark-card"
            >
              <Text className="text-xs text-red-500 font-semibold">
                {i18n.t('deleteReviewTxt')}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export default ReviewCard;
