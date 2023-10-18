import { Octokit } from "octokit";
import { Secrets } from "../secrets";
import { CreateFailure, CreateRepoOptions, CreateSuccess, IRepoManager } from "./repoManager";
import { getErrorMessage } from "../helpers";

export class GitHubRepoManager implements IRepoManager {
    public Scm = "github";
    secrets: Secrets;
    sourceOctokit: Octokit;
    destinationOctoKit: Octokit;

    constructor(secrets: Secrets) {
        this.secrets = secrets;

        this.sourceOctokit = new Octokit({ auth: secrets.SourceToken, baseUrl: secrets.SourceApiHost });
        this.destinationOctoKit = new Octokit({ auth: secrets.DestinationToken, baseUrl: secrets.DestinationApiHost });
    }

    async ListRepos(account: string): Promise<string[]> {
        const repos = await this.sourceOctokit.paginate(this.sourceOctokit.rest.repos.listForUser, {
            username: account
        });

        const repoUrls = repos.map(r => r.html_url);

        return repoUrls;
    }

    async CreateRepo(options: CreateRepoOptions): Promise<CreateSuccess | CreateFailure> {
        if (options.type != "user") {
            return {
                Succeeded: false,
                Message: "Only user based repositories are supported for creation at this point in time."
            }
        }

        const { Name } = ParseRepoUrlParts(options.path);

        try {
            const response = await this.destinationOctoKit.rest.repos.createForAuthenticatedUser({
                name: Name,
                private: true // TODO: allow to be configurable?
            });

            if (response.status < 200 || response.status > 299) {
                return {
                    Succeeded: false,
                    Message: `Create repo did not return a successful code: ${response.status}`
                };
            }

            return {
                Succeeded: true
            };
        }
        catch (e) {
            return {
                Succeeded: false,
                Message: getErrorMessage(e)
            };
        }
    }

    DeleteRepo(path: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}

function ParseRepoUrlParts(path: string) {
    const parts = path.split("/");
    return {
        Org: parts[parts.length - 2],
        Name: parts[parts.length - 1]
    };
}