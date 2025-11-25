import { Text } from '@/components/ui/text';
import { Image, View } from 'react-native';
import { ShoppingController } from '../../../hooks/useShoppingController';

interface ShoppingHeaderProps {
  controller: ShoppingController;
  clientLogo?: string;
  clientName: string;
}

export function ShoppingHeader({ controller, clientLogo, clientName }: ShoppingHeaderProps) {
  const { isStoreOpen, operatingHours } = controller;

  return (
    <View className="border-b border-border bg-white p-4">
      <View className="flex-row items-center gap-4">
        {clientLogo ? (
          <Image source={{ uri: clientLogo }} className="h-16 w-16 rounded-lg" resizeMode="cover" />
        ) : (
          <View className="h-16 w-16 items-center justify-center rounded-lg bg-muted">
            <Text className="text-xs font-semibold text-muted-foreground">
              {clientName.slice(0, 2).toUpperCase()}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <Text className="mb-1 text-lg font-bold text-foreground">{clientName}</Text>

          <View className="flex-row items-center gap-2">
            <View
              className={`h-2 w-2 rounded-full ${isStoreOpen ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <Text
              className={`text-sm ${isStoreOpen ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {isStoreOpen ? 'Aberto' : 'Fechado'}
            </Text>
          </View>

          <Text className="mt-1 text-xs text-muted-foreground">{operatingHours}</Text>
        </View>
      </View>
    </View>
  );
}
