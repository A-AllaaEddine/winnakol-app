import { useColorScheme } from '@/context/ColorSchemeContext';
import { languageContext } from '@/context/LanguageContext';
import { ShopAr } from '@/locales/ar/shop';
import { ShopEn } from '@/locales/en/shop';
import { ShopFr } from '@/locales/fr/shop';
import { useSession } from '@fullauth/react-native';
import { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import openMap from 'react-native-open-maps';
import Toast from 'react-native-toast-message';
import * as Clipboard from 'expo-clipboard';

function AddressSheet(props: SheetProps<'address-sheet'>) {
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
    i18n.t('navigateBtn'),
    i18n.t('copyBtn'),
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
                  openMap({
                    query: props.payload?.address,
                  });
                  SheetManager.hide('address-sheet');
                  return;
                }
                if (idx === 1) {
                  await Clipboard.setStringAsync(props.payload?.address!);
                  Toast.show({
                    type: 'success',
                    text1: i18n.t('addressCopiedTxt'),
                  });
                  SheetManager.hide('address-sheet');
                  return;
                }
                if (idx === 2) {
                  SheetManager.hide('address-sheet');
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

export default AddressSheet;
