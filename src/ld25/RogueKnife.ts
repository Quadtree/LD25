import { int } from "@babylonjs/core";
import { uint } from "./Common";
import { Projectile } from "./Projectile";
import { Rogue } from "./Rogue";
import { Box2DT } from "./Box2DT";
import { Actor } from "./Actor";
import { Villager } from "./Villager";

export class RogueKnife extends Projectile {
	protected _thrower!: Rogue;

	protected override get categoryBits(): uint {
		return 0x2;
	}

	protected override get maskBits(): uint {
		return 0x2;
	}

	protected override get group(): int {
		return -2;
	}

	protected override get texture(): string {
		return "rogueknife";
	}

	protected override get projectileSpeed(): number {
		return 17;
	}

	protected override get density(): number {
		return 0.15;
	}

	public constructor(pos: Box2DT.b2Vec2, target: Box2DT.b2Vec2, thrower: Rogue) {
		super(pos, target);
		this._thrower = thrower;
		this._body.SetAngularVelocity(15);
		this._body.SetFixedRotation(false);
	}

	public override beginContact(other: Actor): void {
		super.beginContact(other);

		if (other instanceof Villager) this._thrower.setMessage("Whoops!", "Uh, acceptable collateral damage.", "Wow, he's throwing knives now?", "Who threw that?!", "Did anybody see that?", "Sorry!");

		other.takeDamage(0.9);
		other.wreck(0.05);
	}

}