import LogoText from '@/assets/images/logo_text.svg';
import ShopCard from '@/components/commun/cards/ShopCard';
import ShopSkeletonCard from '@/components/commun/cards/ShopSkeletonCard';
import { MainColor } from '@/constants/colors';
import { languageContext } from '@/context/LanguageContext';
import { categoriesAr } from '@/locales/ar/categories';
import { HomeAr } from '@/locales/ar/home';
import { categoriesEn } from '@/locales/en/categories';
import { HomeEn } from '@/locales/en/home';
import { categoriesFr } from '@/locales/fr/categories';
import { HomeFr } from '@/locales/fr/home';
import { trpc } from '@/trpc/client';
import { FontAwesome } from '@expo/vector-icons';
import { useSession } from '@fullauth/react-native';
import { DrawerActions } from '@react-navigation/native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

const Home = () => {
  const searchParams = useLocalSearchParams();
  const isNewUser = searchParams.isNewUser === 'true' ? true : false;
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);
  const [text, setText] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hookData, setHookData] = useState<{
    keyword: string;
    tags: string[] | [];
  }>({
    keyword: '',
    tags: [],
  });

  const navigation = useNavigation();
  const { update, session } = useSession();

  // SplashScreen.hideAsync();

  const context = useContext(languageContext);

  useEffect(() => {
    if (isNewUser) {
      SheetManager.show('email-code-sheet', {
        payload: {
          email: session?.user.email!,
        },
      });
    }
    // navigation.addListener('beforeRemove', (e) => {
    //   e.preventDefault();
    //   // Do your stuff here
    //   // navigation.dispatch(e.data.action);
    // });
  }, [isNewUser]);

  const onChangeText = (e: string) => {
    setText(e);
  };

  const { i18n } = context?.translation({
    translations: {
      en: { ...HomeEn, ...categoriesEn },
      fr: { ...HomeFr, ...categoriesFr },
      ar: { ...HomeAr, ...categoriesAr },
    },
  });

  const {
    data: shops,
    isFetching,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
  } = trpc.shop.getMany.useInfiniteQuery(
    {
      categories: selectedFilters.includes('all') ? [] : selectedFilters,
      keyword: hookData.keyword,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const data = shops?.pages.reduce((acc: any, page) => {
    return [...acc, ...page.data];
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    refetch();
    await update();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const allCategories: Record<string, string> = {
    en: 'All',
    fr: 'Tous',
    ar: 'الكل',
  };

  const filterOptions = [
    {
      label: allCategories[i18n.locale],
      value: 'all',
    },
    ...i18n.t('categories', { returnObjects: true }),
  ];

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      {/* {session?.user?.id && !session?.user.emailVerified && (
        <EmailProvider>
          <VerifyEmailModal />
        </EmailProvider>
      )} */}
      <View className="flex flex-col justify-start items-center px-4  pb-2">
        <View className="w-full h-full">
          {/* // TODO: add restaurant skeleton Card */}
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            // key={isFetching ? 'fetching' : 'not-fetching'}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <View className=" pb-5 bg-white dark:bg-dark">
                <View className="w-full h-14   flex flex-row justify-between items-center">
                  <Pressable
                    className="w-[70px] flex flex-row justify-start  items-center"
                    onPress={() =>
                      //  router.push('/SideMenu')
                      navigation.dispatch(DrawerActions.openDrawer())
                    }
                  >
                    {/* <Entypo name="menu" size={36} color="black" /> */}
                    <LogoText width="140" height="56" />
                    {/* <View className="flex flex-row mx-3">
                      <Text className="text-xl font-bold text-black dark:text-dark">
                        {i18n.t('win')}
                      </Text>
                      <Text className="text-main text-xl font-bold">
                        {' '}
                        {i18n.t('nakol')}
                      </Text>
                    </View> */}
                  </Pressable>
                </View>
                <View className="mt-5">
                  <Text className="font-bold text-2xl text-black dark:text-dark">
                    {i18n.t('find')}
                    <Text className="text-main"> {i18n.t('food')}</Text>
                    {'\n'}
                    {i18n.t('aroundYou')}
                  </Text>
                </View>
                <View className="w-full h-20  mt-5">
                  <View
                    className={`w-full h-16 flex flex-row justify-center items-center  px-8  rounded-full  shadow-lg border-[1px] border-main/20  bg-white dark:bg-dark-card`}
                    // style={{ flexDirection: 'row' }}
                  >
                    <TextInput
                      onChangeText={onChangeText}
                      value={text}
                      inputMode="text"
                      className="w-full h-14 px-2 text-black dark:text-white"
                      placeholderTextColor={'#9F9F9F'}
                      placeholder={i18n.t('lookingFor')}
                    />
                    <Pressable
                      className="w-12 h-12 pb-3 bg-white dark:bg-dark-card rounded-full border-[1px] border-main flex justify-end items-center"
                      onPress={() => {
                        setHookData((prev) => {
                          return { ...prev, keyword: text.toLowerCase() };
                        });
                      }}
                    >
                      <FontAwesome name="search" size={24} color={MainColor} />
                    </Pressable>
                  </View>
                </View>
                <View className="w-full h-auto  gap-y-3">
                  <View className="w-full h-auto flex flex-row justify-between items-center">
                    <Text className="text-xl font-bold text-black dark:text-dark">
                      {i18n.t('filter')}
                    </Text>
                    <Pressable
                      onPress={() => {
                        setSelectedFilters(['all']);
                        setHookData((prev) => {
                          return { ...prev, tags: [] };
                        });
                      }}
                    >
                      <Text className="text-sub text-sm">
                        {i18n.t('clear')}
                      </Text>
                    </Pressable>
                  </View>
                  <FlatList
                    horizontal
                    data={filterOptions}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className="w-2" />}
                    renderItem={({ item }) => {
                      return (
                        <Pressable
                          id={item.value}
                          className={`w-auto h-auto rounded-full px-3 py-2 ${
                            selectedFilters.includes(item.value)
                              ? 'bg-main'
                              : 'bg-sub dark:bg-dark-card'
                          }`}
                          onPress={() => {
                            if (item.value === 'all') {
                              setSelectedFilters(['all']);
                              setHookData((prev) => {
                                return { ...prev, tags: [] };
                              });
                              return;
                            }
                            if (selectedFilters.includes(item.value)) {
                              setSelectedFilters((prev) => {
                                const newFilter = prev.filter(
                                  (fil) => fil !== item.value
                                );
                                if (newFilter.length === 0) {
                                  return ['all'];
                                }
                                return newFilter;
                              });
                              setHookData((prev) => {
                                const newFilter = prev.tags.filter(
                                  (fil) => fil !== item.value
                                );
                                if (newFilter.length === 0) {
                                  return { ...prev, tags: [] };
                                }
                                return { ...prev, tags: newFilter };
                              });
                              return;
                            }
                            setSelectedFilters((prev) => {
                              return [...prev, item.value].filter(
                                (fil) => fil !== 'all'
                              );
                            });
                          }}
                        >
                          <Text
                            className={`${
                              selectedFilters.includes(item.value)
                                ? 'text-white'
                                : 'text-black dark:text-dark'
                            } font-semibold`}
                          >
                            {item.label}
                          </Text>
                        </Pressable>
                      );
                    }}
                  />
                </View>
              </View>
            }
            numColumns={2}
            columnWrapperStyle={{
              paddingTop: 10,
              paddingHorizontal: 0,
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              // gap: 20,
            }}
            data={data}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-6" />}
            renderItem={({ item }) => {
              return <ShopCard shop={item} />;
            }}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              fetchNextPage();
            }}
            ListEmptyComponent={
              isLoading ? (
                <View
                  className="flex flex-row flex-wrap justify-between"
                  style={{ gap: 10 }}
                >
                  {Array.from({ length: 8 }, (_, i) => i).map((__, idx) => {
                    // return <DishSkeletonCard key={idx} />;
                    // TODO: Make Restaurant Skeleton Card
                    return <ShopSkeletonCard key={idx} />;
                  })}
                </View>
              ) : isFetching ? (
                <View
                  className="flex flex-row flex-wrap justify-between"
                  style={{ gap: 10 }}
                >
                  {Array.from({ length: 2 }, (_, i) => i).map((__, idx) => {
                    // return <DishSkeletonCard key={idx} />;
                    // TODO: Make Restaurant Skeleton Card
                    return <ShopSkeletonCard key={idx} />;
                  })}
                </View>
              ) : (
                <View className="w-full h-36 flex justify-center items-center">
                  <Text className="text-xl text-black dark:text-white font-poppins-bold">
                    {i18n.t('noRestaurantTxt')}
                  </Text>
                </View>
              )
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { padding: 1, maxHeight: 100, minHeight: 200 },
  dropdown: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#BCBCBC',

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
