import React, { useState, useEffect, useCallback } from 'react';
import { MantineProvider, Container, Grid, Box } from '@mantine/core';
import { CardOptions } from './types.ts';
import { defaultOptions, generateSVG } from './generators/index.ts';
import { downloadSVG } from './utils/export.ts';
import { AppHeader } from './components/AppHeader.tsx';
import { CardForm } from './components/CardForm.tsx';
import { CardPreview } from './components/CardPreview.tsx';
import { PngModal } from './components/PngModal.tsx';

export const App: React.FC = () => {
  const [options, setOptions] = useState<CardOptions>(defaultOptions);
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);
  const [isPngModalOpen, setIsPngModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const updatePreview = useCallback(async (currentOptions: CardOptions) => {
    try {
      const svg = await generateSVG(currentOptions);
      setSvgElement(svg);
    } catch (err) {
      console.error('Failed to generate SVG preview:', err);
    }
  }, []);

  useEffect(() => {
    updatePreview(options);
  }, [options, updatePreview]);

  const handleReview = () => {
    updatePreview(options);
    setStatusMessage('Preview refreshed');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleDownloadSVG = async () => {
    try {
      await downloadSVG(options);
      setStatusMessage('SVG downloaded successfully');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (_err) {
      alert('Failed to download SVG');
    }
  };

  return (
    <MantineProvider defaultColorScheme="auto">
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Screen reader announcement region */}
      <div role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </div>

      <Box style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-body)' }}>
        <AppHeader setOptions={setOptions} />

        <main id="main-content" tabIndex={-1}>
          <Container size="xl" py="lg">
            <Grid gap="xl">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <CardForm
                  options={options}
                  setOptions={setOptions}
                  onReview={handleReview}
                  onDownloadSVG={handleDownloadSVG}
                  onOpenPNGModal={() => setIsPngModalOpen(true)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <CardPreview svgElement={svgElement} options={options} />
              </Grid.Col>
            </Grid>
          </Container>
        </main>

        <PngModal
          opened={isPngModalOpen}
          onClose={() => setIsPngModalOpen(false)}
          options={options}
        />
      </Box>
    </MantineProvider>
  );
};

export default App;
