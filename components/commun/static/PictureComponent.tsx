import { cn } from '@/utils/utils';
import { Image, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

const PictureComponent = ({
  className,
  url,
  rounded = 'rounded-full',
  objectFit = 'cover',
}: {
  className?: string;
  url: string;
  rounded?: 'rounded-full' | 'rounded-xl' | 'rounded-lg' | 'rounded-none';
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | undefined;
}) => {
  return (
    <View
      className={cn(
        className,
        `w-full h-full flex justify-center items-center ${className} ${rounded} overflow-hidden`
      )}
    >
      {url?.includes('api.dicebear.com') ? (
        <SvgUri
          width="100%"
          height="100%"
          style={{ width: '100%', height: '100%' }}
          uri={url}
        />
      ) : (
        <Image
          source={{
            uri: url,
          }}
          width={100}
          height={100}
          style={{
            objectFit: objectFit ?? 'cover',
          }}
          className="w-full h-full border-none object-contain bg-contain"
          alt="@image"
        />
      )}
    </View>
  );
};

export default PictureComponent;
