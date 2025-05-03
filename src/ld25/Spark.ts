import { Actor } from "./Actor";
import { Box2DT } from "./Box2DT";
import { int } from "./Common";
import { setBodyRotation } from "./util";

export class Spark extends Actor {
	protected _texture: string;
	protected _size: number;
	protected _lifetime: int;
	protected _maxLifetime: int;

	protected override get texture(): string {
		return this._texture;
	}

	protected override get imageSize(): number {
		return this._size;
	}

	protected override get hasFixture(): Boolean {
		return false;
	}

	public constructor(pos: Box2DT.b2Vec2, speed: number, size: number, lifetime: int, texture: string) {
		super(pos, { textureOverride: texture, imageSize: size });

		this._texture = texture;
		this._size = size;
		this._lifetime = lifetime;
		this._maxLifetime = lifetime;

		this._body.SetLinearVelocity(new Box2D.b2Vec2((Math.random() * 2 - 1) * speed, (Math.random() * 2 - 1) * speed));
		this._body.SetFixedRotation(false);
		setBodyRotation(this._body, Math.random() * Math.PI * 2);
		this._body.SetAngularVelocity(Math.random());
	}

	override update(): void {
		super.update();

		this._image.color.a = this._lifetime / this._maxLifetime;

		this._lifetime--;
	}

	override keep(): Boolean {
		return this._lifetime > 0;
	}
}