import { Badge, Paper, Stack, Table, Title } from '@mantine/core';

export interface RecentOrderRow {
  id: string;
  name: string;
  client: string;
  status: string;
  total: string;
  items: number;
  requestedAt: string;
}

interface RecentOrdersTableProps {
  orders: RecentOrderRow[];
  statusColor: Record<string, string>;
  lastUpdateLabel?: string;
}

export function RecentOrdersTable({
  orders,
  statusColor,
  lastUpdateLabel,
}: RecentOrdersTableProps) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Stack gap="md">
        <Title order={4}>Pedidos recentes</Title>
        {lastUpdateLabel ? (
          <Badge variant="light" color="lime" w="fit">
            {lastUpdateLabel}
          </Badge>
        ) : null}
        <Table.ScrollContainer minWidth={500}>
          <Table verticalSpacing="md" striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Pedido</Table.Th>
                <Table.Th>Cliente</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Itens</Table.Th>
                <Table.Th>Solicitado</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {orders.map((order) => (
                <Table.Tr key={order.id}>
                  <Table.Td>{order.id}</Table.Td>
                  <Table.Td>{order.name}</Table.Td>
                  <Table.Td>{order.client}</Table.Td>
                  <Table.Td>
                    <Badge color={statusColor[order.status] || 'gray'}>{order.status}</Badge>
                  </Table.Td>
                  <Table.Td>{order.total}</Table.Td>
                  <Table.Td>{order.items}</Table.Td>
                  <Table.Td>{order.requestedAt}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Stack>
    </Paper>
  );
}
