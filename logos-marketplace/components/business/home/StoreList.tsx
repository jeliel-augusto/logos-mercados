import { Text } from '@/components/ui/text';
import { Client, useGetClientsQuery } from '@/lib/api/client-api';
import { useRouter } from 'expo-router';
import { ClockIcon, StoreIcon } from 'lucide-react-native';
import { Image, Pressable, ScrollView, View } from 'react-native';

export function StoreList() {
  const { data: clients, isLoading: isLoadingClients, error: clientsError } = useGetClientsQuery();
  const router = useRouter();

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
        {isLoadingClients ? (
          <Text className="text-sm text-muted-foreground">Carregando lojas...</Text>
        ) : clientsError ? (
          <Text className="text-sm text-destructive">Erro ao carregar lojas</Text>
        ) : clients && clients.length > 0 ? (
          clients.map((client: Client) => (
            <Pressable
              key={client.id}
              className="w-56 overflow-hidden rounded-2xl border border-border bg-card active:opacity-80"
              onPress={() => router.push(`/shopping/${client.id}`)}>
              {/* Store Image */}
              {client.logo_url ? (
                <Image
                  source={{ uri: client.logo_url }}
                  className="h-32 w-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-32 items-center justify-center bg-muted">
                  <StoreIcon size={40} className="text-muted-foreground" />
                </View>
              )}

              {/* Store Info */}
              <View className="p-3">
                <Text className="mb-1 text-sm font-semibold text-foreground" numberOfLines={1}>
                  {client.name}
                </Text>
                <Text className="mb-2 text-xs text-muted-foreground" numberOfLines={1}>
                  {client.address || '--'}
                </Text>

                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1">
                    <ClockIcon size={14} className="text-muted-foreground" />
                    <Text className="text-xs text-muted-foreground">
                      {client.time_to_delivery || '--'}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <Text className="text-sm text-muted-foreground">Nenhuma loja encontrada</Text>
        )}
      </ScrollView>
    </View>
  );
}
