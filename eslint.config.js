import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// FSD: слой импортирует только из слоёв ниже, слайсы одного слоя не знают друг о друге,
// а в чужой слайс заходим только через его index.ts.
const layers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];
const slicedLayers = ['pages', 'widgets', 'features', 'entities'];
const allLayerAliases = layers.flatMap((name) => [`@${name}`, `@${name}/*`]);

function fsdPatterns(layer) {
  const index = layers.indexOf(layer);
  const higher = layers.slice(0, index);
  const lower = layers.slice(index + 1);
  const patterns = [
    {
      group: ['@server', '@server/*', '**/server/*'],
      message: 'Фронтенд не импортирует серверный код. Данные приходят через маршруты Next или API.',
    },
  ];

  if (higher.length > 0) {
    patterns.push({
      group: higher.flatMap((name) => [`@${name}`, `@${name}/*`]),
      message: `Слой ${layer} не может импортировать из слоёв выше.`,
    });
  }
  if (slicedLayers.includes(layer)) {
    patterns.push({
      group: [`@${layer}/*`],
      message: 'Слайсы одного слоя не импортируют друг друга. Внутри своего слайса — относительные пути.',
    });
  }
  if (lower.length > 0) {
    patterns.push({
      group: lower.map((name) => `@${name}/*/*`),
      message: 'Импортируйте слайс через его публичный index.ts, без глубоких путей.',
    });
  }
  return patterns;
}

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  ...layers.map((layer) => ({
    files: [`src/${layer}/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-imports': ['error', { patterns: fsdPatterns(layer) }],
    },
  })),
  {
    files: ['app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: layers.flatMap((name) => [`@${name}/*/*`]),
              message: 'Маршруты подключают слайсы FSD только через их index.ts.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['server/**/*.ts', 'contracts/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [...allLayerAliases, '**/src/*'],
              message: 'Сервер и контракты не зависят от фронтенда.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['contracts/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [...allLayerAliases, '**/src/*', '@server', '@server/*', '**/server/*'],
              message: 'Контракты — общий нижний уровень: ни фронтенд, ни сервер сюда не импортируются.',
            },
          ],
        },
      ],
    },
  },
]);
