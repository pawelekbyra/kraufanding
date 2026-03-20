'use client';

import React from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Progress,
  Paper,
  Group,
  Stack,
  Box,
  Avatar,
  rem,
  Badge,
  Grid,
  Image
} from '@mantine/core';
import { Campaign } from '../types/campaign';

interface HeroProps {
  campaign: Campaign;
}

const Hero: React.FC<HeroProps> = ({ campaign }) => {
  const percentage = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);

  return (
    <Box component="section" py={rem(64)} style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'var(--mantine-color-body)' }}>
      {/* Decorative patterns */}
      <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </Box>

      <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>
        <Grid gutter={rem(48)} align="center">
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Stack gap="xl">
              <Badge variant="outline" size="lg" radius="sm" fw={900} py={rem(18)} px={rem(20)}>
                ✨ WYRÓŻNIONY PROJEKT
              </Badge>

              <Title order={1} size={rem(56)} fw={900} lts={rem(-1.5)} style={{ lineHeight: 1.1 }}>
                {campaign.title}
              </Title>

              <Text size="xl" c="dimmed" fw={500} style={{ lineHeight: 1.6 }}>
                {campaign.description}
              </Text>

              <Paper withBorder p="xl" radius="md" shadow="sm">
                <Stack gap="md">
                  <Group justify="space-between" align="flex-end">
                    <Box>
                      <Text span fw={900} size={rem(32)} c="blue">
                        {campaign.raised.toLocaleString()} PLN
                      </Text>
                      <Text span c="dimmed" ml="xs" fw={700}>
                        z {campaign.goal.toLocaleString()} PLN
                      </Text>
                    </Box>
                    <Text fw={900} size="xl" c="blue">
                      {percentage}%
                    </Text>
                  </Group>

                  <Progress
                    value={percentage}
                    size="xl"
                    radius="xl"
                    animated
                    color="blue"
                    style={{ transition: 'width 1s ease-in-out' }}
                  />

                  <Group justify="space-between">
                    <Text size="xs" fw={900} c="dimmed" tt="uppercase" lts={rem(1)}>
                      {campaign.raised.toLocaleString()} Zebrano
                    </Text>
                    <Text size="xs" fw={900} c="dimmed" tt="uppercase" lts={rem(1)}>
                      Cel: {campaign.goal.toLocaleString()}
                    </Text>
                  </Group>
                </Stack>
              </Paper>

              <Group gap="md">
                <Button size="xl" radius="md" px={rem(48)} fw={900}>
                  Wesprzyj Projekt
                </Button>
                <Button variant="outline" size="xl" radius="md" px={rem(48)} fw={900}>
                  Udostępnij
                </Button>
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Paper shadow="xl" radius="lg" style={{ overflow: 'hidden', position: 'relative' }}>
              <Image
                src={campaign.thumbnail}
                alt={campaign.title}
                height={400}
                fallbackSrc="https://placehold.co/600x400?text=No+image"
              />
              <Box
                p="md"
                style={{
                  position: 'absolute',
                  bottom: rem(16),
                  left: rem(16),
                  right: rem(16),
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Avatar.Group spacing="sm">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} src={`https://i.pravatar.cc/100?u=${i}`} radius="xl" />
                  ))}
                  <Avatar radius="xl">+1.2k</Avatar>
                </Avatar.Group>
                <Badge variant="filled" color="blue" size="lg" radius="sm" fw={900}>
                  {campaign.category}
                </Badge>
              </Box>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
