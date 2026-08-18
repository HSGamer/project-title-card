import React, { useEffect, useRef, useState } from 'react';
import {
  Paper,
  Group,
  Badge,
  ActionIcon,
  Tooltip,
  CopyButton,
  Stack,
  Box,
  Title,
  Text,
  Divider
} from '@mantine/core';
import {
  IconCopy,
  IconCheck,
  IconZoomIn,
  IconZoomOut,
  IconRotate,
  IconGridDots,
  IconMoon,
  IconSun
} from '@tabler/icons-react';
import { CardOptions } from '../types';
import { getCardDimensionsLabel } from '../utils/dimensions';

interface CardPreviewProps {
  svgElement: SVGSVGElement | null;
  options: CardOptions;
}

type BackdropType = 'checkerboard' | 'dark' | 'light';

export const CardPreview: React.FC<CardPreviewProps> = ({ svgElement, options }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [backdrop, setBackdrop] = useState<BackdropType>('checkerboard');

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      if (svgElement) {
        containerRef.current.appendChild(svgElement.cloneNode(true));
      }
    }
  }, [svgElement]);

  const dimensionsLabel = getCardDimensionsLabel(options);

  const svgString = svgElement
    ? new XMLSerializer().serializeToString(svgElement)
    : '';

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));
  const handleResetZoom = () => setZoom(100);

  const getBackdropStyle = () => {
    switch (backdrop) {
      case 'dark':
        return { backgroundColor: '#090d16' };
      case 'light':
        return { backgroundColor: '#ffffff' };
      case 'checkerboard':
      default:
        return {};
    }
  };

  return (
    <Paper
      component="section"
      aria-labelledby="preview-heading"
      shadow="sm"
      radius="lg"
      p="lg"
      withBorder
      style={{
        position: 'sticky',
        top: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '450px'
      }}
    >
      <Stack w="100%" gap="md">
        {/* Compact, Unified Toolbar */}
        <Group justify="space-between" align="center" wrap="wrap" gap="xs">
          <Group gap="xs">
            <Title order={2} size="h4" id="preview-heading">
              Card Preview
            </Title>
            <Badge variant="light" size="sm" color="blue">
              {dimensionsLabel}
            </Badge>
          </Group>

          <Group gap="xs">
            {/* Backdrop Switcher (Clean Icon Group) */}
            <ActionIcon.Group>
              <Tooltip label="Checkerboard (Transparency)" withArrow>
                <ActionIcon
                  size="sm"
                  variant={backdrop === 'checkerboard' ? 'filled' : 'default'}
                  color={backdrop === 'checkerboard' ? 'blue' : 'gray'}
                  onClick={() => setBackdrop('checkerboard')}
                  aria-label="Checkerboard transparent backdrop"
                >
                  <IconGridDots size={14} aria-hidden="true" />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Dark backdrop" withArrow>
                <ActionIcon
                  size="sm"
                  variant={backdrop === 'dark' ? 'filled' : 'default'}
                  color={backdrop === 'dark' ? 'blue' : 'gray'}
                  onClick={() => setBackdrop('dark')}
                  aria-label="Dark background"
                >
                  <IconMoon size={14} aria-hidden="true" />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Light backdrop" withArrow>
                <ActionIcon
                  size="sm"
                  variant={backdrop === 'light' ? 'filled' : 'default'}
                  color={backdrop === 'light' ? 'blue' : 'gray'}
                  onClick={() => setBackdrop('light')}
                  aria-label="Light background"
                >
                  <IconSun size={14} aria-hidden="true" />
                </ActionIcon>
              </Tooltip>
            </ActionIcon.Group>

            <Divider orientation="vertical" />

            {/* Zoom Controls */}
            <Group gap={2}>
              <Tooltip label="Zoom Out" withArrow>
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="gray"
                  onClick={handleZoomOut}
                  aria-label="Zoom Out Preview"
                >
                  <IconZoomOut size={16} aria-hidden="true" />
                </ActionIcon>
              </Tooltip>
              <Text size="xs" fw={600} style={{ minWidth: '36px', textAlign: 'center' }}>
                {zoom}%
              </Text>
              <Tooltip label="Zoom In" withArrow>
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="gray"
                  onClick={handleZoomIn}
                  aria-label="Zoom In Preview"
                >
                  <IconZoomIn size={16} aria-hidden="true" />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Reset Zoom" withArrow>
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="gray"
                  onClick={handleResetZoom}
                  aria-label="Reset Zoom to 100%"
                >
                  <IconRotate size={14} aria-hidden="true" />
                </ActionIcon>
              </Tooltip>
            </Group>

            <Divider orientation="vertical" />

            {/* Copy SVG Code */}
            <CopyButton value={svgString} timeout={2000}>
              {({ copied, copy }) => (
                <>
                  <Tooltip label={copied ? 'Copied!' : 'Copy SVG Code'} withArrow>
                    <ActionIcon
                      color={copied ? 'teal' : 'gray'}
                      variant="light"
                      size="sm"
                      onClick={copy}
                      aria-label={copied ? 'Copied SVG to clipboard' : 'Copy SVG Code'}
                    >
                      {copied ? (
                        <IconCheck size={16} aria-hidden="true" />
                      ) : (
                        <IconCopy size={16} aria-hidden="true" />
                      )}
                    </ActionIcon>
                  </Tooltip>
                  <div role="status" aria-live="polite" className="sr-only">
                    {copied ? 'SVG markup copied to clipboard' : ''}
                  </div>
                </>
              )}
            </CopyButton>
          </Group>
        </Group>

        {/* SVG Display Canvas */}
        <Box
          className={backdrop === 'checkerboard' ? 'preview-checkerboard' : ''}
          style={{
            ...getBackdropStyle(),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid var(--mantine-color-default-border)',
            overflow: 'auto',
            minHeight: '360px',
            maxHeight: '70vh',
            transition: 'background-color 0.2s ease'
          }}
        >
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out'
            }}
          >
            <Box
              id="svgContainer"
              ref={containerRef}
              role="region"
              aria-label="Interactive SVG Display Area"
            />
          </div>
        </Box>
      </Stack>
    </Paper>
  );
};
