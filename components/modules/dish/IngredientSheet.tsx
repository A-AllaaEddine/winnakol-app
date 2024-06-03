import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { IngredientsEn } from '@/locales/en/ingredients';
import { IngredientsFr } from '@/locales/fr/ingredients';
import { IngredientsAr } from '@/locales/ar/ingredients';
import { useContext, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { ShopSettingsEn } from '@/locales/en/shopSettings';
import { ShopSettingsFr } from '@/locales/fr/shopSettings';
import { ShopSettingsAr } from '@/locales/ar/shopSettings';
import { FlashList } from '@shopify/flash-list';

const IngredientSheet = (props: SheetProps<'ingredient-sheet'>) => {
  const [ingredients, setIngrendients] = useState(
    props.payload?.selectedIngredients ?? []
  );
  const { colorScheme } = useColorScheme();

  const context = useContext(languageContext);
  const { i18n } = context?.translation({
    translations: {
      en: { ...IngredientsEn, ...ShopSettingsEn },
      fr: { ...IngredientsFr, ...ShopSettingsFr },
      ar: { ...IngredientsAr, ...ShopSettingsAr },
    },
  });

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
            {i18n.t('selectedIngredientsPlaceholder')}
          </Text>
        </View>
      }
    >
      <View className="h-[250px] bg-transparent">
        <FlashList
          data={i18n.t('ingredients')}
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
                  ingredients.includes(item.value)
                    ? 'bg-main'
                    : 'bg-white dark:bg-dark'
                }`}
                onPress={() => {
                  if (ingredients.includes(item.value)) {
                    props.payload?.setSelectedIngredients((prev) =>
                      prev?.filter((ing) => ing !== item.value)
                    );
                    setIngrendients((prev) =>
                      prev?.filter((ing) => ing !== item.value)
                    );
                    return;
                  }
                  props.payload?.setSelectedIngredients((prev) => {
                    return [...prev, item.value];
                  });
                  setIngrendients((prev) => {
                    return [...prev, item.value];
                  });
                }}
              >
                <Text
                  className={`${
                    ingredients.includes(item.value)
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

export default IngredientSheet;
