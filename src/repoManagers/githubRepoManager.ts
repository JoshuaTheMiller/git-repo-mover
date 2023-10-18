import { IRepoManager } from "./repoManager";

class GitHubRepoManager implements IRepoManager {
    public Scm =  "github";

    CreateRepo(path:string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    DeleteRepo(path:string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}