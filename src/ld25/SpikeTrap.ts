import { Actor } from "./Actor";
import { Assets } from "./Assets";
import { Box2DT } from "./Box2DT";
import { int, uint } from "./Common";

export class SpikeTrap extends Actor {
	protected readonly COOLDOWN: int = 60 * 6;

	protected _charge: int = this.COOLDOWN;

	protected override get texture(): string {
		return "spiketrap";
	}

	protected override get isSensor(): Boolean {
		return true;
	}

	public constructor(pos: Box2DT.b2Vec2) {
		super(pos);

		Assets.s.snd("place").play();
	}

	public override update(): void {
		super.update();

		this._charge--;

		if (this._charge <= 0)
			this.textureSwap("spiketrap_ready");
		else
			this.textureSwap("spiketrap");
	}

	public override beginContact(other: Actor): void {
		super.beginContact(other);

		if (this._charge <= 0 && other.isGood) {
			other.takeTrapDamage(3);

			this._charge = this.COOLDOWN;
		}
	}

	protected override get miniMapColor(): uint {
		return 0xFF666666;
	}
}