import { Text } from '@/components/ui/text';
import { HomeIcon, ShoppingCartIcon, StoreIcon, UserIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAV_ITEMS = [
  { id: 'home', label: 'Início', icon: HomeIcon },
  { id: 'stores', label: 'Lojas', icon: StoreIcon },
  { id: 'cart', label: 'Carrinho', icon: ShoppingCartIcon },
  { id: 'profile', label: 'Perfil', icon: UserIcon },
];

export function BottomNav() {
  const insets = useSafeAreaInsets();
  const activeTab = 'home'; // Por enquanto, fixo em home

  return (
    <View
      className="border-t border-border bg-background"
      style={{ paddingBottom: insets.bottom }}>
      <View className="flex-row items-center justify-around px-4 py-2">
        {NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Pressable
              key={item.id}
              className="items-center gap-1 py-2 active:opacity-70"
              onPress={() => console.log('Navigate to:', item.id)}>
              <IconComponent
                size={24}
                className={isActive ? 'text-primary' : 'text-muted-foreground'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text
                className={`text-xs ${isActive ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
