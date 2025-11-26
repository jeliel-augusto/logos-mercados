'use client';

import { useRouter } from 'next/navigation';
import { IconChartLine, IconDiscount2, IconPackage, IconShoppingCart } from '@tabler/icons-react';
import { Button, Container, Grid, Stack } from '@mantine/core';
import { OrderStatusCard, type OrderStatusItem } from '../components/dashboard/OrderStatusCard';
import { OrdersVolumeCard, type OrdersVolumePoint } from '../components/dashboard/OrdersVolumeCard';
import {
  PromotionHighlights,
  type PromotionRow,
} from '../components/dashboard/PromotionHighlights';
import { RecentOrdersTable, type RecentOrderRow } from '../components/dashboard/RecentOrdersTable';
import { SectionHeader } from '../components/dashboard/SectionHeader';
import { StatsOverview, type StatsCard } from '../components/dashboard/StatsOverview';
import { TopClientsList, type TopClientRow } from '../components/dashboard/TopClientsList';
import { TopProductsTable, type TopProductRow } from '../components/dashboard/TopProductsTable';
import { AuthProvider, useAuth } from '../lib/auth';

const statsCards: StatsCard[] = [
  {
    label: 'Pedidos no dia',
    value: '128',
    description: '+12% vs. ontem',
    hint: '12 aguardando aprovação',
    icon: IconShoppingCart,
    color: 'teal',
  },
  {
    label: 'Receita projetada',
    value: 'R$ 18.450',
    description: '+8% nas últimas 4h',
    hint: 'Ticket médio R$ 144',
    icon: IconChartLine,
    color: 'blue',
  },
  {
    label: 'Produtos ativos',
    value: '632',
    description: 'Catálogos de todos os clientes',
    hint: '24 com estoque crítico',
    icon: IconPackage,
    color: 'violet',
  },
  {
    label: 'Promoções ativas',
    value: '5',
    description: 'Campanhas multicanais',
    hint: '2 expiram nesta semana',
    icon: IconDiscount2,
    color: 'grape',
  },
];

const orderVolume: OrdersVolumePoint[] = [
  { day: 'Seg', value: 68 },
  { day: 'Ter', value: 74 },
  { day: 'Qua', value: 92 },
  { day: 'Qui', value: 85 },
  { day: 'Sex', value: 110 },
  { day: 'Sáb', value: 138 },
  { day: 'Dom', value: 120 },
];

const orderStatuses: OrderStatusItem[] = [
  { label: 'Criados', status: 'CREATED', value: 24 },
  { label: 'Aceitos', status: 'ACCEPTED', value: 36 },
  { label: 'Em rota', status: 'IN_DELIVERY', value: 42 },
  { label: 'Concluídos', status: 'CONCLUDED', value: 64 },
];

const promotionPerformance: PromotionRow[] = [
  { title: 'Semana do Hortifrúti', reach: '1.2k clientes', conversion: 4.3, color: 'teal' },
  { title: 'Clube Prime', reach: '860 clientes', conversion: 6.1, color: 'violet' },
  { title: 'Combo Família', reach: '640 clientes', conversion: 3.2, color: 'orange' },
];

const topProducts: TopProductRow[] = [
  { name: 'Kit Café da Manhã', category: 'Cestas', orders: 64, revenue: 'R$ 5.120' },
  { name: 'Arroz Premium 5kg', category: 'Mercearia', orders: 58, revenue: 'R$ 3.896' },
  { name: 'Combo Churrasco', category: 'Açougue', orders: 41, revenue: 'R$ 4.060' },
];

const topClients: TopClientRow[] = [
  { name: 'Rede Bom Preço', orders: 182, ticket: 'R$ 162' },
  { name: 'SuperMix Center', orders: 145, ticket: 'R$ 148' },
  { name: 'Mercantil Norte', orders: 129, ticket: 'R$ 137' },
];

const recentOrders: RecentOrderRow[] = [
  {
    id: 'LM-1029',
    name: 'Pedido express 1029',
    client: 'Hiper Ideal',
    status: 'IN_DELIVERY',
    total: 'R$ 420,80',
    requestedAt: '10:24',
    items: 12,
  },
  {
    id: 'LM-1028',
    name: 'Pedido agendado 1028',
    client: 'Rede Bom Preço',
    status: 'ACCEPTED',
    total: 'R$ 318,50',
    requestedAt: '09:10',
    items: 9,
  },
  {
    id: 'LM-1027',
    name: 'Pedido catálogo 1027',
    client: 'Mercantil Norte',
    status: 'CONCLUDED',
    total: 'R$ 572,30',
    requestedAt: 'Ontem',
    items: 16,
  },
  {
    id: 'LM-1026',
    name: 'Pedido recorrente 1026',
    client: 'SuperMix Center',
    status: 'CREATED',
    total: 'R$ 288,00',
    requestedAt: 'Ontem',
    items: 8,
  },
];

const inventoryHealth = {
  healthy: 72,
  low: 18,
  critical: 10,
};

const statusColor: Record<string, string> = {
  CREATED: 'gray',
  ACCEPTED: 'blue',
  IN_DELIVERY: 'yellow',
  CONCLUDED: 'teal',
};

const orderHighlights = {
  conversion: '78% dos pedidos',
  sla: '03m 45s médios',
  cancellations: '1,9% nas últimas 24h',
};

function DashboardContent() {
  const { admin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const lastUpdateLabel = `Última atualização: ${new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <SectionHeader
          title={`Operações de vendas${admin?.name ? ` • ${admin.name}` : ''}`}
          description="Monitoramento de pedidos, promoções e produtos em tempo real"
          actions={
            <Button variant="light" color="gray" onClick={handleLogout}>
              Sair
            </Button>
          }
        />

        <StatsOverview cards={statsCards} />

        <Grid>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <OrdersVolumeCard
              data={orderVolume}
              highlights={orderHighlights}
              lastSyncLabel="Última sincronização: há 3 min"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="lg">
              <OrderStatusCard statuses={orderStatuses} statusColor={statusColor} />
            </Stack>
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <TopProductsTable products={topProducts} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <TopClientsList clients={topClients} />
          </Grid.Col>
        </Grid>

        <RecentOrdersTable
          orders={recentOrders}
          statusColor={statusColor}
          lastUpdateLabel={lastUpdateLabel}
        />

        <PromotionHighlights promotions={promotionPerformance} />
      </Stack>
    </Container>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
