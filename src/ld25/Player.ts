import { int } from "@babylonjs/core";
import { Unit } from "./Unit";
import { Game } from "./Game";
import { Assets } from "./Assets";
import { uint } from "./Common";
import { Box2DT } from "./Box2DT";
import { copyVector } from "./util";
import { FlameLance } from "./FlameLance";
import { FrostBolt } from "./FrostBolt";
import { GateVisual } from "./GateVisual";
import { Villager } from "./Villager";
import { SpikeTrap } from "./SpikeTrap";
import { FlamePedistal } from "./FlamePedistal";
import { DarkCrystal } from "./DarkCrystal";

export class Player extends Unit {
	_globalCooldown: int = 0;
	_maxCooldown: number = 60;

	_healthPotionTimer: int = 0;

	public readonly HEALTH_POTION_ACTION_TIME: int = 480;

	protected override get group(): int {
		return -1;
	}

	protected override get armor(): number {
		return 8.5;
	}

	protected resetCooldown(): void {
		this._globalCooldown = this._maxCooldown;
	}

	public constructor(startPos: Box2DT.b2Vec2) {
		if (!startPos) throw new Error("startPos must not be null");

		super(startPos);

		console.log("created player at", startPos.x, startPos.y)
	}

	public override update(): void {
		super.update();

		if (this._healthPotionTimer > 0) {
			this._health += 1 / this.HEALTH_POTION_ACTION_TIME;
			this._health = Math.min(this._health, 1);
			this._healthPotionTimer--;
		}

		this._globalCooldown--;
	}

	public useBoltVolley(target: Box2DT.b2Vec2): void {
		if (this._globalCooldown > 0) return;
		this.resetCooldown();

		var dist: number = Math.sqrt(Math.pow(target.x - this.position.x, 2) + Math.pow(target.y - this.position.y, 2));
		var angle: number = Math.atan2(target.y - this.position.y, target.x - this.position.x);

		for (var i: int = -2; i <= 2; ++i) {
			var curAngle: number = angle + i * 0.2;

			Game.s._actors.push(new FrostBolt(this.position, new Box2D.b2Vec2(this.position.x + Math.cos(curAngle), this.position.y + Math.sin(curAngle))));
		}
	}

	public useFlameLance(target: Box2DT.b2Vec2): void {
		console.log('useFlameLance', target.x, target.y)

		if (this._globalCooldown > 0) return;
		this.resetCooldown();

		Game.s._actors.push(new FlameLance(this.position, target));
	}

	public useGate(target: Box2DT.b2Vec2): void {
		if (target.x < 7.5 * 4) return;
		if (target.y < 7.5 * 4) return;
		if (target.x > (Game.s.MAP_WIDTH - 7.5 + 1) * 4) return;
		if (target.y > (Game.s.MAP_HEIGHT - 7.5 + 1) * 4) return;

		if (this._globalCooldown > 0) return;
		this.resetCooldown();

		Game.s._actors.push(new GateVisual(copyVector(this._body.GetPosition())));

		this._body.SetPosition(copyVector(target));
		this._dest = copyVector(target);

		Game.s._actors.push(new GateVisual(copyVector(this._body.GetPosition())));

		Assets.s.snd("gate").play();
	}

	public extortVillagers(): void {
		this.setMessage("The Dark Lord demands tribute!", "Give me all your money!", "Taxes are due!");

		for (var a of Game.s._actors) {
			if (a instanceof Villager) {
				var dist: number = Math.sqrt(Math.pow(a.position.x - this.position.x, 2) + Math.pow(a.position.y - this.position.y, 2));
				if (dist < 10) {
					(a as Villager).extort();
				}
			}
		}
	}

	public readonly SPIKE_TRAP_GOLD: int = 60;
	public readonly DARK_CRYSTAL_GOLD: int = 150;
	public readonly FLAME_PEDISTAL_GOLD: int = 75;
	public readonly HEALTH_POTION_GOLD: int = 50;

	public placeSpikeTrap(target: Box2DT.b2Vec2): void {
		if (Game.s._gold < this.SPIKE_TRAP_GOLD) return;
		Game.s._gold -= this.SPIKE_TRAP_GOLD;

		Game.s._actors.push(new SpikeTrap(target));
	}

	public placeFlamePedistal(target: Box2DT.b2Vec2): void {
		if (Game.s._gold < this.FLAME_PEDISTAL_GOLD) return;
		Game.s._gold -= this.FLAME_PEDISTAL_GOLD;

		Game.s._actors.push(new FlamePedistal(target));
	}

	public placeDarkCrystal(target: Box2DT.b2Vec2): void {
		if (Game.s._gold < this.DARK_CRYSTAL_GOLD) return;
		Game.s._gold -= this.DARK_CRYSTAL_GOLD;

		Game.s._actors.push(new DarkCrystal(target));
	}

	public drinkHealthPotion(target: Box2DT.b2Vec2): void {
		if (Game.s._gold < this.HEALTH_POTION_GOLD) return;
		Game.s._gold -= this.HEALTH_POTION_GOLD;

		Assets.s.snd("potion").play();

		this._healthPotionTimer = this.HEALTH_POTION_ACTION_TIME;
	}

	protected override get miniMapColor(): uint {
		return 0xFFFF0000;
	}
}
