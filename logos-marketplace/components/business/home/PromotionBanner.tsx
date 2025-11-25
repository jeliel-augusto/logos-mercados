import { Text } from '@/components/ui/text';
import { TagIcon } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

const PROMOTIONS = [];

export function PromotionBanner() {
  return (
    <View className="bg-background py-4">
      <View className="mb-3 px-4">
        <Text className="text-base font-semibold text-foreground">Promoções</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-3"
        className="flex-row">
        {PROMOTIONS.map((promo) => (
          <Pressable
            key={promo.id}
            className={`w-64 rounded-2xl p-4 active:opacity-80 ${promo.bgColor}`}
            onPress={() => console.log('Promotion:', promo.title)}>
            <View className="mb-2 flex-row items-center gap-2">
              <TagIcon size={18} className={promo.textColor} />
              <Text className={`text-sm font-bold ${promo.textColor}`}>{promo.title}</Text>
            </View>
            <Text className="text-xs text-foreground/70">{promo.description}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
