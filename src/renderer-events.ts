/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

/**
 * Lightweight event registry to help renderer processes subscribe to
 * push messages sent by the main process through Noxus.
 */
import { IRendererEventMessage, isRendererEventMessage } from 'src/request';

export type RendererEventHandler<TPayload = unknown> = (payload: TPayload) => void;

export interface RendererEventSubscription {
    unsubscribe(): void;
}

export class RendererEventRegistry {
    private readonly listeners = new Map<string, Set<RendererEventHandler>>();

    /**
     *
     */
    public subscribe<TPayload>(eventName: string, handler: RendererEventHandler<TPayload>): RendererEventSubscription {
        const normalizedEventName = eventName.trim();

        if(normalizedEventName.length === 0) {
            throw new Error('Renderer event name must be a non-empty string.');
        }

        const handlers = this.listeners.get(normalizedEventName) ?? new Set<RendererEventHandler>();

        handlers.add(handler as RendererEventHandler);
        this.listeners.set(normalizedEventName, handlers);

        return {
            unsubscribe: () => this.unsubscribe(normalizedEventName, handler as RendererEventHandler),
        };
    }

    /**
     *
     */
    public unsubscribe<TPayload>(eventName: string, handler: RendererEventHandler<TPayload>): void {
        const handlers = this.listeners.get(eventName);

        if(!handlers) {
            return;
        }

        handlers.delete(handler as RendererEventHandler);

        if(handlers.size === 0) {
            this.listeners.delete(eventName);
        }
    }

    /**
     *
     */
    public clear(eventName?: string): void {
        if(eventName) {
            this.listeners.delete(eventName);
            return;
        }

        this.listeners.clear();
    }

    /**
     *
     */
    public dispatch<TPayload>(message: IRendererEventMessage<TPayload>): void {
        const handlers = this.listeners.get(message.event);

        if(!handlers || handlers.size === 0) {
            return;
        }

        handlers.forEach((handler) => {
            try {
                handler(message.payload as TPayload);
            }
            catch(error) {
                console.error(`[Noxus] Renderer event handler for "${message.event}" threw an error.`, error);
            }
        });
    }

    /**
     *
     */
    public tryDispatchFromMessageEvent(event: MessageEvent): boolean {
        if(!isRendererEventMessage(event.data)) {
            return false;
        }

        this.dispatch(event.data);
        return true;
    }

    /**
     *
     */
    public hasHandlers(eventName: string): boolean {
        const handlers = this.listeners.get(eventName);
        return !!handlers && handlers.size > 0;
    }
}
