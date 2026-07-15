/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { Request } from '../internal/request';
import { MaybeAsync } from '../utils/types';

/**
 * A guard decides whether an incoming request should reach the handler.
 * Implement this interface and pass the class to @Controller({ guards }) or @Get('path', { guards }).
 */

export type Guard = (request: Request) => MaybeAsync<boolean>;
