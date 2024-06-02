import { Stack } from 'expo-router';

const AccountLayout = () => {
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
      <Stack.Screen name="details" />
      <Stack.Screen name="password" />
      <Stack.Screen name="picture" />
    </Stack>
  );
};

export default AccountLayout;
