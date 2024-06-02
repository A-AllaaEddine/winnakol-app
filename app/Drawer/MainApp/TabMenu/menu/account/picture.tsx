import BackButton from '@/components/commun/static/BackButton';
import PictureComponent from '@/components/commun/static/PictureComponent';
import { languageContext } from '@/context/LanguageContext';
import { accountAr } from '@/locales/ar/account';
import { accountEn } from '@/locales/en/account';
import { accountFr } from '@/locales/fr/account';
import { trpc } from '@/trpc/client';
import { MaterialIcons } from '@expo/vector-icons';
import { authHeaders, useSession } from '@fullauth/react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

const Picture = () => {
  const { session } = useSession();
  const searchParams = useLocalSearchParams();
  const shopId = searchParams.shopId as string;

  const [picturePreview, setPicturePreview] = useState(
    session?.user.profilePicture
  );
  const [pictureFiles, setPictureFiles] = useState<any | null>(null);
  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: {
      en: accountEn,
      fr: accountFr,
      ar: accountAr,
    },
  });

  const {
    mutateAsync: updateUserInfo,
    isLoading: isUpadtingUserInfo,
    isError,
    error,
  } = trpc.user.update.useMutation();

  const handleSubmit = async () => {
    if (!pictureFiles) {
      return;
    }

    try {
      const updates: {
        profilePicture?: any;
      } = {};

      if (pictureFiles) {
        const formData = new FormData();
        formData.append('picture', pictureFiles!);
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

        updates.profilePicture = data.imgData;
      }

      if (Object.keys(updates).length > 0) {
        // Apply updates using a single API call
        await updateUserInfo({
          profilePicture: updates.profilePicture,
        });
      }
      setPictureFiles(null);
      Toast.show({
        type: 'success',
        text1: i18n.t('savedTxt'),
      });
    } catch (error: any) {
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
            text1: i18n.t('errorSavingPPTxt'),
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
          <Text className=" font-poppins-bold text-black dark:text-dark text-3xl tracking-wider">
            {i18n.t('profilePictureLabel')}
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
          height: '100%',
        }}
      >
        <View className="w-full h-auto flex justify-start items-start gap-y-3 mt-5">
          {/* <Text className="font-bold text-lg text-start">
            {i18n.t('profilePictureLabel')}
          </Text> */}
          <View className="w-full h-fw-full flex flex-row justify-center items-center">
            <View className="w-40 h-40 rounded-full  relative border-[2px] border-[#BCBCBC]">
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

                      setPicturePreview({
                        url: result.assets[0].uri,
                      });
                      setPictureFiles({
                        name: result.assets[0].fileName,
                        type: result.assets[0].mimeType,
                        uri: result.assets[0].uri,
                      });
                    }
                  } catch (error: any) {
                    console.log('error: ', error);
                    Toast.show({
                      type: 'error',
                      text1: i18n.t('errorSelectingImgTxt'),
                    });
                  }
                }}
              >
                <MaterialIcons name="edit" size={24} color="black" />
              </Pressable>
              <PictureComponent
                url={picturePreview?.url ?? ''}
                rounded="rounded-full"
              />
            </View>
          </View>
        </View>
        <Pressable
          onPress={handleSubmit}
          className="w-full h-14 p-2 rounded-md bg-black dark:bg-dark-btn flex justify-center items-center my-3"
          disabled={isUpadtingUserInfo}
        >
          {isUpadtingUserInfo ? (
            <Text className="text-lg  font-poppins-bold text-white">
              {i18n.t('savingTxt')}
            </Text>
          ) : (
            <Text className="text-lg  font-poppins-bold text-white">
              {i18n.t('savedTxt')}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Picture;
