// import {
//   compositeProviders,
//   SiteWiseTimeSeriesDataProvider
// } from "@iot-app-kit/source-iotsitewise/src/time-series-data/provider";
//
//   it('merges the inputs for multiple providers, taking session and request settings from the first provider', () => {
//     const START = new Date(2020, 0, 0);
//     const END = new Date();
//
//     const query1 = { source: 'site-wise', assets: [] };
//     const query2 = { source: 'custom', assets: [] };
//     const query3 = { source: 'my-source', assets: [] };
//     const query4 = {
//       source: 'site-wise',
//       assets: [{ assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] }],
//     };
//
//     const provider1 = new SiteWiseTimeSeriesDataProvider(componentSession, {
//       queries: [query1],
//       request: {
//         viewport: { start: START, end: END },
//         settings: { fetchFromStartToEnd: true },
//       },
//     });
//
//     const provider2 = new SiteWiseTimeSeriesDataProvider(componentSession, {
//       queries: [query2],
//       request: {
//         viewport: { start: START, end: END },
//         settings: { fetchFromStartToEnd: true },
//       },
//     });
//
//     const provider3 = new SiteWiseTimeSeriesDataProvider(componentSession, {
//       queries: [query3, query4],
//       request: {
//         viewport: { start: START, end: END },
//         settings: { fetchFromStartToEnd: false },
//       },
//     });
//
//     const composedProvider = compositeProviders([provider1, provider2, provider3]);
//
//     // expect(composedProvider.session).toEqual(componentSession);
//     // expect(composedProvider.input).toEqual({
//     //   queries: [query1, query2, query3, query4],
//     //   request: provider1.input.request,
//     // });
//   });
//
//   it('throws error if provider list is empty', () => {
//     expect(() => compositeProviders([])).toThrow('composeSiteWiseProviders must be called with at least one provider');
//   });
//
//   it('returns the provider if there is only one', () => {
//     const START = new Date(2020, 0, 0);
//     const END = new Date();
//
//     const provider = new SiteWiseTimeSeriesDataProvider(componentSession, {
//       queries: [{ source: 'site-wise', assets: [] }],
//       request: {
//         viewport: { start: START, end: END },
//         settings: { fetchFromStartToEnd: true },
//       },
//     });
//
//     expect(compositeProviders([provider])).toBe(provider);
//   });

it('has a test', () => {
  expect(true).toBe(true);
});
