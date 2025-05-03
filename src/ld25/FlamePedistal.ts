import { Actor } from "./Actor";
import { Assets } from "./Assets";
import { BodyTypes, Box2DT } from "./Box2DT";
import { int, uint } from "./Common";
import { FireBolt } from "./FireBolt";
import { Game } from "./Game";
import { Unit } from "./Unit";
import { Villager } from "./Villager";

export class FlamePedistal extends Actor {
	_cooldown: int = 60 * 5;

	protected override get group(): int {
		return -3;
	}

	protected override get texture(): string {
		return "flamepedistal";
	}

	public constructor(startPos: Box2DT.b2Vec2) {
		super(startPos);

		this._body.SetType(BodyTypes.staticBody);

		Assets.s.snd("place").play();
	}

	protected override get miniMapColor(): uint {
		return 0xFFFF7700;
	}

	public override update(): void {
		super.update();

		this._cooldown--;

		// @TODO
		// if (this._cooldown <= 0)
		// 	this._image.texture = Assets.s.flamepedistal_ready;
		// else
		// 	this._image.texture = Assets.s.flamepedistal;

		if (this._cooldown <= 0) {
			var target: Unit | null = null;
			var bestDist: number = 30 * 30;

			for (var a of Game.s._actors) {
				if (a instanceof Unit && a.isGood && !(a instanceof Villager)) {
					var dist: number = Math.pow(a.position.x - this._body.GetPosition().x, 2) + Math.pow(a.position.y - this._body.GetPosition().y, 2);

					if (dist < bestDist) {
						bestDist = dist;
						target = a as Unit;
					}
				}
			}

			if (target) {
				this._cooldown = 40;

				//dist = Math.sqrt(Math.pow(target.position.x - position.x, 2) + Math.pow(target.position.y - position.y, 2));
				//var angle: number = Math.atan2(target.position.y - position.y, target.position.x - position.x);

				//angle += (Math.random() - 0.5) * 0.35;

				Game.s._actors.push(new FireBolt(this.position, target));

				//Game.s._actors.push(new FireBolt(position, target.position));
			}
		}
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
