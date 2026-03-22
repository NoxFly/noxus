/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { IResponse, Request } from '../request';
import { MaybeAsync } from '../utils/types';

/**
 * A middleware intercepts requests before they reach guards and the handler.
 * Implement this interface and pass the class to @Controller({ middlewares }) or per-route options.
 */
export type Middleware = (request: Request, response: IResponse, next: NextFunction) => MaybeAsync<void>;
export type NextFunction = () => Promise<void>;
