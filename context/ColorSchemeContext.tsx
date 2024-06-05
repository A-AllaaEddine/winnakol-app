import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Appearance } from 'react-native';
import { useColorScheme as useColor } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
// const wait = async (ms: number) =>
//   new Promise((resolve) => setTimeout(resolve, ms));

// export type ColorSchemeName = 'light' | 'dark';

// interface ColorScheme {
//   active: boolean;
//   statusBarStyle: ColorSchemeName;
//   colorScheme: ColorSchemeName;
//   overlay1: SkImage | null;
//   overlay2: SkImage | null;
// }

// const defaultValue: ColorScheme = {
//   active: false,
//   statusBarStyle: Appearance.getColorScheme() ?? 'light' ? 'dark' : 'light',
//   colorScheme: Appearance.getColorScheme() ?? 'light',
//   overlay1: null,
//   overlay2: null,
// };

// interface ColorSchemeContext extends ColorScheme {
//   ref: RefObject<View>;
//   transition: SharedValue<number>;
//   circle: SharedValue<{ x: number; y: number; r: number }>;
//   setScheme: (scheme: ColorScheme) => void;
// }

// // const ColorSchemeContext = createContext<ColorSchemeContext | null>(null);

// export const ColorSchemeContext = createContext<ColorSchemeContext | null>(
//   null
// );

// export const useColorScheme = () => {
//   const ctx = useContext(ColorSchemeContext);
//   if (ctx === null) {
//     throw new Error('No ColorScheme context context found');
//   }
//   const { colorScheme, setScheme, ref, transition, circle, active } = ctx;
//   const toggle = useCallback(
//     async (x: number, y: number) => {
//       const newColorScheme = colorScheme === 'light' ? 'dark' : 'light';

//       setScheme({
//         active: true,
//         colorScheme,
//         overlay1: null,
//         overlay2: null,
//         statusBarStyle: newColorScheme,
//       });
//       // 0. Define the circle and its maximum radius
//       const r = Math.max(...corners.map((corner) => dist(corner, { x, y })));
//       circle.value = { x, y, r };

//       // 1. Take the screenshot
//       const overlay1 = await makeImageFromView(ref);
//       // 2. display it
//       setScheme({
//         active: true,
//         colorScheme,
//         overlay1,
//         overlay2: null,
//         statusBarStyle: newColorScheme,
//       });
//       // 3. switch to dark mode
//       await wait(16);
//       setScheme({
//         active: true,
//         colorScheme: newColorScheme,
//         overlay1,
//         overlay2: null,
//         statusBarStyle: newColorScheme,
//       });
//       // 4. wait for the dark mode to render
//       await wait(16);
//       // 5. take screenshot
//       const overlay2 = await makeImageFromView(ref);
//       setScheme({
//         active: true,
//         colorScheme: newColorScheme,
//         overlay1,
//         overlay2,
//         statusBarStyle: newColorScheme,
//       });
//       // 6. transition
//       transition.value = 0;
//       transition.value = withTiming(1, { duration: 650 });
//       await wait(650);
//       setScheme({
//         active: false,
//         colorScheme: newColorScheme,
//         overlay1: null,
//         overlay2: null,
//         statusBarStyle: newColorScheme === 'light' ? 'dark' : 'light',
//       });
//     },
//     [circle, colorScheme, setScheme, ref, transition]
//   );
//   return { colorScheme, toggle, active };
// };

// const { width, height } = Dimensions.get('window');
// const corners = [vec(0, 0), vec(width, 0), vec(width, height)];

// interface ColorSchemeProviderProps {
//   children: ReactNode;
// }

// export const ColorSchemeProvider = ({ children }: ColorSchemeProviderProps) => {
//   const circle = useSharedValue({ x: 0, y: 0, r: 0 });
//   const transition = useSharedValue(0);
//   const ref = useRef(null);
//   const [currentColorScheme, setCurrentColorScheme] =
//     useState<ColorScheme>(defaultValue);

//   const { active, colorScheme, overlay1, overlay2, statusBarStyle } =
//     currentColorScheme;
//   const r = useDerivedValue(() => {
//     return mix(transition.value, 0, circle.value.r);
//   });

//   const setScheme = (scheme: ColorScheme) => {};

//   return (
//     <ColorSchemeContext.Provider
//       value={{
//         active,
//         colorScheme,
//         overlay1,
//         overlay2,
//         setScheme,
//         ref,
//         transition,
//         circle,
//         statusBarStyle,
//       }}
//     >
//       {children}
//     </ColorSchemeContext.Provider>
//   );
// };

export const useColorScheme = () => {
  const ctx = useContext(ColorSchemeContext);
  if (ctx === null) {
    throw new Error('No ColorScheme context context found');
  }
  // const { colorScheme, setCurrentColorScheme } = ctx;
  const { toggleColorScheme, colorScheme } = useColor();
  const newColorScheme = colorScheme === 'light' ? 'dark' : 'light';

  const setColorScheme = (colorScheme: ColorSchemeName) => {
    // setCurrentColorScheme({ colorScheme, statusBarStyle: newColorScheme });
    toggleColorScheme();
    // Appearance.setColorScheme(colorScheme);
  };

  return { colorScheme, setColorScheme };
};
export type ColorSchemeName = 'light' | 'dark';

interface ColorScheme {
  statusBarStyle: ColorSchemeName;
  colorScheme: ColorSchemeName;
}

const defaultValue: ColorScheme = {
  statusBarStyle: Appearance.getColorScheme() ?? 'light' ? 'dark' : 'light',
  colorScheme: Appearance.getColorScheme() ?? 'light',
};

interface ColorSchemeContext extends ColorScheme {
  setCurrentColorScheme: (scheme: ColorScheme) => void;
}

export const ColorSchemeContext = createContext<ColorSchemeContext | null>(
  null
);

interface ColorSchemeProviderProps {
  children: ReactNode;
}

export const ColorSchemeProvider = ({ children }: ColorSchemeProviderProps) => {
  const [currentColorScheme, setCurrentColorScheme] =
    useState<ColorScheme>(defaultValue);

  useEffect(() => {
    const getTheme = async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (theme) {
        setCurrentColorScheme((prev) => {
          return {
            statusBarStyle: theme as 'light' | 'dark',
            colorScheme: theme === 'light' ? 'dark' : 'light',
          };
        });
      }
    };

    getTheme();
  }, []);

  const { colorScheme, statusBarStyle } = currentColorScheme;

  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme,
        setCurrentColorScheme,
        statusBarStyle,
      }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
};
