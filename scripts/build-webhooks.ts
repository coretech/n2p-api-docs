import shell from 'shelljs';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import yaml from 'js-yaml';
import { quit, print } from './helpers'

const basePath = path.join(__dirname, '../');
const docsPath = path.join(basePath, './models/webhooks/')
const outFile = path.join(basePath, './reference/webhooks.v1.json');
const inRoot = path.join(basePath, './scripts/base/webhooks.json');

process.chdir(basePath);

interface Options {
  type: 'local' | 'remote';
}

const defaultOptions: Options = {
  type: 'remote',
};

const paths = {
  local: 'http://localhost:8080',
  remote: 'https://raw.githubusercontent.com/coretech/n2p-i2-docs/dev'
}

function main(opts: Options = defaultOptions) {
  const type =
    process.argv[ 2 ] as unknown as Options || opts.type
  // @ts-ignore
  const base = paths[type]

  if (!base) {
    quit('Invalid type [local | remote]')
  }

  if (!shell.test('-d', docsPath)) {
    quit('Directory does not exist', docsPath);
  }

  shell.echo(chalk.blue(`Parsing ${docsPath}`));

  shell.cd(docsPath)

  // list of files to model names
  const specs = shell.ls('*.yaml')
    .map(file => file.split('.v')[0]);
  shell.cd('-')

  if (specs.length < 1) {
    quit('Empty directory');
  }

  buildSpecFile(specs, base);
}

function buildSpecFile (tags: any[], refBase) {
  const baseSpec = JSON.parse(fs.readFileSync(inRoot, 'utf8'));
  const outSpec = { ...baseSpec};

  outSpec.openapi = '3.1.0'
  outSpec.webhooks = {}

  tags.forEach(tag => {
    const spec = yaml.load(fs.readFileSync(path.join(docsPath, `${tag}.v1.yaml`), 'utf8'))

    outSpec.webhooks[tag] = {
      summary: 'this is a summary',
      description: spec['description'],
      get: {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: `${refBase}/models/webhooks/${tag}.v1.yaml`
                },
                examples: spec['examples']
              }
            }
          }
        }
      }
    }
    // tag
    // outSpec.tags.push({
    //   name: tag,
    //   'x-displayName': tag,
    //   description: `<SchemaDefinition schemaRef="#/components/schemas/${tag}" />`,
    // });
    // outSpec['x-tagGroups'][0].tags.push(tag);
    // ref
    outSpec.components.schemas[tag] = {
      $ref: `${refBase}/models/webhooks/${tag}.v1.yaml`,
    };
  });

  // write file
  print(`Writing ${outFile}`, 'greenBright');
  fs.writeFileSync(outFile, JSON.stringify(outSpec, null, 2));
}

(function () {
  main();
})();
