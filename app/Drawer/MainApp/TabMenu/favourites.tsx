import { languageContext } from '@/context/LanguageContext';
import { BookmarksAr } from '@/locales/ar/favourites';
import { BookmarksEn } from '@/locales/en/favourites';
import { BookmarksFr } from '@/locales/fr/favourites';
import { trpc } from '@/trpc/client';
import { useCallback, useContext, useState } from 'react';
import {
  FlatList,
  I18nManager,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
// import SkeletonCard from '@/components/commun/cards/SkeletonCard';
import DishCard from '@/components/commun/cards/DishCard';
import ShopCard from '@/components/commun/cards/ShopCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DishSkeletonCard from '@/components/commun/cards/DishSkeletonCard';
import ShopSkeletonCard from '@/components/commun/cards/ShopSkeletonCard';
import { useColorScheme } from '@/context/ColorSchemeContext';

type HookData = {
  keyword: string;
  craft: string;
  state: string;
  rating: number;
};

const Favourites = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const [type, setType] = useState<'shop' | 'dish'>('shop');
  const [hookData, setHookData] = useState<HookData>({
    keyword: '',
    craft: '',
    state: '',
    rating: 0,
  });
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {
    data: favorites,

    fetchNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    refetch: refetchBookmarks,
  } = trpc.favourites.getInfinite.useInfiniteQuery(
    {
      type: type,
    },

    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );

  const data = favorites?.pages.reduce((acc: any, page) => {
    return [...acc, ...page.data];
  }, []);

  const { colorScheme } = useColorScheme();

  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: { en: BookmarksEn, fr: BookmarksFr, ar: BookmarksAr },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchBookmarks();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      <View className="w-full h-14 flex flex-row justify-start items-end px-4">
        {/* <View className=" h-16 flex justify-center items-center ">
          <BackButton />
        </View> */}
        <View className="w-full h-16 flex flex-row justify-start items-center">
          <Text className=" font-bold font-oswald text-3xl text-black dark:text-dark tracking-wider">
            {i18n.t('bookmarksTitle')}
          </Text>
        </View>
      </View>
      <View
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        className="w-full h-full p-4 flex justify-center items-center pt-5"
        // contentContainerStyle={{
        //   justifyContent: 'center',
        //   alignItems: 'center',
        // }}
      >
        {type === 'shop' ? (
          <FlatList
            key={type}
            data={data ?? []}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={() => (
              <>
                <View className="w-full h-auto bg-white dark:bg-dark flex flex-row justify-center items-center">
                  <Text className="text-lg text-black dark:text-dark font-nunito-semi">
                    {i18n.t('shops')}
                  </Text>
                  <View>
                    {toggle ? (
                      I18nManager.isRTL ? (
                        <Pressable
                          onPress={() => {
                            setToggle(!toggle);
                            setType('shop');
                            refetchBookmarks();
                          }}
                          className="mx-2"
                        >
                          <MaterialCommunityIcons
                            name="toggle-switch-off"
                            size={50}
                            color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                          />
                        </Pressable>
                      ) : (
                        <Pressable
                          onPress={() => {
                            setToggle(!toggle);
                            setType('shop');
                            refetchBookmarks();
                          }}
                          className="mx-2"
                        >
                          <MaterialCommunityIcons
                            name="toggle-switch"
                            size={50}
                            color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                          />
                        </Pressable>
                      )
                    ) : I18nManager.isRTL ? (
                      <Pressable
                        onPress={() => {
                          setToggle(!toggle);
                          setType('dish');
                          refetchBookmarks();
                        }}
                        className="mx-2"
                      >
                        <MaterialCommunityIcons
                          name="toggle-switch"
                          size={50}
                          color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                        />
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() => {
                          setToggle(!toggle);
                          setType('dish');
                          refetchBookmarks();
                        }}
                        className="mx-2"
                      >
                        <MaterialCommunityIcons
                          name="toggle-switch-off"
                          size={50}
                          color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                        />
                      </Pressable>
                    )}
                  </View>
                  <Text className="text-lg text-black dark:text-dark font-nunito-semi">
                    {i18n.t('dishes')}
                  </Text>
                </View>
              </>
            )}
            stickyHeaderIndices={[0]}
            numColumns={2}
            columnWrapperStyle={{
              width: '100%',
              paddingTop: 10,
              paddingHorizontal: 0,
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              // gap: 20,
            }}
            renderItem={({ item }) => {
              return <ShopCard shop={item.favouriteShop} />;
            }}
            onEndReached={() => {
              fetchNextPage();
            }}
            ListEmptyComponent={
              isFetching ? (
                <View
                  className="flex flex-row flex-wrap justify-between"
                  style={{ gap: 10 }}
                >
                  {Array.from({ length: 4 }, (_, i) => i).map((__, idx) => {
                    // return <DishSkeletonCard key={idx} />;
                    // TODO: Make Restaurant Skeleton Card
                    return <ShopSkeletonCard key={idx} />;
                  })}
                </View>
              ) : (
                <View className="w-full h-36 flex justify-center items-center">
                  <Text className="text-xl text-black dark:text-dark font-nunito-semi">
                    {i18n.t('noData')}
                  </Text>
                </View>
              )
            }
            onEndReachedThreshold={0.2}
          />
        ) : (
          <FlatList
            key={type}
            data={data ?? []}
            ListHeaderComponent={() => (
              <>
                {/* <View className="w-full h-14 flex flex-row justify-start items-end ">
                  <View className="w-full h-16 flex flex-row justify-start items-center">
                    <Text className=" font-bold  text-3xl tracking-wider">
                      {i18n.t('bookmarksTitle')}
                    </Text>
                  </View>
                </View> */}
                <View className="w-full h-auto bg-white dark:bg-dark flex flex-row justify-center items-center">
                  <Text className="text-lg text-black dark:text-dark font-nunito-semi">
                    {i18n.t('shops')}
                  </Text>
                  <View>
                    {toggle ? (
                      I18nManager.isRTL ? (
                        <Pressable
                          onPress={() => {
                            setToggle(!toggle);
                            setType('shop');
                            refetchBookmarks();
                          }}
                          className="mx-2"
                        >
                          <MaterialCommunityIcons
                            name="toggle-switch-off"
                            size={50}
                            color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                          />
                        </Pressable>
                      ) : (
                        <Pressable
                          onPress={() => {
                            setToggle(!toggle);
                            setType('shop');
                            refetchBookmarks();
                          }}
                          className="mx-2"
                        >
                          <MaterialCommunityIcons
                            name="toggle-switch"
                            size={50}
                            color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                          />
                        </Pressable>
                      )
                    ) : I18nManager.isRTL ? (
                      <Pressable
                        onPress={() => {
                          setToggle(!toggle);
                          setType('dish');
                          refetchBookmarks();
                        }}
                        className="mx-2"
                      >
                        <MaterialCommunityIcons
                          name="toggle-switch"
                          size={50}
                          color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                        />
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() => {
                          setToggle(!toggle);
                          setType('dish');
                          refetchBookmarks();
                        }}
                        className="mx-2"
                      >
                        <MaterialCommunityIcons
                          name="toggle-switch-off"
                          size={50}
                          color={colorScheme === 'dark' ? '#EDEBEB' : 'black'}
                        />
                      </Pressable>
                    )}
                  </View>
                  <Text className="text-lg text-black dark:text-dark font-nunito-semi">
                    {i18n.t('dishes')}
                  </Text>
                </View>
              </>
            )}
            // stickyHeaderIndices={[0]}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              width: '100%',
              paddingHorizontal: 0,
              justifyContent: 'space-between',
              // gap: 10,
            }}
            renderItem={({ item }) => {
              return <DishCard dish={item.favouriteDish} />;
            }}
            onEndReached={() => {
              fetchNextPage();
            }}
            ListEmptyComponent={
              isFetching ? (
                // <SkeletonCard />
                <View
                  className="w-full h-36 flex flex-row flex-wrap justify-between items-center"
                  style={{ gap: 10 }}
                >
                  {Array.from({ length: 3 }, (_, i) => i).map((__, idx) => {
                    return <DishSkeletonCard key={idx} />;
                  })}
                </View>
              ) : (
                <View className="w-full h-36 flex justify-center items-center">
                  <Text className="text-xl text-black dark:text-dark font-nunito-semi">
                    {i18n.t('noData')}
                  </Text>
                </View>
              )
            }
            onEndReachedThreshold={0.2}
            contentContainerStyle={{
              flex: 1,
              gap: 20,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Favourites;
