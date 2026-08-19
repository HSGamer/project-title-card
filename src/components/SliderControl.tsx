import React from 'react';
import { Box, Group, Slider, NumberInput, Button, Text } from '@mantine/core';
import { FieldGuide } from './FieldGuide.tsx';
import { FIELD_GUIDES } from '../data/suggestions.ts';

interface SliderControlProps {
  label: string;
  fieldKey?: keyof typeof FIELD_GUIDES;
  value: number;
  min: number;
  max: number;
  step?: number;
  presets?: number[];
  unit?: string;
  onChange: (val: number) => void;
  ariaLabel?: string;
  numberInputWidth?: number;
  labelSize?: 'xs' | 'sm';
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  fieldKey,
  value,
  min,
  max,
  step = 1,
  presets = [],
  unit = 'px',
  onChange,
  ariaLabel,
  numberInputWidth = 75,
  labelSize = 'sm'
}) => {
  return (
    <Box>
      <Group justify="space-between" align="center" mb={4}>
        <Group gap={4}>
          <Text size={labelSize} fw={600}>
            {label} ({value}{unit})
          </Text>
          {fieldKey && <FieldGuide fieldKey={fieldKey} />}
        </Group>
      </Group>
      <Group align="center" gap="xs" mb="xs">
        <Slider
          style={{ flex: 1 }}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
        />
        <NumberInput
          w={numberInputWidth}
          size="xs"
          min={min}
          max={max * 2}
          step={step}
          value={value}
          onChange={(val) => onChange(Number(val ?? min))}
          aria-label={ariaLabel || `${label} in ${unit}`}
        />
      </Group>
      {presets.length > 0 && (
        <Group gap={4}>
          {presets.map((preset) => (
            <Button
              key={preset}
              size="compact-xs"
              variant={value === preset ? 'filled' : 'subtle'}
              color="gray"
              onClick={() => onChange(preset)}
            >
              {preset}{unit}
            </Button>
          ))}
        </Group>
      )}
    </Box>
  );
};
