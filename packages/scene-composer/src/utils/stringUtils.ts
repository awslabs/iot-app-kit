import { upperFirst, camelCase } from 'lodash';

const templateVarRegex = /{{[^{][\s\S]*?}}/g;

export function pascalCase(text: string) {
  return upperFirst(camelCase(text));
}

/**
 * Converts a string to a number. If string parses to `NaN`, returns optional `defaultValue` or `0`.
 */
export function toNumber(s: string, defaultValue = 0) {
  const num = Number.parseFloat(s);
  return Number.isNaN(num) ? defaultValue : num;
}

/**
 * A simple function to replace variables in a string to support basic
 * string templates. We need this simple implementation instead of something
 * like lodash.template is to avoid CSP violation in the AWS Console.
 * Our use case is really simple and we will most likely replace this with
 * a more standard string intl function when we work on them.
 * This implementation doesn't consider supporting feature like nested, chained
 * replacement.
 *
 * @param template - the template string to evaluate
 * @param params - the parameters to replace the template variables
 * @returns - the evalauted string
 */
export function evalStringTemplate(template: string, params?: Record<string, string>) {
  if (!params) {
    return template;
  }

  const found = template.match(templateVarRegex);
  if (!found) {
    return template;
  }

  const result = found.reduce((prev, curr) => {
    // remove the {{ , }}
    const varName = curr.substring(2, curr.length - 2);
    return prev.replace(curr, varName in params ? params[varName] : '');
  }, template);
  return result;
}
