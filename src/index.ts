#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';

import { Configuration, ReadConfiguration } from './configuration';

const cli = new Command()
  .name("git-repo-mover")
  .version('0.0.1')
  .description('Move git repos around!');

const run = new Command()
  .name("run")
  .description("Applies the given configuration. With no other flags passed, this will display what the tool plans on doing.")
  .option("-c, --config-path <string>", "The path to the configuration file.", "./config.yaml")
  .option("--apply", "Applies the given configuration.", false)  
  .action((_, opts) => {
    const { apply, configPath } = opts.opts();    

    console.log(opts.opts());

    const response = ReadConfiguration(configPath);

    if(response.Errors) {
      console.log("Errors detected in configuration file:")
      response.Errors.forEach((error) => {
        console.log(`* ${error}`);
      })
      return;
    }

    const config = response.Config;

    if (!apply) {
      runDryRun(config);
    }

    if (apply) {
      runApply(config);
    }
  });

cli.addCommand(run)
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  cli.outputHelp();
}

function runDryRun(config: Configuration) {
  console.log("Configuration is as follows:")
  console.log("")
  console.log(config)
  console.log("")
  const amountOfReposToMove = config.repos.length;
  console.log(`The plan is to create and move ${amountOfReposToMove} repo${amountOfReposToMove == 1 ? "" : "s"}.`)
}

function runApply(config: Configuration) {
  throw new Error('Function not implemented.');
}
