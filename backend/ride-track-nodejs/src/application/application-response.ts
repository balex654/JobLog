import { IResource } from "../contract/iresource"

export type ApplicationResponse = {
    status: Status,
    resource: IResource
}

export enum Status {
    Ok = 200,
    Created = 201,
    NotFound = 404,
    BadRequest = 400,
    Error = 500
}