import { getPropertyId } from './getPropertyId';
import { ALARM_ASSET_MODEL_ID, INPUT_PROPERTY_ID } from '../../../__mocks__';

it('extracts the propertyId from an iot events expressions', () => {
  expect(
    getPropertyId(
      `$sitewise.assetModel.${'`'}${ALARM_ASSET_MODEL_ID}${'`'}.${'`'}${INPUT_PROPERTY_ID}${'`'}.propertyValue.value`
    )
  ).toEqual(INPUT_PROPERTY_ID);
});
