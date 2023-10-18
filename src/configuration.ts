import yaml from "js-yaml"
import fs from "fs"

export type Configuration = {
    sourceSystem: string
    destinationSystem: string
    repos: Repository[]
}

export type Repository = {
    source: string
    destination: string
}

export type ConfigResponse = ErrorResponse | SuccessResponse;

export type ErrorResponse = {
    Errors: string[]
    Config: null
}

export type SuccessResponse = {
    Config: Configuration
    Errors: null
}

export function ReadConfiguration(path: string): ConfigResponse {
    const errors: string[] = [];

    if (!fs.existsSync(path)) {
        errors.push(`No config file found at "${path}"`);
        return {
            Config: null,
            Errors: errors
        }
    }

    const config = yaml.load(fs.readFileSync(path, 'utf8')) as Configuration;

    const acceptedSourceAndDestinations = ["github"];
    const set = new Set(acceptedSourceAndDestinations);

    if (!set.has(config.destinationSystem)) {
        errors.push(`destinationSystem must be one of the following types: [${acceptedSourceAndDestinations}]`);
    }

    if (!set.has(config.sourceSystem)) {
        errors.push(`sourceSystem must be one of the following types: [${acceptedSourceAndDestinations}]`);
    }

    if (config.repos.length < 1) {
        errors.push("A list of repositories must be supplied!");
    }

    if (errors.length > 0) {
        return {
            Config: null,
            Errors: errors
        }
    }

    return {
        Config: config,
        Errors: null
    };
}