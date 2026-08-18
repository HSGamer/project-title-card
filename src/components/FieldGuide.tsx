import React from 'react';
import { Popover, ActionIcon, Text, Title, Stack } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { FIELD_GUIDES } from '../data/suggestions';

interface FieldGuideProps {
  fieldKey: keyof typeof FIELD_GUIDES;
}

export const FieldGuide: React.FC<FieldGuideProps> = ({ fieldKey }) => {
  const guide = FIELD_GUIDES[fieldKey];
  if (!guide) return null;

  return (
    <Popover width={300} position="top-start" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon
          size="xs"
          variant="subtle"
          color="gray"
          aria-label={`Show guide for ${guide.title}`}
        >
          <IconInfoCircle size={14} aria-hidden="true" />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p="xs">
        <Stack gap={4}>
          <Title order={4} size="xs" fw={700} c="blue">
            {guide.title}
          </Title>
          <Text size="xs" style={{ whiteSpace: 'pre-line', lineHeight: 1.45 }}>
            {guide.content}
          </Text>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
