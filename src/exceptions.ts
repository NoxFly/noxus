/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

export class ResponseException extends Error {
    public readonly status: number = 0;

    constructor(message?: string);
    constructor(statusCode?: number, message?: string);
    constructor(statusOrMessage?: number | string, message?: string) {
        let statusCode: number | undefined;
        
        if(typeof statusOrMessage === 'number') {
            statusCode = statusOrMessage;
        }
        else if(typeof statusOrMessage === 'string') {
            message = statusOrMessage;
        }

        super(message ?? "");

        if(statusCode !== undefined) {
            this.status = statusCode;
        }
        
        this.name = this.constructor.name
            .replace(/([A-Z])/g, ' $1');
    }
}

// 4XX
export class BadRequestException extends ResponseException { public override readonly status = 400; }
export class UnauthorizedException extends ResponseException { public override readonly status = 401; }
export class PaymentRequiredException extends ResponseException { public override readonly status = 402; }
export class ForbiddenException extends ResponseException { public override readonly status = 403; }
export class NotFoundException extends ResponseException { public override readonly status = 404; }
export class MethodNotAllowedException extends ResponseException { public override readonly status = 405; }
export class NotAcceptableException extends ResponseException { public override readonly status = 406; }
export class RequestTimeoutException extends ResponseException { public override readonly status = 408; }
export class ConflictException extends ResponseException { public override readonly status = 409; }
export class UpgradeRequiredException extends ResponseException { public override readonly status = 426; }
export class TooManyRequestsException extends ResponseException { public override readonly status = 429; }
// 5XX
export class InternalServerException extends ResponseException { public override readonly status = 500; }
export class NotImplementedException extends ResponseException { public override readonly status = 501; }
export class BadGatewayException extends ResponseException { public override readonly status = 502; }
export class ServiceUnavailableException extends ResponseException { public override readonly status = 503; }
export class GatewayTimeoutException extends ResponseException { public override readonly status = 504; }
export class HttpVersionNotSupportedException extends ResponseException { public override readonly status = 505; }
export class VariantAlsoNegotiatesException extends ResponseException { public override readonly status = 506; }
export class InsufficientStorageException extends ResponseException { public override readonly status = 507; }
export class LoopDetectedException extends ResponseException { public override readonly status = 508; }
export class NotExtendedException extends ResponseException { public override readonly status = 510; }
export class NetworkAuthenticationRequiredException extends ResponseException { public override readonly status = 511; }
export class NetworkConnectTimeoutException extends ResponseException { public override readonly status = 599; }
