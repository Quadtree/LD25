import { Actor } from "./Actor";
import { Box2DT } from "./Box2DT";
import { uint } from "./Common";
import { Game } from "./Game";
import { Projectile } from "./Projectile";
import { Spark } from "./Spark";

export class FrostBolt extends Projectile {
	protected override get group(): uint {
		return -1;
	}

	protected override get projectileSpeed(): number {
		return 10;
	}

	public constructor(startPos: Box2DT.b2Vec2, targetPos: Box2DT.b2Vec2) {
		super(startPos, targetPos);
	}

	protected override get texture(): string {
		return "icebolt";
	}

	protected override get density(): number {
		return 10;
	}

	public override beginContact(other: Actor): void {
		super.beginContact(other);
		other.beginSlide();
	}

	public override update(): void {
		super.update();

		if (Math.random() < 0.2)
			Game.s._actors.push(new Spark(this.position, 2, 0.8, 60, "frostspark"));
	}
}