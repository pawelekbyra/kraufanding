"use client"

import React from 'react'
import {
  Box,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react"
import { LuCheck } from "react-icons/lu"
import { Campaign } from '../types/campaign'

interface ProjectStoryProps {
  campaign: Campaign
}

const ProjectStory: React.FC<ProjectStoryProps> = ({ campaign }) => {
  return (
    <Stack gap={12}>
      <Box
        p={{ base: 8, md: 12 }}
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        borderRadius="3xl"
        shadow="xl"
      >
        <Heading
          as="h2"
          fontSize="3xl"
          fontWeight="black"
          mb={8}
          pb={6}
          borderBottomWidth="1px"
          borderColor="border"
        >
          O Projekcie
        </Heading>

        <Stack gap={6}>
          {campaign.story?.map((paragraph, index) => (
            <Text key={index} fontSize="lg" color="fg.muted" lineHeight="tall">
              {paragraph}
            </Text>
          ))}
        </Stack>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
        <Box
          p={8}
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border"
          borderRadius="2xl"
          shadow="lg"
        >
          <Heading as="h3" fontSize="xl" fontWeight="black" mb={4}>
            Dlaczego my?
          </Heading>
          <Text color="fg.muted" lineHeight="relaxed" fontWeight="medium">
            Nasz zespół składa się z pasjonatów i ekspertów w dziedzinie technologii,
            którzy dążą do wprowadzenia realnych zmian w sposobie korzystania z urządzeń cyfrowych.
          </Text>
        </Box>

        <Box
          p={8}
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border"
          borderRadius="2xl"
          shadow="lg"
        >
          <Heading as="h3" fontSize="xl" fontWeight="black" mb={4}>
            Plan Działania
          </Heading>
          <Stack gap={3}>
            <Flex align="center" gap={3}>
              <Box w={2} h={2} rounded="full" bg="blue.500" />
              <Text fontWeight="bold" color="fg.muted">Zakończenie fazy prototypowania</Text>
            </Flex>
            <Flex align="center" gap={3}>
              <Box w={2} h={2} rounded="full" bg="purple.500" />
              <Text fontWeight="bold" color="fg.muted">Rozpoczęcie masowej produkcji</Text>
            </Flex>
            <Flex align="center" gap={3}>
              <Box w={2} h={2} rounded="full" bg="teal.500" />
              <Text fontWeight="bold" color="fg.muted">Wysyłka pierwszych zamówień</Text>
            </Flex>
          </Stack>
        </Box>
      </SimpleGrid>
    </Stack>
  )
}

export default ProjectStory
