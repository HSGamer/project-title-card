import React, { useState } from 'react';
import {
  Stack,
  Box,
  Group,
  Text,
  Select,
  ColorInput,
  Switch,
  Divider,
  Button,
  TextInput,
  Paper,
  Alert
} from '@mantine/core';
import {
  IconTypography,
  IconDeviceDesktop,
  IconCheck,
  IconAlertCircle
} from '@tabler/icons-react';
import {
  CardOptions,
  TitleFontWeight,
  DescriptionFontWeight
} from '../../types.ts';
import { FieldGuide } from '../FieldGuide.tsx';
import { SliderControl } from '../SliderControl.tsx';
import {
  DEFAULT_FONT_OPTIONS,
  FontOption,
  querySystemFonts,
  loadWebFont
} from '../../utils/fonts.ts';
import { COLOR_SWATCHES } from '../../data/suggestions.ts';

interface TypographyTabProps {
  options: CardOptions;
  setOptions: React.Dispatch<React.SetStateAction<CardOptions>>;
}

export const TypographyTab: React.FC<TypographyTabProps> = ({ options, setOptions }) => {
  const [fontList, setFontList] = useState<FontOption[]>(DEFAULT_FONT_OPTIONS);
  const [isScanningFonts, setIsScanningFonts] = useState(false);
  const [scannedCount, setScannedCount] = useState<number | null>(null);
  const [scanMessage, setScanMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [customFontInput, setCustomFontInput] = useState('');

  // Scan installed system fonts via Local Font Access API
  const handleScanSystemFonts = async () => {
    try {
      setIsScanningFonts(true);
      setScanMessage(null);
      const localFonts = await querySystemFonts();
      if (localFonts.length > 0) {
        setFontList((prev) => {
          const existingLabels = new Set(prev.map((f) => f.label.toLowerCase()));
          const newLocal = localFonts.filter((f) => !existingLabels.has(f.label.toLowerCase()));
          return [...newLocal, ...prev];
        });
        setScannedCount(localFonts.length);
        setScanMessage({
          text: `Found and loaded ${localFonts.length} local system fonts!`,
          type: 'success'
        });
      }
    } catch (err) {
      setScanMessage({
        text: err instanceof Error ? err.message : String(err),
        type: 'error'
      });
    } finally {
      setIsScanningFonts(false);
    }
  };

  // Add custom font family name to list and apply
  const handleAddCustomFont = (target: 'title' | 'description') => {
    const trimmed = customFontInput.trim();
    if (!trimmed) return;

    const formattedValue = trimmed.includes(',') ? trimmed : `"${trimmed}", sans-serif`;
    const newFont: FontOption = {
      label: trimmed,
      value: formattedValue,
      category: 'Display',
      isGoogleFont: true
    };

    setFontList((prev) => [newFont, ...prev]);
    loadWebFont(trimmed);

    if (target === 'title') {
      setOptions((prev) => ({
        ...prev,
        titleFont: { ...prev.titleFont, fontFamily: formattedValue }
      }));
    } else {
      setOptions((prev) => ({
        ...prev,
        ...('descriptionFont' in prev
          ? { descriptionFont: { ...prev.descriptionFont, fontFamily: formattedValue } }
          : {})
      }));
    }
    setCustomFontInput('');
  };

  // Build select options with groups
  const getFontSelectData = (currentValue?: string) => {
    const groupsMap = new Map<string, { value: string; label: string }[]>();

    if (currentValue && !fontList.some((f) => f.value === currentValue)) {
      const customName = currentValue.split(',')[0].replace(/["']/g, '');
      groupsMap.set('Custom', [{ value: currentValue, label: `Custom: ${customName}` }]);
    }

    for (const f of fontList) {
      const groupName = f.category || 'Web Fonts';
      if (!groupsMap.has(groupName)) {
        groupsMap.set(groupName, []);
      }
      groupsMap.get(groupName)!.push({
        value: f.value,
        label: f.label
      });
    }

    const result: Array<{ group: string; items: { value: string; label: string }[] }> = [];
    for (const [group, items] of groupsMap.entries()) {
      result.push({ group, items });
    }

    return result;
  };

  return (
    <Stack gap="lg">
      {/* Dynamic Font Source Toolbar */}
      <Paper p="sm" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-default-hover)' }}>
        <Stack gap="xs">
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <IconTypography size={18} color="var(--mantine-color-blue-filled)" />
              <Text size="xs" fw={700}>
                Font Catalog & Local System Fonts
              </Text>
            </Group>
            <Button
              size="compact-xs"
              variant="light"
              leftSection={<IconDeviceDesktop size={14} />}
              onClick={handleScanSystemFonts}
              loading={isScanningFonts}
            >
              {scannedCount ? `Re-Scan (${scannedCount} loaded)` : 'Scan Local OS Fonts'}
            </Button>
          </Group>

          {scanMessage && (
            <Alert
              p="xs"
              color={scanMessage.type === 'success' ? 'teal' : 'orange'}
              icon={
                scanMessage.type === 'success' ? (
                  <IconCheck size={14} />
                ) : (
                  <IconAlertCircle size={14} />
                )
              }
            >
              {scanMessage.text}
            </Alert>
          )}

          {/* Add custom font input */}
          <Group gap="xs" align="flex-end">
            <TextInput
              style={{ flex: 1 }}
              size="xs"
              placeholder="Type any Google Font or Custom Font (e.g. Space Grotesk)..."
              value={customFontInput}
              onChange={(e) => setCustomFontInput(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomFont('title');
                }
              }}
            />
            <Button
              size="xs"
              variant="default"
              onClick={() => handleAddCustomFont('title')}
              disabled={!customFontInput.trim()}
            >
              Apply to Title
            </Button>
            {options.generateType !== 'badge' && (
              <Button
                size="xs"
                variant="subtle"
                onClick={() => handleAddCustomFont('description')}
                disabled={!customFontInput.trim()}
              >
                Apply to Desc
              </Button>
            )}
          </Group>
        </Stack>
      </Paper>

      {/* 1. Title Typography */}
      <Box>
        <Group justify="space-between" align="center" mb={4}>
          <Group gap={4}>
            <Text size="sm" fw={700} c="blue">
              Title Typography
            </Text>
            <FieldGuide fieldKey="titleTypography" />
          </Group>
          <Switch
            size="xs"
            label="ALL CAPS"
            checked={Boolean(options.titleFont?.uppercase)}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                titleFont: { ...prev.titleFont, uppercase: e.currentTarget.checked }
              }))
            }
          />
        </Group>

        <Stack gap="xs">
          <Select
            label="Font Family"
            searchable
            nothingFoundMessage="Font not found in catalog. Type name above to add it."
            value={options.titleFont?.fontFamily || fontList[0]?.value}
            data={getFontSelectData(options.titleFont?.fontFamily)}
            onChange={(val) => {
              if (!val) return;
              loadWebFont(val);
              setOptions((prev) => ({
                ...prev,
                titleFont: {
                  ...prev.titleFont,
                  fontFamily: val
                }
              }));
            }}
          />

          <Group grow align="flex-start">
            <Select
              label="Font Weight"
              value={options.titleFont?.fontWeight || '800'}
              data={[
                { label: '400 - Regular', value: '400' },
                { label: '500 - Medium', value: '500' },
                { label: '600 - SemiBold', value: '600' },
                { label: '700 - Bold', value: '700' },
                { label: '800 - ExtraBold', value: '800' },
                { label: '900 - Black', value: '900' }
              ]}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  titleFont: {
                    ...prev.titleFont,
                    fontWeight: (val as TitleFontWeight) || '800'
                  }
                }))
              }
            />

            <ColorInput
              label="Title Color"
              value={options.titleFont?.color || '#f8fafc'}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  titleFont: { ...prev.titleFont, color: val }
                }))
              }
              swatches={COLOR_SWATCHES}
            />
          </Group>

          <Group grow align="flex-start">
            <SliderControl
              label="Font Size"
              value={options.titleFont?.fontSize || 34}
              min={16}
              max={72}
              step={2}
              presets={[24, 34, 44, 52]}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  titleFont: { ...prev.titleFont, fontSize: val }
                }))
              }
              labelSize="xs"
            />

            <SliderControl
              label="Letter Spacing"
              value={options.titleFont?.letterSpacing || 0}
              min={-2}
              max={10}
              step={1}
              presets={[0, 1, 2, 4]}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  titleFont: { ...prev.titleFont, letterSpacing: val }
                }))
              }
              labelSize="xs"
            />
          </Group>
        </Stack>
      </Box>

      <Divider />

      {/* 2. Description Typography (Disabled in Badge mode) */}
      {options.generateType !== 'badge' && (
        <Box>
          <Group justify="space-between" align="center" mb={4}>
            <Group gap={4}>
              <Text size="sm" fw={700} c="blue">
                Description Typography
              </Text>
              <FieldGuide fieldKey="descriptionTypography" />
            </Group>
          </Group>

          <Stack gap="xs">
            <Select
              label="Font Family"
              searchable
              nothingFoundMessage="Font not found in catalog. Type name above to add it."
              value={
                'descriptionFont' in options
                  ? options.descriptionFont?.fontFamily || fontList[0]?.value
                  : fontList[0]?.value
              }
              data={getFontSelectData(
                'descriptionFont' in options ? options.descriptionFont?.fontFamily : undefined
              )}
              onChange={(val) => {
                if (!val) return;
                loadWebFont(val);
                setOptions((prev) => ({
                  ...prev,
                  ...('descriptionFont' in prev
                    ? {
                        descriptionFont: {
                          ...prev.descriptionFont,
                          fontFamily: val
                        }
                      }
                    : {})
                }));
              }}
            />

            <Group grow align="flex-start">
              <Select
                label="Font Weight"
                value={
                  'descriptionFont' in options
                    ? options.descriptionFont?.fontWeight || '500'
                    : '500'
                }
                data={[
                  { label: '300 - Light', value: '300' },
                  { label: '400 - Regular', value: '400' },
                  { label: '500 - Medium', value: '500' },
                  { label: '600 - SemiBold', value: '600' },
                  { label: '700 - Bold', value: '700' }
                ]}
                onChange={(val) =>
                  setOptions((prev) => ({
                    ...prev,
                    ...('descriptionFont' in prev
                      ? {
                          descriptionFont: {
                            ...prev.descriptionFont,
                            fontWeight: (val as DescriptionFontWeight) || '500'
                          }
                        }
                      : {})
                  }))
                }
              />

              <ColorInput
                label="Description Color"
                value={
                  'descriptionFont' in options
                    ? options.descriptionFont?.color || '#94a3b8'
                    : '#94a3b8'
                }
                onChange={(val) =>
                  setOptions((prev) => ({
                    ...prev,
                    ...('descriptionFont' in prev
                      ? { descriptionFont: { ...prev.descriptionFont, color: val } }
                      : {})
                  }))
                }
                swatches={COLOR_SWATCHES}
              />
            </Group>

            <Group grow align="flex-start">
              <SliderControl
                label="Font Size"
                value={
                  'descriptionFont' in options
                    ? options.descriptionFont?.fontSize || 22
                    : 22
                }
                min={12}
                max={44}
                step={2}
                presets={[16, 20, 24, 28]}
                onChange={(val) =>
                  setOptions((prev) => ({
                    ...prev,
                    ...('descriptionFont' in prev
                      ? { descriptionFont: { ...prev.descriptionFont, fontSize: val } }
                      : {})
                  }))
                }
                labelSize="xs"
              />

              <SliderControl
                label="Line Spacing"
                value={Math.round(
                  ('descriptionFont' in options
                    ? options.descriptionFont?.lineHeight || 1.3
                    : 1.3) * 10
                )}
                min={10}
                max={20}
                step={1}
                unit="x"
                presets={[11, 13, 15, 18]}
                onChange={(val) =>
                  setOptions((prev) => ({
                    ...prev,
                    ...('descriptionFont' in prev
                      ? {
                          descriptionFont: {
                            ...prev.descriptionFont,
                            lineHeight: val / 10
                          }
                        }
                      : {})
                  }))
                }
                labelSize="xs"
              />
            </Group>
          </Stack>
        </Box>
      )}
    </Stack>
  );
};
