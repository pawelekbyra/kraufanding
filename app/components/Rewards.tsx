'use client';

import React from 'react';
import {
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Badge,
  rem,
  Box
} from '@mantine/core';
import { Reward } from '../types/campaign';

interface RewardsProps {
  rewards: Reward[];
}

const Rewards: React.FC<RewardsProps> = ({ rewards }) => {
  return (
    <Stack gap="xl">
      <Title order={2} size={rem(32)} fw={900}>
        Wybierz Nagrodę
      </Title>

      {rewards.map((reward) => (
        <Paper
          key={reward.id}
          withBorder
          p="xl"
          radius="md"
          shadow="sm"
          style={{
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}
          className="reward-card"
        >
          <Stack gap="lg">
            <Group justify="space-between" align="flex-start">
              <Box>
                <Title order={3} size="xl" fw={900}>
                  {reward.title}
                </Title>
                <Text size={rem(28)} fw={900} c="blue">
                  {reward.amount.toLocaleString()} PLN
                </Text>
              </Box>
              <Badge variant="light" color="blue" size="lg" radius="sm" fw={900}>
                {reward.backers} wspierających
              </Badge>
            </Group>

            <Text size="md" fw={500} c="dimmed" style={{ lineHeight: 1.6 }}>
              {reward.description}
            </Text>

            <Box pt="md" style={{ borderTop: `${rem(1)} solid var(--mantine-color-gray-2)` }}>
              <Text size="xs" tt="uppercase" fw={900} c="dimmed" lts={rem(1)}>
                Przewidywana Dostawa
              </Text>
              <Text size="sm" fw={700}>
                {reward.deliveryDate}
              </Text>
            </Box>

            <Button size="lg" radius="md" fullWidth fw={900}>
              Wybierz Tę Nagrodę
            </Button>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

export default Rewards;
