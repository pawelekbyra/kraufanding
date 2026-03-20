'use client';

import React from 'react';
import {
  Tabs,
  Container,
  Paper,
  Stack,
  Text,
  Title,
  Badge,
  Group,
  Avatar,
  rem,
  SimpleGrid,
  Box
} from '@mantine/core';
import { Campaign } from '../types/campaign';
import ProjectStory from './ProjectStory';
import Rewards from './Rewards';

interface ProjectTabsProps {
  campaign: Campaign;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ campaign }) => {
  return (
    <Tabs defaultValue="story" variant="outline" color="blue" radius="md">
      <Tabs.List mb="xl" style={{ borderBottom: `${rem(1)} solid var(--mantine-color-gray-2)` }}>
        <Tabs.Tab value="story" fw={900} py="md" px="xl" fz="sm">
          Story
        </Tabs.Tab>
        <Tabs.Tab value="rewards" fw={900} py="md" px="xl" fz="sm">
          Rewards
        </Tabs.Tab>
        <Tabs.Tab value="updates" fw={900} py="md" px="xl" fz="sm">
          Updates
        </Tabs.Tab>
        <Tabs.Tab value="comments" fw={900} py="md" px="xl" fz="sm">
          Comments
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="story">
        <ProjectStory campaign={campaign} />
      </Tabs.Panel>

      <Tabs.Panel value="rewards">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Rewards rewards={campaign.rewards || []} />
        </SimpleGrid>
      </Tabs.Panel>

      <Tabs.Panel value="updates">
        <Stack gap="xl">
          {campaign.updates?.length ? (
            campaign.updates.map((update) => (
              <Paper key={update.id} withBorder p="xl" radius="md" shadow="sm">
                <Group justify="space-between" align="center" mb="md">
                  <Title order={3} size="xl" fw={900}>
                    {update.title}
                  </Title>
                  <Badge variant="outline" color="blue" size="md" fw={900}>
                    {update.date}
                  </Badge>
                </Group>
                <Text size="md" fw={500} c="dimmed" style={{ lineHeight: 1.6 }}>
                  {update.content}
                </Text>
              </Paper>
            ))
          ) : (
            <Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
              <Text size="lg" fw={500} c="dimmed">No updates yet.</Text>
            </Paper>
          )}
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="comments">
        <Stack gap="xl">
          {campaign.comments?.length ? (
            campaign.comments.map((comment) => (
              <Paper key={comment.id} withBorder p="xl" radius="md" shadow="sm">
                <Group mb="md">
                  {comment.avatar && (
                    <Avatar src={comment.avatar} radius="xl" size="lg" />
                  )}
                  <Box>
                    <Text fw={900} size="md">
                      {comment.author}
                    </Text>
                    <Text size="xs" fw={700} c="dimmed">
                      {comment.date}
                    </Text>
                  </Box>
                </Group>
                <Text size="md" fw={500} c="dimmed" style={{ lineHeight: 1.6 }}>
                  {comment.content}
                </Text>
              </Paper>
            ))
          ) : (
            <Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
              <Text size="lg" fw={500} c="dimmed">No comments yet.</Text>
            </Paper>
          )}
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
};

export default ProjectTabs;
