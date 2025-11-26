import { IconDiscount2 } from '@tabler/icons-react';
import { Button, Group, Paper, Progress, Stack, Text, Title } from '@mantine/core';

export interface PromotionRow {
  title: string;
  reach: string;
  conversion: number;
  color: string;
}

interface PromotionHighlightsProps {
  promotions: PromotionRow[];
  description?: string;
  actionLabel?: string;
}

export function PromotionHighlights({
  promotions,
  description = 'Baseado na entidade Promotion e nos targets configurados',
  actionLabel = 'Criar promoção',
}: PromotionHighlightsProps) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={4}>Promoções em destaque</Title>
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          </div>
          <Button variant="light" leftSection={<IconDiscount2 size={18} />}>
            {actionLabel}
          </Button>
        </Group>
        <Stack gap="lg">
          {promotions.map((promo) => (
            <Stack key={promo.title} gap={6}>
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text fw={500}>{promo.title}</Text>
                  <Text size="sm" c="dimmed">
                    Alcance: {promo.reach}
                  </Text>
                </div>
                <Text fw={600}>{promo.conversion}% conversão</Text>
              </Group>
              <Progress value={promo.conversion * 10} color={promo.color} radius="xl" size="lg" />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
