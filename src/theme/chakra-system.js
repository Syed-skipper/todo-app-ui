import { createSystem, defaultConfig } from '@chakra-ui/react';

export const system = createSystem(defaultConfig, {
  globalCss: {
    'html, body': {
      bg: 'var(--cream)',
      color: 'var(--ink)',
    },
  },
  theme: {
    tokens: {
      fonts: {
        body: { value: 'var(--font-geist-sans), "Segoe UI", system-ui, sans-serif' },
      },
      radii: {
        card: { value: '16px' },
        button: { value: '12px' },
      },
    },
  },
});
