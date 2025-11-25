import { Text } from '@/components/ui/text';
import { Product } from '@/lib/api/product-api';
import { ScrollView, View } from 'react-native';
import { ShoppingController } from '../../../hooks/useShoppingController';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  controller: ShoppingController;
}

export function ProductList({ controller }: ProductListProps) {
  const { products, isLoadingProducts, handleProductPress, handleAddToCart, primaryColor } =
    controller;

  if (isLoadingProducts) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-sm text-muted-foreground">Carregando produtos...</Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-sm text-muted-foreground">Nenhum produto encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="p-4 gap-4">
      {products.map((product: Product) => (
        <ProductCard
          key={product.id}
          product={product}
          onPress={() => handleProductPress(product)}
          onAddToCart={() => handleAddToCart(product)}
          primaryColor={primaryColor}
        />
      ))}
    </ScrollView>
  );
}
