export type StorageResponse<Resource> = {
    status: Status;
    resource: Resource | undefined;
}

export enum Status {
    Ok = 200,
    Created = 201,
    NotFound = 404,
    BadRequest = 400,
    Error = 500,
    NoContent = 204
}