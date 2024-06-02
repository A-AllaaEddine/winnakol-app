import Logo from '@/assets/images/logo.svg';
import { languageContext } from '@/context/LanguageContext';
import { UpdateAr } from '@/locales/ar/update';
import { UpdateEn } from '@/locales/en/update';
import { UpdateFr } from '@/locales/fr/update';
import PackageJson from '@/package.json';
import { trpc } from '@/trpc/client';
import { useSession } from '@fullauth/react-native';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { router, SplashScreen } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Platform, Pressable, SafeAreaView, Text, View } from 'react-native';
import semver from 'semver';

const update = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const context = useContext(languageContext);
  const { i18n } = context?.translation({
    translations: {
      en: UpdateEn,
      fr: UpdateFr,
      ar: UpdateAr,
    },
  });

  const { session, status } = useSession();

  const getCurrentVersion = () => {
    if (Constants.appOwnership === 'expo') {
      return PackageJson.version ?? '';
    }
    return Application.nativeApplicationVersion ?? '';
  };

  const { data: changelog, isFetching: isGettingChangelog } =
    trpc.mobile.changelog.get.useQuery();

  useEffect(() => {
    if (!isGettingChangelog) {
      if (changelog) {
        const currentVersion = getCurrentVersion();
        const latestVersion = changelog.latestVersion;
        const minVersion = changelog.minVersion;

        // if updateRequired is true and user don't have minimum version = update
        // or if user don't have the minimum version = update
        if (
          (changelog.updateRequired && semver.lt(currentVersion, minVersion)) ||
          semver.lt(currentVersion, minVersion)
        ) {
          // router.replace('/update');
          // setTimeout(() => {
          //   SplashScreen.hideAsync();
          // }, 1000);
          setIsLoading(false);
          return;
        } else {
          // User's app version meets the minimum requirements and no update is required
          // Show the app
          router.push('/auth/login');
        }

        // setTimeout(() => {
        //   SplashScreen.hideAsync();
        // }, 1000);
      }
    }
  }, [isGettingChangelog]);

  const redirectToStore = () => {
    // Redirect Android store
    if (Platform.OS === 'android') {
      Linking.canOpenURL(`market://details?id=com.winnakol.app`)
        .then(() => {
          Linking.openURL(`market://details?id=com.winnakol.app`);
        })
        .catch();
    }
  };

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      {isLoading || isGettingChangelog ? (
        <View className="w-full h-full flex justify-center items-center gap-y-3 px-6">
          <View className="w-full h-20 flex justify-center items-center">
            <Logo width="150" height="150" />
          </View>
          <Text className="text-lg text-center text-black dark:text-dark">
            {i18n.t('checkingTxt')}
          </Text>
        </View>
      ) : (
        <View className="w-full h-full flex justify-center items-center gap-y-3 px-6">
          <View className="w-auto h-auto flex flex-row justify-center items-center py-5">
            <Logo width="100" height="100" />
            {/* <Text className="w-auto flex  font-poppins-bold">
            <Text className="text-[#FF8A20]  font-poppins-bold">
              {i18n.t('b')}
            </Text>
            {i18n.t('enyankom')}
          </Text> */}
          </View>
          <Text className="text-2xl font-bold text-center text-black dark:text-dark">
            {i18n.t('outdatedTxt')}
          </Text>
          <Text className="text-lg text-center text-black dark:text-dark">
            {i18n.t('mustUpdateTxt')}
          </Text>
          <Pressable
            onPress={() => redirectToStore()}
            className="w-auto px-4 py-3  bg-black dark:bg-dark-btn rounded-lg"
          >
            <Text className="text-white text-xl font-bold ">
              {i18n.t('updateNowTxt')}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default update;
