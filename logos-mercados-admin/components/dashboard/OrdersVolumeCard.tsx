import { Badge, Box, Divider, Flex, Paper, Stack, Text, Title } from '@mantine/core';

export interface OrdersVolumePoint {
  day: string;
  value: number;
}

interface OrdersVolumeCardProps {
  title?: string;
  subtitle?: string;
  lastSyncLabel?: string;
  data: OrdersVolumePoint[];
  highlights: {
    conversion: string;
    sla: string;
    cancellations: string;
  };
}

export function OrdersVolumeCard({
  title = 'Volume por dia',
  subtitle = 'Fluxo semanal de pedidos',
  lastSyncLabel,
  data,
  highlights,
}: OrdersVolumeCardProps) {
  const maxOrders = Math.max(...data.map((item) => item.value));

  return (
    <Paper withBorder radius="md" p="lg" h="100%">
      <Stack gap="lg">
        <Stack gap={4}>
          <Text size="sm" c="dimmed">
            {subtitle}
          </Text>
          <Title order={3}>{title}</Title>
          {lastSyncLabel ? (
            <Badge color="blue" variant="light" w="fit">
              {lastSyncLabel}
            </Badge>
          ) : null}
        </Stack>
        <Flex gap="md" align="flex-end">
          {data.map((item) => (
            <Stack key={item.day} gap={4} align="center" style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {item.value}
              </Text>
              <Box
                w="100%"
                style={{
                  height: `${(item.value / maxOrders) * 140}px`,
                  borderRadius: '12px',
                  background: 'linear-gradient(180deg, #4dabf7 0%, #1c7ed6 100%)',
                }}
              />
              <Text size="xs" c="dimmed">
                {item.day}
              </Text>
            </Stack>
          ))}
        </Flex>
        <Divider />
        <Flex gap="lg" justify="space-between" wrap="wrap">
          <Stack gap={0}>
            <Text size="sm" c="dimmed">
              Conversão em até 15 min
            </Text>
            <Text fw={600}>{highlights.conversion}</Text>
          </Stack>
          <Stack gap={0}>
            <Text size="sm" c="dimmed">
              SLA de aceite
            </Text>
            <Text fw={600}>{highlights.sla}</Text>
          </Stack>
          <Stack gap={0}>
            <Text size="sm" c="dimmed">
              Cancelamentos
            </Text>
            <Text fw={600}>{highlights.cancellations}</Text>
          </Stack>
        </Flex>
      </Stack>
    </Paper>
  );
}
