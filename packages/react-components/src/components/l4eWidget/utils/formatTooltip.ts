import { AnomalyValue } from '../types';

export const formatTooltip = (data: [Date, number, AnomalyValue]) => {
  const { anomalyScore, diagnostics, predictionReason } = data[2];
  const div = document.createElement('div');
  const timestampString = `<div><b>${data[0].toLocaleString()}</b></div>`;
  const anomalyScoreString = `<div><b>Anomaly Score</b> ${anomalyScore}</div>`;
  const predictionReasonString = `<div><b>Prediction reason</b> ${predictionReason}</div>`;
  const diagnosticString = diagnostics
    .map(
      ({ name, value }: { name: string; value: number }) =>
        `<div><span>${name}</span> - <span>${value * 100}%</span></div>`
    )
    .join('');

  div.innerHTML = `${timestampString}<hr/>${anomalyScoreString}${predictionReasonString}<div><b>Contributing Properties</b></div><div>${diagnosticString}</div>`;
  return div;
};
