import React from 'react';
import {
  Group,
  Title,
  Button,
  Menu,
  ActionIcon,
  Tooltip,
  useMantineColorScheme,
  useComputedColorScheme,
  Container
} from '@mantine/core';
import { IconSparkles, IconSun, IconMoon } from '@tabler/icons-react';
import { CardOptions } from '../types';
import { PRESETS } from '../data/presets';

interface AppHeaderProps {
  setOptions: React.Dispatch<React.SetStateAction<CardOptions>>;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ setOptions }) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const isDark = computedColorScheme === 'dark';

  const toggleColorScheme = () => {
    setColorScheme(isDark ? 'light' : 'dark');
  };

  const handleApplyPreset = (presetOptions: Partial<CardOptions>) => {
    setOptions((prev) => ({
      ...prev,
      ...presetOptions
    }));
  };

  return (
    <header
      role="banner"
      style={{
        borderBottom: '1px solid var(--mantine-color-default-border)',
        backgroundColor: 'var(--mantine-color-body)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <Container size="xl" py="sm">
        <Group justify="space-between" align="center">
          <Title order={1} size="h3" style={{ letterSpacing: '-0.5px' }}>
            Project Title Card
          </Title>

          <Group gap="sm">
            <Menu shadow="md" width={220} position="bottom-end">
              <Menu.Target>
                <Button
                  variant="default"
                  size="sm"
                  leftSection={<IconSparkles size={16} aria-hidden="true" />}
                  aria-label="Select a style preset"
                  aria-haspopup="menu"
                >
                  Presets
                </Button>
              </Menu.Target>

              <Menu.Dropdown aria-label="Style Presets">
                <Menu.Label>Style Presets</Menu.Label>
                {PRESETS.map((preset) => (
                  <Menu.Item
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.options)}
                    role="menuitem"
                  >
                    {preset.name}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>

            <Tooltip
              label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              withArrow
            >
              <ActionIcon
                onClick={toggleColorScheme}
                variant="default"
                size="lg"
                aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {isDark ? (
                  <IconSun size={18} stroke={1.5} aria-hidden="true" />
                ) : (
                  <IconMoon size={18} stroke={1.5} aria-hidden="true" />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Container>
    </header>
  );
};
