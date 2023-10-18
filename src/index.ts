#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';
import { applyCommand } from './cliCommands/apply';
import { generateConfigurationCommand } from './cliCommands/generateConfig';

const cli = new Command()
  .name("git-repo-mover")
  .version('0.0.1')
  .description('Move git repos around!');

cli.addCommand(applyCommand)
  .addCommand(generateConfigurationCommand)
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  cli.outputHelp();
}