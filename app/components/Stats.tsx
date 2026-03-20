"use client"

import React from 'react'
import {
  Box,
  Container,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react"
import { LuUsers, LuClock, LuTarget } from "react-icons/lu"

interface StatCardProps {
  label: string
  value: string
  description: string
  icon: any
  colorPalette: string
}

const StatCard = ({ label, value, description, icon, colorPalette }: StatCardProps) => (
  <Box
    p={6}
    bg="bg.panel"
    borderWidth="1px"
    borderColor="border"
    borderRadius="2xl"
    shadow="sm"
    transition="all 0.3s"
    _hover={{ shadow: "md", transform: "translateY(-2px)" }}
  >
    <HStack gap={4} align="flex-start">
      <Box
        p={3}
        bg={`${colorPalette}.50`}
        _dark={{ bg: `${colorPalette}.900/20` }}
        borderRadius="xl"
        color={`${colorPalette}.600`}
      >
        <Icon as={icon} boxSize={6} />
      </Box>
      <VStack align="flex-start" gap={0}>
        <Text fontSize="xs" fontWeight="bold" color="fg.subtle" textTransform="uppercase" letterSpacing="widest">
          {label}
        </Text>
        <Text fontSize="3xl" fontWeight="black" color={`${colorPalette}.600`}>
          {value}
        </Text>
        <Text fontSize="sm" fontWeight="medium" color="fg.subtle">
          {description}
        </Text>
      </VStack>
    </HStack>
  </Box>
)

const Stats = () => {
  return (
    <Box as="section" py={12} bg="bg.muted">
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          <StatCard
            label="Wspierających"
            value="1,240"
            description="Jan 1st - Feb 1st"
            icon={LuUsers}
            colorPalette="blue"
          />
          <StatCard
            label="Czas do końca"
            value="14 dni"
            description="Do 15 marca 2025"
            icon={LuClock}
            colorPalette="purple"
          />
          <StatCard
            label="Zrealizowano"
            value="85%"
            description="Cel: 100,000 PLN"
            icon={LuTarget}
            colorPalette="teal"
          />
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default Stats
