'use client';

import { useContext, useState } from 'react';

import { languageContext } from '@/context/LanguageContext';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import { UsernameFr } from '@/locales/fr/username';
import { trpc } from '@/trpc/client';
import Toast from 'react-native-toast-message';
// import { UsernameAr } from '@/locales/ar/username';
import PictureComponent from '@/components/commun/static/PictureComponent';
import { useColorScheme } from '@/context/ColorSchemeContext';
import { categoriesAr } from '@/locales/ar/categories';
import { ShopSettingsAr } from '@/locales/ar/shopSettings';
import { categoriesEn } from '@/locales/en/categories';
import { ShopSettingsEn } from '@/locales/en/shopSettings';
import { categoriesFr } from '@/locales/fr/categories';
import { ShopSettingsFr } from '@/locales/fr/shopSettings';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { authHeaders } from '@fullauth/react-native';
import * as ImagePicker from 'expo-image-picker';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

const DishAddModal = (props: SheetProps<'dish-add-sheet'>) => {
  const shopId = props.payload?.shopId as string;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<{
    name: string;
    price: number;
    description: string;
    ingredients: string[];
    category: string;
  }>({
    name: '',
    price: 0,
    description: '',
    ingredients: [],
    category: '',
  });
  const [imgUrlPreview, setImgUrlPreview] = useState({ url: '' });
  const [imgUrlFile, setImgUrlFiles] = useState<any | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[] | []>(
    []
  );

  const { colorScheme } = useColorScheme();
  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: {
      en: { ...ShopSettingsEn, ...categoriesEn },
      fr: { ...ShopSettingsFr, ...categoriesFr },
      ar: { ...ShopSettingsAr, ...categoriesAr },
    },
  });

  const {
    mutateAsync: addDish,
    isLoading: isSaving,
    isError,
    error,
  } = trpc.dish.add.useMutation();

  const handleSubmit = async () => {
    if (!formFields.name) {
      Toast.show({
        type: 'error',
        text1: i18n.t('provideName'),
      });
      return;
    }
    if (!formFields.price) {
      Toast.show({
        type: 'error',
        text1: i18n.t('providePrice'),
      });
      return;
    }
    if (!formFields.description) {
      Toast.show({
        type: 'error',
        text1: i18n.t('provideDescription'),
      });
      return;
    }
    if (!formFields.category) {
      Toast.show({
        type: 'error',
        text1: i18n.t('provideTag'),
      });
      return;
    }

    if (!imgUrlFile) {
      Toast.show({
        type: 'error',
        text1: i18n.t('providePicture'),
      });
      return;
    }

    try {
      setIsLoading(true);
      let imgUrl;

      if (imgUrlFile) {
        const formData = new FormData();
        formData.append('picture', imgUrlFile);
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

        imgUrl = data.imgData;
      }

      await addDish({
        shopId: shopId,
        data: {
          name: formFields.name,
          description: formFields.description,
          ingredients: selectedIngredients,
          price: formFields.price,
          imgUrl: imgUrl,
          category: formFields.category,
        },
      });

      setImgUrlFiles(null);
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: i18n.t('savedTxt'),
      });
      // router.dismiss();
      await SheetManager.hide('dish-edit-sheet');
    } catch (error: any) {
      // router.dismiss();
      console.log(error.message);
      Toast.show({
        type: 'error',
        text1: i18n.t('errorSavingDishInfoTxt'),
      });
    }
  };

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 30,
        backgroundColor: colorScheme === 'light' ? 'white' : '#141414',
        minHeight: 500,
        maxHeight: '90%',
      }}
      safeAreaInsets={{
        top: 20,
        bottom: 0,
        left: 0,
        right: 0,
      }}
      headerAlwaysVisible={true}
      gestureEnabled
      snapPoints={[85]}
    >
      <ScrollView
        className="w-full h-full bg-white dark:bg-dark px-6 "
        //   scrollEnabled={false}
        // automaticallyAdjustKeyboardInsets
      >
        <View
          // dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
          className="w-full rounded-md gap-y-4 pb-52 pt-5"
        >
          <View className="w-full h-auto flex flex-row justify-center items-center">
            <View className="w-40 h-40 border-2 border-[#BCBCBC] rounded-full relative">
              <Pressable
                className="bg-main rounded-full p-2 absolute top-0 right-2 z-20"
                onPress={async () => {
                  try {
                    const result = await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.Images,
                      quality: 1,
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
                      setImgUrlPreview({
                        url: result.assets[0].uri,
                      });
                      setImgUrlFiles({
                        name: result.assets[0].fileName,
                        type: result.assets[0].mimeType,
                        uri: result.assets[0].uri,
                      });
                    }
                    // console.log('result: ', result.assets![0]);-()
                  } catch (error: any) {
                    console.log('error: ', error);
                  }
                }}
              >
                <MaterialIcons name="add" size={24} color="black" />
              </Pressable>
              <PictureComponent
                url={imgUrlPreview.url}
                className="w-5"
                rounded="rounded-full"
              />
            </View>
          </View>
          <View className="w-full h-auto flex justify-start items-start gap-y-3">
            <Text className="  font-poppins-bold text-black dark:text-dark text-lg text-start">
              {i18n.t('nameLabel')}
            </Text>
            <TextInput
              onChangeText={(v) => {
                setFormFields((prev) => {
                  return { ...prev, name: v };
                });
              }}
              inputMode="text"
              value={formFields.name}
              defaultValue=""
              textAlignVertical="center"
              placeholderTextColor={'gray'}
              className="w-full h-14  text-black dark:text-dark text-start text-lg bg-slate-100 dark:bg-dark-card rounded-md px-2 mt-3"
              placeholder={i18n.t('nameLabel')}
            />
          </View>
          <View className="w-full h-auto flex justify-start items-start gap-y-3">
            <Text className=" text-black dark:text-dark font-poppins-bold text-lg text-start">
              {i18n.t('priceLabel')}
            </Text>
            <TextInput
              onChangeText={(v) => {
                setFormFields((prev) => {
                  return {
                    ...prev,
                    price: Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v),
                  };
                });
              }}
              inputMode="decimal"
              value={formFields.price.toString()}
              defaultValue=""
              textAlignVertical="center"
              placeholderTextColor={'gray'}
              className="w-full h-14  text-black dark:text-dark  text-start text-lg bg-slate-100 dark:bg-dark-card rounded-md px-2 mt-3"
              placeholder={i18n.t('priceLabel')}
            />
          </View>
          <View className="w-full h-auto flex justify-start items-start gap-y-3">
            <Text className="text-black dark:text-dark  font-poppins-bold text-lg text-start">
              {i18n.t('descLabel')}
            </Text>
            <TextInput
              onChangeText={(v) => {
                setFormFields((prev) => {
                  return { ...prev, description: v };
                });
              }}
              value={formFields.description}
              defaultValue=""
              multiline
              maxLength={100}
              textAlignVertical="center"
              placeholderTextColor={'gray'}
              className="w-full h-36  text-black dark:text-dark text-start text-lg bg-slate-100 dark:bg-dark-card rounded-md px-2 mt-3"
              placeholder={i18n.t('descLabel')}
            />
          </View>
          <View className="w-full h-auto flex justify-start items-start gap-y-3">
            <Text className="w-full text-black dark:text-dark font-poppins-bold text-xl text-start">
              {i18n.t('ingredientsLabel')}
            </Text>
            <Pressable
              onPress={() =>
                SheetManager.show('ingredient-sheet', {
                  payload: {
                    selectedIngredients: selectedIngredients,
                    setSelectedIngredients: setSelectedIngredients,
                  },
                })
              }
              className="w-full h-12 rounded-lg bg-white dark:bg-dark-card flex flex-row justify-between items-center p-2"
            >
              <Text className="text-lg text-black dark:text-dark">
                {i18n.t('selectedIngredientsPlaceholder')}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color={colorScheme === 'light' ? 'black' : 'white'}
              />
            </Pressable>
            <View className="w-full h-auto max-h-[100px] min-h-[50px] flex flex-row flex-wrap justify-start gap-1">
              {selectedIngredients.map((ing) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedIngredients((prev) =>
                        prev?.filter((ingr: string) => ingr !== ing)
                      )
                    }
                  >
                    <View
                      style={{
                        ...styles.selectedStyle,
                        backgroundColor:
                          colorScheme === 'light' ? 'white' : '#404040',
                      }}
                    >
                      <Text
                        className=" font-poppins"
                        style={{
                          ...styles.textSelectedStyle,
                          color: colorScheme === 'light' ? 'black' : '#EDEBEB',
                        }}
                      >
                        {ing}
                      </Text>
                      <AntDesign
                        color={colorScheme === 'light' ? 'black' : 'white'}
                        name="delete"
                        size={17}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View className="w-full h-auto flex justify-start items-start gap-y-3">
            <Text className="w-full text-black dark:text-dark font-poppins-bold text-xl text-start">
              {i18n.t('categoryLabel')}
            </Text>
            <Pressable
              onPress={() =>
                SheetManager.show('category-sheet', {
                  payload: {
                    category: formFields.category,
                    setFormFields: setFormFields,
                  },
                })
              }
              className="w-full h-12 rounded-lg bg-white dark:bg-dark-card flex flex-row justify-between items-center p-2"
            >
              <Text className="text-lg text-black dark:text-dark">
                {formFields.category
                  ? formFields.category.charAt(0).toUpperCase() +
                    formFields.category.slice(1)
                  : i18n.t('selectedCategoryPlaceholder')}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color={colorScheme === 'light' ? 'black' : 'white'}
              />
            </Pressable>
          </View>
          <View className="">
            <Pressable
              className="w-auto h-12 flex justify-center items-center  text-lg
            font-bold bg-black dark:bg-dark-btn rounded-lg"
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text className="text-white font-poppins-bold text-lg">
                {isLoading ? i18n.t('savingTxt') : i18n.t('saveBtn')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

export default DishAddModal;

const styles = StyleSheet.create({
  container: { padding: 16, maxHeight: 100, minHeight: 200 },
  dropdown: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

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
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});
