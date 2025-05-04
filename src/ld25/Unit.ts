import { DynamicTexture, int, Mesh, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";
import { Actor } from "./Actor";
import { Assets } from "./Assets";
import { Box2DT } from "./Box2DT";
import { copyVector, subtractVectors } from "./util";
import { Game } from "./Game";

export class Unit extends Actor {
	_dest: Box2DT.b2Vec2 = new Box2D.b2Vec2();

	textMesh: Mesh | null = null;

	protected _messageTimer: int = 0;

	protected _slideTime: int = 0;
	_health: number = 1;

	// @TODO
	//protected _message: TextField;

	protected get armor(): number { return 1; }

	protected get movePower(): number { return 4; }

	public override takeTrapDamage(amount: number): void {
		super.takeTrapDamage(amount);
		this.takeDamage(amount);
	}

	public override get isInjured(): Boolean {
		return this._health < 0.9;
	}

	public override takeDamage(amount: number): void {
		super.takeDamage(amount);
		this._health -= amount / this.armor;

		this._bloodSparks += amount * 3;

		Assets.s.snd("hit" + Math.round(Math.random() + 1)).play();
	}

	public override beginSlide(): void {
		super.beginSlide();

		this._slideTime = 60;

		this.setMessage("Aieee!", "Help!", "Whaaag!", "Whoa!");
	}

	protected override get drag(): number {
		return 0.25;
	}

	public constructor(startPos: Box2DT.b2Vec2) {
		super(startPos);

		this._dest = copyVector(startPos);

		if (!this._dest) throw new Error("Dest cannot be undefined");

		// @TODO
		//this._message = new TextField(200, 100, "", "Verdana", 15, 0xFFFFFFFF);


		//this._message.touchable = false;
		//Game.s._speechSurface.addChild(_message);
	}

	public override update(): void {
		super.update();

		this._body.SetAwake(true);

		if (this._slideTime <= 0) {

			var delta: Box2DT.b2Vec2 = copyVector(this._dest);
			delta = subtractVectors(delta, copyVector(this._body.GetPosition()));
			if (delta.Length() > 1) {
				delta.Normalize();
				delta.op_mul(this.movePower);

				this._body.ApplyLinearImpulse(delta, this._body.GetWorldCenter());
				//this._body.ApplyForce(delta, this._body.GetWorldCenter());

				// if ((this as any)._maxCooldown) console.log('ApplyLinearImpulse', delta.x, delta.y,
				// 	'lin_vel', this._body.GetLinearVelocity().x, this._body.GetLinearVelocity().y,
				// 	'mass', this._body.GetMass(),
				// 	'type', this._body.GetType(),
				// 	'pos', this._body.GetWorldCenter().x, this._body.GetWorldCenter().y,
				// 	//'enabled', this._body.IsEnabled(),
				// 	//'shpc', this._body.GetShapeCount(),
				// 	'IsActive', this._body.IsActive(),
				// 	'IsAwake', this._body.IsAwake(),
				// )
			}

			var vel: Box2DT.b2Vec2 = new Box2D.b2Vec2(-this._body.GetLinearVelocity().x * this.drag, -this._body.GetLinearVelocity().y * this.drag);
			this._body.ApplyLinearImpulse(vel, this._body.GetWorldCenter());
			this._body.SetFixedRotation(true);
			this._body.SetTransform(this._body.GetPosition(), 0);
			this._body.SetAngularVelocity(0);
		} else {
			this._slideTime--;
			this._body.SetFixedRotation(false);
		}

		if (this.textMesh) {
			this.textMesh.position = new Vector3(
				this._body.GetPosition().x,
				this._body.GetPosition().y + 1,
				-0.075,
			);
		}

		// @TODO
		// _message.x = (_image.x - Game.s._camPos.x - 4) * 24 + (Starling.current.viewPort.width / 2);
		// _message.y = (_image.y - Game.s._camPos.y - 3) * 24 + (Starling.current.viewPort.height / 2);

		this._messageTimer--;
		if (this._messageTimer <= 0 && this.textMesh) {
			this.textMesh.dispose();
			this.textMesh = null;
		}
	}

	public setMessage(...msgs: string[]): void {
		var msg: string = msgs[Math.floor(Math.random() * msgs.length)];
		console.log(msg)

		if (this.textMesh) {
			this.textMesh.dispose();
			this.textMesh = null;
		}

		const font = "72px Arial";

		const temp = new DynamicTexture("DynamicTexture", 64, Game.s.scene);
		const tmpctx = temp.getContext();
		tmpctx.font = font;
		const DTWidth = tmpctx.measureText(msg).width;

		const planeHeight = 0.75;
		const DTHeight = 72; //or set as wished
		const ratio = planeHeight / DTHeight;
		const planeWidth = DTWidth * ratio;

		const dynamicTexture = new DynamicTexture("DynamicTexture", { width: DTWidth, height: DTHeight }, Game.s.scene, false);
		const mat = new StandardMaterial("mat", Game.s.scene);
		mat.emissiveTexture = dynamicTexture;
		mat.opacityTexture = dynamicTexture;
		dynamicTexture.drawText(msg, null, null, font, "#FFFFFF", null, true); //use of null, null centers the text

		console.log('plane size', planeWidth, planeHeight)

		const plane = MeshBuilder.CreatePlane("plane", { width: planeWidth, height: planeHeight }, Game.s.scene);
		plane.material = mat;

		plane.visibility = 0.9999;
		this.textMesh = plane;

		this._messageTimer = msg.length * 10 + 40;
	}

	public override keep(): Boolean {
		return super.keep() && this._health > 0;
	}

	public override destroyed(): void {
		super.destroyed();

		// @TODO
		//Game.s._speechSurface.removeChild(_message);
	}
}