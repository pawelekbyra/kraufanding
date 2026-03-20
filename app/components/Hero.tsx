"use client"

import React from 'react'
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
  Image,
  Progress,
  Button,
  Badge,
  HStack,
  Icon,
} from "@chakra-ui/react"
import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import { Campaign } from '../types/campaign'

interface HeroProps {
  campaign: Campaign
}

const Hero: React.FC<HeroProps> = ({ campaign }) => {
  const percentage = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100)

  return (
    <Box as="section" position="relative" py={{ base: 12, md: 20 }} overflow="hidden" bg="bg.panel">
      {/* Decorative Grid */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
        opacity={0.05}
        pointerEvents="none"
        backgroundImage="radial-gradient(circle, currentColor 1px, transparent 1px)"
        backgroundSize="40px 40px"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <Flex direction={{ base: "column", lg: "row-reverse" }} gap={12} align="center">
          {/* Hero Image / Video */}
          <Box flex={1} position="relative" width="full" role="group">
            <Box
              position="absolute"
              inset={-4}
              bg="blue.500/10"
              filter="blur(40px)"
              rounded="3xl"
              transition="0.3s"
              _groupHover={{ bg: "blue.500/20" }}
            />
            <Box
              borderRadius="2xl"
              overflow="hidden"
              borderWidth="1px"
              borderColor="border"
              bg="bg.panel"
              shadow="2xl"
              position="relative"
            >
              <Image
                src={campaign.thumbnail}
                alt={campaign.title}
                width="full"
                height="auto"
                aspectRatio={16/10}
                objectFit="cover"
                transition="0.5s"
                _hover={{ scale: 1.05 }}
              />
              <Flex
                position="absolute"
                bottom={4}
                left={4}
                right={4}
                justify="space-between"
                align="center"
                pointerEvents="none"
              >
                <AvatarGroup size="sm" bg="white/80" _dark={{ bg: "black/60" }} p={1} rounded="full" backdropFilter="blur(8px)" border="1px solid" borderColor="border">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} src={`https://i.pravatar.cc/100?u=${i}`} />
                  ))}
                  <Avatar fallback="+1.2k" />
                </AvatarGroup>
                <Badge colorPalette="blue" px={3} py={1} rounded="md" fontWeight="bold">
                  {campaign.category}
                </Badge>
              </Flex>
            </Box>
          </Box>

          {/* Hero Content */}
          <Box flex={1} width="full">
            <Stack gap={6}>
              <Badge
                variant="outline"
                colorPalette="blue"
                alignSelf="flex-start"
                px={4}
                py={1}
                rounded="full"
                fontWeight="black"
                letterSpacing="widest"
              >
                ✨ WYRÓŻNIONY PROJEKT
              </Badge>
              <Heading
                as="h1"
                fontSize={{ base: "4xl", md: "6xl" }}
                fontWeight="black"
                lineHeight="shorter"
                letterSpacing="tight"
              >
                {campaign.title}
              </Heading>
              <Text fontSize="xl" color="fg.muted" lineHeight="tall" maxW="lg">
                {campaign.description}
              </Text>

              <Box
                p={6}
                bg="bg.surface"
                borderWidth="1px"
                borderColor="border"
                borderRadius="2xl"
                shadow="sm"
              >
                <Stack gap={4}>
                  <Flex justify="space-between" align="flex-end">
                    <Box>
                      <Text fontSize="3xl" fontWeight="black" color="blue.600" display="inline">
                        {campaign.raised.toLocaleString()} PLN
                      </Text>
                      <Text fontSize="sm" fontWeight="medium" color="fg.subtle" ml={2} display="inline">
                        z {campaign.goal.toLocaleString()} PLN
                      </Text>
                    </Box>
                    <Text fontSize="xl" fontWeight="black" color="blue.600">
                      {percentage}%
                    </Text>
                  </Flex>

                  <Progress.Root value={percentage} colorPalette="blue" size="lg" shape="rounded">
                    <Progress.Track bg="gray.100" _dark={{ bg: "gray.800" }}>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>

                  <Flex justify="space-between">
                    <Text fontSize="xs" fontWeight="bold" color="fg.subtle" textTransform="uppercase" letterSpacing="widest">
                      {campaign.raised.toLocaleString()} ZEBRANO
                    </Text>
                    <Text fontSize="xs" fontWeight="bold" color="fg.subtle" textTransform="uppercase" letterSpacing="widest">
                      CEL: {campaign.goal.toLocaleString()}
                    </Text>
                  </Flex>
                </Stack>
              </Box>

              <HStack gap={4} pt={4}>
                <Button
                  colorPalette="blue"
                  size="xl"
                  rounded="2xl"
                  px={10}
                  fontWeight="black"
                  shadow="lg"
                  _hover={{ scale: 1.02 }}
                  _active={{ scale: 0.98 }}
                >
                  Wesprzyj Projekt
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  rounded="2xl"
                  px={10}
                  fontWeight="black"
                  _hover={{ scale: 1.02 }}
                  _active={{ scale: 0.98 }}
                >
                  Udostępnij
                </Button>
              </HStack>
            </Stack>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default Hero
