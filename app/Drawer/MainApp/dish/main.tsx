import ReviewCard from '@/components/commun/cards/ReviewCard';
import ReviewSkeletonCard from '@/components/commun/cards/ReviewSkeletonCard';
import BackButton from '@/components/commun/static/BackButton';
import Skeleton from '@/components/commun/static/Skeleton';
import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { DishAr } from '@/locales/ar/dish';
import { IngredientsAr } from '@/locales/ar/ingredients';
import { DishEn } from '@/locales/en/dish';
import { IngredientsEn } from '@/locales/en/ingredients';
import { DishFr } from '@/locales/fr/dish';
import { IngredientsFr } from '@/locales/fr/ingredients';
import { trpc } from '@/trpc/client';
import { Dish, Favorite } from '@/types/types';
import { formatNumber } from '@/utils/utils';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useSession } from '@fullauth/react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import ImageView from 'react-native-image-viewing-rtl';
import { Rating } from 'react-native-ratings';
import { t } from '../../../../../winnakol-next/server/trpc';
import { MainColor } from '@/constants/colors';

const DishMain = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showDishPic, setShowDishPic] = useState(false);

  const searchParams = useLocalSearchParams();
  const dishData = JSON.parse(searchParams.dish as string) as Dish;

  const { colorScheme } = useColorScheme();

  const context = useContext(languageContext);
  const { i18n } = context?.translation({
    translations: {
      en: { ...DishEn, ...IngredientsEn },
      fr: { ...DishFr, ...IngredientsFr },
      ar: { ...DishAr, ...IngredientsAr },
    },
  });

  const { session } = useSession();

  useEffect(() => {
    if (session) setIsEnabled(true);
  }, [session]);

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
    data: dish,
    refetch: refetchDish,
    isLoading,
    isFetching: isFetchingDish,
  } = trpc.dish.get.useQuery(
    {
      dishId: dishData.id,
    },
    {
      initialData: dishData,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: reviews,
    refetch: refetchReviews,
    isLoading: isLoadingReviews,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isRefetching,
  } = trpc.reviews.dish.getMany.useInfiniteQuery(
    {
      dishId: dishData.id,
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const data = reviews?.pages.reduce((acc: any, page) => {
    return [...acc, ...page.data];
  }, []);

  const AddToFavourite = async () => {
    try {
      await addFavourite({ id: dish.id, type: 'dish' });
      refetchUserFavorites();
    } catch (error: any) {
      console.log('error: ', error);
    }
  };
  const RemoveFromFavourite = async () => {
    try {
      await removeFavourite({ id: dish.id });
      refetchUserFavorites();
    } catch (error: any) {
      console.log('error: ', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    refetchReviews();
    refetchDish();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View className="w-full h-full bg-white dark:bg-dark">
      <View className="w-full h-full">
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            <View className="pb-5">
              <View className="w-full h-auto bg-white">
                <View className="w-full h-[300px] relative shadow-lg shadow-gray-400 dark:shadow-none">
                  <View className="absolute top-10 z-30 left-4">
                    <BackButton bg />
                  </View>
                  <Pressable
                    onPress={() => {
                      setShowDishPic(true);
                    }}
                  >
                    <Image
                      source={{ uri: dish.imgUrl.url }}
                      className="w-full h-full bg-slate-200 rounded-bl-2xl rounded-br-2xl"
                    />
                  </Pressable>
                  <View
                    className="w-auto h-auto flex flex-row justify-end items-center  absolute bottom-5 right-4
                  rounded-full shadow-md dark:shadow-none bg-white  p-3"
                  >
                    {userFavorites &&
                    userFavorites.length > 0 &&
                    (userFavorites as Favorite[]).find(
                      (favorite) => favorite.favourite_id === dish.id
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
              <View className=" px-4 mt-5">
                <View className="w-full h-10 flex flex-row justify-between items-center">
                  {isFetchingDish ? (
                    <Skeleton classname="w-48 h-6" />
                  ) : (
                    <Text className="text-2xl font-bold text-black dark:text-dark">
                      {dish.name}
                    </Text>
                  )}
                  <Pressable
                    //  onPress={openActions}
                    onPress={() =>
                      SheetManager.show('dish-action-sheet', {
                        payload: {
                          dish: JSON.stringify(dish),
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
                </View>
                <View className="w-full h-auto flex flex-row justify-between items-center">
                  {isFetchingDish ? (
                    <Skeleton classname="w-28 h-4" />
                  ) : (
                    <View className="w-auto h-full flex flex-row justify-center items-center gap-x-1">
                      <Rating
                        type="custom"
                        startingValue={dish.averageRating}
                        ratingColor={MainColor}
                        imageSize={14}
                        ratingBackgroundColor="#EDEBEB"
                        tintColor={colorScheme === 'dark' ? '#141414' : '#fff'}
                        readonly
                      />
                      <Text className="text-sm text-black dark:text-dark">
                        {dish.averageRating.toFixed(1)}
                      </Text>
                      <Text className="text-xs text-black dark:text-dark">
                        ({formatNumber(dish.totalReviews)} reviews)
                      </Text>
                    </View>
                  )}
                </View>
                {isFetchingDish ? (
                  <Skeleton classname="w-full h-16 mt-3" />
                ) : (
                  <Text className="max-h-[80px] text-left truncate text-black dark:text-dark whitespace-break-spaces text-sm mt-3">
                    {dish.description}
                  </Text>
                )}
              </View>
              <View className="mt-5 px-4">
                <Text className="text-lg font-bold text-black dark:text-dark">
                  {i18n.t('ingredientsTxt')}
                </Text>
                {isFetchingDish ? (
                  <FlatList
                    data={Array.from({ length: 6 })}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 10, marginTop: 10 }}
                    renderItem={({ item }) => {
                      return <Skeleton classname="w-16 h-10" />;
                    }}
                  />
                ) : (
                  <FlatList
                    data={dish.ingredients}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 10, marginTop: 10 }}
                    renderItem={({ item }) => {
                      return (
                        <View
                          className={`rounded-xl px-3 py-2 bg-sub dark:bg-dark-card`}
                        >
                          <Image
                            source={
                              (
                                i18n.t('ingredients') as {
                                  value: string;
                                  label: string;
                                  imgUrl: any;
                                }[]
                              ).find((ingredient) => ingredient.value === item)
                                ?.imgUrl
                            }
                            resizeMode="contain"
                          />
                        </View>
                      );
                    }}
                    ListEmptyComponent={
                      <View className="w-full h-auto flex justify-center items-center">
                        <Text className="text-sm text-left font-poppins-bold text-black dark:text-dark">
                          {i18n.t('noIngredientsTxt')}
                        </Text>
                      </View>
                    }
                  />
                )}
              </View>
              <View className="mt-5 px-4">
                <Text className="text-lg font-bold text-black dark:text-dark">
                  {i18n.t('reviewsTxt')}
                </Text>
              </View>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 15,
            justifyContent: 'flex-start',
            // paddingHorizontal: 16,
            paddingBottom: 100,
          }}
          renderItem={({ item }) => {
            return (
              <View className="w-full flex flex-row justify-start items-center px-4">
                <ReviewCard review={item} />
              </View>
            );
          }}
          key={isFetching ? 'fetching' : 'not-fetching'}
          ListEmptyComponent={
            isFetching ? (
              <>
                {Array.from({ length: 3 }, (_, i) => i).map((__, idx) => {
                  return (
                    <View
                      key={idx}
                      className="w-full flex flex-row justify-start items-center px-4"
                    >
                      <ReviewSkeletonCard />
                    </View>
                  );
                })}
              </>
            ) : (
              <View className="w-full h-36 flex justify-center items-center">
                <Text className="text-xl text-black dark:text-dark font-poppins-bold">
                  {i18n.t('noResultsText')}
                </Text>
              </View>
            )
          }
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.2}
        />
      </View>
      <ImageView
        images={[{ uri: dish.imgUrl.url }]}
        imageIndex={0}
        visible={showDishPic}
        onRequestClose={() => setShowDishPic(false)}
        doubleTapToZoomEnabled={false}
      />
    </View>
  );
};

export default DishMain;
