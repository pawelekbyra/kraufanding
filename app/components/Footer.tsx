"use client"

import React from 'react'
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Input,
  Button,
  Link,
  Flex,
} from "@chakra-ui/react"

const Footer = () => {
  return (
    <Box as="footer" bg="bg.panel" borderTopWidth="1px" borderColor="border" py={16}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={8}>
          <Stack gap={4}>
            <Text fontWeight="black" textTransform="uppercase" letterSpacing="widest" fontSize="sm">
              Serwisy
            </Text>
            <Link fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ color: "blue.600" }}>Branding</Link>
            <Link fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ color: "blue.600" }}>Design</Link>
            <Link fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ color: "blue.600" }}>Marketing</Link>
            <Link fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ color: "blue.600" }}>Reklama</Link>
          </Stack>

          <Stack gap={4}>
            <Text fontWeight="black" textTransform="uppercase" letterSpacing="widest" fontSize="sm">
              Firma
            </Text>
            <Link fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ color: "blue.600" }}>O nas</Link>
            <Link fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ color: "blue.600" }}>Kontakt</Link>
            <Link fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ color: "blue.600" }}>Praca</Link>
            <Link fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ color: "blue.600" }}>Prasowe</Link>
          </Stack>

          <Stack gap={4}>
            <Text fontWeight="black" textTransform="uppercase" letterSpacing="widest" fontSize="sm">
              Prawne
            </Text>
            <Link fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ color: "blue.600" }}>Regulamin</Link>
            <Link fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ color: "blue.600" }}>Polityka prywatności</Link>
            <Link fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ color: "blue.600" }}>Cookie policy</Link>
          </Stack>

          <Stack gap={4}>
            <Text fontWeight="black" textTransform="uppercase" letterSpacing="widest" fontSize="sm">
              Newsletter
            </Text>
            <Text fontSize="xs" fontWeight="bold" color="fg.subtle" textTransform="uppercase">
              Wpisz swój email
            </Text>
            <Flex gap={0}>
              <Input
                placeholder="Twoje email"
                borderRightRadius="none"
                bg="bg.muted"
                borderWidth="1px"
                borderColor="border"
              />
              <Button
                colorPalette="blue"
                borderLeftRadius="none"
                fontWeight="black"
              >
                Subskrybuj
              </Button>
            </Flex>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default Footer
