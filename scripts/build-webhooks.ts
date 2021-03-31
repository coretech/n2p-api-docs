import shell from 'shelljs';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';

console.log(__dirname)

const basePath = path.join(__dirname, '../');
const docsPath = path.join(basePath, './models/webhooks/')
const outFile = path.join(basePath, './reference/webhooks.v1.json');
const inRoot = path.join(basePath, './scripts/base/webhooks.json');

const gitBase = 'https://raw.githubusercontent.com/coretech/n2p-i2-docs/dev';

process.chdir(basePath);

function quit(err: string, param?: string) {
  const message = param ? `: ${param}` : '';
  shell.echo(chalk.red(err + message));
  shell.exit(1);
}

function print(str: string, color: string = 'blue') {
  shell.echo(chalk[color](str));
}

function main() {
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

function buildSpecFile(tags: any[]) {
  const baseSpec = JSON.parse(fs.readFileSync(inRoot, 'utf8'));
  const outSpec = { ...baseSpec};

  tags.forEach(tag => {
    // tag
    outSpec.tags.push({
      name: tag,
      'x-displayName': tag,
      description: `<SchemaDefinition schemaRef="#/components/schemas/${tag}" />`,
    });
    outSpec['x-tagGroups'][0].tags.push(tag);
    // ref
    outSpec.components.schemas[tag] = {
      $ref: `${gitBase}/models/webhooks/${tag}.v1.yaml`,
    };
  });

  // write file
  print(`Writing ${outFile}`, 'greenBright');
  fs.writeFileSync(outFile, JSON.stringify(outSpec, null, 2));
}

(function () {
  main();
})();
