import { Box2DT } from "./Box2DT";
import { int } from "./Common";
import { Game } from "./Game";
import { GoodGuy } from "./GoodGuy";

export class Knight extends GoodGuy {
	protected _aggroed: Boolean = false;

	protected _swingTimer: int = 0;

	protected override get armor(): number {
		return 4;
	}

	protected override get movePower(): number {
		return 4;
	}

	protected override get texture(): string {
		return "knight";
	}

	public constructor(pos: Box2DT.b2Vec2) {
		super(pos);
	}

	public override update(): void {
		super.update();

		this._dest = Game.s._player.position;

		if (!this._aggroed && Math.pow(this._dest.x - this.position.x, 2) + Math.pow(this._dest.y - this.position.y, 2) < (15 * 15)) {
			this.setMessage("There he is!", "Get him!", "For the light!", "For puppies!", "Yaaaaaaaaa!", "Chaaarge!", "Attack!", "Prepare to die, tyrant!");
			this._aggroed = true;
		}

		this._swingTimer--;
		if (this._swingTimer <= 0 && Math.pow(this._dest.x - this.position.x, 2) + Math.pow(this._dest.y - this.position.y, 2) < 2) {
			this._swingTimer = 90;
			Game.s._player.takeDamage(0.8);
		}
	}
}