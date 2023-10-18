interface RepoManager {
    Scm: string
    CreateRepo(path:string):Promise<boolean>
    DeleteRepo(path:string):Promise<boolean>
}