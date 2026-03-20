"use client"

import React from 'react'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Link,
  useDisclosure,
  Stack,
  Container,
} from "@chakra-ui/react"
import { LuMenu, LuX } from "react-icons/lu"
import { ColorModeButton } from "@/components/ui/color-mode"

const Links = [
  { name: 'Story', href: '#story' },
  { name: 'Rewards', href: '#rewards' },
  { name: 'Updates', href: '#updates' },
]

const NavLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: 'gray.100',
      _dark: { bg: 'gray.700' },
    }}
    href={href}
    fontWeight="medium"
  >
    {children}
  </Link>
)

export default function Navbar() {
  const { open, onToggle } = useDisclosure()

  return (
    <Box
      bg="bg.panel"
      px={4}
      position="sticky"
      top={0}
      zIndex={50}
      borderBottomWidth="1px"
      backdropFilter="blur(10px)"
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={onToggle}
            variant="ghost"
          >
            {open ? <LuX /> : <LuMenu />}
          </IconButton>
          <HStack gap={8} alignItems={'center'}>
            <Link
              color="blue.600"
              fontWeight="black"
              fontSize="xl"
              letterSpacing="tighter"
              href="/"
              _hover={{ textDecoration: 'none' }}
            >
              CROWDFUND
            </Link>
            <HStack as={'nav'} gap={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.name} href={link.href}>{link.name}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'} gap={4}>
            <ColorModeButton />
            <Button
              variant="ghost"
              size="sm"
              fontWeight="bold"
              display={{ base: 'none', md: 'inline-flex' }}
            >
              Log in
            </Button>
            <Button
              colorPalette="blue"
              size={{ base: 'sm', md: 'md' }}
              fontWeight="black"
              rounded="xl"
            >
              Back Project
            </Button>
          </Flex>
        </Flex>

        {open ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} gap={4}>
              {Links.map((link) => (
                <NavLink key={link.name} href={link.href}>{link.name}</NavLink>
              ))}
              <Button variant="ghost" size="sm" justifyContent="flex-start">Log in</Button>
            </Stack>
          </Box>
        ) : null}
      </Container>
    </Box>
  )
}
