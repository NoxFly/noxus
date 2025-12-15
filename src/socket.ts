/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

/**
 * Centralizes MessagePort storage for renderer communication and handles
 * push-event delivery back to renderer processes.
 */
import { Injectable } from 'src/decorators/injectable.decorator';
import { createRendererEventMessage } from 'src/request';
import { Logger } from 'src/utils/logger';

interface RendererChannels {
    request: Electron.MessageChannelMain;
    socket: Electron.MessageChannelMain;
}

@Injectable('singleton')
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

    public emit<TPayload = unknown>(eventName: string, payload?: TPayload, targetSenderIds?: number[]): number {
        const normalizedEvent = eventName.trim();

        if(normalizedEvent.length === 0) {
            throw new Error('Renderer event name must be a non-empty string.');
        }

        const recipients = targetSenderIds ?? this.getSenderIds();
        let delivered = 0;

        for(const senderId of recipients) {
            const channel = this.channels.get(senderId);

            if(!channel) {
                Logger.warn(`No message channel found for sender ID: ${senderId} while emitting "${normalizedEvent}".`);
                continue;
            }

            try {
                channel.socket.port1.postMessage(createRendererEventMessage(normalizedEvent, payload));
                delivered++;
            }
            catch(error) {
                Logger.error(`[Noxus] Failed to emit "${normalizedEvent}" to sender ${senderId}.`, error);
            }
        }

        return delivered;
    }

    public emitToRenderer<TPayload = unknown>(senderId: number, eventName: string, payload?: TPayload): boolean {
        return this.emit(eventName, payload, [senderId]) > 0;
    }
}
