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

@Injectable('singleton')
export class NoxSocket {
    private readonly messagePorts = new Map<number, Electron.MessageChannelMain>();

    public register(senderId: number, channel: Electron.MessageChannelMain): void {
        this.messagePorts.set(senderId, channel);
    }

    public get(senderId: number): Electron.MessageChannelMain | undefined {
        return this.messagePorts.get(senderId);
    }

    public unregister(senderId: number): void {
        this.messagePorts.delete(senderId);
    }

    public getSenderIds(): number[] {
        return [...this.messagePorts.keys()];
    }

    public emit<TPayload = unknown>(eventName: string, payload?: TPayload, targetSenderIds?: number[]): number {
        const normalizedEvent = eventName.trim();

        if(normalizedEvent.length === 0) {
            throw new Error('Renderer event name must be a non-empty string.');
        }

        const recipients = targetSenderIds ?? this.getSenderIds();
        let delivered = 0;

        for(const senderId of recipients) {
            const channel = this.messagePorts.get(senderId);

            if(!channel) {
                Logger.warn(`No message channel found for sender ID: ${senderId} while emitting "${normalizedEvent}".`);
                continue;
            }

            try {
                channel.port1.postMessage(createRendererEventMessage(normalizedEvent, payload));
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
