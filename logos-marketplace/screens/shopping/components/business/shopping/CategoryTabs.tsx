import { Text } from '@/components/ui/text';
import { Category } from '@/lib/api/product-api';
import { Pressable, ScrollView, View } from 'react-native';
import { ShoppingController } from '../../../hooks/useShoppingController';

interface CategoryTabsProps {
  controller: ShoppingController;
}

export function CategoryTabs({ controller }: CategoryTabsProps) {
  const { categories, selectedCategoryId, handleCategorySelect, primaryColor } = controller;

  if (categories.length === 0) {
    return null;
  }

  return (
    <View className="border-b border-border bg-white">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 py-3 gap-3"
        className="flex-row">
        {categories.map((category: Category) => {
          const isSelected = category.id === selectedCategoryId;

          return (
            <Pressable
              key={category.id}
              onPress={() => handleCategorySelect(category.id)}
              className={`rounded-full px-4 py-2 ${isSelected ? 'bg-opacity-100' : 'bg-muted'}`}
              style={{
                backgroundColor: isSelected ? primaryColor : undefined,
              }}>
              <Text
                className={`text-sm font-medium ${
                  isSelected ? 'text-white' : 'text-muted-foreground'
                }`}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
