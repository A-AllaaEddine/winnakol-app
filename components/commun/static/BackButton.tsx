import { useColorScheme } from '@/context/ColorSchemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { I18nManager, Pressable } from 'react-native';

const BackButton = ({ bg }: { bg?: boolean }) => {
  const { colorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={() => router.back()}
      className={`w-auto h-auto  ${bg ? 'bg-main p-2' : ''} rounded-full `}
    >
      {I18nManager.isRTL ? (
        <MaterialIcons
          name="keyboard-arrow-right"
          size={bg ? 28 : 32}
          color={bg ? 'white' : colorScheme === 'light' ? 'black' : '#EDEBEB'}
        />
      ) : (
        <MaterialIcons
          name="keyboard-arrow-left"
          size={bg ? 28 : 32}
          color={bg ? 'white' : colorScheme === 'light' ? 'black' : '#EDEBEB'}
        />
      )}
    </Pressable>
  );
};

export default BackButton;
