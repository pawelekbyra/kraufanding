import React from 'react';
import { Container, Paper, Title, Text, Button, Group, Stack, rem, Box } from '@mantine/core';

const StartCampaignCTA = () => {
  return (
    <Container size="lg" py={rem(64)}>
      <Paper
        p={rem(64)}
        radius={rem(32)}
        bg="indigo.7"
        style={{
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center'
        }}
        shadow="xl"
      >
        <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.3, zIndex: 0 }}>
          <Box style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '40%', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', filter: 'blur(100px)' }} />
          <Box style={{ position: 'absolute', bottom: 0, left: 0, width: '30%', height: '30%', backgroundColor: 'rgba(96, 165, 250, 0.2)', borderRadius: '50%', filter: 'blur(100px)' }} />
        </Box>

        <Stack gap="xl" style={{ position: 'relative', zIndex: 1 }}>
          <Title order={2} size={rem(48)} fw={900} c="white" style={{ lineHeight: 1.1 }}>
            Masz Wielki Pomysł? <br />
            Zacznij Już Dzisiaj.
          </Title>
          <Text size="lg" fw={500} c="indigo.0" maw={rem(600)} mx="auto" style={{ lineHeight: 1.6 }}>
            Dołącz do tysięcy twórców, którzy zrealizowali swoje marzenia dzięki naszej społeczności.
            Zapewniamy narzędzia, których potrzebujesz, aby odnieść sukces.
          </Text>
          <Group justify="center" gap="lg" mt="lg">
            <Button variant="white" color="indigo.7" size="xl" radius="md" fw={900} px={rem(48)}>
              Rozpocznij Zbiórkę
            </Button>
            <Button variant="transparent" color="white" size="lg" fw={700}>
              Dowiedz się więcej →
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
};

export default StartCampaignCTA;
