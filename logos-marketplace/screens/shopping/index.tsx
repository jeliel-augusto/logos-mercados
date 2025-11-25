import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';
import {
  CategoryTabs,
  ProductList,
  ShoppingCartFooter,
  ShoppingHeader,
} from './components/business/shopping';
import { useShoppingController } from './hooks/useShoppingController';

export default function Shopping() {
  const params = useLocalSearchParams();

  if (!params.clientId) {
    throw new Error('Client ID is required');
  }

  const controller = useShoppingController({
    clientId: params.clientId as string,
  });

  const { client } = controller;

  console.log(client);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-20">
        <ShoppingHeader
          controller={controller}
          clientLogo={client?.logo_url}
          clientName={client?.name || ''}
        />

        <CategoryTabs controller={controller} />

        <ProductList controller={controller} />
      </ScrollView>

      <ShoppingCartFooter controller={controller} cartItemsCount={0} cartTotal={0} />
    </View>
  );
}
