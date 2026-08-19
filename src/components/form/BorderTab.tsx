import React from 'react';
import {
  Stack,
  Box,
  Group,
  Text,
  SegmentedControl,
  ColorInput,
  Divider
} from '@mantine/core';
import { CardOptions, BorderStyle, ShadowEffect } from '../../types.ts';
import { FieldGuide } from '../FieldGuide.tsx';
import { SliderControl } from '../SliderControl.tsx';
import { COLOR_SWATCHES } from '../../data/suggestions.ts';

interface BorderTabProps {
  options: CardOptions;
  setOptions: React.Dispatch<React.SetStateAction<CardOptions>>;
}

export const BorderTab: React.FC<BorderTabProps> = ({ options, setOptions }) => {
  return (
    <Stack gap="md">
      {/* Border Style & Width */}
      <Group grow align="flex-start">
        <Box>
          <Group justify="space-between" align="center" mb={4}>
            <Group gap={4}>
              <Text size="sm" fw={600}>
                Border Style
              </Text>
              <FieldGuide fieldKey="border" />
            </Group>
          </Group>
          <SegmentedControl
            fullWidth
            size="xs"
            value={options.border?.style || 'solid'}
            onChange={(val) =>
              setOptions((prev) => ({
                ...prev,
                border: { ...prev.border, style: val as BorderStyle }
              }))
            }
            data={[
              { label: 'Solid', value: 'solid' },
              { label: 'Dashed', value: 'dashed' },
              { label: 'Dotted', value: 'dotted' },
              { label: 'None', value: 'none' }
            ]}
          />
        </Box>

        <SliderControl
          label="Border Thickness"
          value={options.border?.width ?? 2}
          min={0}
          max={16}
          step={1}
          presets={[0, 1, 2, 4]}
          onChange={(val) =>
            setOptions((prev) => ({
              ...prev,
              border: { ...prev.border, width: val }
            }))
          }
          labelSize="xs"
        />
      </Group>

      {/* Border Color */}
      <ColorInput
        label="Border Color"
        value={options.border?.color || '#334155'}
        onChange={(val) =>
          setOptions((prev) => ({
            ...prev,
            border: { ...prev.border, color: val }
          }))
        }
        swatches={COLOR_SWATCHES}
      />

      {/* Border Radius & Margin */}
      <Group grow align="flex-start">
        <SliderControl
          label="Border Corner Radius"
          value={options.border?.radius ?? 16}
          min={0}
          max={60}
          step={2}
          presets={[0, 8, 16, 24, 32]}
          onChange={(val) =>
            setOptions((prev) => ({
              ...prev,
              border: { ...prev.border, radius: val }
            }))
          }
          labelSize="xs"
        />

        <SliderControl
          label="Border Margin"
          value={options.border?.margin ?? 10}
          min={0}
          max={40}
          step={2}
          presets={[0, 5, 10, 15, 20]}
          onChange={(val) =>
            setOptions((prev) => ({
              ...prev,
              border: { ...prev.border, margin: val }
            }))
          }
          labelSize="xs"
        />
      </Group>

      <Divider />

      {/* Shadow & Glow Effects */}
      <Box>
        <Group justify="space-between" align="center" mb={4}>
          <Group gap={4}>
            <Text size="sm" fw={600}>
              Shadow & Glow Effect
            </Text>
            <FieldGuide fieldKey="shadow" />
          </Group>
        </Group>
        <SegmentedControl
          fullWidth
          size="xs"
          value={options.border?.shadow || 'soft'}
          onChange={(val) =>
            setOptions((prev) => ({
              ...prev,
              border: { ...prev.border, shadow: val as ShadowEffect }
            }))
          }
          data={[
            { label: 'None', value: 'none' },
            { label: 'Subtle', value: 'subtle' },
            { label: 'Soft Shadow', value: 'soft' },
            { label: 'Deep Shadow', value: 'strong' },
            { label: 'Neon Glow', value: 'glow' }
          ]}
        />
      </Box>

      {/* Glow Color Input if Neon Glow selected */}
      {options.border?.shadow === 'glow' && (
        <ColorInput
          label="Glow Tint Color"
          value={options.border?.glowColor || options.border?.color || '#06b6d4'}
          onChange={(val) =>
            setOptions((prev) => ({
              ...prev,
              border: { ...prev.border, glowColor: val }
            }))
          }
          swatches={COLOR_SWATCHES}
        />
      )}
    </Stack>
  );
};
