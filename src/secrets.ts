import dotenv from "dotenv"

export function ReadSecrets(pathToEnv: string | undefined) {    
    if (!pathToEnv) {
        const output = dotenv.config();
        return MapToResponseOrError(output);
    }

    const output = dotenv.config({
        path: pathToEnv
    });

    return MapToResponseOrError(output);
}

function MapToResponseOrError(output: dotenv.DotenvConfigOutput) : Secrets | string {
    if (output.error) {
        return output.error.message;
    }

    const parsed = output.parsed;

    if (!parsed) {
        return "No secrets found!"; //TODO: provide a more helpful error.
    }

    if (!parsed.SourceToken) {
        return "Must configure a source token!"; //TODO: provide a more helpful error.
    }

    if (!parsed.DestinationToken) {
        return "Must configure a destination token!"; //TODO: provide a more helpful error.
    }

    if (!parsed.SourceApiHost) {
        return "Must configure a source host!"; //TODO: provide a more helpful error.
    }

    if (!parsed.DestinationApiHost) {
        return "Must configure a destination host!"; //TODO: provide a more helpful error.
    }

    return {
        SourceToken: parsed.SourceToken,
        SourceApiHost: parsed.SourceApiHost,
        DestinationToken: parsed.DestinationToken,
        DestinationApiHost: parsed.DestinationApiHost
    };
}

export type Secrets = {
    SourceToken: string
    SourceApiHost: string
    DestinationToken: string
    DestinationApiHost: string
}
