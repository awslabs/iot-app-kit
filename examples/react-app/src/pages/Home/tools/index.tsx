import { Button, Container } from "@cloudscape-design/components";
import useDataGenerator, { TelemetryMetric } from "../../../hooks/useDataGenerator";
import { useCallback } from "react";

const mixers = [
  'Mixer_15_0bb566cd-d6f3-4804-9fe1-7d2abcad82d0'
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
