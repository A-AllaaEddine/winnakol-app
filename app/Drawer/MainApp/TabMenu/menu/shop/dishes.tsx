import DishCard from '@/components/commun/cards/DishCard';
import DishSkeletonCard from '@/components/commun/cards/DishSkeletonCard';
import BackButton from '@/components/commun/static/BackButton';
import { MainColor } from '@/constants/colors';
import { languageContext } from '@/context/LanguageContext';
import { ShopSettingsAr } from '@/locales/ar/shopSettings';
import { ShopSettingsEn } from '@/locales/en/shopSettings';
import { ShopSettingsFr } from '@/locales/fr/shopSettings';
import { trpc } from '@/trpc/client';
import { Shop } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

const DishesMain = () => {
  const searchParams = useLocalSearchParams();
  const shopData = JSON.parse(searchParams.shop as string) as Shop;
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>(
    shopData.categories[0]
  );

  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: {
      en: ShopSettingsEn,
      fr: ShopSettingsFr,
      ar: ShopSettingsAr,
    },
  });

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
      category: selectedFilter ?? shopData.categories[0],
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
      initialData: shopData,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (shop) setSelectedFilter(shop.categories[0]);
  }, [shop]);

  const data = dishes?.pages.reduce((acc: any, page) => {
    return [...acc, ...page.data];
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    refetchDishes();
    refetchShop();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="w-full h-full bg-white dark:bg-dark">
      <View className="w-full h-full ">
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          numColumns={2}
          ListHeaderComponent={
            <View className="pb-5">
              <View className="w-full h-16 flex flex-row justify-start items-end px-6">
                <View className=" h-16 flex justify-center items-center ">
                  <BackButton />
                </View>
                <View className="w-full h-16 mx-2 flex flex-row justify-start items-center">
                  <Text className=" font-bold font-oswald text-black dark:text-dark text-2xl tracking-wider">
                    {i18n.t('dishesTitle')}
                  </Text>
                </View>
              </View>
              <View className="w-full h-auto py-2 flex flex-row justify-end items-start px-6">
                <Pressable
                  onPress={() =>
                    SheetManager.show('dish-add-sheet', {
                      payload: {
                        shopId: shopData.id,
                      },
                    })
                  }
                  className="w-auto h-auto flex flex-row justify-center items-center
                    px-3 py-1 rounded-full bg-white dark:bg-dark-card border-main border-[1px] dark:border-dark"
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color={MainColor}
                  />
                  <Text className="text-sm text-black dark:text-dark font-nunito-semi mx-1">
                    {i18n.t('addDishTxt')}
                  </Text>
                </Pressable>
              </View>
              <View className="w-full px-6 h-auto flex flex-row justify-start items-center mt-5 gap-x-3">
                <FlatList
                  horizontal
                  data={shop.categories}
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-2" />}
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
                          className={`text-sm  font-nunito-semi  ${
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
                  ListEmptyComponent={
                    isFetchingShop ? (
                      <View className="w-full px-4 h-36 flex flex-row flex-wrap justify-between items-center">
                        {Array.from({ length: 3 })
                          .map((_, i) => i)
                          .map((__, idx) => {
                            return (
                              <View
                                className="w-24 h-8  animate-pulse bg-gray-200 rounded-full"
                                key={idx}
                              />
                            );
                          })}
                      </View>
                    ) : (
                      <View className="w-full h-36 flex justify-center items-center">
                        <Text className="text-xl text-black dark:text-dark font-nunito-semi">
                          {i18n.t('noResultsText')}
                        </Text>
                      </View>
                    )
                  }
                />
              </View>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 15 }}
          columnWrapperStyle={{
            paddingHorizontal: 24,
            justifyContent: 'space-between',
            gap: 10,
          }}
          onEndReached={() => {
            if (hasNextPage) {
              console.log('here: ');
              fetchNextPage();
            }
          }}
          ListEmptyComponent={
            isFetching ? (
              <View className="w-full px-4 h-36 flex flex-row flex-wrap justify-between items-center">
                {Array.from({ length: 3 }, (_, i) => i).map((__, idx) => {
                  return <DishSkeletonCard key={idx} />;
                })}
              </View>
            ) : (
              <View className="w-full h-36 flex justify-center items-center">
                <Text className="text-xl text-black dark:text-dark font-nunito-semi">
                  {i18n.t('noResultsText')}
                </Text>
              </View>
            )
          }
          onEndReachedThreshold={0.2}
          // ItemSeparatorComponent={() => <View className="w-2" />}
          renderItem={({ item }) => {
            return <DishCard dish={item} />;
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default DishesMain;
