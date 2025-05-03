import { Actor } from "./Actor";
import { Box2DT } from "./Box2DT";
import { int } from "./Common";
import { Game } from "./Game";
import { GoodGuy } from "./GoodGuy";
import { RogueKnife } from "./RogueKnife";

export class Rogue extends GoodGuy {
	protected _throwTimer: int = 0;

	protected _aggroed: Boolean = false;

	protected override get armor(): number {
		return 3;
	}

	protected override get texture(): string {
		return "rogue";
	}

	public constructor(pos: Box2DT.b2Vec2) {
		super(pos);
	}

	public override update(): void {
		super.update();

		this._dest = Game.s._player.position;

		var range: number = Math.pow(this._dest.x - this.position.x, 2) + Math.pow(this._dest.y - this.position.y, 2);

		if (!this._aggroed && range < (15 * 15)) {
			this.setMessage("Target spotted.", "Easy contract.", "Moving in.", "You distract him while I move in.", "I've got your back.");
			this._aggroed = true;
		}

		if (range < (12 * 12)) {
			this._dest = this.position;
			this._throwTimer--;

			if (this._throwTimer <= 0) {
				var dist: number = Math.sqrt(Math.pow(Game.s._player.position.x - this.position.x, 2) + Math.pow(Game.s._player.position.y - this.position.y, 2));
				var angle: number = Math.atan2(Game.s._player.position.y - this.position.y, Game.s._player.position.x - this.position.x);

				angle += (Math.random() - 0.5) * 0.35;

				Game.s._actors.push(new RogueKnife(this.position, new Box2D.b2Vec2(this.position.x + Math.cos(angle), this.position.y + Math.sin(angle)), this));

				this._throwTimer = 40;
			}
		}
	}

	public override takeTrapDamage(amount: number): void {
	}
}
