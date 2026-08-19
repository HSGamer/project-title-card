import React, { useRef, useState } from 'react';
import {
  Paper,
  Button,
  Group,
  Stack,
  FileButton,
  Title,
  Text,
  Badge,
  Box,
  Tabs
} from '@mantine/core';
import {
  IconDownload,
  IconEye,
  IconFileTypePng,
  IconFileExport,
  IconFileImport,
  IconLayout,
  IconPalette,
  IconFrame,
  IconTypography
} from '@tabler/icons-react';
import {
  CardOptions,
  GenerateType,
  StandardCardOptions,
  WideCardOptions,
  WidescreenCardOptions,
  BadgeCardOptions
} from '../types.ts';
import { exportOptions, importOptions } from '../utils/export.ts';
import { LayoutTab } from './form/LayoutTab.tsx';
import { BackgroundTab } from './form/BackgroundTab.tsx';
import { BorderTab } from './form/BorderTab.tsx';
import { TypographyTab } from './form/TypographyTab.tsx';

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
  const [activeTab, setActiveTab] = useState<string | null>('layout');
  const jsonFileResetRef = useRef<() => void>(null);

  // Format switcher preserving common visual state
  const handleFormatChange = (newFormat: GenerateType) => {
    setOptions((prev) => {
      const base = {
        title: prev.title,
        background: { ...prev.background },
        border: { ...prev.border },
        titleFont: { ...prev.titleFont },
        image: { ...prev.image }
      };
      const desc =
        'description' in prev ? prev.description : 'Fast • Lightweight • Type-Safe\nZero Dependencies';
      const descFont =
        'descriptionFont' in prev
          ? { ...prev.descriptionFont }
          : {
              color: '#94a3b8',
              fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: '500' as const,
              fontSize: 22,
              lineHeight: 1.3,
              opacity: 1
            };

      if (newFormat === 'widecard') {
        return {
          ...base,
          generateType: 'widecard',
          imagePosition: 'left',
          description: desc,
          descriptionFont: { ...descFont, fontSize: 24 },
          titleFont: { ...base.titleFont, fontSize: 44 },
          image: { ...base.image, size: 220 }
        } as WideCardOptions;
      }
      if (newFormat === 'widescreen') {
        return {
          ...base,
          generateType: 'widescreen',
          layoutStyle: 'split',
          description: desc,
          descriptionFont: { ...descFont, fontSize: 24 },
          titleFont: { ...base.titleFont, fontSize: 42 },
          image: { ...base.image, size: 240 }
        } as WidescreenCardOptions;
      }
      if (newFormat === 'badge') {
        return {
          ...base,
          generateType: 'badge',
          badgeWidth: 400,
          badgeHeight: 120,
          iconPosition: 'left',
          titleFont: { ...base.titleFont, fontSize: 32 },
          image: { ...base.image, size: 70 }
        } as BadgeCardOptions;
      }
      // Standard card
      return {
        ...base,
        generateType: 'card',
        textAlign: 'center',
        description: desc,
        descriptionFont: { ...descFont, fontSize: 22 },
        titleFont: { ...base.titleFont, fontSize: 34 },
        image: { ...base.image, size: 260 }
      } as StandardCardOptions;
    });
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
        <Stack gap="md">
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
              Card Customizer
            </Title>
            <Badge variant="dot" color="blue" size="sm">
              Live Interactive
            </Badge>
          </Group>

          {/* Main Configuration Tabs */}
          <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
            <Tabs.List grow mb="md">
              <Tabs.Tab value="layout" leftSection={<IconLayout size={15} />}>
                Layout
              </Tabs.Tab>
              <Tabs.Tab value="background" leftSection={<IconPalette size={15} />}>
                Background
              </Tabs.Tab>
              <Tabs.Tab value="border" leftSection={<IconFrame size={15} />}>
                Border & Shadow
              </Tabs.Tab>
              <Tabs.Tab value="typography" leftSection={<IconTypography size={15} />}>
                Typography
              </Tabs.Tab>
            </Tabs.List>

            {/* TAB 1: LAYOUT & CONTENT */}
            <Tabs.Panel value="layout">
              <LayoutTab
                options={options}
                setOptions={setOptions}
                onFormatChange={handleFormatChange}
              />
            </Tabs.Panel>

            {/* TAB 2: BACKGROUND & PALETTE */}
            <Tabs.Panel value="background">
              <BackgroundTab options={options} setOptions={setOptions} />
            </Tabs.Panel>

            {/* TAB 3: BORDER & SHADOW */}
            <Tabs.Panel value="border">
              <BorderTab options={options} setOptions={setOptions} />
            </Tabs.Panel>

            {/* TAB 4: TYPOGRAPHY */}
            <Tabs.Panel value="typography">
              <TypographyTab options={options} setOptions={setOptions} />
            </Tabs.Panel>
          </Tabs>

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
