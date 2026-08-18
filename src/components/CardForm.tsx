import React, { useRef } from 'react';
import {
  Paper,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  FileButton,
  Title,
  Text,
  Badge,
  Box,
  SegmentedControl,
  Tooltip
} from '@mantine/core';
import {
  IconDownload,
  IconEye,
  IconFileTypePng,
  IconUpload,
  IconFileExport,
  IconFileImport,
  IconX,
  IconPlus,
  IconPhoto
} from '@tabler/icons-react';
import { CardOptions, GenerateType } from '../types';
import { exportOptions, importOptions } from '../utils/download';
import { FieldGuide } from './FieldGuide';
import { SliderControl } from './SliderControl';
import {
  TITLE_SUGGESTIONS,
  DESCRIPTION_SUGGESTIONS,
  BACKGROUND_STYLE_SUGGESTIONS,
  TITLE_STYLE_SUGGESTIONS,
  DESCRIPTION_STYLE_SUGGESTIONS,
  LOGO_SUGGESTIONS,
  SuggestionChip
} from '../data/suggestions';
import { QUICK_DEFS_SNIPPETS } from '../data/presets';

interface CardFormProps {
  options: CardOptions;
  setOptions: React.Dispatch<React.SetStateAction<CardOptions>>;
  onReview: () => void;
  onDownloadSVG: () => void;
  onOpenPNGModal: () => void;
}

