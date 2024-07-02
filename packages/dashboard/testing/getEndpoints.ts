interface Endpoints {
  edgeGatewayEndpoint: string|undefined;
}

/** Call to return services endpoints defined in `.env`.  */
export function getEndpoints(): Endpoints | never {
  const edgeGatewayEndpoint = process.env.EDGE_GATEWAY_ENDPOINT;

  /*
  if (!edgeGatewayEndpoint) {
    throw new Error(
      'Missing credentials: EDGE_GATEWAY_ENDPOINT. Update EDGE_GATEWAY_ENDPOINT in root `.env` file.'
    );
  }
    */

  return {
    // Provided by `.env` environment variable file
    edgeGatewayEndpoint,
  };
}
