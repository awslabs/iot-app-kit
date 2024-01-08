import { rangeValidator } from './rangeValidator';

const rangeValidatorWithMessaging = rangeValidator({
  dateRangeIncompleteError: 'incomplete',
  dateRangeInvalidError: 'invalid',
});

describe('rangeValidator', () => {
  describe('null case', () => {
    it('is valid when no range is present', () => {
      expect(rangeValidatorWithMessaging(null).valid).toBe(true);
    });
  });

  describe('relative ranges', () => {
    it('is valid for relative ranges', () => {
      expect(
        rangeValidatorWithMessaging({
          type: 'relative',
          amount: 10,
          unit: 'minute',
        }).valid
      ).toBe(true);
    });
  });

  describe('absolute ranges', () => {
    it('is not valid if the start and or end date are not present', () => {
      const missingStartAndEnd = rangeValidatorWithMessaging({
        type: 'absolute',
        startDate: '',
        endDate: '',
      });

      const missingStartAndEndErrorMessage =
        !missingStartAndEnd.valid && missingStartAndEnd.errorMessage;

      expect(missingStartAndEnd.valid).toBe(false);
      expect(missingStartAndEndErrorMessage).toBeString();
      expect(missingStartAndEndErrorMessage).toBe('incomplete');

      const missingStart = rangeValidatorWithMessaging({
        type: 'absolute',
        startDate: '',
        endDate: '1899-12-31T06:01:34.689Z',
      });

      const missingStartErrorMessage =
        !missingStart.valid && missingStart.errorMessage;

      expect(missingStart.valid).toBe(false);
      expect(missingStartErrorMessage).toBeString();
      expect(missingStartErrorMessage).toBe('incomplete');

      const missingEnd = rangeValidatorWithMessaging({
        type: 'absolute',
        startDate: '1899-12-31T06:01:34.689Z',
        endDate: '',
      });

      const missingEndErrorMessage =
        !missingEnd.valid && missingEnd.errorMessage;

      expect(missingEnd.valid).toBe(false);
      expect(missingEndErrorMessage).toBeString();
      expect(missingEndErrorMessage).toBe('incomplete');
    });

    it('is not valid if the start date is after the end date', () => {
      const validation = rangeValidatorWithMessaging({
        type: 'absolute',
        startDate: '1901-12-31T06:01:34.689Z',
        endDate: '1900-12-31T06:01:34.689Z',
      });

      const errorMessage = !validation.valid && validation.errorMessage;

      expect(validation.valid).toBe(false);
      expect(errorMessage).toBeString();
      expect(errorMessage).toBe('invalid');
    });
  });
});
