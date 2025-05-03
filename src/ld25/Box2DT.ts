export namespace Box2DT {
    export type b2Body = {
        ApplyLinearImpulse(impulse: b2Vec2, centerOfMass: b2Vec2): void
        SetPosition(pos: b2Vec2): void
        GetPosition(): b2Vec2
        SetFixedRotation(fixed: boolean): void
        SetTransform(pos: b2Vec2, rot: number): void
        SetAngularVelocity(av: number): void
        GetLinearVelocity(): b2Vec2
        GetWorldCenter(): b2Vec2
        SetAwake(a: boolean): void
        SetLinearVelocity(vec: b2Vec2): void
        SetType(type: number): void
        GetMass(): number;
        CreateFixture(def: b2FixtureDef): void
        GetAngle(): number
    };
    export type b2Vec2 = {
        x: number,
        y: number,
        Length(): number,
        Normalize(): b2Vec2,
        op_mul(other: number): b2Vec2
        op_sub(other: b2Vec2): b2Vec2
        op_add(other: b2Vec2): b2Vec2
    }
    export type b2BodyDef = any;
    export type b2FixtureDef = any;
    export type b2CircleShape = any;
    export type b2World = any;
    export type b2PolygonShape = any;
    export type b2Fixture = {
        GetBody(): b2Body;
    }
    export type b2Contact = {
        GetFixtureA(): b2Fixture
        GetFixtureB(): b2Fixture
    }
}

export const BodyTypes = {
    staticBody: 0,
    kinematicBody: 1,
    dynamicBody: 2,
}