import { Camera, UniversalCamera, Vector3 } from "@babylonjs/core";
import { Assets } from "./ld25/Assets";
import { Game } from "./ld25/Game";
import { Game as GameInterface } from "./util/Game";
import { GameManager } from "./util/GameManager";
import { initializeTypes } from "./ld25/ActorFactory";



export default class implements GameInterface {
    requireXR = false;

    async init(gameManager: GameManager): Promise<void> {
        await Assets.s.loadAll(gameManager.scene);

        await initializeTypes();

        (window as any).Box2D = await (window as any).Box2D();

        new Game(gameManager.scene);

        const cam = new UniversalCamera("MainCamera", new Vector3(96, 96, -60), gameManager.scene);
        cam.setTarget(new Vector3(96, 96, 0));

        gameManager.scene.onKeyboardObservable.add((evt) => Game.s.keyDown(evt));
        gameManager.scene.onPointerObservable.add((evt) => Game.s.touch(evt));
    }

    elapsedTime = 0;

    update(delta: number): void {
        this.elapsedTime += delta;
        if (this.elapsedTime >= 0.016) {
            Game.s.update();
            this.elapsedTime = Math.min(this.elapsedTime - 0.016, 0.04);
        }
    }
}