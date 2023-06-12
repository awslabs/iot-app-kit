import { Button, Container } from "@cloudscape-design/components";
import useDataGenerator, { TelemetryMetric } from "../../../hooks/useDataGenerator";
import { useCallback } from "react";

const mixers = [
  'Mixer_0_cd81d9fd-3f74-437a-802b-9747ff240837'
];

const DataGeneratorTools = () => {
  const { postTelemetry } = useDataGenerator();

  const generateTelemetry = useCallback(async () => {
    const fakeMetrics = mixers.map((mixer) => {
      return {
        telemetryAssetId: mixer,
        telemetryAssetType: 'Mixer',
        metrics: {
          RPM: Math.random() * 100,
          Temperature: Math.random() * 100,
        }
      } as TelemetryMetric
    });

    await postTelemetry(fakeMetrics);
  }, [postTelemetry]);

  return (
    <Container header={<h2>Data Generator Tools</h2>}>
      DataGenerator Tools

      <Button onClick={generateTelemetry}>Generate Telemetry</Button>
    </Container>
  )
}

export default DataGeneratorTools;
