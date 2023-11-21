import { reactConfig } from '@iot-app-kit/jest-config';

const config = {
  ...reactConfig,
  roots: ['src'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 70,
      lines: 80,
    },
  },
  transform: {
    ...reactConfig.transform,
    '^.+\\.svg$': '<rootDir>/svgTransform.js',
  },
  setupFilesAfterEnv: [...reactConfig.setupFilesAfterEnv, '<rootDir>/jest-setup.js'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/components/knowledge-graph/KnowledgeGraphPanel.tsx',
    '<rootDir>/src/components/chart/trendCursor/mouseEvents/useTrendCursorsEvents.ts',
  ],
};
export default config;
