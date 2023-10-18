export interface RepoManager {
    Scm: string
    CreateRepo(path: string): Promise<boolean>
    DeleteRepo(path: string): Promise<boolean>
}

export type Configuration = {
    sourceSystem: string
    destinationSystem: string
    repos: Repository[]
}

export type Repository = {
    source: string
    destination: string
}