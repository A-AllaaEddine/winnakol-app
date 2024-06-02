import { SafeAreaView, Text, View } from 'react-native';
import MaintenancePicture from '@/assets/images/maintenance.svg';
import Logo from '@/assets/images/logo.svg';
import { useContext, useEffect, useState } from 'react';
import { languageContext } from '@/context/LanguageContext';
import { MaintenanceEn } from '@/locales/en/maintenance';
import { MaintenanceFr } from '@/locales/fr/maintenance';
import { MaintenanceAr } from '@/locales/ar/maintenance';
import { router, SplashScreen, useNavigation } from 'expo-router';
import { trpc } from '@/trpc/client';

const Maintenance = () => {
  const [isLoading, setIsLoading] = useState(true);

  const context = useContext(languageContext);
  const { i18n } = context?.translation({
    translations: {
      en: MaintenanceEn,
      fr: MaintenanceFr,
      ar: MaintenanceAr,
    },
  });
  const navigation = useNavigation();

  SplashScreen.hideAsync();

  const { data: isMaintenance, isFetching: isGettingMaintenance } =
    trpc.maintenance.get.useQuery();

  useEffect(() => {
    if (!isGettingMaintenance) {
      if (!isMaintenance) {
        // If the app is under maintenance, redirect to the maintenance page
        router.push('/update');
      } else {
        setIsLoading(false);
        // setTimeout(() => {
        //   SplashScreen.hideAsync();
        // }, 1000);
      }
    }
  }, [isMaintenance, isGettingMaintenance]);

  // Effect
  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      // Do your stuff here
      // navigation.dispatch(e.data.action);
    });
  }, []);

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      {isLoading ? (
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
            <MaintenancePicture width="300" height="300" />
          </View>
          <Text className="text-2xl font-bold text-black dark:text-dark text-center">
            {i18n.t('maintenanceTxt')}
          </Text>
          <Text className="text-lg text-center text-black dark:text-dark">
            {i18n.t('beBackTxt')}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Maintenance;
