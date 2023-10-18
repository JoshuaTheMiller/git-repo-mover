class GitHubRepoManager implements RepoManager {
    public Scm =  "GitHub";

    CreateRepo(path:string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    DeleteRepo(path:string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}