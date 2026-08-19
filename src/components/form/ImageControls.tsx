import React, { useRef } from 'react';
import {
  Box,
  Group,
  Stack,
  TextInput,
  Button,
  Switch,
  Badge,
  Text,
  FileButton,
  SegmentedControl
} from '@mantine/core';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { CardOptions, ImageShape } from '../../types.ts';
import { FieldGuide } from '../FieldGuide.tsx';
import { SliderControl } from '../SliderControl.tsx';
import { LOGO_SUGGESTIONS } from '../../data/suggestions.ts';

interface ImageControlsProps {
  options: CardOptions;
  setOptions: React.Dispatch<React.SetStateAction<CardOptions>>;
}

export const ImageControls: React.FC<ImageControlsProps> = ({ options, setOptions }) => {
  const imageFileResetRef = useRef<() => void>(null);
  const isDataUrl = options.image?.url?.startsWith('data:');

  const handleImageUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const dataUrl = reader.result;
        setOptions((prev) => ({
          ...prev,
          image: {
            ...prev.image,
            url: dataUrl,
            show: true
          }
        }));
      }
      imageFileResetRef.current?.();
    };
    reader.onerror = () => {
      imageFileResetRef.current?.();
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box>
      <Group justify="space-between" align="center" mb={4}>
        <Group gap={4}>
          <Text size="sm" fw={600}>
            Card Logo / Image
          </Text>
          {isDataUrl && (
            <Badge size="xs" variant="light" color="indigo" leftSection={<IconPhoto size={10} />}>
              Uploaded File
            </Badge>
          )}
          <FieldGuide fieldKey="image" />
        </Group>
        <Group gap="xs">
          <Switch
            size="xs"
            label="Show Image"
            checked={options.image?.show !== false}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                image: { ...prev.image, show: e.currentTarget.checked }
              }))
            }
          />
          {options.image?.url && (
            <Button
              size="compact-xs"
              variant="subtle"
              color="red"
              leftSection={<IconX size={12} />}
              onClick={() =>
                setOptions((prev) => ({
                  ...prev,
                  image: { ...prev.image, url: '' }
                }))
              }
            >
              Clear
            </Button>
          )}
        </Group>
      </Group>

      <Stack gap="xs">
        <TextInput
          id="imageUrl"
          value={options.image?.url || ''}
          onChange={(e) =>
            setOptions((prev) => ({
              ...prev,
              image: { ...prev.image, url: e.currentTarget.value }
            }))
          }
          placeholder="Paste image URL or upload image file..."
          rightSection={
            <FileButton resetRef={imageFileResetRef} onChange={handleImageUpload} accept="image/*">
              {(props) => (
                <Button
                  {...props}
                  id="btnUpload"
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

        {/* Demo Logo suggestions */}
        <Group gap="xs">
          <Text size="xs" c="dimmed">
            Demo Logos:
          </Text>
          {LOGO_SUGGESTIONS.map((chip) => (
            <Button
              key={chip.label}
              size="compact-xs"
              variant="subtle"
              color="gray"
              onClick={() =>
                setOptions((prev) => ({
                  ...prev,
                  image: { ...prev.image, url: chip.value, show: true }
                }))
              }
            >
              {chip.label}
            </Button>
          ))}
        </Group>

        {/* Image shape and sizing */}
        <Group grow align="flex-start" mt="xs">
          <Box>
            <Text size="xs" fw={600} mb={4} c="dimmed">
              Image Shape
            </Text>
            <SegmentedControl
              fullWidth
              size="xs"
              value={options.image?.shape || 'rounded'}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  image: { ...prev.image, shape: val as ImageShape }
                }))
              }
              data={[
                { label: 'Original', value: 'original' },
                { label: 'Rounded', value: 'rounded' },
                { label: 'Circle', value: 'circle' }
              ]}
            />
          </Box>

          <SliderControl
            label="Logo Size"
            value={options.image?.size || (options.generateType === 'badge' ? 70 : 240)}
            min={options.generateType === 'badge' ? 20 : 60}
            max={options.generateType === 'badge' ? 180 : 360}
            step={5}
            onChange={(val) =>
              setOptions((prev) => ({
                ...prev,
                image: { ...prev.image, size: val }
              }))
            }
            labelSize="xs"
          />
        </Group>
      </Stack>
    </Box>
  );
};
