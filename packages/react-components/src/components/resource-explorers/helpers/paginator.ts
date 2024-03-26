type Paginated = { nextToken?: string };

/** Recursive AWS list paginator. */
export class Paginator<Request extends Paginated, Response extends Paginated> {
  readonly #fn: (params: Request) => Promise<Response>;

  constructor(fn: (params: Request) => Promise<Response>) {
    this.#fn = fn;
  }

  async paginate(params: Request): Promise<Response[]> {
    const response = await this.#fn(params);

    if (response.nextToken) {
      const nextPage = await this.paginate({
        ...params,
        nextToken: response.nextToken,
      });

      return [response, ...nextPage];
    } else {
      return [response];
    }
  }
}