export const CardForm: React.FC<CardFormProps> = ({
  options,
  setOptions,
  onReview,
  onDownloadSVG,
  onOpenPNGModal
}) => {
  const jsonFileResetRef = useRef<() => void>(null);
  const imageFileResetRef = useRef<() => void>(null);

  const handleChange = (name: keyof CardOptions, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyBackgroundSuggestion = (chip: SuggestionChip) => {
    setOptions((prev) => {
      let updatedDefs = prev.defs || '';
      if (chip.defsSnippet && !updatedDefs.includes(chip.defsSnippet.slice(0, 30))) {
        updatedDefs = (updatedDefs ? updatedDefs + '\n' : '') + chip.defsSnippet;
      }
      return {
        ...prev,
        backgroundStyle: chip.value,
        defs: updatedDefs
      };
    });
  };

  const handleImageUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleChange('imageLink', reader.result);
      }
      imageFileResetRef.current?.();
    };
    reader.onerror = () => {
      imageFileResetRef.current?.();
    };
    reader.readAsDataURL(file);
  };

  const handleJsonImport = async (file: File | null) => {
    if (!file) return;
    try {
      const imported = await importOptions(file);
      setOptions(imported);
    } catch (err) {
      alert('Failed to parse JSON file: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      jsonFileResetRef.current?.();
    }
  };

  const radiusNum = parseFloat(options.borderRadius) || 0;
  const marginNum = parseFloat(options.borderMargin) || 0;
  const badgeWNum = parseFloat(options.badgeWidth || '400') || 400;
  const badgeHNum = parseFloat(options.badgeHeight || '120') || 120;
  const isDataUrl = options.imageLink?.startsWith('data:');

  return (
    <Paper
      component="section"
      aria-labelledby="card-form-heading"
      shadow="sm"
      radius="lg"
      p="lg"
      withBorder
    >
      <form id="svgOptionsForm" onSubmit={(e) => e.preventDefault()} aria-label="Card Configuration Form">
        <Stack gap="lg">
          {/* Top Quick Actions Bar */}
          <Box>
            <Group grow>
              <Button
                id="btnReview"
                size="sm"
                leftSection={<IconEye size={16} aria-hidden="true" />}
                onClick={onReview}
                aria-label="Refresh SVG Preview"
              >
                Review
              </Button>
              <Button
                id="btnDownload"
                size="sm"
                variant="light"
                leftSection={<IconDownload size={16} aria-hidden="true" />}
                onClick={onDownloadSVG}
                aria-label="Download Card as SVG file"
              >
                Download SVG
              </Button>
              <Button
                id="btnDownloadPNG"
                size="sm"
                variant="outline"
                leftSection={<IconFileTypePng size={16} aria-hidden="true" />}
                onClick={onOpenPNGModal}
                aria-label="Open PNG Download options dialog"
              >
                Download PNG
              </Button>
            </Group>
          </Box>

          <Group justify="space-between" align="center">
            <Title order={2} size="h4" id="card-form-heading">
              Card Settings
            </Title>
            <Badge variant="dot" color="blue" size="sm">
              Live Interactive
            </Badge>
          </Group>

          {/* 1. Layout Aspect Ratio */}
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
              value={options.generateType || 'card'}
              onChange={(val) => handleChange('generateType', (val as GenerateType) || 'card')}
              data={[
                { label: 'Card', value: 'card' },
                { label: 'Wide', value: 'widecard' },
                { label: 'Widescreen', value: 'widescreen' },
                { label: 'Badge', value: 'badge' }
              ]}
              aria-label="Select card dimensions layout"
            />
          </Box>

          {/* Badge Dimensions (Shown when Badge format is active) */}
          {options.generateType === 'badge' && (
            <Paper p="sm" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-default-hover)' }}>
              <Stack gap="sm">
                <Text size="xs" fw={700} c="blue">
                  Badge Custom Dimensions
                </Text>
                <Group grow align="flex-start">
                  <SliderControl
                    label="Width"
                    fieldKey="badgeWidth"
                    value={badgeWNum}
                    min={100}
                    max={1000}
                    step={5}
                    presets={[250, 320, 400, 500, 600]}
                    onChange={(val) => handleChange('badgeWidth', String(val))}
                    labelSize="xs"
                  />
                  <SliderControl
                    label="Height"
                    fieldKey="badgeHeight"
                    value={badgeHNum}
                    min={40}
                    max={400}
                    step={5}
                    presets={[60, 80, 100, 120, 160]}
                    onChange={(val) => handleChange('badgeHeight', String(val))}
                    labelSize="xs"
                  />
                </Group>
              </Stack>
            </Paper>
          )}

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
              onChange={(e) => handleChange('title', e.currentTarget.value)}
              placeholder="e.g. MaskedGUI"
            />
            {/* Title Suggestions */}
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
                  onClick={() => handleChange('title', chip.value)}
                >
                  {chip.label}
                </Button>
              ))}
            </Group>
          </Box>

          {/* 3. Card Description */}
          <Box style={{ opacity: options.generateType === 'badge' ? 0.6 : 1, transition: 'opacity 0.2s ease' }}>
            <Group justify="space-between" align="center" mb={4}>
              <Group gap={4}>
                <Text size="sm" fw={600}>
                  Description
                </Text>
                {options.generateType === 'badge' && (
                  <Badge size="xs" variant="outline" color="gray">
                    Not used in Badge mode
                  </Badge>
                )}
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
              disabled={options.generateType === 'badge'}
              value={options.description || ''}
              onChange={(e) => handleChange('description', e.currentTarget.value)}
              placeholder={options.generateType === 'badge' ? '(Description is disabled in Badge mode)' : 'Enter description lines...'}
            />
            {/* Description Suggestions */}
            {options.generateType !== 'badge' && (
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
                    onClick={() => handleChange('description', chip.value)}
                  >
                    {chip.label}
                  </Button>
                ))}
              </Group>
            )}
          </Box>

          {/* 4. Background Style */}
          <Box>
            <Group justify="space-between" align="center" mb={4}>
              <Group gap={4}>
                <Text size="sm" fw={600}>
                  Background Style
                </Text>
                <FieldGuide fieldKey="backgroundStyle" />
              </Group>
            </Group>
            <TextInput
              id="backgroundStyle"
              name="backgroundStyle"
              value={options.backgroundStyle || ''}
              onChange={(e) => handleChange('backgroundStyle', e.currentTarget.value)}
              placeholder="fill: white; stroke: black; stroke-width: 2;"
              style={{ fontFamily: 'monospace' }}
            />
            {/* Background Style Suggestions */}
            <Group gap="xs" mt="xs">
              <Text size="xs" c="dimmed">
                Color Presets:
              </Text>
              {BACKGROUND_STYLE_SUGGESTIONS.map((chip) => (
                <Tooltip key={chip.label} label={chip.description || chip.value} withArrow>
                  <Button
                    size="compact-xs"
                    variant="light"
                    color="blue"
                    onClick={() => handleApplyBackgroundSuggestion(chip)}
                  >
                    {chip.label}
                  </Button>
                </Tooltip>
              ))}
            </Group>
          </Box>

          {/* 5. Border Radius & Margin */}
          <Group grow align="flex-start">
            <SliderControl
              label="Border Radius"
              fieldKey="borderRadius"
              value={radiusNum}
              min={0}
              max={60}
              presets={[0, 8, 16, 24]}
              onChange={(val) => handleChange('borderRadius', String(val))}
            />
            <SliderControl
              label="Border Margin"
              fieldKey="borderMargin"
              value={marginNum}
              min={0}
              max={40}
              presets={[0, 5, 10, 15]}
              onChange={(val) => handleChange('borderMargin', String(val))}
            />
          </Group>

          {/* 6. Image / Logo */}
          <Box>
            <Group justify="space-between" align="center" mb={4}>
              <Group gap={4}>
                <Text size="sm" fw={600}>
                  Card Logo / Image
                </Text>
                {isDataUrl && (
                  <Badge size="xs" variant="light" color="indigo" leftSection={<IconPhoto size={10} />}>
                    Uploaded Image
                  </Badge>
                )}
                <FieldGuide fieldKey="imageLink" />
              </Group>
              {options.imageLink && (
                <Button
                  size="compact-xs"
                  variant="subtle"
                  color="red"
                  leftSection={<IconX size={12} />}
                  onClick={() => handleChange('imageLink', '')}
                >
                  Clear Image
                </Button>
              )}
            </Group>
            <TextInput
              id="imageLink"
              name="imageLink"
              value={options.imageLink || ''}
              onChange={(e) => handleChange('imageLink', e.currentTarget.value)}
              placeholder="Paste image URL or upload local file..."
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
            {/* Logo suggestions */}
            <Group gap="xs" mt="xs">
              <Text size="xs" c="dimmed">
                Demo Logos:
              </Text>
              {LOGO_SUGGESTIONS.map((chip) => (
                <Button
                  key={chip.label}
                  size="compact-xs"
                  variant="subtle"
                  color="gray"
                  onClick={() => handleChange('imageLink', chip.value)}
                >
                  {chip.label}
                </Button>
              ))}
            </Group>
          </Box>

          {/* 7. Typography Styles */}
          <Group grow align="flex-start">
            <Box>
              <Group justify="space-between" align="center" mb={4}>
                <Group gap={4}>
                  <Text size="sm" fw={600}>
                    Title Style
                  </Text>
                  <FieldGuide fieldKey="titleStyle" />
                </Group>
              </Group>
              <TextInput
                id="titleStyle"
                name="titleStyle"
                value={options.titleStyle || ''}
                onChange={(e) => handleChange('titleStyle', e.currentTarget.value)}
                style={{ fontFamily: 'monospace' }}
              />
              <Group gap="xs" mt="xs">
                {TITLE_STYLE_SUGGESTIONS.map((chip) => (
                  <Button
                    key={chip.label}
                    size="compact-xs"
                    variant="subtle"
                    color="gray"
                    onClick={() => handleChange('titleStyle', chip.value)}
                  >
                    {chip.label}
                  </Button>
                ))}
              </Group>
            </Box>

            <Box>
              <Group justify="space-between" align="center" mb={4}>
                <Group gap={4}>
                  <Text size="sm" fw={600}>
                    Description Style
                  </Text>
                  <FieldGuide fieldKey="descriptionStyle" />
                </Group>
              </Group>
              <TextInput
                id="descriptionStyle"
                name="descriptionStyle"
                value={options.descriptionStyle || ''}
                onChange={(e) => handleChange('descriptionStyle', e.currentTarget.value)}
                style={{ fontFamily: 'monospace' }}
              />
              <Group gap="xs" mt="xs">
                {DESCRIPTION_STYLE_SUGGESTIONS.map((chip) => (
                  <Button
                    key={chip.label}
                    size="compact-xs"
                    variant="subtle"
                    color="gray"
                    onClick={() => handleChange('descriptionStyle', chip.value)}
                  >
                    {chip.label}
                  </Button>
                ))}
              </Group>
            </Box>
          </Group>

          {/* 8. SVG Defs (Gradients & Filters) */}
          <Box>
            <Group justify="space-between" align="center" mb={4}>
              <Group gap={4}>
                <Text size="sm" fw={600}>
                  SVG &lt;defs&gt; (Gradients & Filters)
                </Text>
                <FieldGuide fieldKey="defs" />
              </Group>
            </Group>
            <Textarea
              id="defs"
              name="defs"
              rows={3}
              autosize
              minRows={3}
              maxRows={6}
              value={options.defs || ''}
              onChange={(e) => handleChange('defs', e.currentTarget.value)}
              placeholder="<linearGradient id='...'>...</linearGradient>"
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
            />
            {/* Quick defs snippets */}
            <Group gap="xs" mt="xs">
              <Text size="xs" c="dimmed">
                Insert Snippets:
              </Text>
              {QUICK_DEFS_SNIPPETS.map((snippet) => (
                <Button
                  key={snippet.name}
                  size="compact-xs"
                  variant="light"
                  color="violet"
                  leftSection={<IconPlus size={12} />}
                  onClick={() =>
                    setOptions((prev) => ({
                      ...prev,
                      defs: (prev.defs ? prev.defs + '\n' : '') + snippet.snippet
                    }))
                  }
                >
                  {snippet.name}
                </Button>
              ))}
            </Group>
          </Box>

          {/* Bottom Import & Export Presets */}
          <Box pt="sm" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                Save or load card settings:
              </Text>
              <Group gap="xs">
                <FileButton resetRef={jsonFileResetRef} onChange={handleJsonImport} accept="application/json">
                  {(props) => (
                    <Button
                      {...props}
                      id="btnImport"
                      size="xs"
                      variant="default"
                      leftSection={<IconFileImport size={14} aria-hidden="true" />}
                    >
                      Import JSON
                    </Button>
                  )}
                </FileButton>
                <Button
                  id="btnExport"
                  size="xs"
                  variant="default"
                  leftSection={<IconFileExport size={14} aria-hidden="true" />}
                  onClick={() => exportOptions(options)}
                >
                  Export JSON
                </Button>
              </Group>
            </Group>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};
