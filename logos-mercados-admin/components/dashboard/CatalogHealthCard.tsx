import { Group, Paper, RingProgress, Stack, Text, Title } from '@mantine/core';

interface CatalogHealthCardProps {
  healthy: number;
  low: number;
  critical: number;
}

export function CatalogHealthCard({ healthy, low, critical }: CatalogHealthCardProps) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Stack gap="md">
        <Group justify="space-between">
          <div>
            <Title order={4}>Saúde do catálogo</Title>
            <Text size="sm" c="dimmed">
              Produtos por nível de estoque
            </Text>
          </div>
          <RingProgress
            size={120}
            thickness={12}
            label={<Text fw={600}>{healthy}%</Text>}
            sections={[
              { value: healthy, color: 'teal' },
              { value: low, color: 'yellow' },
              { value: critical, color: 'red' },
            ]}
          />
        </Group>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm">Estoque saudável</Text>
            <Text size="sm" fw={600}>
              {healthy}%
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Nível de atenção</Text>
            <Text size="sm" fw={600}>
              {low}%
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Crítico</Text>
            <Text size="sm" fw={600}>
              {critical}%
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Paper>
  );
}
