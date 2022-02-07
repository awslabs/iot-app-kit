import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';
import { addChartCommands } from './chartCommands';
import 'cypress-wait-until';

addChartCommands();

addMatchImageSnapshotCommand({
  failureThreshold: 0.025,
  failureThresholdType: 'percent',
});
