import { Actor } from "./Actor";
import { Box2DT } from "./Box2DT";
import { int } from "./Common";
import { copyVector, setBodyRotation } from "./util";

export class Projectile extends Actor {
	protected get projectileSpeed(): number { return 0; }

	protected _lifespan: int = 180;

	public constructor(startPos: Box2DT.b2Vec2, targetPos: Box2DT.b2Vec2) {
		super(startPos);

		var delta: Box2DT.b2Vec2 = copyVector(targetPos);
		delta.op_sub(startPos);
		delta.Normalize();
		delta.op_mul(this.projectileSpeed * this._body.GetMass());

		this._body.ApplyLinearImpulse(delta, this._body.GetWorldCenter());

		setBodyRotation(this._body, Math.atan2(targetPos.y - startPos.y, targetPos.x - startPos.x));
	}

	public override update(): void {
		super.update();

		this._lifespan--;
	}

	public override keep(): Boolean {
		return super.keep() && this._lifespan > 0;
	}
}