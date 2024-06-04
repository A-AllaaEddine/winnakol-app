import LogoText from '@/assets/images/logo_text.svg';
import { languageContext } from '@/context/LanguageContext';
import { AboutAr } from '@/locales/ar/about';
import { AboutEn } from '@/locales/en/about';
import { AboutFr } from '@/locales/fr/about';
import { useSession } from '@fullauth/react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

const About = () => {
  const context = useContext(languageContext);
  const navigation = useNavigation();
  const { session } = useSession();

  const { i18n } = context?.translation({
    translations: {
      en: AboutEn,
      fr: AboutFr,
      ar: AboutAr,
    },
  });

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      <View className="w-full h-14   flex flex-row justify-between items-center px-6">
        <Pressable
          className="w-[70px] flex flex-row justify-start  items-center"
          onPress={() =>
            //  router.push('/SideMenu')
            navigation.dispatch(DrawerActions.openDrawer())
          }
        >
          <LogoText width="140" height="56" />
        </Pressable>
      </View>
      <ScrollView
        className="flex flex-col  px-6"
        contentContainerStyle={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 80,
          paddingTop: 50,
          paddingBottom: 100,
        }}
      >
        {/* <View className="w-full h-56  flex flex-row justify-center items-center">
          <Logo width="130" height="130" />
          <Text className="w-auto flex text-3xl  font-poppins-bold">
            <Text className="text-[#FF8A20]  font-poppins-bold">
              {i18n.t('b')}
            </Text>
            {i18n.t('enyankom')}
          </Text>
        </View> */}

        <View className="w-full h-auto ">
          <Text className="text-xl font-bold text-black dark:text-dark">
            {i18n.t('aboutTitle')}
          </Text>
          <Text className=" text-lg mt-5 text-black dark:text-dark">
            {i18n.t('aboutDescTxt')}
          </Text>
        </View>
        <View className="w-full h-auto ">
          <Text className="text-xl font-bold text-black dark:text-dark">
            {i18n.t('featuresTitle')}
          </Text>
          <Text className=" text-lg mt-5 text-black dark:text-dark">
            - <Text>{i18n.t('shopListingTitle')}</Text>
            {i18n.t('shopListingDesc')}
          </Text>
          <Text className="text-lg mt-5 text-black dark:text-dark">
            - <Text>{i18n.t('userReviewTitle')}</Text>
            {i18n.t('userReviewDesc')}
          </Text>
          <Text className=" text-lg mt-5 text-black dark:text-dark">
            - <Text>{i18n.t('favouritesTitle')}</Text>
            {i18n.t('favouritesDesc')}
          </Text>
          <Text className=" text-lg mt-5 text-black dark:text-dark">
            - <Text>{i18n.t('restaurantListingTitle')}</Text>
            {i18n.t('shopManagementDesc')}
          </Text>
        </View>
        <View className="w-full h-auto ">
          <Text className="text-xl font-bold text-black dark:text-dark">
            {i18n.t('ourMissionTitle')}
          </Text>
          <Text className="text-lg mt-5 text-black dark:text-dark">
            {i18n.t('ourMissionDesc')}
          </Text>
        </View>
        {/* <View className="w-full h-auto justify-center items-center">
          <Pressable
            className="w-auto h-auto p-4 justify-center items-center bg-[#FF8A20] rounded-lg"
            onPress={() => {
              !session?.user?.id
                ? Toast.show({
                    type: 'error',
                    text1: i18n.t('needLoginText'),
                  })
                : router.push('/Drawer/about/WebsiteReview');
            }}
          >
            <Text className="text-white text-xl font-poppins-bold">
              {i18n.t('reviewBtnText')}
            </Text>
          </Pressable>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
