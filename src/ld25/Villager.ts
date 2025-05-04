import { Sprite } from "@babylonjs/core";
import { Unit } from "./Unit";
import { Box2DT } from "./Box2DT";
import { Assets } from "./Assets";
import { Game } from "./Game";
import { uint } from "./Common";
import { parseFlexColor, slightlyRandomizeVector } from "./util";

export class Villager extends Unit {
	protected _hasMoney: boolean = true;
	protected _coin!: Sprite;
	protected _coinPosition: number = 0;

	public override get isGood(): Boolean {
		return true;
	}

	public constructor(pos: Box2DT.b2Vec2) {
		super(slightlyRandomizeVector(pos));

		this._coin = new Sprite("", Assets.s.tex("coin"));
		//this._coin.pivotX = _image.texture.width / 2;
		//this._coin.pivotY = _image.texture.height / 2;
		this._coin.width = this.imageSize * 0.75;
		this._coin.height = this.imageSize * 0.75;
		//Game.s._worldSurface.addChild(_coin);
	}

	public override update(): void {
		super.update();

		if (Math.random() * 60 * 60 <= 1) this._hasMoney = true;

		this._coin.isVisible = this._hasMoney;
		this._coin.position.x = this._image.position.x;
		this._coin.position.y = this._image.position.y - 1.35 + Math.sin(this._coinPosition) * 0.25;
		this._coin.position.z = -0.05;

		this._coinPosition += 0.1;

		if (this._hasMoney)
			this._minimapGraphic.color = parseFlexColor(0xFFFFFF00);
		else
			this._minimapGraphic.color = parseFlexColor(0xFF00FF00);
	}

	protected override get texture(): string {
		return "villager" + (Math.round(Math.random() + 1));
	}

	public extort(): void {
		if (this._hasMoney) {
			this.setMessage("Take it!", "Don't hurt me! Just take it", "Here's all we have.", "You fiend! Here's our last gold.");
			Game.s._gold += 20;
			this._hasMoney = false;
			Assets.s.snd("coin").play();
		} else {
			this.setMessage("I don't have any, dark lord!", "You've taken all we have!", "We have no money, lord!", "We have nothing!");
		}
	}

	public override destroyed(): void {
		super.destroyed();

		this._coin.dispose();

		//Game.s._worldSurface.removeChild(_coin);
	}

	protected override get miniMapColor(): uint {
		return 0xFF00FF00;
	}
}