import { AbstractMesh, AnimationPropertiesOverride, Color3, DirectionalLight, FreeCamera, HemisphericLight, IWebXRAnchor, IWebXRHitResult, IWebXRHitTestFeature, IWebXRPlane, Matrix, Mesh, MeshBuilder, PolygonMeshBuilder, Quaternion, Scene, SceneLoader, ShadowGenerator, StandardMaterial, TransformNode, Vector2, Vector3, WebXRAnchorSystem, WebXRBackgroundRemover, WebXRDefaultExperience, WebXRHitTest, WebXRPlaneDetector, WebXRState } from "@babylonjs/core";
import { Game } from "../util/Game";
import { GameManager } from "../util/GameManager";
// @ts-ignore
import earcut from "earcut";

const SAVED_ANCHOR_KEY = 'anchor_5';

export default class implements Game {
    requireXR = true

    xr!: WebXRDefaultExperience;

    loaded = false

    async init(gameManager: GameManager): Promise<void> {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = gameManager.scene

        // This creates and positions a free camera (non-mesh)
        var camera = new FreeCamera("camera1", new Vector3(0, 1, -5), scene);

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(gameManager.canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        var dirLight = new DirectionalLight('light', new Vector3(0, -1, -0.5), scene);
        dirLight.position = new Vector3(0, 5, -5);

        var shadowGenerator = new ShadowGenerator(1024, dirLight);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;

        const model = MeshBuilder.CreateIcoSphere('marker', {});

        const xr = await scene.createDefaultXRExperienceAsync({
            uiOptions: {
                sessionMode: "immersive-ar",
                referenceSpaceType: "bounded-floor"
            },
            optionalFeatures: true
        });

        if (!xr) throw new Error("Not in XR mode");

        this.xr = xr;

        const fm = xr.baseExperience.featuresManager;

        const xrTest = fm.enableFeature(WebXRHitTest.Name, "latest") as WebXRHitTest;
        const xrPlanes = fm.enableFeature(WebXRPlaneDetector.Name, "latest") as WebXRPlaneDetector;
        const anchors = fm.enableFeature(WebXRAnchorSystem.Name, 'latest') as WebXRAnchorSystem;

        xr.baseExperience.sessionManager.onXRReferenceSpaceChanged.add(evt => {
            console.log(`onXRReferenceSpaceChanged()`)
            if ((evt as any).boundsGeometry) {
                const bounds = (evt as any).boundsGeometry as DOMPointReadOnly[];
                console.log(`bounds=${JSON.stringify(bounds)}`)
            } else {
                console.log(`We're unbounded!`)
            }
        })

        const xrBackgroundRemover = fm.enableFeature(WebXRBackgroundRemover.Name);

        let b = model;//CylinderBuilder.CreateCylinder('cylinder', { diameterBottom: 0.2, diameterTop: 0.4, height: 0.5 });
        b.rotationQuaternion = new Quaternion();
        // b.isVisible = false;
        shadowGenerator.addShadowCaster(b, true);

        const marker = MeshBuilder.CreateTorus('marker', { diameter: 0.15, thickness: 0.05 });
        marker.isVisible = false;
        marker.rotationQuaternion = new Quaternion();

        let hitTest: IWebXRHitResult | undefined;

        b.isVisible = false;

        if (!localStorage.getItem(SAVED_ANCHOR_KEY)) {
            xrTest.onHitTestResultObservable.add((results) => {
                if (results.length) {
                    marker.isVisible = true;
                    hitTest = results[0];
                    hitTest.transformationMatrix.decompose(undefined, b.rotationQuaternion!, b.position);
                    hitTest.transformationMatrix.decompose(undefined, marker.rotationQuaternion!, marker.position);
                } else {
                    marker.isVisible = false;
                    hitTest = undefined;
                }
            });
        }

        const mat1 = new StandardMaterial('1', scene);
        mat1.diffuseColor = Color3.Red();
        const mat2 = new StandardMaterial('1', scene);
        mat2.diffuseColor = Color3.Blue();

        if (anchors) {
            console.log('anchors attached');
            anchors.onAnchorAddedObservable.add(async anchor => {
                console.log('attaching', anchor);
                b.isVisible = true;

                const root = (await SceneLoader.ImportMeshAsync(null, './assets/human.glb', '', gameManager.scene));

                const mesh = root.meshes[0];
                mesh.scaling = new Vector3(0.33, 0.33, 0.33);

                const rootNode = new TransformNode("RootNode", gameManager.scene);
                rootNode.addChild(mesh);

                anchor.attachedNode = rootNode;

                shadowGenerator.addShadowCaster(mesh, true);

                b.isVisible = false;

                if (!localStorage.getItem(SAVED_ANCHOR_KEY)) {
                    (anchor.xrAnchor as any).requestPersistentHandle().then((uuid: string) => {
                        console.log(`got persistent anchor UUID ${uuid}`)
                        localStorage.setItem(SAVED_ANCHOR_KEY, uuid);
                    }, console.warn)
                }
            })

            anchors.onAnchorRemovedObservable.add(anchor => {
                console.log('disposing', anchor);
                if (anchor) {
                    if (!(anchor.attachedNode instanceof AbstractMesh)) throw new Error(`anchor.attachedNode is the wrong type!`);
                    anchor.attachedNode.isVisible = false;
                    anchor.attachedNode.dispose();
                }
            });
        }

        if (!localStorage.getItem(SAVED_ANCHOR_KEY)) {
            scene.onPointerDown = (evt, pickInfo) => {
                if (hitTest && anchors && xr.baseExperience.state === WebXRState.IN_XR) {
                    anchors.addAnchorPointUsingHitTestResultAsync(hitTest);
                }
            }

            const planes: IWebXRPlane[] = [];

            xrPlanes.onPlaneAddedObservable.add(plane => {
                plane.polygonDefinition.push(plane.polygonDefinition[0]);
                var polygon_triangulation = new PolygonMeshBuilder("name", plane.polygonDefinition.map((p) => new Vector2(p.x, p.z)), scene, earcut);
                var polygon = polygon_triangulation.build(false, 0.01);
                (plane as any).mesh = polygon;

                planes[plane.id] = ((plane as any).mesh);
                const mat = new StandardMaterial("mat", scene);
                mat.alpha = 0.5;
                mat.diffuseColor = Color3.Random();
                polygon.createNormals(false);
                // polygon.receiveShadows = true;
                (plane as any).mesh.material = mat;

                (plane as any).mesh.rotationQuaternion = new Quaternion();
                plane.transformationMatrix.decompose((plane as any).mesh.scaling, (plane as any).mesh.rotationQuaternion, (plane as any).mesh.position);
            });

            xrPlanes.onPlaneUpdatedObservable.add(plane => {
                let mat;
                if ((plane as any).mesh) {
                    mat = (plane as any).mesh.material;
                    (plane as any).mesh.dispose(false, false);
                }
                const some = plane.polygonDefinition.some(p => !p);
                if (some) {
                    return;
                }
                plane.polygonDefinition.push(plane.polygonDefinition[0]);
                var polygon_triangulation = new PolygonMeshBuilder("name", plane.polygonDefinition.map((p) => new Vector2(p.x, p.z)), scene, earcut);
                var polygon = polygon_triangulation.build(false, 0.01);
                polygon.createNormals(false);
                (plane as any).mesh = polygon;
                planes[plane.id] = ((plane as any).mesh);
                (plane as any).mesh.material = mat;
                (plane as any).mesh.rotationQuaternion = new Quaternion();
                plane.transformationMatrix.decompose((plane as any).mesh.scaling, (plane as any).mesh.rotationQuaternion, (plane as any).mesh.position);
                (plane as any).mesh.receiveShadows = true;
            })

            xrPlanes.onPlaneRemovedObservable.add(plane => {
                if (plane && planes[plane.id]) {
                    (planes[plane.id] as any).dispose()
                }
            })

            xr.baseExperience.sessionManager.onXRSessionInit.add(() => {
                planes.forEach(plane => (plane as any).dispose());
                while (planes.pop()) { };
            });
        }
    }

    update(delta: number): void {
        if (localStorage.getItem(SAVED_ANCHOR_KEY) && this.xr.baseExperience.sessionManager.session && !this.loaded) {
            this.loaded = true
            const loadedAnchorData = localStorage.getItem(SAVED_ANCHOR_KEY) as string;

            console.log(`restoring anchor with uuid ${loadedAnchorData}`);

            (this.xr.baseExperience.sessionManager.session as any).restorePersistentAnchor(loadedAnchorData).then((anchor: XRAnchor) => {
                console.log(`finished restoring anchor with uuid ${loadedAnchorData}`)
            })
        }
    }
}