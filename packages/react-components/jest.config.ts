import { reactConfig } from '@iot-app-kit/jest-config';

const config = {
  ...reactConfig,
  roots: ['src'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 64,
      functions: 65,
      lines: 80,
    },
  },
  transform: {
    ...reactConfig.transform,
    '^.+\\.svg$': '<rootDir>/svgTransform.js',
  },
  setupFilesAfterEnv: [
    ...reactConfig.setupFilesAfterEnv,
    '<rootDir>/jest-setup.js',
  ],
  globalSetup: './global-jest-setup.js',
  coveragePathIgnorePatterns: [
    '<rootDir>/src/components/knowledge-graph/KnowledgeGraphPanel.tsx',
    '<rootDir>/src/components/chart/trendCursor/mouseEvents/useTrendCursorsEvents.ts',
    '<rootDir>/src/components/chart/events/useHandleChartEvents.ts',
    '<rootDir>/src/echarts/extensions/trendCursors/view/*',
    '<rootDir>/src/echarts/extensions/trendCursors/echartsActions/extension.ts',
    '<rootDir>/src/echarts/extensions/trendCursors/lifeCycle.ts',
  ],
};
export default config;
