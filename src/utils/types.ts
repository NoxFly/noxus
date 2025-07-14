/* eslint-disable @typescript-eslint/no-unsafe-function-type */


declare const Type: FunctionConstructor;
export interface Type<T> extends Function {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    new (...args: any[]): T;
}

export type MaybeAsync<T> = T | Promise<T>;