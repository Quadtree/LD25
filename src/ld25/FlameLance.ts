import { Actor } from "./Actor";
import { Spark } from "./ActorFactory";
import { Assets } from "./Assets";
import { Box2DT } from "./Box2DT";
import { int } from "./Common";
import { Game } from "./Game";
import { Projectile } from "./Projectile";
import { RogueKnife } from "./RogueKnife";

export class FlameLance extends Projectile {
	protected override get group(): int {
		return -1;
	}

	protected override get projectileSpeed(): number {
		return 18;
	}

	public constructor(startPos: Box2DT.b2Vec2, targetPos: Box2DT.b2Vec2) {
		super(startPos, targetPos);
	}

	protected override get texture(): string {
		return "firebolt";
	}

	public override beginContact(other: Actor): void {
		super.beginContact(other);
		if (!(other instanceof RogueKnife)) {
			other.takeDamage(2.5);
			this._lifespan = 0;
		}
	}

	public override update(): void {
		super.update();

		Game.s._actors.push(new Spark(this.position, 2, 0.6, 40, "flamespark"));
	}

	public override destroyed(): void {
		super.destroyed();

		Assets.s.snd("firebolt_hit").play();

		for (var i: int = 0; i < 15; ++i)
			Game.s._actors.push(new Spark(this.position, 10, 1.2, 40, "flamespark"));
	}

}