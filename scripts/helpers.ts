import chalk from 'chalk';
import shell from 'shelljs';

export function quit(err: string, param?: string) {
  const message = param ? `: ${param}` : '';
  shell.echo(chalk.red(err + message));
  shell.exit(1);
}

export function print(str: string, color: string = 'blue') {
  shell.echo(chalk[color](str));
}
