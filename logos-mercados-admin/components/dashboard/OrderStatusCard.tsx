import { Badge, Group, Paper, Progress, Stack, Text, Title } from '@mantine/core';

export interface OrderStatusItem {
  label: string;
  status: string;
  value: number;
}

interface OrderStatusCardProps {
  statuses: OrderStatusItem[];
  statusColor: Record<string, string>;
}

export function OrderStatusCard({ statuses, statusColor }: OrderStatusCardProps) {
  const total = statuses.reduce((acc, item) => acc + item.value, 0);

  return (
    <Paper withBorder radius="md" p="lg">
      <Stack gap="md">
        <Title order={4}>Status dos pedidos</Title>
        {statuses.map((item) => {
          const color = statusColor[item.status] || 'gray';
          const percentage = total ? Math.round((item.value / total) * 100) : 0;
          return (
            <Stack key={item.status} gap={4}>
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  {item.label}
                </Text>
                <Badge color={color} variant="light">
                  {item.value} pedidos
                </Badge>
              </Group>
              <Progress color={color} value={percentage} size="sm" />
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
}
