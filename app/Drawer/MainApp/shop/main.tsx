import DishCard from '@/components/commun/cards/DishCard';
import DishSkeletonCard from '@/components/commun/cards/DishSkeletonCard';
import BackButton from '@/components/commun/static/BackButton';
import Skeleton from '@/components/commun/static/Skeleton';
import { MainColor } from '@/constants/colors';
import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { ShopAr } from '@/locales/ar/shop';
import { ShopEn } from '@/locales/en/shop';
import { ShopFr } from '@/locales/fr/shop';
import { trpc } from '@/trpc/client';
import { Favorite, Shop } from '@/types/types';
import { formatNumber } from '@/utils/utils';
import {
  EvilIcons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useSession } from '@fullauth/react-native';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  I18nManager,
  Image,
  Linking,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import ImageView from 'react-native-image-viewing-rtl';
import { Rating } from 'react-native-ratings';
import Swiper from 'react-native-swiper';

const ShopMain = () => {
  const searchParams = useLocalSearchParams();
  const shopData = JSON.parse(searchParams.shop as string) as Shop;
  const [showShopPics, setShowShopPics] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>(
    shopData.categories[0]
  );

  const { session } = useSession();
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    if (session) setIsEnabled(true);
  }, [session]);

  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: {
      en: ShopEn,
      fr: ShopFr,
      ar: ShopAr,
    },
  });

  const {
    data: userFavorites,
    isLoading: isLoadingUserFavorites,
    refetch: refetchUserFavorites,
  } = trpc.favourites.get.useQuery(undefined, {
    enabled: isEnabled,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: addFavourite } = trpc.favourites.add.useMutation();
  const { mutateAsync: removeFavourite } = trpc.favourites.remove.useMutation();

  const {
    data: dishes,
    isFetching,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    refetch: refetchDishes,
    hasNextPage,
    isError,
    error,
  } = trpc.dish.getMany.useInfiniteQuery(
    {
      shopId: shopData.id,
      category: selectedFilter ?? shopData.categories[0] ?? '',
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: shop,
    refetch: refetchShop,
    isFetching: isFetchingShop,
  } = trpc.shop.get.useQuery(
    {
      shopId: shopData.id,
    },
    {
      // initialData: shopData,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const data = dishes?.pages.reduce((acc: any, page) => {
    return [...acc, ...page.data];
  }, []);

  useEffect(() => {
    if (shop) {
      setSelectedFilter((shop as Shop)?.categories[0]);
    }
  }, [shop]);

  const AddToFavourite = async () => {
    try {
      await addFavourite({ id: shop?.id, type: 'shop' });
      refetchUserFavorites();
    } catch (error: any) {
      console.log('error: ', error);
    }
  };
  const RemoveFromFavourite = async () => {
    try {
      await removeFavourite({ id: shop?.id });
      refetchUserFavorites();
    } catch (error: any) {
      console.log('error: ', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    refetchDishes();
    refetchShop();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View className="w-full h-full bg-white dark:bg-dark pb-4">
      <View className="w-full h-full">
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          // key={isFetching ? 'fetching' : 'not-fetching'}
          key={'fetch'}
          numColumns={2}
          ListHeaderComponent={
            <View className="pb-5">
              <View className="w-full h-auto  pb-5">
                <View className="w-full h-[500px] relative shadow-lg shadow-gray-400 dark:shadow-none ">
                  <View className="absolute top-10 z-30 left-4">
                    <BackButton bg />
                  </View>
                  <View className="w-12 h-12 p-1 bg-sub rounded-full absolute top-10 right-4 z-20 shadow-sm">
                    {isFetchingShop ? (
                      <Skeleton classname="w-full h-full rounded-full" />
                    ) : (
                      <Image
                        source={{
                          uri:
                            shop?.shopLogo.url ??
                            require('@/assets/images/no_image.png'),
                        }}
                        className="w-full h-full bg-slate-200 dark:bg-dark-card rounded-full"
                      />
                    )}
                  </View>
                  {isFetchingShop ? (
                    <Skeleton classname="w-full h-fullrounded-bl-2xl rounded-br-2xl" />
                  ) : (
                    // <Image
                    //   source={{ uri: (shop as Shop)?.shopPicture.url }}
                    //   className="w-full h-full bg-slate-200 dark:bg-dark-card rounded-bl-2xl rounded-br-2xl"
                    // />
                    <View className="w-full h-full justify-center items-center">
                      {(shop as Shop).shopPictures![0]?.url ? (
                        <Swiper
                          style={{
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                          }}
                          // height={180}
                          loop={true}
                          activeDotColor={MainColor}
                          autoplay
                          autoplayTimeout={3}
                        >
                          {(shop as Shop)?.shopPictures.map((item) => {
                            return (
                              <Pressable
                                key={item.key}
                                onPress={() => {
                                  setSelectedImg(item.url);
                                  setShowShopPics(true);
                                }}
                                className="w-screen h-full flex justify-center items-center rounded-bl-xl rounded-br-xl"
                              >
                                <Image
                                  source={{ uri: item.url }}
                                  className="w-full h-full bg-slate-200 dark:bg-dark-card rounded-bl-2xl rounded-br-2xl"
                                />
                              </Pressable>
                            );
                          })}
                        </Swiper>
                      ) : (
                        <View className="w-full h-full bg-gray-300" />
                      )}
                    </View>
                  )}
                  <View className="w-auto h-auto flex p-2 bg-sub rounded-lg flex-row justify-between items-center absolute bottom-3 left-4  shadow-sm">
                    {isFetchingShop ? (
                      // <Skeleton classname="w-16 h-5" />
                      <View className="w-16 h-5 bg-sub rounded-md" />
                    ) : (
                      <View className="w-auto h-full flex flex-row justify-start items-center gap-x-1">
                        <View
                          className={`${
                            (shop as Shop).status === 'open'
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          } w-2 h-2 rounded-full`}
                        />
                        <Text className="text-sm h-full font-bold">
                          {shop?.status === 'open' ? 'Open' : 'Closed'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="w-auto h-auto p-3 bg-sub rounded-full absolute bottom-3 right-4  shadow-sm">
                    {userFavorites &&
                    userFavorites.length > 0 &&
                    (userFavorites as Favorite[]).find(
                      (favorite) => favorite.favourite_id === shop?.id
                    ) ? (
                      <Pressable onPress={RemoveFromFavourite}>
                        <MaterialIcons
                          name="favorite"
                          size={30}
                          color={MainColor}
                        />
                      </Pressable>
                    ) : (
                      <Pressable onPress={AddToFavourite}>
                        <MaterialIcons
                          name="favorite-border"
                          size={30}
                          color="black"
                        />
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
              <View className="px-4">
                <View className="w-full h-10 flex flex-row justify-between items-center">
                  {isFetchingShop ? (
                    // <View className="w-48 h-6  animate-pulse bg-gray-200 rounded-md" />
                    <Skeleton classname="w-48 h-8 rounded-full" />
                  ) : (
                    <Text className="w-auto max-w-[250px] text-black dark:text-dark text-left truncate whitespace-nowrap text-2xl font-bold">
                      {shop?.name}
                    </Text>
                  )}
                  {!session?.user.shop_id.includes(shopData.id) && (
                    <Pressable
                      // onPress={openActions}
                      onPress={() =>
                        SheetManager.show('shop-action-sheet', {
                          payload: {
                            shopId: shop.id,
                          },
                        })
                      }
                      className="rounded-lg"
                    >
                      <MaterialCommunityIcons
                        name="dots-vertical"
                        size={24}
                        color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                      />
                    </Pressable>
                  )}
                </View>
                <View className="w-full h-auto flex flex-row justify-between items-center mt-2">
                  {isFetchingShop ? (
                    <Skeleton classname="w-28 h-4 rounded-full" />
                  ) : (
                    <View className="w-auto h-full flex flex-row justify-center items-center gap-x-1">
                      <Rating
                        type="custom"
                        startingValue={shop?.averageRating}
                        ratingColor={MainColor}
                        imageSize={14}
                        ratingBackgroundColor="#EDEBEB"
                        tintColor={colorScheme === 'dark' ? '#141414' : '#fff'}
                        readonly
                      />
                      <Text className="text-sm text-left text-black dark:text-dark">
                        {shop?.averageRating.toFixed(1)}
                      </Text>
                      <Text className="text-xs text-black dark:text-white">
                        ({formatNumber(shop?.totalReviews)}{' '}
                        {i18n.t('reviewsTxt')})
                      </Text>
                    </View>
                  )}
                </View>
                <View className="w-full h-auto flex flex-row justify-between items-center mt-2">
                  {isFetchingShop ? (
                    <Skeleton classname="w-28 h-4 rounded-full" />
                  ) : (
                    <View className="w-auto h-full flex flex-row justify-center items-center gap-x-1">
                      <Text className="text-xs text-left text-black dark:text-dark">
                        {i18n.t('WorkingHours')}: {shop?.workingHours[0]}-
                        {shop?.workingHours[1]}
                      </Text>
                    </View>
                  )}
                </View>
                <View className="w-full h-auto flex flex-row justify-start items-center mb-2 gap-x-3">
                  {isFetchingShop ? (
                    <FlatList
                      data={Array.from({ length: 2 })}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 10, marginTop: 10 }}
                      inverted={I18nManager.isRTL}
                      renderItem={({ item }) => {
                        return <Skeleton classname="w-28 h-6 rounded-full" />;
                      }}
                    />
                  ) : (
                    <FlatList
                      data={(shop as Shop).phones}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 10, marginTop: 10 }}
                      inverted={I18nManager.isRTL}
                      renderItem={({ item }) => {
                        return (
                          <Pressable
                            className={`rounded-xl px-3 py-1 bg-sub dark:bg-dark-card `}
                            onPress={() => {
                              Linking.openURL(`tel:${item}`);
                            }}
                          >
                            <Text
                              className={`text-xs  font-semibold  text-black dark:text-dark`}
                            >
                              {item}
                            </Text>
                          </Pressable>
                        );
                      }}
                    />
                  )}
                </View>
                <Pressable
                  onPress={() =>
                    SheetManager.show('address-sheet', {
                      payload: {
                        address: shop.address.street,
                      },
                    })
                  }
                  className="w-auto h-auto  flex flex-row justify-start items-center gap-x-1 mt-2 "
                >
                  <EvilIcons name="location" size={20} color={MainColor} />
                  {isFetchingShop ? (
                    <Skeleton classname="w-28 h-4 rounded-full" />
                  ) : (
                    <Text
                      numberOfLines={1}
                      className="text-sm text-black dark:text-dark truncate whitespace-nowrap"
                    >
                      {shop?.address?.street}
                    </Text>
                  )}
                </Pressable>
                {/* <View className="w-full h-32 flex flex-row justify-start items-center gap-x-1 mt-4">
                  {isFetchingShop ? (
                    <Skeleton classname="w-full h-full rounded-lg" />
                  ) : (
                    <MapView
                      className="w-full h-full"
                      style={{ borderRadius: 10 }}
                      moveOnMarkerPress
                      rotateEnabled={false}
                      pitchEnabled={false}
                      zoomEnabled={false}
                      scrollEnabled={false}
                      region={{
                        latitude: (shop as Shop)?.address?.latitude,
                        longitude: (shop as Shop)?.address?.longitude,
                        latitudeDelta: 0.04, // Zoom level
                        longitudeDelta: 0.04, // Zoom level
                      }}
                      onPress={openMap}
                      provider={undefined}
                    >
                      <Marker
                        coordinate={{
                          latitude: (shop as Shop)?.address?.latitude,
                          longitude: (shop as Shop)?.address?.longitude,
                        }}
                      />
                    </MapView>
                  )}
                </View> */}
                <View className="w-full h-auto flex flex-row justify-start items-center mt-5 gap-x-3">
                  {isFetchingShop ? (
                    <FlatList
                      data={Array.from({ length: 4 })}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 10 }}
                      renderItem={({ item }) => {
                        return <Skeleton classname="w-28 h-6 rounded-full" />;
                      }}
                    />
                  ) : (
                    <FlatList
                      data={shop?.categories}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 10, marginTop: 10 }}
                      renderItem={({ item }) => {
                        return (
                          <Pressable
                            onPress={() => setSelectedFilter(item)}
                            className={`rounded-xl px-3 py-1 ${
                              selectedFilter === item
                                ? 'bg-main'
                                : 'bg-sub dark:bg-dark-card'
                            }`}
                          >
                            <Text
                              className={`text-sm  font-semibold  ${
                                selectedFilter === item
                                  ? 'text-white'
                                  : 'text-black dark:text-dark'
                              }`}
                            >
                              {item.charAt(0).toUpperCase() + item.slice(1)}
                            </Text>
                          </Pressable>
                        );
                      }}
                    />
                  )}
                </View>
              </View>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 15 }}
          columnWrapperStyle={{
            paddingHorizontal: 16,
            justifyContent: 'space-between',
            gap: 10,
          }}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          ListEmptyComponent={
            isFetching ? (
              <View className="w-full px-4 h-auto flex flex-row flex-wrap justify-between items-center2">
                {Array.from({ length: 6 }, (_, i) => i).map((__, idx) => {
                  return (
                    <View className="my-2">
                      <DishSkeletonCard key={idx} />
                    </View>
                  );
                })}
              </View>
            ) : (
              <View className="w-full h-36 flex justify-center items-center">
                <Text className="text-xl text-black dark:text-dark font-poppins-bold">
                  {i18n.t('noResultsText')}
                </Text>
              </View>
            )
          }
          onEndReachedThreshold={0.2}
          renderItem={({ item }) => {
            return <DishCard dish={item} />;
          }}
        />
      </View>
      <ImageView
        images={(shop as Shop)?.shopPictures.map((image: any) => {
          return { uri: image.url };
        })}
        imageIndex={(shop as Shop)?.shopPictures.findIndex(
          (img: any) => img.url === selectedImg
        )}
        visible={showShopPics}
        onRequestClose={() => setShowShopPics(false)}
        doubleTapToZoomEnabled={false}
      />
    </View>
  );
};

export default ShopMain;
