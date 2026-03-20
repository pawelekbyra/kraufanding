'use client';

import React from 'react';
import {
  Container,
  Grid,
  Stack,
  Paper,
  Title,
  Text,
  Avatar,
  Button,
  Group,
  Accordion,
  Box,
  rem
} from '@mantine/core';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import ProjectTabs from './components/ProjectTabs';
import Rewards from './components/Rewards';
import Footer from './components/Footer';
import { mockCampaigns } from './data/mock-campaigns';

export default function Home() {
  const campaign = mockCampaigns.find(c => c.id === 'secret-project') || mockCampaigns[0];

  return (
    <Box mih="100vh" bg="white">
      <Navbar />

      <main>
        <Hero campaign={campaign} />
        <Stats />

        <Container size="lg" py={rem(96)}>
          <Grid gutter={rem(64)}>
            {/* Main Content Area */}
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Stack gap={rem(48)}>
                <Box id="story">
                  <ProjectTabs campaign={campaign} />
                </Box>
              </Stack>
            </Grid.Col>

            {/* Sidebar */}
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Stack gap="xl" pos={{ lg: 'sticky' }} top={rem(112)}>
                <Box id="rewards">
                  <Rewards rewards={campaign.rewards || []} />
                </Box>

                <Paper withBorder p="xl" radius="md" shadow="sm">
                  <Stack gap="lg">
                    <Title order={3} size="xl" fw={900}>
                      O Autorze
                    </Title>
                    <Group gap="md">
                      <Avatar color="blue" radius="xl" size="lg">
                        IP
                      </Avatar>
                      <Box>
                        <Text fw={900} size="lg">
                          {campaign.author}
                        </Text>
                        <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={rem(1)}>
                          12 zrealizowanych projektów
                        </Text>
                      </Box>
                    </Group>
                    <Text size="sm" fw={500} c="dimmed" style={{ lineHeight: 1.6 }}>
                      Jesteśmy grupą inżynierów i projektantów, których misją jest tworzenie technologii jutra dostępnej już dziś.
                    </Text>
                    <Button variant="outline" fullWidth size="md" radius="md" fw={900}>
                      Kontakt z Autorem
                    </Button>
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>

        {/* FAQ Section */}
        <Box component="section" py={rem(96)} style={{ borderTop: `${rem(1)} solid var(--mantine-color-gray-2)` }}>
          <Container size="md">
            <Title order={2} size={rem(32)} fw={900} ta="center" mb={rem(64)}>
              Często Zadawane Pytania
            </Title>
            <Accordion variant="separated" radius="md">
              {[
                { q: "Kiedy otrzymam swój produkt?", a: "Pierwsze wysyłki planowane są na początek 2025 roku." },
                { q: "Czy wysyłka jest darmowa?", a: "Tak, dla wszystkich wspierających na poziomie 'Wczesny Ptak' i wyższym." },
                { q: "Czy mogę zrezygnować ze wsparcia?", a: "Możesz zrezygnować w dowolnym momencie przed zakończeniem kampanii." }
              ].map((faq, i) => (
                <Accordion.Item key={i} value={faq.q}>
                  <Accordion.Control fw={900} fz="lg" p="xl">
                    {faq.q}
                  </Accordion.Control>
                  <Accordion.Panel p="xl">
                    <Text size="md" fw={500} c="dimmed" style={{ lineHeight: 1.6 }}>
                      {faq.a}
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Container>
        </Box>
      </main>

      <Footer />
    </Box>
  );
}
