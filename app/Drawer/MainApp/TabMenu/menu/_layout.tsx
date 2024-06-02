import { Stack } from 'expo-router';

const MenuLayout = () => {
  return (
    <Stack
      // initialRouteName={session?.user?.id ? 'main' : 'auth'}
      initialRouteName="main"
      screenOptions={{
        headerShown: false,
        animation: 'default',
      }}
    >
      {/* {!session?.user?.id && <Stack.Screen name="auth" />} */}
      <Stack.Screen name="main" />
      <Stack.Screen name="account" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="shop" />
    </Stack>
  );
};

export default MenuLayout;
