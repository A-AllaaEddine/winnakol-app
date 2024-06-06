import BackButton from '@/components/commun/static/BackButton';
import PictureComponent from '@/components/commun/static/PictureComponent';
import Skeleton from '@/components/commun/static/Skeleton';
import { MainColor } from '@/constants/colors';
import { languageContext } from '@/context/LanguageContext';
import { shopsContext } from '@/context/shopsContext';
import { ShopSettingsAr } from '@/locales/ar/shopSettings';
import { ShopSettingsEn } from '@/locales/en/shopSettings';
import { ShopSettingsFr } from '@/locales/fr/shopSettings';
import { trpc } from '@/trpc/client';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { authHeaders } from '@fullauth/react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

const Pictures = () => {
  const searchParams = useLocalSearchParams();
  const shopId = searchParams.shopId as string;

  const shopsCxt = useContext(shopsContext);
  const [isDeleting, setIsDeleting] = useState<{
    delete: boolean;
    index: number;
  }>({
    delete: false,
    index: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [picturesPreview, setPicturesPreview] = useState({
    shopLogo: shopsCxt?.currentShop?.shopLogo,
    shopPictures: shopsCxt?.currentShop?.shopPictures ?? [],
  });
  const [picturesFiles, setPicturesFiles] = useState<{
    shopLogo: any | null;
    shopPictures: { id: number; file: any }[];
  }>({
    shopLogo: null,
    shopPictures: [],
  });
  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: {
      en: ShopSettingsEn,
      fr: ShopSettingsFr,
      ar: ShopSettingsAr,
    },
  });

  const {
    mutateAsync: updateShopInfo,
    isLoading: isUpadtingShopInfo,
    isError,
    error,
  } = trpc.shop.update.useMutation();
  const {
    mutateAsync: deleteShopPicture,
    // isLoading: isUpadtingShopInfo,
    // isError,
    // error,
  } = trpc.shop.delete.pictures.shopPictures.useMutation();

  const deletePicture = async (id: number, fileKey?: string) => {
    setIsDeleting({
      delete: true,
      index: id,
    });

    if (fileKey?.length) {
      try {
        await deleteShopPicture({ shopId: shopId, fileKey });
        shopsCxt?.refrechCxtData();
        setPicturesPreview((prev) => {
          return {
            ...prev,
            shopPictures: prev.shopPictures?.filter((__, idx) => idx !== id),
          };
        });
        setPicturesFiles((prev) => {
          return {
            ...prev,
            shopPictures: prev.shopPictures?.filter((__, idx) => idx !== id),
          };
        });
      } catch (error: any) {
        console.log(error);
      }
    }
    setPicturesPreview((prev) => {
      return {
        ...prev,
        shopPictures: prev.shopPictures?.filter((__, idx) => idx !== id),
      };
    });
    setPicturesFiles((prev) => {
      return {
        ...prev,
        shopPictures: prev.shopPictures?.filter((__, idx) => idx !== id),
      };
    });
    setIsDeleting({
      delete: false,
      index: id,
    });
    Toast.show({
      type: 'success',
      text1: i18n.t('pictureDeletedTxt'),
    });
  };

  const handleSubmit = async () => {
    if (!picturesFiles.shopLogo && picturesFiles.shopPictures.length === 0) {
      return;
    }

    try {
      setIsLoading(true);
      const updates: {
        shopLogo?: any;
        shopPictures?: any[];
      } = {};

      if (picturesFiles.shopLogo) {
        const formData = new FormData();
        formData.append('picture', picturesFiles.shopLogo!);
        const profileResp = await fetch(
          `${process.env.EXPO_PUBLIC_BASE_URL}/api/upload/img`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
              ...(await authHeaders()),
            },
            body: formData,
          }
        );

        const data = await profileResp.json();
        // Store the profilePicture update

        updates.shopLogo = data.imgData;
      }
      if (picturesFiles.shopPictures.length > 0) {
        const picsResps = await Promise.all(
          picturesFiles.shopPictures.map(async (pic) => {
            const formData = new FormData();
            formData.append('picture', pic.file!);
            return fetch(
              `${process.env.EXPO_PUBLIC_BASE_URL}/api/uploads/ProfilePicture`,
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'multipart/form-data',
                  ...(await authHeaders()),
                },
                body: formData,
              }
            );
          })
        );
        const smth = await Promise.all(
          picsResps.map(async (response) => {
            const data = await response.json();
            return data.imgData;
          })
        );
        // Store the profilePicture update
        updates.shopPictures = smth;
      }

      if (Object.keys(updates).length > 0) {
        // Apply updates using a single API call
        await updateShopInfo({
          shopId: shopId,
          data: updates,
        });
      }
      setPicturesFiles({
        shopLogo: null,
        shopPictures: [],
      });
      Toast.show({
        type: 'success',
        text1: i18n.t('savedTxt'),
      });
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      switch (error) {
        case 'Profile Picture is required.':
          return Toast.show({
            type: 'error',
            text1:
              'Profile Picture is required. Please upload your profile picture.',
          });

        case 'Max file size is 8MB.':
          return Toast.show({
            type: 'error',
            text1: i18n.t('maxSizeTxt'),
          });
        default:
          Toast.show({
            type: 'error',
            text1: i18n.t('errorSavingPicturesTxt'),
          });
      }

      console.log('error: ', error);
    }
  };

  return (
    <SafeAreaView className="bg-white dark:bg-dark">
      <View className="w-full h-16 flex flex-row justify-start items-end px-4">
        <View className=" h-16 flex justify-center items-center ">
          <BackButton />
        </View>
        <View className="w-full h-16 mx-2 flex flex-row justify-start items-center">
          <Text className=" font-bold font-oswald text-black dark:text-dark text-2xl tracking-wider">
            {i18n.t('pictures')}
          </Text>
        </View>
      </View>
      <ScrollView
        className=" flex flex-col  px-6 "
        contentContainerStyle={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingBottom: 120,
          gap: 40,
        }}
      >
        <View className="w-full h-auto flex justify-start items-start gap-y-3">
          <Text className="font-nunito-semi text-lg text-black dark:text-dark text-start">
            {i18n.t('shopLogoLabel')}
          </Text>
          <View className="w-full h-fw-full flex flex-row justify-start items-center">
            <View className="w-32 h-32 rounded-full  relative border-[2px] border-[#BCBCBC]">
              <Pressable
                className="w-8 h-8 absolute top-1 right-1 z-10
                       flex justify-center items-center rounded-full bg-main"
                onPress={async () => {
                  try {
                    const result = await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.Images,
                      quality: 1,
                      selectionLimit: 1,
                      allowsMultipleSelection: false,
                      aspect: [6, 9],
                    });
                    if (!result.canceled) {
                      if (result.assets[0].fileSize! > 8388608) {
                        Toast.show({
                          type: 'error',
                          text1: i18n.t('maxSizeTxt'),
                        });
                        return;
                      }
                      if (
                        !result.assets[0].fileName
                          ?.toLowerCase()
                          .endsWith('.jpg') &&
                        !result.assets[0].fileName
                          ?.toLowerCase()
                          .endsWith('.jpeg') &&
                        !result.assets[0].fileName
                          ?.toLowerCase()
                          .endsWith('.png')
                      ) {
                        Toast.show({
                          type: 'error',
                          text1: i18n.t('invalidFormatTxt'),
                        });
                        return;
                      }

                      setPicturesPreview((prev) => {
                        return {
                          ...prev,
                          shopLogo: {
                            url: result.assets[0].uri,
                          },
                        };
                      });
                      setPicturesFiles((prev) => {
                        return {
                          ...prev,
                          shopLogo: {
                            name: result.assets[0].fileName,
                            type: result.assets[0].mimeType,
                            uri: result.assets[0].uri,
                          },
                        };
                      });
                    }
                  } catch (error: any) {
                    console.log('error: ', error);
                  }
                }}
              >
                <MaterialIcons name="edit" size={24} color="black" />
              </Pressable>
              <PictureComponent
                url={picturesPreview.shopLogo?.url ?? ''}
                rounded="rounded-full"
              />
            </View>
          </View>
        </View>
        <View className="w-full h-auto flex justify-start items-start gap-y-3">
          <Text className="font-nunito-semi text-lg text-black dark:text-dark text-start">
            {i18n.t('shopPicturesLabel')}
          </Text>
          <ScrollView
            className="w-full h-fw-full flex flex-row "
            contentContainerStyle={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 20,
            }}
            horizontal
          >
            {picturesPreview.shopPictures?.map((picture, index) => {
              return (
                <View
                  key={index}
                  className="w-40 h-40 rounded-lg  relative border-[2px] border-[#BCBCBC]"
                >
                  {isDeleting.delete && isDeleting.index === index ? (
                    <Skeleton classname="w-full h-full rounded-lg" />
                  ) : (
                    <>
                      <Pressable
                        className="w-8 h-8 absolute top-1 right-1 z-10
                       flex justify-center items-center bg-black rounded-full"
                        onPress={() => deletePicture(index, picture?.key)}
                      >
                        <AntDesign name="delete" size={18} color={MainColor} />
                      </Pressable>
                      <View>
                        <PictureComponent
                          url={picture?.url}
                          rounded="rounded-lg"
                        />
                      </View>
                    </>
                  )}
                </View>
              );
            })}
            {picturesPreview.shopPictures?.length! < 6 ? (
              <Pressable
                className="w-40 h-40
              flex  justify-center items-center border border-slate-400 rounded-lg 
              hover:cursor-pointer "
                onPress={async () => {
                  try {
                    const result = await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.Images,
                      quality: 1,
                      selectionLimit: 4 - picturesPreview.shopPictures.length,
                      allowsMultipleSelection: true,
                      aspect: [6, 9],
                    });
                    if (!result.canceled) {
                      if (result.assets.length > 1) {
                        result.assets.map((asset) => {
                          if (asset.fileSize! > 8388608) {
                            Toast.show({
                              type: 'error',
                              text1: i18n.t('maxSizeTxt'),
                            });
                            return;
                          }
                          if (
                            !asset.fileName?.toLowerCase().endsWith('.jpg') &&
                            !asset.fileName?.toLowerCase().endsWith('.jpeg') &&
                            !asset.fileName?.toLowerCase().endsWith('.png')
                          ) {
                            Toast.show({
                              type: 'error',
                              text1: i18n.t('invalidFormatTxt'),
                            });
                            return;
                          }
                          setPicturesPreview((prev) => {
                            return {
                              ...prev,
                              shopPictures: [
                                ...prev.shopPictures!,
                                {
                                  url: asset.uri,
                                },
                              ],
                            };
                          });
                          setPicturesFiles((prev) => {
                            return {
                              ...prev,
                              shopPictures: [
                                ...prev.shopPictures,
                                {
                                  id: prev.shopPictures.length,
                                  file: {
                                    name: asset.fileName,
                                    type: asset.mimeType,
                                    uri: asset.uri,
                                  },
                                },
                              ],
                            };
                          });
                        });
                        return;
                      }
                      if (result.assets[0].fileSize! > 8388608) {
                        Toast.show({
                          type: 'error',
                          text1: i18n.t('maxSizeTxt'),
                        });
                        return;
                      }
                      if (
                        !result.assets[0].fileName
                          ?.toLowerCase()
                          .endsWith('.jpg') &&
                        !result.assets[0].fileName
                          ?.toLowerCase()
                          .endsWith('.jpeg') &&
                        !result.assets[0].fileName
                          ?.toLowerCase()
                          .endsWith('.png')
                      ) {
                        Toast.show({
                          type: 'error',
                          text1: i18n.t('invalidFormatTxt'),
                        });
                        return;
                      }
                      setPicturesPreview((prev) => {
                        return {
                          ...prev,
                          shopPictures: [
                            ...prev.shopPictures!,
                            {
                              url: result.assets[0].uri,
                            },
                          ],
                        };
                      });

                      setPicturesFiles((prev) => {
                        return {
                          ...prev,
                          shopPictures: [
                            ...prev.shopPictures,
                            {
                              id: prev.shopPictures.length,
                              file: {
                                name: result.assets[0].fileName,
                                type: result.assets[0].mimeType,
                                uri: result.assets[0].uri,
                              },
                            },
                          ],
                        };
                      });
                      // handleSubmit(result.assets[0] as unknown as File);
                    }
                    // console.log('result: ', result.assets![0]);-()
                  } catch (error: any) {
                    console.log('error: ', error);
                  }
                }}
              >
                <MaterialIcons
                  name="add-photo-alternate"
                  size={24}
                  color="black"
                />
              </Pressable>
            ) : null}
          </ScrollView>
        </View>
        <Pressable
          onPress={handleSubmit}
          className="w-full h-14 p-2 rounded-md bg-black dark:bg-dark-btn flex justify-center items-center my-3"
          disabled={isDeleting.delete || isLoading}
        >
          {isUpadtingShopInfo ? (
            <Text className="text-lg  font-nunito-semi text-white">
              {i18n.t('savingTxt')}
            </Text>
          ) : (
            <Text className="text-lg  font-nunito-semi text-white">
              {i18n.t('saveBtn')}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Pictures;
