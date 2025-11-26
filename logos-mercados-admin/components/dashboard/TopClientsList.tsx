import { Badge, Group, Paper, Stack, Text, Title } from '@mantine/core';

export interface TopClientRow {
  name: string;
  orders: number;
  ticket: string;
  segment?: string;
}

interface TopClientsListProps {
  clients: TopClientRow[];
  badgeLabel?: string;
}

export function TopClientsList({ clients, badgeLabel = 'Segmento B2B' }: TopClientsListProps) {
  return (
    <Paper withBorder radius="md" p="lg" h="100%">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>Clientes com maior volume</Title>
          <Badge variant="light" color="teal">
            {badgeLabel}
          </Badge>
        </Group>
        <Stack gap="md">
          {clients.map((client) => (
            <Group key={client.name} justify="space-between" align="flex-start">
              <div>
                <Text fw={500}>{client.name}</Text>
                <Text size="sm" c="dimmed">
                  {client.segment || 'Clientes corporativos'}
                </Text>
              </div>
              <Stack gap={2} align="flex-end">
                <Text size="sm" c="dimmed">
                  Pedidos
                </Text>
                <Text fw={600}>{client.orders}</Text>
                <Text size="sm" c="dimmed">
                  Ticket {client.ticket}
                </Text>
              </Stack>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
