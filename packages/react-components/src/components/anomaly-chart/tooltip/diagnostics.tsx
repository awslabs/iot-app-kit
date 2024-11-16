import { TooltipDiagnostic, type TooltipDiagnosticOptions } from './diagnostic';

export type TooltipDiagnosticsOptions = {
  diagnostics: TooltipDiagnosticOptions[];
  decimalPlaces?: number;
};

export const TooltipDiagnostics = ({
  diagnostics,
  decimalPlaces,
}: TooltipDiagnosticsOptions) => {
  return (
    <>
      {diagnostics.map((d) => (
        <TooltipDiagnostic key={d.id} {...d} decimalPlaces={decimalPlaces} />
      ))}
    </>
  );
};
