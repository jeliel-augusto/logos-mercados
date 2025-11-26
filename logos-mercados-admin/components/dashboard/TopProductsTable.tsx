import { Badge, Paper, Stack, Table, Text, Title } from '@mantine/core';

export interface TopProductRow {
  name: string;
  category: string;
  orders: number;
  revenue: string;
}

interface TopProductsTableProps {
  products: TopProductRow[];
  rangeLabel?: string;
}

export function TopProductsTable({
  products,
  rangeLabel = 'Últimos 7 dias',
}: TopProductsTableProps) {
  return (
    <Paper withBorder radius="md" p="lg" h="100%">
      <Stack gap="md">
        <Title order={4}>Top produtos</Title>
        <Badge variant="light" w="fit">
          {rangeLabel}
        </Badge>
        <Table.ScrollContainer minWidth={300}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Produto</Table.Th>
                <Table.Th>Categoria</Table.Th>
                <Table.Th>Pedidos</Table.Th>
                <Table.Th>Receita</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {products.map((product) => (
                <Table.Tr key={product.name}>
                  <Table.Td>
                    <Text fw={500}>{product.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {product.category}
                    </Text>
                  </Table.Td>
                  <Table.Td>{product.orders}</Table.Td>
                  <Table.Td>{product.revenue}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Stack>
    </Paper>
  );
}
