/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

/**
 * Centralizes MessagePort storage for renderer communication and handles
 * push-event delivery back to renderer processes.
 */
import { Injectable } from '../decorators/injectable.decorator';
import { Logger } from '../utils/logger';
import { createRendererEventMessage } from './request';

interface RendererChannels {
    request: Electron.MessageChannelMain;
    socket: Electron.MessageChannelMain;
}

@Injectable({ lifetime: 'singleton' })
export class NoxSocket {
    private readonly channels = new Map<number, RendererChannels>();

    public register(senderId: number, requestChannel: Electron.MessageChannelMain, socketChannel: Electron.MessageChannelMain): void {
        this.channels.set(senderId, { request: requestChannel, socket: socketChannel });
    }

    public get(senderId: number): RendererChannels | undefined {
        return this.channels.get(senderId);
    }

    public unregister(senderId: number): void {
        this.channels.delete(senderId);
    }

    public getSenderIds(): number[] {
        return [...this.channels.keys()];
    }

    public emit<TPayload = unknown>(eventName: string, payload?: TPayload, targetSenderIds?: number[]): void {
        const normalizedEvent = eventName.trim();

        if(normalizedEvent.length === 0) {
            throw new Error('Renderer event name must be a non-empty string.');
        }

        const recipients = targetSenderIds ?? this.getSenderIds();

        for(const senderId of recipients) {
            const channel = this.channels.get(senderId);

            if(!channel) {
                Logger.warn(`No message channel found for sender ID: ${senderId} while emitting "${normalizedEvent}".`);
                continue;
            }

            try {
                channel.socket.port1.postMessage(createRendererEventMessage(normalizedEvent, payload));
            }
            catch(error) {
                Logger.error(`[Noxus] Failed to emit "${normalizedEvent}" to sender ${senderId}.`, error);
            }
        }
    }

    public emitToRenderer<TPayload = unknown>(senderId: number, eventName: string, payload?: TPayload): boolean {
        if(!this.channels.has(senderId)) {
            return false;
        }

        this.emit(eventName, payload, [senderId]);

        return true;
    }
}
