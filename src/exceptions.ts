export abstract class ResponseException extends Error {
    public abstract readonly status: number;

    constructor(message: string) {
        super(message);
        
        this.name = this.constructor.name
            .replace(/([A-Z])/g, ' $1');
    }
}

// 4XX
export class BadRequestException extends ResponseException { public readonly status = 400; }
export class UnauthorizedException extends ResponseException { public readonly status = 401; }
export class ForbiddenException extends ResponseException { public readonly status = 403; }
export class NotFoundException extends ResponseException { public readonly status = 404; }
export class MethodNotAllowedException extends ResponseException { public readonly status = 405; }
export class NotAcceptableException extends ResponseException { public readonly status = 406; }
export class RequestTimeoutException extends ResponseException { public readonly status = 408; }
export class ConflictException extends ResponseException { public readonly status = 409; }
export class UpgradeRequiredException extends ResponseException { public readonly status = 426; }
export class TooManyRequestsException extends ResponseException { public readonly status = 429; }
// 5XX
export class InternalServerException extends ResponseException { public readonly status = 500; }
export class NotImplementedException extends ResponseException { public readonly status = 501; }
export class BadGatewayException extends ResponseException { public readonly status = 502; }
export class ServiceUnavailableException extends ResponseException { public readonly status = 503; }
export class GatewayTimeoutException extends ResponseException { public readonly status = 504; }
export class HttpVersionNotSupportedException extends ResponseException { public readonly status = 505; }
export class VariantAlsoNegotiatesException extends ResponseException { public readonly status = 506; }
export class InsufficientStorageException extends ResponseException { public readonly status = 507; }
export class LoopDetectedException extends ResponseException { public readonly status = 508; }
export class NotExtendedException extends ResponseException { public readonly status = 510; }
export class NetworkAuthenticationRequiredException extends ResponseException { public readonly status = 511; }
export class NetworkConnectTimeoutException extends ResponseException { public readonly status = 599; }
