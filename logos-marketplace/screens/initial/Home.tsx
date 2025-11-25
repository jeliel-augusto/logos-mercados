import { BottomNav } from '@/components/business/home/BottomNav';
import { CategoryList } from '@/components/business/home/CategoryList';
import { HomeHeader } from '@/components/business/home/HomeHeader';
import { StoreList } from '@/components/business/home/StoreList';
import { ScrollView, View } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 bg-background">
      <HomeHeader />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-4">
        <CategoryList />
        {/* <PromotionBanner /> */}
        <StoreList />
      </ScrollView>

      <BottomNav />
    </View>
  );
}
