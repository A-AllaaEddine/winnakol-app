import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { I18nManager, Pressable, View } from 'react-native';

const Back = ({ px = 'px-3', url }: { px?: string; url?: any }) => {
  return (
    <View
      className={`w-auto  h-16 flex flex-row justify-start items-center ${px} `}
    >
      <Pressable
        onPress={() => {
          url ? router.navigate(url) : router.back();
        }}
        className="w-auto h-12 flex flex-row justify-start items-center"
      >
        {I18nManager.isRTL ? (
          <MaterialIcons name="keyboard-arrow-right" size={34} color="black" />
        ) : (
          <MaterialIcons name="keyboard-arrow-left" size={34} color="black" />
        )}
      </Pressable>
    </View>
  );
};

export default Back;
