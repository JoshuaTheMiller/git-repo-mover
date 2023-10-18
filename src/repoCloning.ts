import path from "path";
import fs from "fs";
import os from "os";
import { simpleGit } from "simple-git";
import crypto from "crypto";
import { getErrorMessage } from "./helpers";

export async function CloneRepository(source:string, destination:string, deleteTempDirectory:boolean): Promise<CloneSucceeded | CloneFailed> {
    const tempDir = getTempDir();
    const remoteName = "Destination123"; // "123" for *slight* uniqueness.
    const git = simpleGit();
    await git.clone(source, tempDir);

    // Change working directory.
    git.cwd(tempDir);
    git.addRemote(remoteName, destination);

    let pushError: string | undefined; 

    try {
        await git.push([remoteName, "--mirror"]);
    }
    catch(e) {
        pushError = getErrorMessage(e);
    }        

    if (deleteTempDirectory) {
        deleteTempDir(tempDir);
    }
    else {
        console.log(`Skipping deletion of ${tempDir}`);
    }

    if(pushError) {
        return {
            Success: false,
            TempDir: tempDir,
            Message: pushError
        }
    }

    return {
        Success: true,
        TempDir: tempDir
    }
}

function getTempDir() {
    const uniqueName = crypto.randomUUID();
    return path.join(os.tmpdir(), uniqueName);
}

function deleteTempDir(path:string) {
    fs.rmSync(path, { recursive: true, force: true });
}

export type CloneSucceeded = {
    Success: true
    TempDir: string
}

export type CloneFailed = {
    Success: false
    TempDir: string
    Message: string
}
