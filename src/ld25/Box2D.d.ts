// export namespace Box2D {
//     export type b2Body = any;
//     export type b2Vec2 = any;
//     export type b2BodyDef = any;
//     export type b2FixtureDef = any;
//     export type b2CircleShape = any;
//     export type b2World = any;
//     export type b2PolygonShape = any;
// }

declare global {
    const Box2D: {
        b2Vec2: any;
        b2Body: any;
        b2BodyDef: any;
        b2FixtureDef: any;
        b2CircleShape: any;
        b2World: any;
        b2PolygonShape: any;
        b2Contact: any;
        wrapPointer(a: any, b: any): any;
    }
}

// declare const Box2D: {
//     b2Vec2: any;
//     b2Body: any;
//     b2BodyDef: any;
//     b2FixtureDef: any;
//     b2CircleShape: any;
//     b2World: any;
//     b2PolygonShape: any;
// }

// export { };

// declare global {
//     const Box2D: any;
// }

export { };