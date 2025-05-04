import { Image } from "@babylonjs/gui";
import { uint } from "./Common";
import { Color3, Color4, int, Sprite, Vector3 } from "@babylonjs/core";
import { Game } from "./Game";
import { Assets } from "./Assets";

import { BodyTypes, Box2DT } from "./Box2DT";
import { b2Vec2ToVec3, copyVector } from "./util";
import { Spark } from "./ActorFactory";

export class Actor {
	protected _body: Box2DT.b2Body;
	protected _image!: Sprite;
	protected _minimapGraphic!: Sprite;

	protected get radius(): number { return 0.5; }
	protected get drag(): number { return 1; }
	protected get maskBits(): uint { return 0xFFFFFFFF; }
	protected get categoryBits(): uint { return 0xFFFFFFFF; }
	protected get group(): int { return 0; }
	protected get texture(): string { return "vil1"; }
	protected get imageSize(): number { return 1; }
	protected get hasFixture(): Boolean { return true; }
	protected get density(): number { return 1; }
	protected get isSensor(): Boolean { return false; }
	get isGood(): Boolean { return false; }
	get isInjured(): Boolean { return false; }
	get position(): Box2DT.b2Vec2 { return copyVector(this._body.GetPosition()); }
	wreck(amount: number): void { }

	beginSlide(): void { }
	takeDamage(amount: number): void { }
	takeTrapDamage(amount: number): void { }

	protected get miniMapColor(): uint { return 0; }

	get body() { return this._body; }

	protected _bloodSparks: int = 0;

	constructor(startPos: Box2DT.b2Vec2, options?: { textureOverride?: string, imageSize?: number }) {
		var bd: Box2DT.b2BodyDef = new Box2D.b2BodyDef();
		bd.position = startPos;
		bd.type = BodyTypes.dynamicBody;
		bd.fixedRotation = true;
		bd.userData = this;

		this._body = Game.s._world.CreateBody(bd);

		var fd: Box2DT.b2FixtureDef = new Box2D.b2FixtureDef();
		fd.filter.categoryBits = this.categoryBits;
		fd.filter.maskBits = this.maskBits;
		fd.filter.groupIndex = this.group;
		fd.isSensor = this.isSensor;

		//console.log(`fd`, fd)

		var cs: Box2DT.b2CircleShape = new Box2D.b2CircleShape();
		cs.m_radius = (this.radius);

		fd.shape = cs;
		fd.density = this.density;

		if (this.hasFixture) this._body.CreateFixture(fd);

		this._image = new Sprite("", Assets.s.tex(options?.textureOverride ?? this.texture));
		this.previousTexture = options?.textureOverride ?? this.texture;
		//this._image.pivotX = this._image.width / 2;
		//this._image.pivotY = this._image.height / 2;

		if (!(options?.imageSize ?? this.imageSize)) {
			throw new Error("ImageSize is invalid");
		}

		this._image.width = options?.imageSize ?? this.imageSize;
		this._image.height = options?.imageSize ?? this.imageSize;
		//this._body.SetUserData(this);
		//this._image.touchable = false;
		//Game.s._worldSurface.addChild(_image);

		//console.log("sprite created for actor", this.texture, this._image.width, this._image.height, 'mass', this._body.GetMass(), 'bd', bd, 'fd', fd, 'cs', cs)

		if (this.miniMapColor > 0) {
			this._minimapGraphic = new Sprite("", Assets.s.tex("solid"));
			this._minimapGraphic.width = .1;
			this._minimapGraphic.height = .1;
			const colorString = this.miniMapColor.toString(16).padStart(8, "0");
			console.log('colorString', colorString)
			this._minimapGraphic.color = Color4.FromInts(
				parseInt(colorString.substring(2, 4), 16),
				parseInt(colorString.substring(4, 6), 16),
				parseInt(colorString.substring(6, 8), 16),
				parseInt(colorString.substring(0, 2), 16),
			)
			//Game.s.ui.addControl(this._minimapGraphic);
		}
	}

	update(): void {
		this._image.position = new Vector3(
			this._body.GetPosition().x,
			this._body.GetPosition().y,
			0,
		);
		//console.log("pos set to ", this._image.position)
		this._image.angle = this._body.GetAngle();

		if (this._minimapGraphic) {
			const vec = this.position;
			vec.op_sub(new Box2D.b2Vec2(96, 96))
			vec.op_mul(0.1);
			vec.op_add(Game.s._player.position);

			const thingToAdd = Game.s.ui.getSize();

			const divisor = 130;

			vec.op_add(new Box2D.b2Vec2(thingToAdd.width / divisor, -thingToAdd.height / divisor))

			this._minimapGraphic.position = b2Vec2ToVec3(vec, -0.1);

			//console.log(this._minimapGraphic.position)

			//this._minimapGraphic.leftInPixels = this._body.GetPosition().x;
			//this._minimapGraphic.topInPixels = this._body.GetPosition().y;
		}
	}

	keep(): Boolean {
		while (this._bloodSparks > 0) {
			Game.s._actors.push(new Spark(this.position, 4, 1, 35, "blood"));
			this._bloodSparks--;
		}

		return true;
	}

	destroyed(): void {
		this._image.dispose();
		Game.s._world.DestroyBody(this._body);

		if (this.miniMapColor > 0) {
			this._minimapGraphic.dispose();
			//Game.s.ui.removeControl(this._minimapGraphic);
		}
	}

	beginContact(other: Actor): void { }

	protected previousTexture: string = "";

	protected textureSwap(newTexture: string) {
		if (newTexture == this.previousTexture) return;

		this._image?.dispose();
		this._image = new Sprite("", Assets.s.tex(newTexture));
		this.previousTexture = newTexture;

		this._image.width = this.imageSize;
		this._image.height = this.imageSize;

		this._image.position = new Vector3(
			this._body.GetPosition().x,
			this._body.GetPosition().y,
			0,
		);
		this._image.angle = this._body.GetAngle();
	}
}