import React from 'react';
import {
  Stack,
  Box,
  Group,
  Text,
  SegmentedControl,
  TextInput,
  Textarea,
  Button,
  Divider,
  Paper
} from '@mantine/core';
import {
  CardOptions,
  GenerateType,
  StandardCardOptions,
  WideCardOptions,
  WidescreenCardOptions,
  BadgeCardOptions,
  TextAlign,
  WidescreenLayout
} from '../../types.ts';
import { FieldGuide } from '../FieldGuide.tsx';
import { SliderControl } from '../SliderControl.tsx';
import { ImageControls } from './ImageControls.tsx';
import {
  TITLE_SUGGESTIONS,
  DESCRIPTION_SUGGESTIONS
} from '../../data/suggestions.ts';

interface LayoutTabProps {
  options: CardOptions;
  setOptions: React.Dispatch<React.SetStateAction<CardOptions>>;
  onFormatChange: (format: GenerateType) => void;
}

export const LayoutTab: React.FC<LayoutTabProps> = ({
  options,
  setOptions,
  onFormatChange
}) => {
  return (
    <Stack gap="md">
      {/* 1. Layout Format */}
      <Box>
        <Group justify="space-between" align="center" mb={4}>
          <Group gap={4}>
            <Text size="sm" fw={600}>
              Layout Format
            </Text>
            <FieldGuide fieldKey="generateType" />
          </Group>
        </Group>
        <SegmentedControl
          fullWidth
          value={options.generateType}
          onChange={(val) => onFormatChange(val as GenerateType)}
          data={[
            { label: 'Card (Portrait)', value: 'card' },
            { label: 'Wide (Banner)', value: 'widecard' },
            { label: 'Widescreen (16:9)', value: 'widescreen' },
            { label: 'Badge', value: 'badge' }
          ]}
          aria-label="Select card dimensions layout"
        />
      </Box>

      {/* Format-Specific Layout Controls */}
      {options.generateType === 'card' && (
        <Box>
          <Text size="xs" fw={600} mb={4} c="dimmed">
            Text Alignment
          </Text>
          <SegmentedControl
            fullWidth
            size="xs"
            value={(options as StandardCardOptions).textAlign || 'center'}
            onChange={(val) =>
              setOptions((prev) => ({
                ...(prev as StandardCardOptions),
                textAlign: val as TextAlign
              }))
            }
            data={[
              { label: 'Centered', value: 'center' },
              { label: 'Left Aligned', value: 'left' }
            ]}
          />
        </Box>
      )}

      {options.generateType === 'widecard' && (
        <Box>
          <Text size="xs" fw={600} mb={4} c="dimmed">
            Logo Placement
          </Text>
          <SegmentedControl
            fullWidth
            size="xs"
            value={(options as WideCardOptions).imagePosition || 'left'}
            onChange={(val) =>
              setOptions((prev) => ({
                ...(prev as WideCardOptions),
                imagePosition: val as 'left' | 'right'
              }))
            }
            data={[
              { label: 'Logo on Left', value: 'left' },
              { label: 'Logo on Right', value: 'right' }
            ]}
          />
        </Box>
      )}

      {options.generateType === 'widescreen' && (
        <Box>
          <Text size="xs" fw={600} mb={4} c="dimmed">
            Widescreen Composition Style
          </Text>
          <SegmentedControl
            fullWidth
            size="xs"
            value={(options as WidescreenCardOptions).layoutStyle || 'split'}
            onChange={(val) =>
              setOptions((prev) => ({
                ...(prev as WidescreenCardOptions),
                layoutStyle: val as WidescreenLayout
              }))
            }
            data={[
              { label: 'Side-by-Side Split', value: 'split' },
              { label: 'Centered Stack', value: 'centered' },
              { label: 'Banner Showcase', value: 'banner' }
            ]}
          />
        </Box>
      )}

      {options.generateType === 'badge' && (
        <Paper p="sm" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-default-hover)' }}>
          <Stack gap="sm">
            <Text size="xs" fw={700} c="blue">
              Badge Style & Dimensions
            </Text>
            <Box>
              <Text size="xs" fw={600} mb={4} c="dimmed">
                Icon Placement
              </Text>
              <SegmentedControl
                fullWidth
                size="xs"
                value={(options as BadgeCardOptions).iconPosition || 'left'}
                onChange={(val) =>
                  setOptions((prev) => ({
                    ...(prev as BadgeCardOptions),
                    iconPosition: val as 'left' | 'right' | 'none'
                  }))
                }
                data={[
                  { label: 'Icon on Left', value: 'left' },
                  { label: 'Icon on Right', value: 'right' },
                  { label: 'No Icon', value: 'none' }
                ]}
              />
            </Box>
            <Group grow align="flex-start">
              <SliderControl
                label="Badge Width"
                fieldKey="badgeWidth"
                value={(options as BadgeCardOptions).badgeWidth || 400}
                min={120}
                max={1000}
                step={10}
                presets={[250, 320, 400, 500, 600]}
                onChange={(val) =>
                  setOptions((prev) => ({
                    ...(prev as BadgeCardOptions),
                    badgeWidth: val
                  }))
                }
                labelSize="xs"
              />
              <SliderControl
                label="Badge Height"
                fieldKey="badgeHeight"
                value={(options as BadgeCardOptions).badgeHeight || 120}
                min={40}
                max={300}
                step={5}
                presets={[60, 80, 100, 120, 160]}
                onChange={(val) =>
                  setOptions((prev) => ({
                    ...(prev as BadgeCardOptions),
                    badgeHeight: val
                  }))
                }
                labelSize="xs"
              />
            </Group>
          </Stack>
        </Paper>
      )}

      <Divider />

      {/* 2. Card Title */}
      <Box>
        <Group justify="space-between" align="center" mb={4}>
          <Group gap={4}>
            <Text size="sm" fw={600}>
              Title
            </Text>
            <FieldGuide fieldKey="title" />
          </Group>
        </Group>
        <TextInput
          id="title"
          name="title"
          value={options.title || ''}
          onChange={(e) =>
            setOptions((prev) => ({
              ...prev,
              title: e.currentTarget.value
            }))
          }
          placeholder="e.g. MaskedGUI"
        />
        <Group gap="xs" mt="xs">
          <Text size="xs" c="dimmed">
            Suggestions:
          </Text>
          {TITLE_SUGGESTIONS.map((chip) => (
            <Button
              key={chip.label}
              size="compact-xs"
              variant="subtle"
              color="gray"
              onClick={() =>
                setOptions((prev) => ({
                  ...prev,
                  title: chip.value
                }))
              }
            >
              {chip.label}
            </Button>
          ))}
        </Group>
      </Box>

      {/* 3. Card Description (Not for Badge) */}
      {options.generateType !== 'badge' && (
        <Box>
          <Group justify="space-between" align="center" mb={4}>
            <Group gap={4}>
              <Text size="sm" fw={600}>
                Description
              </Text>
              <FieldGuide fieldKey="description" />
            </Group>
          </Group>
          <Textarea
            id="description"
            name="description"
            rows={3}
            autosize
            minRows={3}
            maxRows={6}
            value={'description' in options ? options.description || '' : ''}
            onChange={(e) => {
              const val = e.currentTarget.value;
              setOptions((prev) => ({
                ...prev,
                ...('description' in prev ? { description: val } : {})
              }));
            }}
            placeholder="Enter description lines (Enter creates new line)..."
          />
          <Group gap="xs" mt="xs">
            <Text size="xs" c="dimmed">
              Templates:
            </Text>
            {DESCRIPTION_SUGGESTIONS.map((chip) => (
              <Button
                key={chip.label}
                size="compact-xs"
                variant="subtle"
                color="gray"
                onClick={() => {
                  setOptions((prev) => ({
                    ...prev,
                    ...('description' in prev ? { description: chip.value } : {})
                  }));
                }}
              >
                {chip.label}
              </Button>
            ))}
          </Group>
        </Box>
      )}

      <Divider />

      {/* 4. Logo / Image Controls */}
      <ImageControls options={options} setOptions={setOptions} />
    </Stack>
  );
};
