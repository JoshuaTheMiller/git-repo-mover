import { Command } from "@commander-js/extra-typings";

const validHelpTopics = ["output"];

export const helpCommand = new Command()
    .name("help")
    .description("Provides answers to frequently asked questions")
    .argument("topic", `Valid values are as follows: ${JSON.stringify(validHelpTopics)}`)
    .action((args, _) => {
        switch (args) {
            case "output": {
                console.log(`If you were told to refer to this help command, most likely a SourceRepo was found in ".output.txt" file. If you wish to process this repository, fix the issue listed in the "output.json" file file and then delete the entry for that repository from the ".output.json" file. You are now able to run "git-repo-mover run --apply" again.`);
                break;
            }
            default: {
                console.log(`"${args}" is not a valid help topic!`);
                break;
            }
        }
    });