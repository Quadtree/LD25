import { Actor } from "./Actor";
import { Assets } from "./Assets";
import { Box2DT } from "./Box2DT";
import { int } from "./Common";
import { Game } from "./Game";
import { Player } from "./Player";
import { Projectile } from "./Projectile";
import { RogueKnife } from "./RogueKnife";
import { Spark } from "./Spark";
import { Unit } from "./Unit";

export class FireBolt extends Projectile {
	protected _target!: Unit;

	protected override get group(): int {
		return -3;
	}

	protected override get projectileSpeed(): number {
		return 25;
	}

	public constructor(startPos: Box2DT.b2Vec2, target: Unit) {
		super(startPos, target.position);
		this._target = target;
	}

	protected override get texture(): string {
		return "flamespark";
	}

	public override beginContact(other: Actor): void {
		super.beginContact(other);
		if (!(other instanceof RogueKnife) && !(other instanceof Player)) {
			other.takeDamage(0.25);
			this._lifespan = 0;
		}
	}

	protected override get radius(): number {
		return 0.3;
	}

	protected override get imageSize(): number {
		return 0.6;
	}

	public override update(): void {
		super.update();

		if (!this._target.keep()) this._lifespan = 0;

		var delta: Box2DT.b2Vec2 = this._target.position;
		delta.op_sub(this.position);
		delta.Normalize();
		delta.op_mul(this.projectileSpeed);

		this._body.SetLinearVelocity(delta);
	}

	public override destroyed(): void {
		super.destroyed();

		Assets.s.snd("firespark_hit").play();

		for (var i: int = 0; i < 3; ++i)
			Game.s._actors.push(new Spark(this.position, 10, 0.5, 40, "flamespark"));
	}

}