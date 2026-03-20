import React from 'react';
import { Card, Image, Text, Badge, Group, Stack, Progress, rem } from '@mantine/core';
import { Campaign } from '../types/campaign';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const percentage = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={campaign.thumbnail}
          height={160}
          alt={campaign.title}
        />
      </Card.Section>

      <Stack gap="sm" mt="md">
        <Group justify="space-between">
          <Text fw={900}>{campaign.title}</Text>
          <Badge color="blue" variant="light">
            {campaign.category}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={2}>
          {campaign.description}
        </Text>

        <Stack gap={rem(4)}>
          <Progress value={percentage} mt="md" size="sm" radius="xl" />
          <Group justify="space-between" mt="xs">
            <Text size="xs" fw={700}>
              {percentage}%
            </Text>
            <Text size="xs" fw={700}>
              {campaign.raised.toLocaleString()} PLN
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
};

export default CampaignCard;
