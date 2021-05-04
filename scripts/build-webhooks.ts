import shell from 'shelljs';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import yaml from 'js-yaml';
import { merge } from 'openapi-merge';
import {
  quit,
  print,
  flattenAllOf,
} from './helpers'

const basePath = path.join(__dirname, '../');
const docsPath = path.join(basePath, './models/webhooks/')
const outFile = path.join(basePath, './reference/webhooks.v1.json');
const inRoot = path.join(basePath, './scripts/base/webhooks.json');

process.chdir(basePath);

interface Options {}

const defaultOptions: Options = {};

function main(opts: Options = defaultOptions) {
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

  buildSpecFile(specs);
}

function buildSpecFile (tags: any[]) {
  const baseSpec = JSON.parse(fs.readFileSync(inRoot, 'utf8'));
  const outSpec = { ...baseSpec};

  outSpec.openapi = '3.1.0'
  outSpec.webhooks = {}

  tags.forEach((tag, i) => {
    const spec = yaml.load(fs.readFileSync(path.join(docsPath, `${tag}.v1.yaml`), 'utf8'))

    const properties = flattenAllOf(spec['allOf'], docsPath)

    // build webhook
    outSpec.webhooks[tag] = {
      summary: spec['summary'],
      description: spec['description'],
      post: {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  '$ref': `#/components/schemas/${tag}`
                },
                examples: spec['examples']
              }
            }
          }
        }
      }
    }
    // build schema
    outSpec.components.schemas[tag] = {
      type: 'object',
      title: spec['summary'],
      description: spec['description'],
      properties,
    };
  });

  // write file
  print(`Writing ${outFile}`, 'greenBright');
  fs.writeFileSync(outFile, JSON.stringify(outSpec, null, 2));
}

(function () {
  main();
})();
