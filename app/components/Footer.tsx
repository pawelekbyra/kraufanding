import React from 'react';
import {
  Container,
  SimpleGrid,
  Group,
  Text,
  Stack,
  Anchor,
  TextInput,
  Button,
  rem,
  Box,
  Title
} from '@mantine/core';

const Footer = () => {
  return (
    <Box component="footer" py={rem(64)} style={{ backgroundColor: 'var(--mantine-color-white)', borderTop: `${rem(1)} solid var(--mantine-color-gray-2)` }}>
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={rem(48)}>
          <Stack gap="md">
            <Title order={4} size="sm" fw={900} tt="uppercase" lts={rem(1)}>
              Serwisy
            </Title>
            <Stack gap={rem(8)}>
              <Anchor href="#" c="dimmed" size="sm" fw={500} underline="hover">Branding</Anchor>
              <Anchor href="#" c="dimmed" size="sm" fw={500} underline="hover">Design</Anchor>
              <Anchor href="#" c="dimmed" size="sm" fw={500} underline="hover">Marketing</Anchor>
              <Anchor href="#" c="dimmed" size="sm" fw={500} underline="hover">Reklama</Anchor>
            </Stack>
          </Stack>

          <Stack gap="md">
            <Title order={4} size="sm" fw={900} tt="uppercase" lts={rem(1)}>
              Firma
            </Title>
            <Stack gap={rem(8)}>
              <Anchor href="#" c="dimmed" size="sm" fw={500} underline="hover">O nas</Anchor>
              <Anchor href="#" c="dimmed" size="sm" fw={500} underline="hover">Kontakt</Anchor>
              <Anchor href="#" c="dimmed" size="sm" fw={500} underline="hover">Praca</Anchor>
              <Anchor href="#" c="dimmed" size="sm" fw={500} underline="hover">Prasowe</Anchor>
            </Stack>
          </Stack>

          <Stack gap="md">
            <Title order={4} size="sm" fw={900} tt="uppercase" lts={rem(1)}>
              Prawne
            </Title>
            <Stack gap={rem(8)}>
              <Anchor href="#" c="dimmed" size="sm" fw={500} underline="hover">Regulamin</Anchor>
              <Anchor href="#" c="dimmed" size="sm" fw={500} underline="hover">Polityka prywatności</Anchor>
              <Anchor href="#" c="dimmed" size="sm" fw={500} underline="hover">Cookie policy</Anchor>
            </Stack>
          </Stack>

          <Stack gap="md">
            <Title order={4} size="sm" fw={900} tt="uppercase" lts={rem(1)}>
              Newsletter
            </Title>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={rem(1)}>
              Wpisz swój email
            </Text>
            <Group gap="xs" grow>
              <TextInput placeholder="username@site.com" radius="md" size="md" />
              <Button radius="md" size="md" fw={900}>
                Subskrybuj
              </Button>
            </Group>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Footer;
