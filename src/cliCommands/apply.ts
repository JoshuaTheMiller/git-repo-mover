import { Command } from "@commander-js/extra-typings";
import { Configuration, ReadConfiguration, Repository } from "../configuration";
import { ReadSecrets, Secrets } from "../secrets";
import { GitHubRepoManager } from "../repoManagers/githubRepoManager";
import fs from "fs";
import { CloneRepository } from "../repoCloning";

export const applyCommand = new Command()
    .name("apply")
    .description("Applies the given configuration. With no other flags passed, this will display what the tool plans on doing.")
    .option("-c, --config-path <string>", "The path to the configuration file.", "./config.yaml")
    .option("-s, --secret-config-path <string>", "The path to the configuration file that contains sensitive data (i.e., Personal Access Tokens)")
    .option("-d, --delete-temp-directories", "Delete all temporary directories that were created during the execution of this tool.", true)
    .option("--accept", "Accepts and applies the given configuration.", false)
    .action((_, opts) => {
        const { accept, configPath, secretConfigPath, deleteTempDirectories } = opts.opts();

        console.log(opts.opts());

        const response = ReadConfiguration(configPath);

        if (response.Errors) {
            console.log("Errors detected in configuration file:")
            response.Errors.forEach((error) => {
                console.log(`* ${error}`);
            })
            return;
        }

        const secretsResponse = ReadSecrets(secretConfigPath);
        if (typeof secretsResponse == "string") {
            console.log(`An error with secrets was detected: ${secretsResponse}`);
            return;
        }

        const config = {
            Config: response.Config,
            Secrets: secretsResponse
        };

        if (!accept) {
            runDryRun(config);
            return;
        }

        runApply(config, deleteTempDirectories);
    });

type ApplyConfig = {
    Config: Configuration
    Secrets: Secrets
}

function runDryRun(config: ApplyConfig) {
    console.log("Configuration is as follows:")
    console.log("")
    console.log(config.Config) // DO NOT OUTPUT SECRETS TO CONSOLE
    console.log("")
    const amountOfReposToMove = config.Config.repos.length;
    console.log(`The plan is to create and move ${amountOfReposToMove} repo${amountOfReposToMove == 1 ? "" : "s"}.`)
    console.log("")
    console.log(`Run "git-repo-mover apply --accept" to execute the transfer.`)
}

async function runApply(config: ApplyConfig, deleteTempDirectories: boolean) {
    const repoManager = new GitHubRepoManager(config.Secrets);
    const outputFileName = ".output.json";
    let responses: CloneResponse[] = [];

    if (fs.existsSync(outputFileName)) {
        responses = JSON.parse(fs.readFileSync(outputFileName, 'utf8')) as CloneResponse[];
    }

    const existingResponseMap = new Map(responses.map((res) => {
        return [res.repo, res];
    }));

    try {
        for (const repo of config.Config.repos) {
            const potentialExistingResponse = CheckForExistingResponse(existingResponseMap, repo);

            if (potentialExistingResponse == false) {
                // Continue as normal.
                // I'm using this first `if` to get nice typing checking later on.
            }
            else if (potentialExistingResponse.status != "transferred") {
                console.log(`PROBLEM --> Problem encountered with "${repo.source}". Run the following command for more help: "git-repo-mover help output"`);
                continue;
            }
            else if (potentialExistingResponse.status == "transferred") {
                console.log(`SKIPPING --> "${repo.source}" has already been transferred! Skipping.`);
                continue;
            }

            const repoCreateResponse = await repoManager.CreateRepo({
                path: repo.destination,
                type: 'user'
            });

            if (!repoCreateResponse.Succeeded) {
                // TODO: write to output
                responses.push({
                    repo: repo.source,
                    status: "failed",
                    message: repoCreateResponse.Message
                });
                continue;
            }

            const cloneResponse = await CloneRepository(repo.source, repo.destination, deleteTempDirectories);

            if (!cloneResponse.Success) {
                responses.push({
                    repo: repo.source,
                    status: "failed",
                    message: cloneResponse.Message
                })
                continue;
            }

            responses.push({
                repo: repo.source,
                status: "transferred"
            });
        }
    }
    finally {
        // The last argument causes the file to be "prettified"
        fs.writeFileSync(".output.json", JSON.stringify(responses, null, 2));
    }
}

type CloneResponse = CloneSuccess | CloneFailure;

type CloneSuccess = {
    repo: string,
    status: "transferred"
}

type CloneFailure = {
    repo: string,
    status: "failed"
    message: string
}

function CheckForExistingResponse(existingResponseMap: Map<string, CloneResponse>, repo: Repository) {
    if (existingResponseMap.has(repo.source)) {
        return existingResponseMap.get(repo.source)!;
    }

    return false;
}
