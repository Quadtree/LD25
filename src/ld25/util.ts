import { Box2DT } from "./Box2DT";

export function copyVector(vec2: Box2DT.b2Vec2): Box2DT.b2Vec2 {
    if (typeof vec2 === "undefined") throw new Error("copyVector did not expect an undefined vector")
    return new Box2D.b2Vec2(vec2.x, vec2.y);
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