import { useColorScheme } from '@/context/ColorSchemeContext';
import { Stack } from 'expo-router';

const AppNavigator = () => {
  // Check version

  const { colorScheme } = useColorScheme();
  return (
    <Stack
      initialRouteName="Drawer"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        contentStyle: {
          backgroundColor: colorScheme === 'light' ? 'white' : '#141414',
        },
      }}
    >
      <Stack.Screen name="Drawer" options={{ animation: 'fade' }} />
      <Stack.Screen name="auth" options={{ animation: 'fade' }} />
      <Stack.Screen name="update" options={{ animation: 'none' }} />
      <Stack.Screen name="maintenance" options={{ animation: 'none' }} />
    </Stack>
  );
};

export default AppNavigator;
