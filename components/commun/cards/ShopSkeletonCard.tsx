import { View } from 'react-native';
import Skeleton from '../static/Skeleton';

const ShopSkeletonCard = () => {
  return (
    <View className="w-[170px] h-auto flex justify-start items-center">
      <Skeleton classname="w-full h-[120px] rounded-xl" />
      <View className="w-full h-auto rounded-lg">
        <View className="w-full h-auto flex flex-row justify-between items-center mt-3">
          <Skeleton classname="w-20 h-4 rounded-full" />
          <View className="w-auto h-full flex flex-row justify-center items-center gap-x-1">
            <Skeleton classname="w-10 h-4 rounded-full" />
          </View>
        </View>
        <Skeleton classname="w-20 h-4 rounded-full mt-2" />
      </View>
    </View>
  );
};

export default ShopSkeletonCard;
