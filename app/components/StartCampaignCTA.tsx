"use client"

import React from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
  Flex,
} from "@chakra-ui/react"

const StartCampaignCTA = () => {
  return (
    <Container maxW="container.xl" py={24}>
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="3xl"
        bg="blue.600"
        px={6}
        py={20}
        textAlign="center"
        shadow="2xl"
      >
        {/* Decorative background effects */}
        <Box
          position="absolute"
          top={0}
          left={0}
          width="full"
          height="full"
          zIndex={0}
          opacity={0.3}
          pointerEvents="none"
        >
          <Box
            position="absolute"
            top={0}
            right={0}
            width="40%"
            height="40%"
            bg="white"
            borderRadius="full"
            filter="blur(100px)"
          />
          <Box
            position="absolute"
            bottom={0}
            left={0}
            width="30%"
            height="30%"
            bg="blue.300"
            borderRadius="full"
            filter="blur(100px)"
          />
        </Box>

        <Stack gap={6} position="relative" zIndex={1} maxW="2xl" mx="auto">
          <Heading
            as="h2"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="black"
            letterSpacing="tight"
            color="white"
            lineHeight="shorter"
          >
            Masz Wielki Pomysł? <br />
            Zacznij Już Dzisiaj.
          </Heading>
          <Text fontSize="lg" lineHeight="tall" color="blue.100" fontWeight="medium">
            Dołącz do tysięcy twórców, którzy zrealizowali swoje marzenia dzięki naszej społeczności.
            Zapewniamy narzędzia, których potrzebujesz, aby odnieść sukces.
          </Text>
          <Flex direction={{ base: "column", sm: "row" }} gap={6} justify="center" align="center" mt={4}>
            <Button
              bg="white"
              color="blue.600"
              size="xl"
              px={10}
              rounded="xl"
              fontWeight="black"
              _hover={{ scale: 1.05 }}
              _active={{ scale: 0.95 }}
            >
              Rozpocznij Zbiórkę
            </Button>
            <Button
              variant="ghost"
              color="white"
              fontWeight="bold"
              _hover={{ textDecoration: "underline", bg: "white/10" }}
            >
              Dowiedz się więcej →
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Container>
  )
}

export default StartCampaignCTA
