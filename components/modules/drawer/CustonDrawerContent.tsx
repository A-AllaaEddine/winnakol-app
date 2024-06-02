import Logo from '@/assets/images/logo.svg';
import { languageContext } from '@/context/LanguageContext';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useContext } from 'react';
import { SafeAreaView, View } from 'react-native';

const CustomDrawerContent = (props: any) => {
  const context = useContext(languageContext);

  const { i18n } = context?.translation({
    translations: {
      en: {},
      fr: {},
      ar: {},
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white dark:bg-dark">
      <View className="w-full h-14   flex flex-row justify-between items-center  px-3">
        <View className="w-auto h-14 flex flex-row justify-center items-center">
          <Logo width="30" height="30" />
          {/* <View className="flex flex-row mx-3">
            <Text className="text-xl font-bold text-black dark:text-dark">
              {i18n.t('win')}
            </Text>
            <Text className="text-main text-xl font-bold">
              {' '}
              {i18n.t('nakol')}
            </Text>
          </View> */}
        </View>
      </View>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 5 }}
        style={{
          height: 'auto',
          paddingTop: 0,
        }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      {/* <View className="p-10 ">
        <View className="w-full h-14 flex flex-row justify-start items-center gap-x-4">
          <Pressable
            onPress={() =>
              Linking.openURL('https://www.instagram.com/benyankomdz/')
            }
          >
            <AntDesign name="instagram" size={30} color="black" />
          </Pressable>
          <Pressable
            onPress={() =>
              Linking.openURL(
                'https://www.facebook.com/share/nxDN2Uf3VCJVyXKx/?mibextid=WC7FNe'
              )
            }
          >
            <AntDesign name="facebook-square" size={30} color="black" />
          </Pressable>
          <Pressable
            onPress={() =>
              Linking.openURL(
                'https://www.linkedin.com/company/94287516/admin/feed/posts/?feedType=following'
              )
            }
          >
            <AntDesign name="linkedin-square" size={30} color="black" />
          </Pressable>
        </View>
        <Text className="w-full h-10  font-poppins text-xl ">
          {i18n.t('copyrightTxt')}
        </Text>
      </View> */}
    </SafeAreaView>
  );
};

export default CustomDrawerContent;
