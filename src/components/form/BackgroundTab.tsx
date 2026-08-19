import React, { useRef } from 'react';
import {
  Stack,
  Box,
  Group,
  Text,
  SegmentedControl,
  ColorInput,
  Button,
  TextInput,
  FileButton,
  Badge
} from '@mantine/core';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { CardOptions, BackgroundType, GradientDirection } from '../../types.ts';
import { FieldGuide } from '../FieldGuide.tsx';
import { SliderControl } from '../SliderControl.tsx';
import {
  GRADIENT_PRESETS,
  COLOR_SWATCHES,
  GradientPreset
} from '../../data/suggestions.ts';

interface BackgroundTabProps {
  options: CardOptions;
  setOptions: React.Dispatch<React.SetStateAction<CardOptions>>;
}

export const BackgroundTab: React.FC<BackgroundTabProps> = ({ options, setOptions }) => {
  const bgFileResetRef = useRef<() => void>(null);
  const isBgDataUrl = options.background?.imageUrl?.startsWith('data:');

  const handleApplyGradientPreset = (preset: GradientPreset) => {
    setOptions((prev) => ({
      ...prev,
      background: {
        ...prev.background,
        type: 'gradient',
        gradientStart: preset.start,
        gradientMiddle: preset.middle,
        gradientEnd: preset.end,
        gradientDirection: preset.direction || prev.background.gradientDirection || 'to-br'
      }
    }));
  };

  const handleBgImageUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const dataUrl = reader.result;
        setOptions((prev) => ({
          ...prev,
          background: {
            ...prev.background,
            type: 'image',
            imageUrl: dataUrl
          }
        }));
      }
      bgFileResetRef.current?.();
    };
    reader.onerror = () => {
      bgFileResetRef.current?.();
    };
    reader.readAsDataURL(file);
  };

  return (
    <Stack gap="md">
      {/* Background Type */}
      <Box>
        <Group justify="space-between" align="center" mb={4}>
          <Group gap={4}>
            <Text size="sm" fw={600}>
              Background Mode
            </Text>
            <FieldGuide fieldKey="background" />
          </Group>
        </Group>
        <SegmentedControl
          fullWidth
          value={options.background?.type || 'solid'}
          onChange={(val) =>
            setOptions((prev) => ({
              ...prev,
              background: {
                ...prev.background,
                type: val as BackgroundType
              }
            }))
          }
          data={[
            { label: 'Solid Color', value: 'solid' },
            { label: 'Gradient', value: 'gradient' },
            { label: 'Frosted Glass', value: 'glass' },
            { label: 'Custom Image', value: 'image' }
          ]}
        />
      </Box>

      {/* 1. SOLID / GLASS COLOR */}
      {(options.background?.type === 'solid' || options.background?.type === 'glass') && (
        <Box>
          <ColorInput
            label="Background Color"
            value={options.background?.color || '#0f172a'}
            onChange={(val) =>
              setOptions((prev) => ({
                ...prev,
                background: { ...prev.background, color: val }
              }))
            }
            swatches={COLOR_SWATCHES}
          />
        </Box>
      )}

      {/* 2. GRADIENT CONTROLS */}
      {options.background?.type === 'gradient' && (
        <Stack gap="sm">
          {/* Gradient Preset Chips */}
          <Box>
            <Text size="xs" fw={600} mb="xs" c="dimmed">
              Popular Gradient Themes:
            </Text>
            <Group gap="xs">
              {GRADIENT_PRESETS.map((p) => (
                <Button
                  key={p.id}
                  size="compact-xs"
                  variant="light"
                  color="blue"
                  leftSection={
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${p.start}, ${p.end})`
                      }}
                    />
                  }
                  onClick={() => handleApplyGradientPreset(p)}
                >
                  {p.name}
                </Button>
              ))}
            </Group>
          </Box>

          {/* Gradient Direction */}
          <Box>
            <Text size="xs" fw={600} mb={4} c="dimmed">
              Gradient Direction
            </Text>
            <SegmentedControl
              fullWidth
              size="xs"
              value={options.background?.gradientDirection || 'to-br'}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  background: {
                    ...prev.background,
                    gradientDirection: val as GradientDirection
                  }
                }))
              }
              data={[
                { label: '→ Right', value: 'to-r' },
                { label: '↘ Diagonal', value: 'to-br' },
                { label: '↓ Down', value: 'to-b' },
                { label: '↙ Left-Down', value: 'to-bl' },
                { label: '◉ Radial', value: 'radial' }
              ]}
            />
          </Box>

          {/* Gradient Stops */}
          <Group grow align="flex-start">
            <ColorInput
              label="Start Color"
              value={options.background?.gradientStart || '#ea580c'}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  background: { ...prev.background, gradientStart: val }
                }))
              }
              swatches={COLOR_SWATCHES}
            />
            <ColorInput
              label="Middle Color (Optional)"
              value={options.background?.gradientMiddle || ''}
              placeholder="None"
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  background: { ...prev.background, gradientMiddle: val || undefined }
                }))
              }
              swatches={COLOR_SWATCHES}
            />
            <ColorInput
              label="End Color"
              value={options.background?.gradientEnd || '#7c3aed'}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  background: { ...prev.background, gradientEnd: val }
                }))
              }
              swatches={COLOR_SWATCHES}
            />
          </Group>
        </Stack>
      )}

      {/* 3. CUSTOM BACKGROUND IMAGE CONTROLS */}
      {options.background?.type === 'image' && (
        <Stack gap="sm">
          <Box>
            <Group justify="space-between" align="center" mb={4}>
              <Group gap={4}>
                <Text size="xs" fw={600} c="dimmed">
                  Background Image Source
                </Text>
                {isBgDataUrl && (
                  <Badge size="xs" variant="light" color="indigo" leftSection={<IconPhoto size={10} />}>
                    Uploaded File
                  </Badge>
                )}
              </Group>
              {options.background?.imageUrl && (
                <Button
                  size="compact-xs"
                  variant="subtle"
                  color="red"
                  leftSection={<IconX size={12} />}
                  onClick={() =>
                    setOptions((prev) => ({
                      ...prev,
                      background: { ...prev.background, imageUrl: '' }
                    }))
                  }
                >
                  Clear Image
                </Button>
              )}
            </Group>

            <TextInput
              id="bgImageUrl"
              value={options.background?.imageUrl || ''}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  background: { ...prev.background, imageUrl: e.currentTarget.value }
                }))
              }
              placeholder="Paste background image URL or upload image file..."
              rightSection={
                <FileButton resetRef={bgFileResetRef} onChange={handleBgImageUpload} accept="image/*">
                  {(props) => (
                    <Button
                      {...props}
                      size="xs"
                      variant="light"
                      leftSection={<IconUpload size={14} aria-hidden="true" />}
                    >
                      Upload
                    </Button>
                  )}
                </FileButton>
              }
              rightSectionWidth={95}
            />
          </Box>

          <SliderControl
            label="Image Opacity"
            value={Math.round((options.background?.imageOpacity ?? 1) * 100)}
            min={10}
            max={100}
            step={5}
            unit="%"
            presets={[30, 50, 75, 100]}
            onChange={(val) =>
              setOptions((prev) => ({
                ...prev,
                background: { ...prev.background, imageOpacity: val / 100 }
              }))
            }
            labelSize="xs"
          />

          <Group grow align="flex-start">
            <ColorInput
              label="Overlay Tint Color (Contrast)"
              value={options.background?.overlayColor || '#0f172a'}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  background: { ...prev.background, overlayColor: val }
                }))
              }
              swatches={COLOR_SWATCHES}
            />

            <SliderControl
              label="Tint Overlay Opacity"
              value={Math.round((options.background?.overlayOpacity ?? 0.4) * 100)}
              min={0}
              max={95}
              step={5}
              unit="%"
              presets={[0, 25, 50, 75]}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  background: { ...prev.background, overlayOpacity: val / 100 }
                }))
              }
              labelSize="xs"
            />
          </Group>
        </Stack>
      )}

      {/* Global Background Opacity */}
      <SliderControl
        label="Background Opacity"
        value={Math.round((options.background?.opacity ?? 1) * 100)}
        min={10}
        max={100}
        step={5}
        unit="%"
        presets={[25, 50, 75, 100]}
        onChange={(val) =>
          setOptions((prev) => ({
            ...prev,
            background: { ...prev.background, opacity: val / 100 }
          }))
        }
        labelSize="xs"
      />
    </Stack>
  );
};
