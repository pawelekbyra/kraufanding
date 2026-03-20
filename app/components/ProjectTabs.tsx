"use client"

import React from 'react'
import {
  Box,
  Tabs,
  Stack,
  Heading,
  Text,
  Badge,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react"
import { Avatar } from "@/components/ui/avatar"
import { Campaign } from '../types/campaign'
import ProjectStory from './ProjectStory'
import Rewards from './Rewards'

interface ProjectTabsProps {
  campaign: Campaign
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ campaign }) => {
  return (
    <Box width="full">
      <Tabs.Root defaultValue="story" variant="line" colorPalette="blue">
        <Tabs.List mb={10} borderBottomWidth="1px" borderColor="border">
          <Tabs.Trigger value="story" py={4} fontWeight="black" fontSize="sm" textTransform="uppercase" letterSpacing="widest">
            Story
          </Tabs.Trigger>
          <Tabs.Trigger value="rewards" py={4} fontWeight="black" fontSize="sm" textTransform="uppercase" letterSpacing="widest">
            Rewards
          </Tabs.Trigger>
          <Tabs.Trigger value="updates" py={4} fontWeight="black" fontSize="sm" textTransform="uppercase" letterSpacing="widest">
            Updates
          </Tabs.Trigger>
          <Tabs.Trigger value="comments" py={4} fontWeight="black" fontSize="sm" textTransform="uppercase" letterSpacing="widest">
            Comments
          </Tabs.Trigger>
          <Tabs.Indicator height="2px" bg="blue.600" />
        </Tabs.List>

        <Box minH="400px">
          <Tabs.Content value="story">
            <ProjectStory campaign={campaign} />
          </Tabs.Content>

          <Tabs.Content value="rewards">
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <Rewards rewards={campaign.rewards || []} />
            </SimpleGrid>
          </Tabs.Content>

          <Tabs.Content value="updates">
            <Stack gap={8}>
              {campaign.updates?.length ? (
                campaign.updates.map((update) => (
                  <Box
                    key={update.id}
                    p={8}
                    bg="bg.panel"
                    borderWidth="1px"
                    borderColor="border"
                    borderRadius="2xl"
                    shadow="sm"
                  >
                    <Flex justify="space-between" align="center" mb={4}>
                      <Heading size="md" fontWeight="black">
                        {update.title}
                      </Heading>
                      <Badge variant="outline" size="sm" fontWeight="bold">
                        {update.date}
                      </Badge>
                    </Flex>
                    <Text color="fg.muted" lineHeight="tall">
                      {update.content}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text textAlign="center" color="fg.subtle" py={12}>
                  No updates yet.
                </Text>
              )}
            </Stack>
          </Tabs.Content>

          <Tabs.Content value="comments">
            <Stack gap={8}>
              {campaign.comments?.length ? (
                campaign.comments.map((comment) => (
                  <Box
                    key={comment.id}
                    p={8}
                    bg="bg.panel"
                    borderWidth="1px"
                    borderColor="border"
                    borderRadius="2xl"
                    shadow="sm"
                  >
                    <Flex gap={4} align="center" mb={4}>
                      <Avatar src={comment.avatar} name={comment.author} size="md" />
                      <Box>
                        <Text fontWeight="black">{comment.author}</Text>
                        <Text fontSize="xs" fontWeight="bold" color="fg.subtle">
                          {comment.date}
                        </Text>
                      </Box>
                    </Flex>
                    <Text color="fg.muted" lineHeight="tall">
                      {comment.content}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text textAlign="center" color="fg.subtle" py={12}>
                  No comments yet.
                </Text>
              )}
            </Stack>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  )
}

export default ProjectTabs
