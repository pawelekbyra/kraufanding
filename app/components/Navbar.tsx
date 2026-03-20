'use client';

import React from 'react';
import {
  Group,
  Button,
  Container,
  Anchor,
  Box,
  Burger,
  Drawer,
  Stack,
  rem,
  Text
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const Navbar = () => {
  const [opened, { toggle, close }] = useDisclosure(false);

  const links = [
    { link: '#story', label: 'Story' },
    { link: '#rewards', label: 'Rewards' },
    { link: '#updates', label: 'Updates' },
  ];

  const items = links.map((link) => (
    <Anchor
      key={link.label}
      href={link.link}
      c="dimmed"
      fw={700}
      fz="sm"
      style={{ textDecoration: 'none' }}
      onClick={() => close()}
    >
      {link.label}
    </Anchor>
  ));

  return (
    <Box
      component="nav"
      pos="sticky"
      top={0}
      style={{
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: `${rem(1)} solid var(--mantine-color-gray-2)`
      }}
    >
      <Container size="lg" h={rem(64)}>
        <Group justify="space-between" h="100%">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Anchor
              href="/"
              underline="never"
              c="blue"
              fw={900}
              fz="xl"
              style={{ letterSpacing: rem(-1) }}
            >
              CROWDFUND
            </Anchor>
          </Group>

          <Group gap={rem(32)} visibleFrom="sm">
            {items}
          </Group>

          <Group gap="sm">
            <Button variant="subtle" fw={700} size="sm" visibleFrom="xs">
              Log in
            </Button>
            <Button radius="md" fw={900} size="sm">
              Back Project
            </Button>
          </Group>
        </Group>
      </Container>

      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000}
      >
        <Stack gap="md">
          {items}
          <Button variant="subtle" fw={700} fullWidth>
            Log in
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
};

export default Navbar;
