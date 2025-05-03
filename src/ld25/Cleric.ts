import { Actor } from "./Actor";
import { Assets } from "./Assets";
import { Box2DT } from "./Box2DT";
import { int } from "./Common";
import { Game } from "./Game";
import { GoodGuy } from "./GoodGuy";
import { Spark } from "./Spark";
import { Unit } from "./Unit";

export class Cleric extends GoodGuy {
	protected _castTimer: int = 0;

	protected override get texture(): string {
		return "cleric";
	}

	public override get isGood(): Boolean {
		return true;
	}

	public constructor(pos: Box2DT.b2Vec2) {
		super(pos);
	}

	protected override get armor(): number {
		return 2.5;
	}

	public override update(): void {
		super.update();

		var healTarget: Unit | null = null;
		var bestDist: number = Number.MAX_VALUE;

		for (var a of Game.s._actors) {
			if (a.isGood && a != this) {
				if (!a.isInjured && a instanceof Cleric) continue;

				var dist: number = Math.pow(a.position.x - this._body.GetPosition().x, 2) + Math.pow(a.position.y - this._body.GetPosition().y, 2);

				if (!a.isInjured) dist += 100000;

				if (dist < bestDist) {
					bestDist = dist;
					healTarget = a as Unit;
				}
			}
		}

		this._castTimer--;

		if (healTarget) {
			bestDist = Math.pow(healTarget.position.x - this._body.GetPosition().x, 2) + Math.pow(healTarget.position.y - this._body.GetPosition().y, 2);

			if (bestDist < 10 * 10) {
				this._dest = this.position;

				if (healTarget.isInjured && this._castTimer <= 0) {
					this._castTimer = 95;
					healTarget._health = 1;

					Assets.s.snd("heal").play();

					this.setMessage("Light mend your wounds!", "It's going to be alright.", "That looks bad, let me help.", "You'll be alright in a moment.", "What foul creature did this?");

					var steps: int = Math.sqrt(bestDist) + 2;
					var curPos: Box2DT.b2Vec2 = this.position;
					var move: Box2DT.b2Vec2 = new Box2D.b2Vec2(healTarget.position.x - this._body.GetPosition().x, healTarget.position.y - this._body.GetPosition().y);
					move.Normalize();

					for (var i: int = 0; i < steps; ++i) {
						Game.s._actors.push(new Spark(curPos, 0.5, 0.85, 90, "healbeam"));
						curPos.op_add(move);
					}
				}
			} else {
				this._dest = healTarget.position;
			}
		} else {
			this._dest = this.position;
		}
	}
}