import { useColorScheme } from '@/context/ColorSchemeContext';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

const HourSheet = (props: SheetProps<'hours-sheet'>) => {
  const [selectedHour, setSelectedHour] = useState(props.payload?.hour ?? '');
  const { colorScheme } = useColorScheme();

  const hours = [
    { value: '00:00', label: '00:00' },
    { value: '01:00', label: '01:00' },
    { value: '02:00', label: '02:00' },
    { value: '03:00', label: '03:00' },
    { value: '04:00', label: '04:00' },
    { value: '05:00', label: '05:00' },
    { value: '06:00', label: '06:00' },
    { value: '07:00', label: '07:00' },
    { value: '08:00', label: '08:00' },
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '12:00', label: '12:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' },
    { value: '17:00', label: '17:00' },
    { value: '18:00', label: '18:00' },
    { value: '19:00', label: '19:00' },
    { value: '20:00', label: '20:00' },
    { value: '21:00', label: '21:00' },
    { value: '22:00', label: '22:00' },
    { value: '23:00', label: '23:00' },
  ];

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 30,
        backgroundColor: colorScheme === 'light' ? 'white' : '#141414',
        maxHeight: '90%',
      }}
      headerAlwaysVisible={true}
      gestureEnabled
      CustomHeaderComponent={
        <View className="w-full h-16 flex flex-row justify-center items-center">
          <Text className="text-lg text-black dark:text-dark font-bold">
            {props.payload?.header}
          </Text>
        </View>
      }
    >
      <View className="h-[250px] bg-transparent">
        <FlashList
          data={hours}
          contentContainerStyle={{
            paddingHorizontal: 25,
          }}
          // initialScrollIndex={
          //   hours.findIndex((hr) => hr.value === selectedHour) ?? 0
          // }
          renderItem={({
            item,
          }: {
            item: { value: string; label: string };
          }) => {
            return (
              <Pressable
                className={`w-full h-12 flex flex-row justify-center items-center rounded-full my-2 ${
                  selectedHour === item.value
                    ? 'bg-main'
                    : 'bg-white dark:bg-dark'
                }`}
                onPress={async () => {
                  props.payload?.setHour(item.value);
                  setSelectedHour(item.value);
                  await SheetManager.hide('category-sheet');
                }}
              >
                <Text
                  className={`${
                    selectedHour === item.value
                      ? 'text-white font-bold'
                      : 'text-black dark:text-dark'
                  }  text-lg `}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
          estimatedItemSize={24}
        />
      </View>
    </ActionSheet>
  );
};

export default HourSheet;
