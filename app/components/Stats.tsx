'use client';

import React from 'react';
import {
  Container,
  SimpleGrid,
  Text,
  Group,
  Box,
  rem,
  Paper,
  Stack,
  ThemeIcon
} from '@mantine/core';
import { IconUsers, IconClock, IconTarget } from '@tabler/icons-react';

const Stats = () => {
  const statsData = [
    {
      title: 'Wspierających',
      value: '1,240',
      description: 'Jan 1st - Feb 1st',
      icon: IconUsers,
      color: 'blue',
    },
    {
      title: 'Czas do końca',
      value: '14 dni',
      description: 'Do 15 marca 2025',
      icon: IconClock,
      color: 'pink',
    },
    {
      title: 'Zrealizowano',
      value: '85%',
      description: 'Cel: 100,000 PLN',
      icon: IconTarget,
      color: 'teal',
    },
  ];

  const stats = statsData.map((stat) => {
    const Icon = stat.icon;
    return (
      <Paper key={stat.title} withBorder p="xl" radius="md" shadow="sm">
        <Group justify="space-between" align="center">
          <Stack gap={0}>
            <Text size="xs" fw={700} tt="uppercase" c="dimmed" lts={rem(1)}>
              {stat.title}
            </Text>
            <Text fw={900} size={rem(32)} c={stat.color}>
              {stat.value}
            </Text>
            <Text size="sm" fw={500} c="dimmed">
              {stat.description}
            </Text>
          </Stack>
          <ThemeIcon variant="light" size={rem(48)} radius="md" color={stat.color}>
            <Icon size={rem(24)} stroke={2} />
          </ThemeIcon>
        </Group>
      </Paper>
    );
  });

  return (
    <Box bg="gray.0" py={rem(64)}>
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
          {stats}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Stats;
