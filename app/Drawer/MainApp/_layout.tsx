import { Stack } from 'expo-router';

const TabLayout = () => {
  return (
    <Stack initialRouteName="TabMenu" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="TabMenu"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="shop" options={{ headerShown: false }} />
      <Stack.Screen name="dish" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TabLayout;
