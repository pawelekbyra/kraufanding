"use client"

import React from 'react'
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Stack,
  Button,
  VStack,
} from "@chakra-ui/react"
import { Avatar } from "@/components/ui/avatar"
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion"
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import ProjectTabs from './components/ProjectTabs'
import Rewards from './components/Rewards'
import Footer from './components/Footer'
import { mockCampaigns } from './data/mock-campaigns'

export default function Home() {
  const campaign = mockCampaigns.find(c => c.id === 'secret-project') || mockCampaigns[0]

  return (
    <Box minH="screen" bg="bg.muted">
      <Navbar />

      <Box as="main">
        <Hero campaign={campaign} />
        <Stats />

        <Container maxW="container.xl" py={20}>
          <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={16} alignItems="flex-start">
            {/* Main Content Area */}
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <Stack gap={12} id="story">
                <ProjectTabs campaign={campaign} />
              </Stack>
            </GridItem>

            {/* Sidebar */}
            <GridItem position={{ lg: "sticky" }} top={{ lg: 28 }}>
              <Stack gap={8}>
                <Box id="rewards">
                  <Rewards rewards={campaign.rewards || []} />
                </Box>

                <Box
                  p={8}
                  bg="bg.panel"
                  borderWidth="1px"
                  borderColor="border"
                  borderRadius="2xl"
                  shadow="xl"
                >
                  <Heading as="h3" fontSize="xl" fontWeight="black" mb={6}>
                    O Autorze
                  </Heading>
                  <Stack gap={4} align="center" direction="row" mb={4}>
                    <Avatar
                      name={campaign.author}
                      fallback="IP"
                      bg="blue.600"
                      color="white"
                      size="lg"
                    />
                    <Box>
                      <Heading as="h4" fontSize="lg" fontWeight="black">
                        {campaign.author}
                      </Heading>
                      <Text fontSize="2xs" fontWeight="black" color="fg.subtle" textTransform="uppercase" letterSpacing="widest">
                        12 Zrealizowanych Projektów
                      </Text>
                    </Box>
                  </Stack>
                  <Text fontSize="sm" color="fg.muted" fontWeight="medium" lineHeight="relaxed" mb={6}>
                    Jesteśmy grupą inżynierów i projektantów, których misją jest tworzenie technologii jutra dostępnej już dziś.
                  </Text>
                  <Button variant="outline" width="full" rounded="xl" fontWeight="black">
                    Kontakt z Autorem
                  </Button>
                </Box>
              </Stack>
            </GridItem>
          </Grid>
        </Container>

        {/* FAQ Section */}
        <Box py={24} borderTopWidth="1px" borderColor="border" bg="bg.panel">
          <Container maxW="container.md">
            <Heading as="h2" fontSize="3xl" fontWeight="black" textAlign="center" mb={16}>
              Często Zadawane Pytania
            </Heading>
            <AccordionRoot defaultValue={["item-0"]} collapsible>
              {[
                { q: "Kiedy otrzymam swój produkt?", a: "Pierwsze wysyłki planowane są na początek 2025 roku." },
                { q: "Czy wysyłka jest darmowa?", a: "Tak, dla wszystkich wspierających na poziomie 'Wczesny Ptak' i wyższym." },
                { q: "Czy mogę zrezygnować ze wsparcia?", a: "Możesz zrezygnować w dowolnym momencie przed zakończeniem kampanii." }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} mb={4} borderBottomWidth="1px" borderColor="border">
                  <AccordionItemTrigger py={4} fontSize="xl" fontWeight="black" _hover={{ bg: "transparent" }}>
                    {faq.q}
                  </AccordionItemTrigger>
                  <AccordionItemContent pb={6}>
                    <Text color="fg.muted" fontWeight="medium">
                      {faq.a}
                    </Text>
                  </AccordionItemContent>
                </AccordionItem>
              ))}
            </AccordionRoot>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}
