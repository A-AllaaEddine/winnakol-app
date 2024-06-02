import { View } from 'react-native';
import Skeleton from '../static/Skeleton';

const ReviewSkeletonCard = () => {
  return (
    <View className="w-[350px]  h-auto  rounded-xl flex  justify-start items-start p-3">
      <View className="w-full h-auto flex flex-row justify-start items-center gap-x-2">
        <Skeleton classname="w-14 h-14 rounded-full" />
        <View className="h-auto w-full">
          <Skeleton classname="w-20 h-4 rounded-full" />
          <View className="w-auto h-auto mt-2 flex flex-row justify-start items-center">
            <Skeleton classname="w-20 h-4 rounded-full" />
            <Skeleton classname="w-20 h-4 rounded-full mx-1" />
          </View>
        </View>
      </View>
      <Skeleton classname="w-full h-10 rounded-full mt-2" />
    </View>
  );
};

export default ReviewSkeletonCard;
