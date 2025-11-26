import { type ComponentType } from 'react';
import { Badge, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';

export type StatsCard = {
  label: string;
  value: string;
  description: string;
  hint: string;
  icon: ComponentType<{ size?: number | string }>;
  color: string;
};

interface StatsOverviewProps {
  cards: StatsCard[];
}

export function StatsOverview({ cards }: StatsOverviewProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Paper key={card.label} withBorder radius="md" p="lg">
            <Stack gap="sm">
              <Group gap="sm">
                <ThemeIcon size="lg" radius="md" color={card.color} variant="light">
                  <Icon size={20} />
                </ThemeIcon>
                <div>
                  <Text size="sm" c="dimmed">
                    {card.label}
                  </Text>
                  <Text size="xl" fw={600}>
                    {card.value}
                  </Text>
                </div>
              </Group>
              <Text size="sm" c="dimmed">
                {card.description}
              </Text>
              <Badge color={card.color} variant="light" w="fit">
                {card.hint}
              </Badge>
            </Stack>
          </Paper>
        );
      })}
    </SimpleGrid>
  );
}
