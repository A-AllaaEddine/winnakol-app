import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { categoriesAr } from '@/locales/ar/categories';
import { ShopSettingsAr } from '@/locales/ar/shopSettings';
import { categoriesEn } from '@/locales/en/categories';
import { ShopSettingsEn } from '@/locales/en/shopSettings';
import { categoriesFr } from '@/locales/fr/categories';
import { ShopSettingsFr } from '@/locales/fr/shopSettings';
import { useContext, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import { FlashList } from 'react-native-actions-sheet/dist/src/views/FlashList';

const CategorySheet = (props: SheetProps<'category-sheet'>) => {
  const [selectedCategory, setSelectedCategory] = useState(
    props.payload?.category ?? ''
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

  const categoryOptions = i18n.t('categories', { returnObjects: true });
  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 30,
        backgroundColor: colorScheme === 'light' ? 'white' : '#141414',
        maxHeight: '90%',
      }}
      headerAlwaysVisible={true}
      gestureEnabled
      CustomHeaderComponent={
        <View className="w-full h-16 flex flex-row justify-center items-center">
          <Text className="text-lg text-black dark:text-dark font-bold">
            {i18n.t('selectedCategoryPlaceholder')}
          </Text>
        </View>
      }
    >
      <View className="h-[250px] bg-transparent">
        <FlashList
          data={categoryOptions}
          contentContainerStyle={{
            paddingHorizontal: 25,
          }}
          renderItem={({
            item,
          }: {
            item: { value: string; label: string };
          }) => {
            return (
              <Pressable
                className={`w-full h-12 flex flex-row justify-center items-center rounded-full my-2 ${
                  selectedCategory === item.value
                    ? 'bg-main'
                    : 'bg-white dark:bg-dark'
                }`}
                onPress={async () => {
                  props.payload?.setFormFields((prev: any) => {
                    return { ...prev, category: item.value };
                  });
                  setSelectedCategory(item.value);
                  await SheetManager.hide('category-sheet');
                }}
              >
                <Text
                  className={`${
                    selectedCategory === item.value
                      ? 'text-white font-bold'
                      : 'text-black dark:text-dark'
                  }  text-lg `}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
          estimatedItemSize={10}
        />
      </View>
    </ActionSheet>
  );
};

export default CategorySheet;
