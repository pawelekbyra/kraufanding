"use client"

import React from 'react'
import {
  Box,
  Heading,
  Text,
  Stack,
  Button,
  Badge,
  Flex,
  VStack,
  HStack,
} from "@chakra-ui/react"
import { Reward } from '../types/campaign'

interface RewardsProps {
  rewards: Reward[]
}

const Rewards: React.FC<RewardsProps> = ({ rewards }) => {
  return (
    <Stack gap={6}>
      <Heading as="h2" fontSize="2xl" fontWeight="black" mb={2}>
        Wybierz Nagrodę
      </Heading>
      {rewards.map((reward) => (
        <Box
          key={reward.id}
          p={6}
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border"
          borderRadius="2xl"
          shadow="sm"
          transition="all 0.3s"
          cursor="pointer"
          _hover={{
            shadow: "xl",
            transform: "scale(1.02)",
            borderColor: "blue.500",
          }}
          role="group"
        >
          <VStack align="flex-start" gap={4}>
            <Flex justify="space-between" width="full" align="flex-start">
              <Box>
                <Heading
                  as="h3"
                  fontSize="lg"
                  fontWeight="bold"
                  _groupHover={{ color: "blue.600" }}
                  transition="colors 0.3s"
                >
                  {reward.title}
                </Heading>
                <Text fontSize="2xl" fontWeight="black" color="blue.600" mt={1}>
                  {reward.amount.toLocaleString()} PLN
                </Text>
              </Box>
              <Badge
                variant="outline"
                colorPalette="purple"
                px={2}
                py={1}
                rounded="md"
                fontSize="2xs"
                fontWeight="black"
              >
                {reward.backers} wspierających
              </Badge>
            </Flex>

            <Text fontSize="sm" color="fg.muted" lineHeight="tall">
              {reward.description}
            </Text>

            <Box width="full" pt={4} borderTopWidth="1px" borderColor="border">
              <Text
                fontSize="2xs"
                fontWeight="black"
                color="fg.subtle"
                textTransform="uppercase"
                letterSpacing="widest"
                mb={1}
              >
                Przewidywana Dostawa
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                {reward.deliveryDate}
              </Text>
            </Box>

            <Button
              colorPalette="blue"
              width="full"
              mt={2}
              rounded="xl"
              fontWeight="black"
            >
              Wybierz Tę Nagrodę
            </Button>
          </VStack>
        </Box>
      ))}
    </Stack>
  )
}

export default Rewards
