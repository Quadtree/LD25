import { Actor } from "./Actor";
import { Box2DT } from "./Box2DT";


export class BigGateVisual extends Actor {
	protected _size: number = 100;

	protected override get imageSize(): number {
		return this._size;
	}

	protected override get texture(): string {
		return "gate";
	}

	public constructor(pos: Box2DT.b2Vec2) {
		super(pos);
	}

	public override update(): void {
		super.update();

		this._size *= 0.975;
		this._size -= 0.25;

		this._image.width = this._size;
		this._image.height = this._size;

		this._image.angle = Math.random() * Math.PI * 2;
	}

	public override keep(): Boolean {
		return this._size > 0;
	}

	protected override get hasFixture(): Boolean {
		return false;
	}
}