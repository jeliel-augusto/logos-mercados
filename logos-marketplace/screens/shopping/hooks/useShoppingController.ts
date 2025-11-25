import { useGetClientByIdQuery } from '@/lib/api/client-api';
import {
  Product,
  useGetCategoriesByClientQuery,
  useGetProductsByClientAndCategoryQuery,
} from '@/lib/api/product-api';
import { useMemo, useState } from 'react';

interface ShoppingControllerProps {
  clientId: string;
}

export function useShoppingController({ clientId }: ShoppingControllerProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const {
    data: client,
    isLoading: isLoadingClient,
    error: clientError,
  } = useGetClientByIdQuery(clientId);
  console.log(clientError);
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesByClientQuery(clientId);
  const { data: products, isLoading: isLoadingProducts } = useGetProductsByClientAndCategoryQuery(
    { clientId, categoryId: selectedCategoryId },
    { skip: !selectedCategoryId }
  );

  const isStoreOpen = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 8 && hours < 22;
  }, []);

  const operatingHours = '08:00 - 22:00';

  const primaryColor = client?.theme_color_primary || '#10b981';

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product.name);
  };

  const handleAddToCart = (product: Product) => {
    console.log('Added to cart:', product.name);
  };

  const handleCheckout = () => {
    console.log('Proceed to checkout');
  };

  const selectedCategory = categories?.find((cat) => cat.id === selectedCategoryId);

  return {
    client,
    categories: categories || [],
    products: products || [],
    isLoadingClient,
    isLoadingCategories,
    isLoadingProducts,
    selectedCategory,
    selectedCategoryId,
    isStoreOpen,
    operatingHours,
    primaryColor,
    handleCategorySelect,
    handleProductPress,
    handleAddToCart,
    handleCheckout,
  };
}

export type ShoppingController = ReturnType<typeof useShoppingController>;
