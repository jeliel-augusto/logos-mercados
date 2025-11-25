import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';
import { ShoppingController } from '../../../hooks/useShoppingController';

interface ShoppingCartFooterProps {
  controller: ShoppingController;
  cartItemsCount?: number;
  cartTotal?: number;
}

export function ShoppingCartFooter({
  controller,
  cartItemsCount = 0,
  cartTotal = 0,
}: ShoppingCartFooterProps) {
  const { handleCheckout, primaryColor } = controller;

  if (cartItemsCount === 0) {
    return null;
  }

  return (
    <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-white p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <View>
          <Text className="text-sm text-muted-foreground">
            {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'}
          </Text>
          <Text className="text-xl font-bold text-foreground">R$ {cartTotal.toFixed(2)}</Text>
        </View>

        <Pressable
          onPress={handleCheckout}
          className="rounded-full px-6 py-3 active:opacity-80"
          style={{ backgroundColor: primaryColor }}>
          <Text className="text-base font-semibold text-white">Finalizar Compra</Text>
        </Pressable>
      </View>
    </View>
  );
}
