import { type ReactNode } from 'react';
import { Group, Text, Title } from '@mantine/core';

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: 'flex-start' | 'center' | 'flex-end';
}

export function SectionHeader({
  title,
  description,
  actions,
  align = 'flex-start',
}: SectionHeaderProps) {
  return (
    <Group justify="space-between" align={align} wrap="wrap">
      <div>
        <Title order={4}>{title}</Title>
        {description ? (
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        ) : null}
      </div>
      {actions}
    </Group>
  );
}
