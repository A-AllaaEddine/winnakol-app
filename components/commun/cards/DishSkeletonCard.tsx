import { View } from 'react-native';
import Skeleton from '../static/Skeleton';

const DishSkeletonCard = () => {
  return (
    <View className="w-[170px] h-auto flex  justify-start items-center">
      <Skeleton classname="w-full h-[120px] rounded-lg" />
      <View className="w-full h-auto  flex flex-col justify-start items-start mt-2">
        <Skeleton classname="w-20 h-4 rounded-full" />
        <View className="w-full mt-2 flex flex-row justify-between items-center">
          <Skeleton classname="w-12 h-3 rounded-full" />
          <Skeleton classname="w-1/3 h-3 rounded-full" />
        </View>
      </View>
    </View>
  );
};

export default DishSkeletonCard;
