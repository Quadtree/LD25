import { Color4, Vector3 } from "@babylonjs/core";
import { Box2DT } from "./Box2DT";

export function copyVector(vec2: Box2DT.b2Vec2): Box2DT.b2Vec2 {
    if (typeof vec2 === "undefined") throw new Error("copyVector did not expect an undefined vector")
    return new Box2D.b2Vec2(vec2.x, vec2.y);
}

export function addVectors(v1: Box2DT.b2Vec2, v2: Box2DT.b2Vec2): Box2DT.b2Vec2 {
    return new Box2D.b2Vec2(
        v1.x + v2.x,
        v1.y + v2.y
    );
}

export function subtractVectors(v1: Box2DT.b2Vec2, v2: Box2DT.b2Vec2): Box2DT.b2Vec2 {
    return new Box2D.b2Vec2(
        v1.x - v2.x,
        v1.y - v2.y
    );
}

export function setBodyPos(body: Box2DT.b2Body, pos: { x: number, y: number }) {
    const angle = body.GetAngle();
    body.SetTransform(new Box2D.b2Vec2(pos.x, pos.y), angle);
}

export function setBodyRotation(body: Box2DT.b2Body, rotation: number) {
    const pos = body.GetPosition();
    body.SetTransform(pos, rotation);
}

export function b2Vec2ToVec3(vec: Box2DT.b2Vec2, z?: number) {
    return new Vector3(
        vec.x,
        vec.y,
        z ?? 0
    );
}

export function parseFlexColor(nColor: number) {
    const colorString = nColor.toString(16).padStart(8, "0");
    return Color4.FromInts(
        parseInt(colorString.substring(2, 4), 16),
        parseInt(colorString.substring(4, 6), 16),
        parseInt(colorString.substring(6, 8), 16),
        parseInt(colorString.substring(0, 2), 16),
    )
}

export function slightlyRandomizeVector(vec: Box2DT.b2Vec2): Box2DT.b2Vec2 {
    return addVectors(vec, new Box2D.b2Vec2(Math.random() - 0.5, Math.random() - 0.5))
}