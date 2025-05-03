import { Actor } from "./Actor";
import { Assets } from "./Assets";
import { BodyTypes, Box2DT } from "./Box2DT";
import { uint } from "./Common";
import { Game } from "./Game";

export class DarkCrystal extends Actor {
	public readonly BONUS: number = 0.85;

	protected override get texture(): string {
		return "dark_crystal";
	}

	protected override get imageSize(): number {
		return 2;
	}

	protected override get radius(): number {
		return 1;
	}

	public constructor(pos: Box2DT.b2Vec2) {
		super(pos);
		this._body.SetType(BodyTypes.staticBody);
		Game.s._player._maxCooldown *= this.BONUS;

		Assets.s.snd("place").play();
	}

	protected override get miniMapColor(): uint {
		return 0xFFFF00FF;
	}

	public override destroyed(): void {
		super.destroyed();

		Game.s._player._maxCooldown /= this.BONUS;
	}

	private _alive: Boolean = true;

	public override wreck(amount: number): void {
		super.wreck(amount);

		if (Math.random() < amount) this._alive = false;
	}

	public override keep(): Boolean {
		return super.keep() && this._alive;
	}
}