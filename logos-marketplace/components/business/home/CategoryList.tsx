import { Text } from '@/components/ui/text';
import { useGetGlobalCategoriesQuery } from '@/lib/api/global-categories-api';
import { getCategoryIcon } from '@/lib/icon-mapping';
import { ActivityIndicator, ScrollView, View } from 'react-native';

export function CategoryList() {
  const { data: categories, isLoading, error } = useGetGlobalCategoriesQuery();
  if (isLoading) {
    return (
      <View className="bg-background py-4">
        <View className="mb-3 px-4">
          <Text className="text-base font-semibold text-foreground">Categorias</Text>
        </View>
        <View className="items-center justify-center py-8">
          <ActivityIndicator size="small" className="text-muted-foreground" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-background py-4">
        <View className="mb-3 px-4">
          <Text className="text-base font-semibold text-foreground">Categorias</Text>
        </View>
        <View className="items-center justify-center py-8">
          <Text className="text-sm text-muted-foreground">Erro ao carregar categorias</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-background py-4">
      <View className="mb-3 px-4">
        <Text className="text-base font-semibold text-foreground">Categorias</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-3"
        className="flex-row">
        {categories?.map((category) => {
          const { icon: IconComponent, color } = getCategoryIcon(category.icon_name);
          return (
            <View key={category.id} className="items-center gap-2">
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <IconComponent size={28} className={color} />
              </View>
              <Text className="max-w-20 text-center text-xs text-foreground">{category.name}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
