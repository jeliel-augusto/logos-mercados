import { Text } from '@/components/ui/text';
import { Product } from '@/lib/api/product-api';
import { PlusIcon } from 'lucide-react-native';
import { Image, Pressable, View } from 'react-native';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
  primaryColor: string;
}

export function ProductCard({ product, onPress, onAddToCart, primaryColor }: ProductCardProps) {
  const truncatedDescription =
    product.description.length > 100
      ? product.description.substring(0, 100) + '...'
      : product.description;

  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl border border-border bg-white p-3 active:opacity-80">
      <View className="flex-row gap-3">
        {/* Product Image */}
        <View className="h-20 w-20 overflow-hidden rounded-lg bg-muted">
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-full w-full items-center justify-center">
              <Text className="text-xs text-muted-foreground">Sem imagem</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="flex-1">
          <Text className="mb-1 text-base font-semibold text-foreground" numberOfLines={2}>
            {product.name}
          </Text>

          <Text className="mb-2 text-sm text-muted-foreground" numberOfLines={2}>
            {truncatedDescription}
          </Text>

          <Text className="mb-2 text-lg font-bold text-foreground">
            R$ {product.price.toFixed(2)}
          </Text>
        </View>

        {/* Add to Cart Button */}
        <View className="justify-end">
          <Pressable
            onPress={onAddToCart}
            className="h-10 w-10 items-center justify-center rounded-full active:opacity-80"
            style={{ backgroundColor: primaryColor }}>
            <PlusIcon size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
