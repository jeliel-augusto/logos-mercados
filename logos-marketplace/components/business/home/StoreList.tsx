import { Text } from '@/components/ui/text';
import { ClockIcon, StarIcon, StoreIcon } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

const FEATURED_STORES = [
  {
    id: '1',
    name: 'Mercado São João',
    rating: 4.8,
    deliveryTime: '20-30 min',
    category: 'Supermercado',
  },
  {
    id: '2',
    name: 'Hortifruti Bella',
    rating: 4.9,
    deliveryTime: '15-25 min',
    category: 'Frutas e Verduras',
  },
  {
    id: '3',
    name: 'Açougue Premium',
    rating: 4.7,
    deliveryTime: '25-35 min',
    category: 'Carnes',
  },
  {
    id: '4',
    name: 'Padaria do Bairro',
    rating: 4.6,
    deliveryTime: '10-20 min',
    category: 'Padaria',
  },
];

export function StoreList() {
  return (
    <View className="bg-background py-4">
      <View className="mb-3 flex-row items-center justify-between px-4">
        <Text className="text-base font-semibold text-foreground">Lojas em Destaque</Text>
        <Pressable onPress={() => console.log('Ver todas')}>
          <Text className="text-sm text-primary">Ver todas</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-3"
        className="flex-row">
        {FEATURED_STORES.map((store) => (
          <Pressable
            key={store.id}
            className="w-56 overflow-hidden rounded-2xl border border-border bg-card active:opacity-80"
            onPress={() => console.log('Store:', store.name)}>
            {/* Store Image Placeholder */}
            <View className="h-32 items-center justify-center bg-muted">
              <StoreIcon size={40} className="text-muted-foreground" />
            </View>

            {/* Store Info */}
            <View className="p-3">
              <Text className="mb-1 text-sm font-semibold text-foreground" numberOfLines={1}>
                {store.name}
              </Text>
              <Text className="mb-2 text-xs text-muted-foreground" numberOfLines={1}>
                {store.category}
              </Text>

              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <StarIcon size={14} className="text-amber-500" fill="#f59e0b" />
                  <Text className="text-xs font-medium text-foreground">{store.rating}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <ClockIcon size={14} className="text-muted-foreground" />
                  <Text className="text-xs text-muted-foreground">{store.deliveryTime}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
