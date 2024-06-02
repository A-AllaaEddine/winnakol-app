import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CustomDrawerContent from '@/components/modules/drawer/CustonDrawerContent';
import { Entypo } from '@expo/vector-icons';
import { MainColor } from '@/constants/colors';

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="MainApp"
        screenOptions={{
          headerShown: false,
          swipeEnabled: false,
          drawerLabelStyle: {
            fontSize: 16,
          },
          drawerActiveBackgroundColor: MainColor,
          drawerActiveTintColor: '#fff',
        }}
        drawerContent={CustomDrawerContent}
      >
        <Drawer.Screen
          name="MainApp" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            title: 'home',
            headerLeft: () => <Entypo name="menu" size={36} color="black" />,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
