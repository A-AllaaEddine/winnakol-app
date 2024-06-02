import { Stack } from 'expo-router';

const TabLayout = () => {
  return (
    <Stack initialRouteName="TabMenu" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="TabMenu"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      {/* <Stack.Screen
        name="stepOne"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="stepTwo"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="stepThree"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="stepFour"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="stepFive"
        options={{ headerShown: false, gestureEnabled: false }}
      /> */}
    </Stack>
  );
};

export default TabLayout;
