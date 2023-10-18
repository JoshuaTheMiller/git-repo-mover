import { RepoManager } from "./interfaces";

class GitHubRepoManager implements RepoManager {
    public Scm =  "github";

    CreateRepo(path:string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    DeleteRepo(path:string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}