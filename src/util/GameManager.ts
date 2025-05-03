import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Engine } from "@babylonjs/core/Engines/engine";
import { PhysicsViewer } from "@babylonjs/core/Debug/physicsViewer";
import { Scene } from "@babylonjs/core/scene";
import { Quaternion, Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/core/Physics/physicsEngineComponent";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Game } from "./Game";
import { AmmoJSPlugin, WebGPUEngine } from "@babylonjs/core";

declare const Ammo: any;

export class GameManager {
    public readonly canvas: HTMLCanvasElement;
    public readonly engine: WebGPUEngine | Engine;
    public scene!: Scene;

    private lastRender: DOMHighResTimeStamp = performance.now();

    constructor(canvasElement: string, private game: Game) {
        // Create canvas and engine.
        this.canvas = document.getElementById(canvasElement) as unknown as HTMLCanvasElement;

        // currently, WebGPU and WebXR are incompatible
        if (false && navigator.gpu && !game.requireXR) {
            console.log(`=== navigator.gpu=${!!navigator.gpu} game.requireXR=${!!game.requireXR}, using WebGPU ===`)
            this.engine = new WebGPUEngine(this.canvas);
        } else {
            console.log(`=== navigator.gpu=${!!navigator.gpu} game.requireXR=${!!game.requireXR}, falling back on WebGL ===`)
            this.engine = new Engine(this.canvas, true);
        }
    }

    async enablePhysics() {
        await Ammo();
        this.scene.enablePhysics(new Vector3(0, -9.8, 0), new AmmoJSPlugin());
    }

    async init() {
        if (this.engine instanceof WebGPUEngine) {
            await this.engine.initAsync();
        }
        this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
        this.scene = new Scene(this.engine);
        await this.game.init(this);
    }

    setupPhysicsViewer() {
        var physicsViewer = new PhysicsViewer(this.scene);

        const showImposters = (mesh: AbstractMesh) => {
            for (let cm of mesh.getChildMeshes()) {
                showImposters(cm);
            }

            if (mesh.physicsImpostor) {
                console.log(`showing imposters for ${mesh.name}`);
                physicsViewer.showImpostor(mesh.physicsImpostor, mesh as any);
            } else {
                console.log(`NOT showing imposters for ${mesh.name}`);
            }
        }

        this.scene.meshes.forEach(showImposters);
    }

    async start() {
        await this.init();

        this.lastRender = performance.now();

        // Run the render loop.
        this.engine.runRenderLoop(() => {
            this.scene.render();

            const delta = performance.now() - this.lastRender;
            this.lastRender = performance.now();

            this.game.update(delta / 1_000);
        });

        // The canvas/window resize event handler.
        window.addEventListener('resize', () => {
            this.engine.resize();
        });


    }
}
