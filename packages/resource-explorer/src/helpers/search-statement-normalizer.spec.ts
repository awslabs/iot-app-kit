import { normalizeSearchStatement } from './search-statement-normalizer';

describe('normalizeSearchStatement', () => {
  it('adds %s to a search statement if none are included', () => {
    expect(normalizeSearchStatement('test')).toEqual('%test%');
    expect(normalizeSearchStatement('test_thing_2')).toEqual('%test_thing_2%');
  });

  it('converts * to % for a search statement', () => {
    expect(normalizeSearchStatement('*test*')).toEqual('%test%');
    expect(normalizeSearchStatement('*test%')).toEqual('%test%');
    expect(normalizeSearchStatement('test*')).toEqual('test%');
  });

  it('does nothing if the search statement contains legal wildcards', () => {
    expect(normalizeSearchStatement('%test%')).toEqual('%test%');
    expect(normalizeSearchStatement('test%')).toEqual('test%');
  });
});
