import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { ShopAr } from '@/locales/ar/shop';
import { ShopEn } from '@/locales/en/shop';
import { ShopFr } from '@/locales/fr/shop';
import { Dish } from '@/types/types';
import { useSession } from '@fullauth/react-native';
import { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

function DishActionSheet(props: SheetProps<'dish-action-sheet'>) {
  const { colorScheme } = useColorScheme();
  const { update, session } = useSession();
  const context = useContext(languageContext);

  const dishData = JSON.parse(props.payload?.dish as string) as Dish;

  const { i18n } = context?.translation({
    translations: {
      en: ShopEn,
      fr: ShopFr,
      ar: ShopAr,
    },
  });

  const options = [
    i18n.t('reviewBtn'),
    i18n.t('reportBtn'),
    i18n.t('cancelBtn'),
  ];
  const adminOptions = [
    i18n.t('editBtn'),
    i18n.t('deleteBtn'),
    i18n.t('cancelBtn'),
  ];
  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 30,
        backgroundColor: colorScheme === 'light' ? 'white' : '#141414',
      }}
      headerAlwaysVisible={true}
      gestureEnabled
    >
      <View className="h-auto bg-transparent">
        {(session?.user.shop_id.includes(dishData.shopId)
          ? adminOptions
          : options
        ).map((option, idx) => {
          return (
            <Pressable
              onPress={async () => {
                if (idx === 0) {
                  await SheetManager.hide('dish-action-sheet');
                  if (session?.user.shop_id.includes(dishData.shopId)) {
                    await SheetManager.show('dish-edit-sheet', {
                      payload: {
                        dish: JSON.stringify(dishData),
                      },
                    });
                    return;
                  }
                  await SheetManager.show('dish-rating-sheet', {
                    payload: {
                      dishId: dishData.id as string,
                    },
                  });
                  return;
                }
                if (idx === 1) {
                  await SheetManager.hide('dish-action-sheet');
                  if (session?.user.shop_id.includes(dishData.shopId)) {
                    await SheetManager.show('dish-delete-sheet', {
                      payload: {
                        dishId: dishData.id as string,
                        shopId: dishData.shopId as string,
                      },
                    });
                    return;
                  }
                  await SheetManager.show('dish-report-sheet', {
                    payload: {
                      dishId: dishData.id as string,
                    },
                  });
                  return;
                }
                if (idx === 2) {
                  SheetManager.hide('dish-action-sheet');
                  return;
                }
              }}
              className="w-full h-10 flex flex-row justify-center items-center rounded-lg my-2
              bg-white dark:bg-dark"
              key={idx}
            >
              <Text className="text-black dark:text-dark text-lg">
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ActionSheet>
  );
}

export default DishActionSheet;
