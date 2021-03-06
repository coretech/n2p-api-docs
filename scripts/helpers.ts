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

export function print(str: string, newLine = true, color: string = 'blue') {
  newLine
    ? shell.echo(chalk[color](str))
    : shell.echo('-n', chalk[color](str));
}

export const readSpecFile = (spec: string) => readFile(path.join(shell.pwd().toString(), `${spec}.v1.yaml`))

export const readFile = (path: string) => {
  let parser: Function
  if (path.endsWith('yaml') || path.endsWith('yml')) {
    parser = yaml.load
  } else if (path.endsWith('json')) {
    parser = JSON.parse
  } else {
    throw Error('file does not exist or is not of type yaml or json')
  }

  const file = fs.readFileSync(path, 'utf-8')

  if (file.length === 0) return

  return parser(file)
}

export const flattenAllOf = (allOf: Array<{ '$ref': string} | { properties: object}>, basePath: string = shell.pwd().toString()) => {
  let properties = {}

  allOf.reverse().forEach(refObj => {
    const ref = refObj['$ref']

    if (ref) {
      const spec = readFile(path.join(basePath, ref))
      if (spec) {
        properties = Object.assign(spec['properties'], properties)
      }
    }
  })

  const originalProperties = allOf.filter(spec => spec['properties'])?.[0]?.['properties']
  if (originalProperties) {
    Object.entries(originalProperties).forEach(([key, value]) => {
      // @ts-ignore
      const enumVal = value?.enum
      if (enumVal) {
        properties[key].enum = enumVal
      }
      if (!properties[key]) {
        properties[key] = value
      }
    })
  }

  return properties
}

export const getSpecFiles = (prefix = ''): string[] => {
  const fileGlob = `${prefix}*.yaml`

  // check if yaml files exist
  if (!shell.ls('-A').length || !shell.ls('-A', fileGlob).length) {
    return []
  }

  return shell.ls(fileGlob).map(file => file.split('.v')[0]);
}
