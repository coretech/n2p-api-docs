import shell from 'shelljs';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import yaml from 'js-yaml';
import {
  quit,
  print,
  flattenAllOf,
  readFile,
} from './helpers'

const basePath = path.join(__dirname, '../');
const specBase = path.join(__dirname, 'base-spec.json');

process.chdir(basePath);

interface Options {
  directory: string
  version: string
}

const options: Options = {
  directory: 'webhooks',
  version: 'v1',
};

// global vars
let outSpec: any = {};
let docsPath: string;

/**
 *
 * @param opts
 */
function main() {
  const directoryArg = process.argv[ 2 ] as string
  if (directoryArg) {
    options.directory = directoryArg
  }

  const { directory } = options

  print(`processing - ${directory}`)

  // get path exists
  docsPath = path.join(basePath, 'references/', directory)
  if (!shell.test('-d', docsPath)) {
    quit('Directory does not exist', docsPath);
  }
  shell.cd(docsPath)

  buildBase();

  buildWebhooks();

  saveSpecFile();
}

/**
 * Build base of spec
 */
function buildBase(): void {
  print('Building base...', false)
  const baseSpec = readFile(path.join(__dirname, 'base-spec.json'))

  const infoFile = path.join(docsPath, 'info.yaml')
  const info = readFile(infoFile)

  if (!info) {
    quit(`${infoFile} is missing`)
  }

  Object.assign(outSpec, baseSpec)
  Object.assign(outSpec.info, info)

  print('done')
}

function getSpecFiles(subDir: string = ''): string[] {
  if (subDir) {
    shell.cd(path.join(docsPath, subDir))
  }

  return shell.ls('*.yaml').map(file => file.split('.v')[0]);
}

function saveSpecFile(): void {
  const { directory } = options

  print(`Saving spec file`)

  const outFile = path.join(basePath,
    `./specs/${directory}.${options.version}.json`
  );

  fs.writeFileSync(outFile, JSON.stringify(outSpec, null, 2));
  print(`Successfully wrote ${outFile}`, true, 'greenBright');
}

function buildWebhooks () {
  print(`building webhooks...`, false)
  shell.cd('./webhooks')

  // get all tags
  const specNames = getSpecFiles()

  if (!specNames.length) {
    print('skipped')
    return
  }

  specNames.forEach((specName, i) => {
    const spec = readFile(path.join(shell.pwd().toString(), `${specName}.v1.yaml`))

    if (!spec) return

    let properties: {}
    if (spec['allOf']) {
      properties = flattenAllOf(spec[ 'allOf' ], shell.pwd().toString())
    }

    // build webhook
    outSpec.webhooks[specName] = {
      summary: spec['summary'],
      description: spec['description'],
      post: {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  '$ref': `#/components/schemas/${specName}`
                },
                examples: spec['examples']
              }
            }
          }
        }
      }
    }
    // build schema
    outSpec.components.schemas[specName] = {
      type: 'object',
      title: spec['summary'],
      description: spec['description'],
      properties,
    };
  });

  shell.cd('-')
  print('done')
}

(function () {
  main();
})();
