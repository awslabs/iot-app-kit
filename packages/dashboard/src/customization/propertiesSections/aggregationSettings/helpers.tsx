// replacing the underscore in aggregate names with a space
// ex: "STANDARD_DEVIATION" => "standard deviation"
export const aggregateToString = (aggregate?: string): string => {
  return aggregate ? aggregate.replace(/_/g, ' ').toLowerCase() : 'auto';
};
