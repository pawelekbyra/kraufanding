"use client"

import React from 'react'
import {
  Box,
  Image,
  Heading,
  Text,
  Stack,
  Progress,
  Flex,
  Badge,
} from "@chakra-ui/react"
import { Campaign } from '../types/campaign'

interface CampaignCardProps {
  campaign: Campaign
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const percentage = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100)

  return (
    <Box
      bg="bg.panel"
      borderRadius="2xl"
      overflow="hidden"
      borderWidth="1px"
      borderColor="border"
      shadow="sm"
      transition="all 0.3s"
      _hover={{ shadow: "xl", transform: "translateY(-4px)", borderColor: "blue.500" }}
      role="group"
    >
      <Box position="relative" aspectRatio={16/10} overflow="hidden">
        <Image
          src={campaign.thumbnail}
          alt={campaign.title}
          width="full"
          height="full"
          objectFit="cover"
          transition="0.5s"
          _groupHover={{ scale: 1.1 }}
        />
        <Badge
          position="absolute"
          top={4}
          left={4}
          bg="black/60"
          backdropFilter="blur(8px)"
          px={2}
          py={1}
          rounded="md"
          fontSize="2xs"
          fontWeight="black"
          color="white"
          variant="solid"
          borderWidth="1px"
          borderColor="white/20"
        >
          {campaign.category}
        </Badge>
      </Box>

      <Stack p={6} gap={4}>
        <Box>
          <Heading
            as="h3"
            fontSize="xl"
            fontWeight="bold"
            lineClamp={1}
            _groupHover={{ color: "blue.600" }}
            transition="colors 0.3s"
          >
            {campaign.title}
          </Heading>
          <Text fontSize="sm" color="fg.subtle" mt={1}>
            przez <Text as="span" fontWeight="medium" color="fg.muted">{campaign.author}</Text>
          </Text>
        </Box>

        <Text fontSize="sm" color="fg.muted" lineClamp={2} minH="40px">
          {campaign.description}
        </Text>

        <Stack gap={2}>
          <Progress.Root value={percentage} colorPalette="blue" size="xs" shape="rounded">
             <Progress.Track bg="gray.100" _dark={{ bg: "gray.800" }}>
                <Progress.Range />
             </Progress.Track>
          </Progress.Root>
          <Flex justify="space-between" fontSize="xs" fontWeight="bold">
            <Stack gap={0}>
              <Text color="fg.default">{percentage}%</Text>
              <Text color="fg.subtle" textTransform="uppercase" fontSize="2xs" letterSpacing="tighter">Zebrano</Text>
            </Stack>
            <Stack gap={0} textAlign="right">
              <Text color="fg.default">{campaign.raised.toLocaleString()} PLN</Text>
              <Text color="fg.subtle" textTransform="uppercase" fontSize="2xs" letterSpacing="tighter">Kwota</Text>
            </Stack>
          </Flex>
        </Stack>
      </Stack>
    </Box>
  )
}

export default CampaignCard
