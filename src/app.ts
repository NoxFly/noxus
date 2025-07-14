export interface IApp {
    dispose(): Promise<void>;
    onReady(): Promise<void>;
}
