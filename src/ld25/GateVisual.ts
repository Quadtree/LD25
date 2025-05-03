import { Actor } from "./Actor";
import { Box2DT } from "./Box2DT";

export class GateVisual extends Actor {
	protected override get imageSize(): number {
		return 2.2;
	}

	protected override get texture(): string {
		return "gate";
	}

	public constructor(pos: Box2DT.b2Vec2) {
		super(pos);
	}

	public override update(): void {
		super.update();

		this._image.color.a -= 0.05;

		this._image.angle = Math.random() * Math.PI * 2;
	}

	public override keep(): Boolean {
		return super.keep() && this._image.color.a > 0;
	}

	protected override get hasFixture(): Boolean {
		return false;
	}

}