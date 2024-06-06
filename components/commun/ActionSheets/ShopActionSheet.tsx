import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { ShopAr } from '@/locales/ar/shop';
import { ShopEn } from '@/locales/en/shop';
import { ShopFr } from '@/locales/fr/shop';
import { useSession } from '@fullauth/react-native';
import { router } from 'expo-router';
import { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

function ShopActionSheet(props: SheetProps<'shop-action-sheet'>) {
  const { colorScheme } = useColorScheme();
  const { update, session } = useSession();
  const context = useContext(languageContext);

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
        {options.map((option, idx) => {
          return (
            <Pressable
              onPress={async () => {
                if (idx === 0) {
                  await SheetManager.hide('shop-action-sheet');
                  await SheetManager.show('shop-rating-sheet', {
                    payload: {
                      shopId: props.payload?.shopId as string,
                    },
                  });
                  return;
                }
                if (idx === 1) {
                  await SheetManager.hide('shop-action-sheet');
                  await SheetManager.show('shop-report-sheet', {
                    payload: {
                      shopId: props.payload?.shopId as string,
                    },
                  });
                  return;
                }
                if (idx === 2) {
                  SheetManager.hide('shop-action-sheet');
                  return;
                }
              }}
              className="w-full h-10 flex flex-row justify-center items-center rounded-lg my-2
              bg-white dark:bg-dark"
              key={idx}
            >
              <Text className="text-black dark:text-dark text-lg font-nunito-semi">
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ActionSheet>
  );
}

export default ShopActionSheet;
