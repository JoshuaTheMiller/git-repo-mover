import { Octokit } from "octokit";
import { Secrets } from "../secrets";
import { IRepoManager } from "./repoManager";

export class GitHubRepoManager implements IRepoManager {
    public Scm =  "github";
    secrets : Secrets;
    sourceOctokit:Octokit;
    destinationOctoKit: Octokit;

    constructor(secrets:Secrets) {
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

    CreateRepo(path:string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    DeleteRepo(path:string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}

function ParseRepoUrlParts(path:string) {
    const parts = path.split("/");
    return {
        Org: parts[parts.length - 2],
        Name: parts[parts.length - 1]
    };
}