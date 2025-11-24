import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import UserEntry from '@/screens/initial/UserEntry';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { type ImageStyle } from 'react-native';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const SCREEN_OPTIONS = {
  headerShown: false,
};

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

export default function Screen() {
  const { colorScheme } = useColorScheme();
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    async function initialize() {
      const userCity = await AsyncStorage.getItem('user_city');
      const userUf = await AsyncStorage.getItem('user_uf');
      if (userCity && userUf) {
        router.replace('/home');
      }
      setLoading(false);
    }
    initialize();
  }, []);

  if (loading) {
    return null;
  }
  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <UserEntry />
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
