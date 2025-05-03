import { GameManager } from "./GameManager";

export interface Game {
    requireXR?: boolean

    init(gameManager: GameManager): Promise<void>;

    update(delta: number): void;
}