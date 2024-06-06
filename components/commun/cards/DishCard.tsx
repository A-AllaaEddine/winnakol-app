import { MainColor } from '@/constants/colors';
import { Dish, Shop } from '@/types/types';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import LogoSplash from '@/assets/images/logo_splash.svg';

const DishCard = ({ dish }: { dish: Dish }) => {
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: '/Drawer/MainApp/dish',
          params: {
            dish: JSON.stringify(dish),
          },
        });
      }}
      className="w-[170px] h-auto flex  justify-start items-center"
    >
      {dish.imgUrl.url ? (
        <Image
          source={{
            uri: dish.imgUrl.url,
          }}
          className="w-full h-[120px] bg-slate-200 dark:bg-dark-card  rounded-xl"
        />
      ) : (
        <View className="w-full h-[120px] bg-gray-300 flex justify-center items-center rounded-xl">
          <LogoSplash width="50" height="50" />
        </View>
      )}
      <View className="w-full h-auto  flex flex-col justify-start items-start mt-2">
        <Text
          numberOfLines={1}
          className="w-4/5 text-left text-lg text-black dark:text-dark font-bold font-oswald truncate whitespace-nowrap"
        >
          {dish.name}
        </Text>
        <View className="w-full flex flex-row justify-between items-center">
          <View className="w-auto h-5 flex flex-row justify-start items-center gap-x-1">
            <Text className="text-sm text-black dark:text-dark font-nunito-semi">
              {dish.price}
            </Text>
            <Text className="text-sm text-black dark:text-dark">DA</Text>
          </View>
          <View className="w-auto h-5 flex flex-row justify-center items-center gap-x-1">
            <Text className="text-sm text-black dark:text-dark font-nunito">
              {dish.averageRating.toFixed(1)}
            </Text>
            <AntDesign name="star" size={14} color={MainColor} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default DishCard;
