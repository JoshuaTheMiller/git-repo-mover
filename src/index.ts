#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';
import yaml from "js-yaml"
import fs from "fs"
import { Configuration } from './interfaces';

const cli = new Command()
  .name("git-repo-mover")
  .version('0.0.1')
  .description('Move git repos around!');

const run = new Command()
  .name("run")
  .description("Applies the given configuration. With no other flags passed, this will display what the tool plans on doing.")
  .option("-c, --config-path <string>", "The path to the configuration file.", "./config.yaml")
  .option("--apply", "Applies the given configuration.", false)
  .option("--delete-source-repos", "💣 DANGEROUS! Deletes the list of source repositories.", false)
  .action((_, opts) => {
    const { apply, configPath, deleteSourceRepos } = opts.opts();    

    console.log(opts.opts());

    if (apply && deleteSourceRepos) {
      // TODO: consider splitting apply and delete into subcommands to further
      // cement their seperation.
      console.log("For safety, apply and deletion cannot be done at the same time!");
      return;
    }

    const config = yaml.load(fs.readFileSync(configPath, 'utf8')) as Configuration;

    if (!apply && !deleteSourceRepos) {
      runDryRun(config);
    }

    if (apply) {
      runApply(config);
    }

    if (deleteSourceRepos) {
      runDelete(config);
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

function runDelete(config: Configuration) {
  throw new Error('Function not implemented.');
}
