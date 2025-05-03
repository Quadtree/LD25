import { Actor } from "./Actor";
import { BodyTypes, Box2DT } from "./Box2DT";

export class Hut extends Actor {
	protected override get texture(): string {
		return "hut";
	}

	protected override get imageSize(): number {
		return 4;
	}

	protected override get radius(): number {
		return 2;
	}

	public constructor(pos: Box2DT.b2Vec2) {
		super(pos);

		this._body.SetType(BodyTypes.staticBody);
	}

}