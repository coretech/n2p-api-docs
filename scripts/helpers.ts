import chalk from 'chalk';
import path from 'path';
import shell from 'shelljs';
import yaml from 'js-yaml';
import fs from 'fs'

export function quit(err: string, param?: string) {
  const message = param ? `: ${param}` : '';
  shell.echo(chalk.red(err + message));
  shell.exit(1);
}

export function print(str: string, color: string = 'blue') {
  shell.echo(chalk[color](str));
}

export const flattenAllOf = (allOf: Array<{ '$ref': string} | { properties: object}>, basePath: string) => {
  let properties = {}

  allOf.reverse().forEach(refObj => {
    const ref = refObj['$ref']
    if (ref) {
      let parser: Function
      if (ref.includes('yaml') || ref.includes('yml')) {
        parser = yaml.load
      } else if (ref.includes('json')) {
        parser = JSON.parse
      } else {
        print('skipping' + ref)
        return
      }

      const spec = parser(fs.readFileSync(path.join(basePath, ref), 'utf8'))
      properties = Object.assign(spec['properties'], properties)
    }
  })

  const originalProperties = allOf.filter(spec => spec['properties'])?.[0]?.['properties']
  if (originalProperties) {
    Object.assign(properties, originalProperties)
  }

  return properties
}
