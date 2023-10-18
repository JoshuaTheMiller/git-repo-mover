import { Command } from "@commander-js/extra-typings";
import { Configuration, ReadConfiguration } from "../configuration";

export const applyCommand = new Command()
    .name("apply")
    .description("Applies the given configuration. With no other flags passed, this will display what the tool plans on doing.")
    .option("-c, --config-path <string>", "The path to the configuration file.", "./config.yaml")
    .option("--accept", "Accepts and applies the given configuration.", false)
    .action((_, opts) => {
        const { accept, configPath } = opts.opts();

        console.log(opts.opts());

        const response = ReadConfiguration(configPath);

        if (response.Errors) {
            console.log("Errors detected in configuration file:")
            response.Errors.forEach((error) => {
                console.log(`* ${error}`);
            })
            return;
        }

        const config = response.Config;

        if (!accept) {
            runDryRun(config);
            return;
        }

        runApply(config);
    });

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