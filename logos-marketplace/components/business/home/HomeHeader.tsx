import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { MapPinIcon, SearchIcon } from 'lucide-react-native';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function HomeHeader() {
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');

  useEffect(() => {
    async function loadLocation() {
      const userCity = await AsyncStorage.getItem('user_city');
      const userUf = await AsyncStorage.getItem('user_uf');
      if (userCity && userUf) {
        setCity(userCity);
        setUf(userUf);
      }
    }
    loadLocation();
  }, []);

  return (
    <View className="bg-background px-4 pb-4 pt-12">
      {/* Location */}
      <View className="mb-4 flex-row items-center gap-2">
        <MapPinIcon size={20} className="text-primary" />
        <View>
          <Text className="text-xs text-muted-foreground">Localização</Text>
          <Text className="text-sm font-semibold text-foreground">
            {city ? `${city}, ${uf}` : 'Carregando...'}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="relative">
        <View className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
          <SearchIcon size={18} className="text-muted-foreground" />
        </View>
        <Input
          placeholder="Buscar produtos ou lojas..."
          className="pl-10"
        />
      </View>
    </View>
  );
}
