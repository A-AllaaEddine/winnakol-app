import { Stack } from 'expo-router';

const ShopLayout = () => {
  return (
    <Stack
      initialRouteName="main"
      screenOptions={{
        headerShown: false,
        animation: 'default',
      }}
    >
      <Stack.Screen name="main" />
      <Stack.Screen name="name" />
      <Stack.Screen name="localisation" />
      <Stack.Screen name="phones" />
      <Stack.Screen name="dishes" />
      <Stack.Screen name="hours" />
      <Stack.Screen name="pictures" />
    </Stack>
  );
};

export default ShopLayout;
