import LogoText from '@/assets/images/logo_text.svg';
import { languageContext } from '@/context/LanguageContext';
import { TermsAr } from '@/locales/ar/terms';
import { TermsEn } from '@/locales/en/terms';
import { TermsFr } from '@/locales/fr/terms';
import { useSession } from '@fullauth/react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

const Terms = () => {
  const context = useContext(languageContext);
  const navigation = useNavigation();
  const { session } = useSession();

  const { i18n } = context?.translation({
    translations: {
      en: TermsEn,
      fr: TermsFr,
      ar: TermsAr,
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
          <Text className="text-xl font-bold font-oswald text-black dark:text-dark">
            {i18n.t('termsTitle')}
          </Text>
          <Text className=" text-lg mt-5 text-black font-nunito-semi dark:text-dark">
            {i18n.t('termsDesc')}
          </Text>
        </View>
        <View className="w-full h-auto ">
          <Text className="text-xl font-bold text-black dark:text-dark font-nunito-semi">
            {i18n.t('acceptTitle')}
          </Text>
          <Text className=" text-lg mt-5 text-black dark:text-dark font-nunito">
            {i18n.t('acceptDesc')}
          </Text>
        </View>
        <View className="w-full h-auto ">
          <Text className="text-xl font-bold text-black dark:text-dark font-nunito-semi">
            {i18n.t('useTitle')}
          </Text>
          <Text className=" text-lg mt-5 text-black dark:text-dark font-nunito">
            {i18n.t('useDesc')}
          </Text>
        </View>
        <View className="w-full h-auto ">
          <Text className="text-xl font-bold text-black dark:text-dark font-nunito-semi">
            {i18n.t('accountTitle')}
          </Text>
          <Text className=" text-lg mt-5 text-black dark:text-dark font-nunito">
            {i18n.t('accountDesc')}
          </Text>
        </View>
        <View className="w-full h-auto ">
          <Text className="text-xl font-bold text-black dark:text-dark font-nunito-semi">
            {i18n.t('contentTitle')}
          </Text>
          <Text className=" text-lg mt-5 text-black dark:text-dark font-nunito">
            {i18n.t('contentDesc')}
          </Text>
        </View>
        <View className="w-full h-auto ">
          <Text className="text-xl font-bold text-black dark:text-dark font-nunito-semi">
            {i18n.t('shopTitle')}
          </Text>
          <Text className=" text-lg mt-5 text-black dark:text-dark font-nunito">
            {i18n.t('shopDesc')}
          </Text>
        </View>
        <View className="w-full h-auto ">
          <Text className="text-xl font-bold text-black dark:text-dark font-nunito-semi">
            {i18n.t('propertyTitle')}
          </Text>
          <Text className=" text-lg mt-5 text-black dark:text-dark font-nunito">
            {i18n.t('propertyDesc')}
          </Text>
        </View>
        <View className="w-full h-auto ">
          <Text className="text-xl font-bold text-black dark:text-dark font-nunito-semi">
            {i18n.t('liabilityTitle')}
          </Text>
          <Text className=" text-lg mt-5 text-black dark:text-dark font-nunito">
            {i18n.t('liabilityDesc')}
          </Text>
        </View>
        <View className="w-full h-auto ">
          <Text className="text-xl font-bold text-black dark:text-dark font-nunito-semi">
            {i18n.t('changeTitle')}
          </Text>
          <Text className=" text-lg mt-5 text-black dark:text-dark font-nunito">
            {i18n.t('changeDesc')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Terms;
