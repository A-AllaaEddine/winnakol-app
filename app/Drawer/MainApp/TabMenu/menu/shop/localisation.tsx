import BackButton from '@/components/commun/static/BackButton';
import { languageContext } from '@/context/LanguageContext';
import { shopsContext } from '@/context/shopsContext';
import { ShopSettingsAr } from '@/locales/ar/shopSettings';
import { ShopSettingsEn } from '@/locales/en/shopSettings';
import { ShopSettingsFr } from '@/locales/fr/shopSettings';
import { trpc } from '@/trpc/client';
import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Location from 'expo-location';
import { useContext, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

const localisation = () => {
  const [regionLocation, setRegionLocation] = useState({
    latitude: 36.75,
    longitude: 3.04,
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const shopsCxt = useContext(shopsContext);
  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: {
      en: ShopSettingsEn,
      fr: ShopSettingsFr,
      ar: ShopSettingsAr,
    },
  });

  const schema = z.object({
    address: z.object({
      street: z.string().min(1, { message: i18n.t('streetIsRequired') }),
      latitude: z.number(),
      longitude: z.number(),
    }),
  });

  type nameSchema = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<nameSchema>({
    defaultValues: {
      address: {
        street: shopsCxt?.currentShop?.address.street ?? '',
        latitude: shopsCxt?.currentShop?.address.latitude ?? 0,
        longitude: shopsCxt?.currentShop?.address.longitude ?? 0,
      },
    },
    resolver: zodResolver(schema),
  });

  // useEffect(() => {
  //   (async () => {
  //     setIsGettingLocation(true);
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied');
  //       setIsGettingLocation(false);
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setSelectedLocation({
  //       latitude: location.coords.latitude,
  //       longitude: location.coords.longitude,
  //     });
  //     setRegionLocation({
  //       latitude: location.coords.latitude,
  //       longitude: location.coords.longitude,
  //     });
  //     setIsGettingLocation(false);
  //   })();
  // }, []);

  const {
    mutateAsync: updateRestaurantInfo,
    isLoading,
    isError,
    error,
  } = trpc.shop.update.useMutation();

  const onSubmit: SubmitHandler<nameSchema> = async (data) => {
    const changes =
      JSON.stringify({
        street: shopsCxt?.currentShop?.address.street ?? '',
        latitude: shopsCxt?.currentShop?.address.latitude ?? 0,
        longitude: shopsCxt?.currentShop?.address.longitude ?? 0,
      }) !== JSON.stringify(data.address);

    if (!changes) return;

    try {
      await updateRestaurantInfo({
        shopId: shopsCxt?.currentShop?.id!,
        data,
      });
      if (isError) {
        throw error;
      }
      shopsCxt?.refrechCxtData();
      Toast.show({
        type: 'success',
        text1: i18n.t('savedTxt'),
      });
    } catch (error: any) {
      console.log('error: ', error);
      Toast.show({
        type: 'error',
        text1: i18n.t('errorSavingLocationTxt'),
      });
    }
  };

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      <View className="w-full h-16 flex flex-row justify-start items-end px-4">
        <View className=" h-16 flex justify-center items-center ">
          <BackButton />
        </View>
        <View className="w-full h-16 mx-2 flex flex-row justify-start items-center">
          <Text className=" font-poppins-bold text-black dark:text-dark  text-2xl tracking-wider">
            {i18n.t('localisationTitle')}
          </Text>
        </View>
      </View>
      <View className="w-full h-full flex justify-start items-start px-6 mt-3">
        <View className="w-full h-auto flex flex-col justify-start items-start">
          <Text className="w-auto text-start text-lg text-black dark:text-dark  font-poppins">
            {i18n.t('streetLabel')}
          </Text>
          <Controller
            defaultValue=""
            name="address.street"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={(v) => {
                  onChange(v);
                }}
                value={value}
                defaultValue=""
                className="w-full h-14  text-lg border-[1px] text-black dark:text-dark border-gray-400 rounded-md px-2 mt-3"
                placeholder={i18n.t('streetLabel')}
              />
            )}
          />
        </View>
        {errors.address?.street?.message?.length! > 0 ? (
          <View className="w-full flex flex-row justify-start items-center">
            <MaterialIcons
              name="error-outline"
              size={24}
              color={'red'}
              className="bg-red-500"
            />
            <Text className="w-full text-red-700 mx-2  font-poppins">
              {errors.address?.street?.message}
            </Text>
          </View>
        ) : null}
        {/* <View className="w-full h-[400px] rounded-lg flex pt-10 justify-start items-center">
          {isGettingLocation ? (
            <View className="w-full h-full rounded-lg bg-gray-200 flex justify-center items-center">
              <Text className="text-black dark:text-dark">
                Getting your location...
              </Text>
            </View>
          ) : (
            <MapView
              style={{ borderRadius: 8 }}
              className="w-full h-full rounded-lg"
              moveOnMarkerPress
              rotateEnabled={false}
              initialRegion={{
                // latitude: 36.75, // Latitude of Algiers
                // longitude: 3.04, // Longitude of Algiers
                latitude: regionLocation.latitude,
                longitude: regionLocation.longitude,
                latitudeDelta: 0.04, // Zoom level
                longitudeDelta: 0.04, // Zoom level
              }}
              onPress={(event) => {
                const { latitude, longitude } = event.nativeEvent.coordinate;
                setValue('address.latitude', latitude);
                setValue('address.longitude', longitude);
                setSelectedLocation({ latitude, longitude });
              }}
            >
              <Marker
                coordinate={selectedLocation}
                onDragEnd={(event) => {
                  const { latitude, longitude } = event.nativeEvent.coordinate;
                  setValue('address.latitude', latitude);
                  setValue('address.longitude', longitude);
                  setSelectedLocation({ latitude, longitude });
                }}
                draggable={true}
                isPreselected={true}
              />
            </MapView>
          )}
        </View> */}
        <View className="w-full h-auto flex justify-start items-center ">
          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="w-full h-14 p-2 rounded-md bg-black dark:bg-dark-btn flex justify-center items-center my-6"
          >
            {isLoading ? (
              <Text className="text-lg  font-poppins-bold text-white">
                {i18n.t('savingTxt')}
              </Text>
            ) : (
              <Text className="text-lg  font-poppins-bold text-white">
                {i18n.t('saveBtn')}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default localisation;
