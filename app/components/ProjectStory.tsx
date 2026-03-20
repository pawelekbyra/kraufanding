'use client';

import React from 'react';
import {
  Paper,
  Title,
  Text,
  Stack,
  List,
  ThemeIcon,
  rem,
  SimpleGrid,
  Box
} from '@mantine/core';
import { IconCircleCheck, IconCircleDashed, IconPackage } from '@tabler/icons-react';
import { Campaign } from '../types/campaign';

interface ProjectStoryProps {
  campaign: Campaign;
}

const ProjectStory: React.FC<ProjectStoryProps> = ({ campaign }) => {
  return (
    <Stack gap="xl">
      <Paper withBorder p="xl" radius="md" shadow="sm">
        <Title order={2} size={rem(32)} fw={900} mb="xl" style={{ borderBottom: `${rem(1)} solid var(--mantine-color-gray-2)`, paddingBottom: rem(24) }}>
          O Projekcie
        </Title>

        <Stack gap="lg">
          {campaign.story?.map((paragraph, index) => (
            <Text key={index} size="lg" fw={500} c="dimmed" style={{ lineHeight: 1.6 }}>
              {paragraph}
            </Text>
          ))}
        </Stack>
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        <Paper withBorder p="xl" radius="md" shadow="sm">
          <Title order={3} size="xl" fw={900} mb="md">
            Dlaczego my?
          </Title>
          <Text size="md" fw={500} c="dimmed" style={{ lineHeight: 1.5 }}>
            Nasz zespół składa się z pasjonatów i ekspertów w dziedzinie technologii,
            którzy dążą do wprowadzenia realnych zmian w sposobie korzystania z urządzeń cyfrowych.
          </Text>
        </Paper>

        <Paper withBorder p="xl" radius="md" shadow="sm">
          <Title order={3} size="xl" fw={900} mb="md">
            Plan Działania
          </Title>
          <List
            spacing="md"
            size="md"
            center
            fw={700}
            c="dimmed"
            icon={
              <ThemeIcon color="blue" size={rem(16)} radius="xl">
                <IconCircleCheck size={rem(10)} />
              </ThemeIcon>
            }
          >
            <List.Item>Zakończenie fazy prototypowania</List.Item>
            <List.Item
              icon={
                <ThemeIcon color="pink" size={rem(16)} radius="xl">
                  <IconCircleDashed size={rem(10)} />
                </ThemeIcon>
              }
            >
              Rozpoczęcie masowej produkcji
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon color="teal" size={rem(16)} radius="xl">
                  <IconPackage size={rem(10)} />
                </ThemeIcon>
              }
            >
              Wysyłka pierwszych zamówień
            </List.Item>
          </List>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
};

export default ProjectStory;
