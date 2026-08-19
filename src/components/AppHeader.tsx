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
  Container,
  Badge
} from '@mantine/core';
import { IconSparkles, IconSun, IconMoon } from '@tabler/icons-react';
import { CardOptions } from '../types.ts';
import { PRESET_THEMES, PresetTheme } from '../data/presets.ts';

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

  const handleApplyPreset = (preset: PresetTheme) => {
    setOptions((prev) => {
      const updated = {
        ...prev,
        background: { ...prev.background, ...preset.background },
        border: { ...prev.border, ...preset.border },
        titleFont: { ...prev.titleFont, ...preset.titleFont },
        ...('descriptionFont' in prev
          ? { descriptionFont: { ...prev.descriptionFont, ...preset.descriptionFont } }
          : {})
      } as CardOptions;
      return updated;
    });
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
          <Group gap="xs">
            <Title order={1} size="h3" style={{ letterSpacing: '-0.5px' }}>
              Project Title Card
            </Title>
            <Badge variant="light" color="blue" size="sm">
              Visual Studio
            </Badge>
          </Group>

          <Group gap="sm">
            <Menu shadow="md" width={220} position="bottom-end">
              <Menu.Target>
                <Button
                  variant="default"
                  size="sm"
                  leftSection={<IconSparkles size={16} aria-hidden="true" />}
                  aria-label="Select a style theme preset"
                  aria-haspopup="menu"
                >
                  Style Themes
                </Button>
              </Menu.Target>

              <Menu.Dropdown aria-label="Style Theme Presets">
                <Menu.Label>Theme Presets</Menu.Label>
                {PRESET_THEMES.map((preset) => (
                  <Menu.Item
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
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
