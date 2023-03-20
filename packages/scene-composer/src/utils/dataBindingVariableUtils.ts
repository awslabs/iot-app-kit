// Match ${xyz} where xyz can be anything except new line, and as few as possible
const bindingVariableRegex = /\$\{.+?\}/gi;
const UNAVAILABLE_DATA = '-';

export function replaceBindingVariables(content: string, bindingValuesMap: Record<string, string>): string {
  let result = content;

  const variableMatches = content.match(bindingVariableRegex) || [];
  const variables = variableMatches.map((v: string) => v.substring(2, v.length - 1));
  // Only support replace variable with their latest property value for now.
  variables.forEach((variable, index) => {
    // Display "-" when value not available
    const value = bindingValuesMap[variable] || UNAVAILABLE_DATA;
    result = result.replaceAll(variableMatches[index], value);
  });

  return result;
}
