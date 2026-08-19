import React, { useState } from 'react';
import {
  Modal,
  Button,
  Slider,
  NumberInput,
  TextInput,
  Group,
  Stack,
  Text,
  Box,
  Title
} from '@mantine/core';
import { IconDownload, IconPhoto } from '@tabler/icons-react';
import { CardOptions } from '../types.ts';
import { downloadPNG } from '../utils/export.ts';
import { getCardDimensions } from '../utils/dimensions.ts';

interface PngModalProps {
  opened: boolean;
  onClose: () => void;
  options: CardOptions;
}

export const PngModal: React.FC<PngModalProps> = ({ opened, onClose, options }) => {
  const [scale, setScale] = useState<number>(100);
  const [filename, setFilename] = useState<string>('card.png');
  const [loading, setLoading] = useState(false);

  const { width: baseWidth, height: baseHeight } = getCardDimensions(options);

  const outputWidth = Math.round((baseWidth * scale) / 100);
  const outputHeight = Math.round((baseHeight * scale) / 100);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const safeFilename = filename.trim().endsWith('.png')
        ? filename.trim()
        : `${filename.trim()}.png`;
      await downloadPNG(options, scale, safeFilename);
      onClose();
    } catch (_err) {
      alert('Error generating PNG. Please check image CORS or format.');
    } finally {
      setLoading(false);
    }
  };

  const marks = [
    { value: 50, label: '50%' },
    { value: 100, label: '100%' },
    { value: 150, label: '150%' },
    { value: 200, label: '200%' }
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconPhoto size={20} aria-hidden="true" />
          <Title order={3} size="h5" id="png-modal-title">
            Download as PNG
          </Title>
        </Group>
      }
      aria-labelledby="png-modal-title"
      centered
      trapFocus
      returnFocus
    >
      <Stack gap="md" aria-busy={loading}>
        <TextInput
          id="png-filename-input"
          label="File Name"
          value={filename}
          onChange={(e) => setFilename(e.currentTarget.value)}
          placeholder="card.png"
          aria-label="Output PNG file name"
        />

        <Box>
          <Text id="scale-slider-label" size="sm" fw={500} mb="xs">
            Scale Percentage ({scale}%)
          </Text>
          <Group align="center" gap="sm" mb="lg">
            <Slider
              style={{ flex: 1 }}
              value={scale}
              onChange={setScale}
              min={10}
              max={200}
              step={5}
              marks={marks}
              aria-labelledby="scale-slider-label"
              aria-valuemin={10}
              aria-valuemax={200}
              aria-valuenow={scale}
              aria-valuetext={`${scale} percent, ${outputWidth} by ${outputHeight} pixels`}
            />
            <NumberInput
              w={85}
              size="xs"
              min={10}
              max={200}
              step={5}
              suffix="%"
              value={scale}
              onChange={(val) => setScale(Number(val) || 100)}
              aria-label="PNG export scale percentage"
            />
          </Group>
        </Box>

        <Box
          p="xs"
          role="status"
          aria-live="polite"
          style={{ borderRadius: '8px', backgroundColor: 'var(--mantine-color-gray-light)' }}
        >
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              Output Resolution:
            </Text>
            <Text size="sm" fw={600}>
              {outputWidth} × {outputHeight} px
            </Text>
          </Group>
        </Box>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} aria-label="Cancel export dialog">
            Cancel
          </Button>
          <Button
            leftSection={<IconDownload size={16} aria-hidden="true" />}
            onClick={handleDownload}
            loading={loading}
            aria-label={`Confirm and download PNG at ${outputWidth} by ${outputHeight} pixels`}
          >
            Download PNG
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
