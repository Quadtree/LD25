import { FreeCamera, HemisphericLight, Mesh, Scene, Vector3 } from "@babylonjs/core";
import { Game } from "../util/Game";
import { GameManager } from "../util/GameManager";


export default class implements Game {
    requireXR = true

    async init(gameManager: GameManager): Promise<void> {
        var scene = gameManager.scene;
        var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(gameManager.canvas, true);
        var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        var sphere = Mesh.CreateSphere("sphere1", 16, 2, scene);
        sphere.position.y = 1;

        const env = scene.createDefaultEnvironment();

        if (!env) throw new Error("No env!");
        if (!env.ground) throw new Error("No ground! AAAAAAA!!!")

        const xr = await scene.createDefaultXRExperienceAsync({
            floorMeshes: [env.ground]
        });
    }
    update(delta: number): void {

    }
}