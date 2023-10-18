export interface IRepoManager {
    Scm: string
    CreateRepo(options: CreateRepoOptions): Promise<CreateSuccess | CreateFailure>
    DeleteRepo(path: string): Promise<boolean>
    ListRepos(account:string):Promise<string[]>
}

export type CreateRepoOptions = {
    path: string,
    type: 'user' // Only 'user' is supported at this point in time
}

export type CreateSuccess = {
    Succeeded: true    
}

export type CreateFailure = {
    Succeeded: false    
    Message: string
}