import { cn } from '@/utils/utils';
import { View } from 'react-native';

const Skeleton = ({ classname }: { classname?: string }) => {
  return (
    <View
      className={cn(
        `w-12 h-4 rounded-md  animate-pulse bg-gray-200 dark:bg-dark-card`,
        classname
      )}
    />
  );
};

export default Skeleton;
