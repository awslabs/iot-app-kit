const { toBeValidSvgRect } = require('./matchers/toBeValidSvgRect');
const { toBeNearDate } = require('./matchers/toBeNearDate');
const { toNotOverlap } = require('./matchers/toNotOverlap');

// Register Custom Matchers
expect.extend(toBeNearDate);
expect.extend(toBeValidSvgRect);
expect.extend(toNotOverlap);
