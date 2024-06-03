import { MainColor } from '@/constants/colors';
import { languageContext } from '@/context/LanguageContext';
import { ShopAr } from '@/locales/ar/shop';
import { ShopEn } from '@/locales/en/shop';
import { ShopFr } from '@/locales/fr/shop';
import { Shop } from '@/types/types';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useContext } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Swiper from 'react-native-swiper';
import LogoSplash from '@/assets/images/logo_splash.svg';

const ShopCard = ({ shop }: { shop: Shop }) => {
  const context = useContext(languageContext);
  const { i18n } = context?.translation({
    translations: { en: ShopEn, fr: ShopFr, ar: ShopAr },
  });

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: '/Drawer/MainApp/shop/main',
          params: {
            shop: JSON.stringify(shop),
          },
        });
      }}
      className="w-[170px] h-auto flex justify-start items-center"
    >
      {(shop as Shop).shopPictures![0]?.url ? (
        <Swiper
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: 50,
          }}
          height={120}
          loop={true}
          // activeDotColor={MainColor}
          paginationStyle={{ display: 'none' }}
          autoplay
          autoplayTimeout={3}
        >
          {(shop as Shop)?.shopPictures.map((item, idx) => {
            return (
              <Image
                key={idx}
                source={{ uri: item.url }}
                className="w-full h-full bg-slate-200 dark:bg-dark-card rounded-xl"
              />
            );
          })}
        </Swiper>
      ) : (
        <View className="w-full h-[120px] bg-gray-300 flex justify-center items-center rounded-xl">
          <LogoSplash width="50" height="50" />
        </View>
      )}

      <View className="w-full h-auto rounded-lg mt-3">
        <View className="w-full h-auto flex flex-row justify-between items-center">
          <Text
            numberOfLines={1}
            className="w-4/6 text-left text-black dark:text-dark truncate text-lg font-bold"
          >
            {shop.name}
          </Text>
          <View className="w-auto h-full flex flex-row justify-center items-center gap-x-1">
            <Text className="w-auto max-w-[70px] text-black dark:text-dark text-sm truncate">
              {shop.averageRating.toFixed(1)}
            </Text>
            <AntDesign name="star" size={15} color={MainColor} />
          </View>
        </View>
        <Text className="text-xs text-black dark:text-dark">
          {i18n.t('WorkingHours')}: {shop.workingHours[0]}-
          {shop.workingHours[1]}
        </Text>
      </View>
    </Pressable>
  );
};

export default ShopCard;
