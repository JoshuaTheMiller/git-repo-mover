import { Command } from "@commander-js/extra-typings";
import { ReadSecrets, Secrets } from "../secrets";
import fs from "fs";
import yaml from "js-yaml";
import { GitHubRepoManager } from "../repoManagers/githubRepoManager";

export const generateConfigurationCommand = new Command()
    .name("generate-configuration")
    .description("A convenience command that can be used to generate a configuration file from an existing list of repositories.")
    .option("--source-type <string>", "The type of source system to use for authentication purposes (e.g., `github`).")
    .option("--destination-type <string>", "The type of source system to use for authentication purposes (e.g., `github`).")
    .option("-c, --config-path <string>", "The path where the config file will be created.", "./config.yaml")
    .option("-s, --secret-config-path <string>", "The path to the configuration file that contains sensitive data (i.e., Personal Access Tokens)")
    .option("-a, ---account <string>", "The name of the user or organization that will be queried for repositories. For example, this could be the name of your GitHub User account.")
    .option("-d, --destination  <string>", "The URL of the destination host and org/account, including Scheme (e.g., `https://github.com/JoshuaTheMiller`).")
    .action((_, opts) => {
        const { Account, configPath, secretConfigPath, destination, sourceType, destinationType } = opts.opts();
        if (!Account) {
            console.log("Source Account must be supplied (pass --help for more information)");
            return;
        }
        if (!destination) {
            console.log("Destination must be supplied (pass --help for more information)");
            return;
        }
        if (!sourceType) {
            console.log("SourceType must be supplied (pass --help for more information)");
            return;
        }
        if (!destinationType) {
            console.log("DestinationType must be supplied (pass --help for more information)");
            return;
        }
        
        const secretsResponse = ReadSecrets(secretConfigPath);
        if (typeof secretsResponse == "string") {
            console.log(`An error with secrets was detected: ${secretsResponse}`);
            return;
        }

        const config = {
            Secrets: secretsResponse,
            Account: Account,
            Destination: destination,
            ConfigPath: configPath,
            SourceType: sourceType,
            DestinationType: destinationType
        };
        
        generateConfig(config);
    });

type GenerateConfigConfig = {
    Secrets: Secrets
    Account: string
    Destination: string
    ConfigPath: string
    SourceType: string
    DestinationType: string
};

async function generateConfig(config: GenerateConfigConfig) {
    const { Account, ConfigPath, Destination, Secrets, SourceType, DestinationType } = config;
    const repoManager = new GitHubRepoManager(Secrets);

    const repos = await repoManager.ListRepos(Account);

    const basicConfig = {
        sourceSystem: SourceType,
        destinationSystem: DestinationType,
        repos: repos.map(r => {
            const repoParts = r.split("/");
            const name = repoParts[repoParts.length - 1];
            return {
                destination: `${Destination}/${name}`,
                source: r
            };
        })
    };
    const configAsString = yaml.dump(basicConfig);

    fs.writeFileSync(ConfigPath, configAsString);
};