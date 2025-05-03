import { KeyboardInfo, Matrix, Plane, PointerInfo, Scene, Sprite, Vector3 } from "@babylonjs/core";
import { Actor } from "./Actor";
import { int } from "./Common";
import { Player } from "./Player";
import { Assets } from "./Assets";
import { Box2DT } from "./Box2DT";
import { Hut } from "./Hut";
import { Villager } from "./Villager";
import { Keyboard } from "./Keyboard";
import { Cleric, Knight, Rogue } from "./ActorFactory";

export class Game {
	// @TODO
	//_worldSurface: Sprite = new Sprite();
	//_speechSurface: Sprite = new Sprite();

	_world: Box2DT.b2World = new Box2D.b2World(new Box2D.b2Vec2(0, 0), false);
	_ground: Object = new Object();

	_actors: Actor[] = [];

	static s: Game;

	private _msDone!: int;

	_player: Player;

	public readonly MAP_WIDTH: int = 48;
	public readonly MAP_HEIGHT: int = 48;

	_mouseWorldPosition: Box2DT.b2Vec2 = new Box2D.b2Vec2();

	_camPos: Box2DT.b2Vec2 = new Box2D.b2Vec2();

	_gold: int = 0;

	// @TODO
	// protected _goldDisplay: TextField = new TextField(300, 30, "Gold", "Verdana", 20, 0xFFFFFF00);

	// _hpBarBackground: Quad = new Quad(200, 30, 0xFF000000);
	// _hpBar: Quad = new Quad(200, 30, 0xFFFF0000);
	// _chargeBarBackground: Quad = new Quad(200, 30, 0xFF000000);
	// _chargeBar: Quad = new Quad(200, 30, 0xFF0000FF);

	// _minimapSprite: Sprite = new Sprite();
	// _minimapBackground: Quad = new Quad(MAP_WIDTH * 4, MAP_HEIGHT * 4, 0xFF000000);

	private readonly WAVES = [
		{
			"knight": 2
		},
		{
			"knight": 5
		},
		{
			"knight": 5,
			"rogue": 2
		},
		{
			"knight": 5,
			"rogue": 2,
			"cleric": 1
		},
		{
			"rogue": 5
		},
		{
			"knight": 8,
			"cleric": 3
		},
		{
			"knight": 8,
			"cleric": 3,
			"rogue": 4
		}
	];

	private _spawnTimer: int = 10 * 60;
	private _nextWave: int = 0;

	private _moveToCursor: Boolean = false;

	private _victory?: Sprite;
	private _lose?: Sprite;
	private _help?: Sprite;
	private _title?: Sprite;

	public scene: Scene;

	public constructor(scene: Scene) {
		this.scene = scene;
		Game.s = this;

		console.log(this._world);

		// this._world.SetContactListener((a: any, b: any, c: any, d: any) => {
		// 	console.log('contact', a, b, c, d);
		// })

		const contactListener = new (Box2D as any).JSContactListener();

		// const contactListener = {
		// 	JSContactListener() {
		// 		console.log('JSContactListener');
		// 	},

		// 	BeginContact: (a: any) => {
		// 		console.log('BeginContact', a);
		// 	},
		// 	EndContact: (a: any) => {
		// 		console.log('EndContact', a);
		// 	},
		// 	PreSolve: (a: any) => {
		// 		console.log('PreSolve', a);
		// 	},
		// 	PostSolve: (a: any) => {
		// 		console.log('PostSolve', a);
		// 	}
		// };

		console.log(contactListener);

		const bodyToActorMap = new WeakMap<Box2DT.b2Body, Actor | null>();

		const findActorWithBody = (body: Box2DT.b2Body) => {
			if (bodyToActorMap.has(body)) return bodyToActorMap.get(body);

			for (const actor of this._actors) {
				bodyToActorMap.set(actor.body, actor);
				if (actor.body == body) {
					return actor;
				}
			}

			bodyToActorMap.set(body, null);
		}

		contactListener.BeginContact = (it: any, b: any) => {
			const contact = Box2D.wrapPointer(it, Box2D.b2Contact) as Box2DT.b2Contact;
			console.log('BeginContact', contact);

			const fixtures = [
				[contact.GetFixtureA(), contact.GetFixtureB()],
				[contact.GetFixtureB(), contact.GetFixtureA()],
			]

			for (const f2 of fixtures) {
				const udSelf = findActorWithBody(f2?.[0]?.GetBody());
				const udOther = findActorWithBody(f2?.[1]?.GetBody());
				if (udSelf instanceof Actor && udOther instanceof Actor) {
					udSelf.beginContact(udOther);
				} else {
					console.log('udSelf', udSelf, 'udOther', udOther)
				}
			}
		}
		contactListener.EndContact = (it: any) => {
			console.log('EndContact', it);
		}
		contactListener.PreSolve = (it: any) => {
		}
		contactListener.PostSolve = (it: any) => {
		}

		this._world.SetContactListener(contactListener)

		// this.addChild(_worldSurface);
		// this.addChild(_speechSurface);
		// _worldSurface.scaleX = 24;
		// _worldSurface.scaleY = 24;

		var x: int, y: int;

		for (x = 0; x < this.MAP_WIDTH; x++) {
			for (y = 0; y < this.MAP_HEIGHT; y++) {
				var textureName: string;

				var image: Sprite;

				if (x == 7) {
					if (y == 7) {
						textureName = "shore4";
					} else if (y == this.MAP_HEIGHT - 7) {
						textureName = "shore6";
					} else if (y > 7 && y < this.MAP_HEIGHT - 7) {
						textureName = "shore5";
					} else {
						textureName = "water";
					}
				} else if (x == this.MAP_WIDTH - 7) {
					if (y == 7) {
						textureName = "shore2";
					} else if (y == this.MAP_HEIGHT - 7) {
						textureName = "shore8";
					} else if (y > 7 && y < this.MAP_HEIGHT - 7) {
						textureName = "shore1";
					} else {
						textureName = "water";
					}
				} else if (y == 7 && x > 7 && x < this.MAP_WIDTH - 7) {
					textureName = "shore3";
				} else if (y == this.MAP_HEIGHT - 7 && x > 7 && x < this.MAP_WIDTH - 7) {
					textureName = "shore7";
				} else {
					if (x > 6 && y > 6 && x < this.MAP_WIDTH - 6 && y < this.MAP_HEIGHT - 6) {
						if (Math.random() < 0.2)
							textureName = "grass2";
						else if (Math.random() < 0.05)
							textureName = "grass3";
						else if (Math.random() < 0.05)
							textureName = "grass4";
						else
							textureName = "grass1";
					} else
						textureName = "water";
				}

				//console.log(x, y, textureName)

				image = new Sprite("", Assets.s.tex(textureName));
				image.position.x = x * 4;
				image.position.y = y * 4;
				image.width = 4.1;
				image.height = 4.1;

				// if (!this._ground[textureName]) {
				// 	_ground[textureName] = new QuadBatch();
				// 	_worldSurface.addChild(_ground[textureName]);
				// }

				// _ground[textureName].addImage(image);
			}
		}


		// @TODO
		/*
		var hud: Image = new Image(Assets.s.hud);
		hud.touchable = false;
		addChild(hud);

		_minimapSprite.addChild(_minimapBackground);
		addChild(_minimapSprite);
		_minimapSprite.scaleX = 128 / _minimapBackground.width;
		_minimapSprite.scaleY = 128 / _minimapBackground.height;
		_minimapSprite.y = 768 - 148;
		_minimapSprite.x = 1024 - 148;
		_minimapSprite.touchable = false;*/

		this._player = new Player(new Box2D.b2Vec2((this.MAP_WIDTH * 4) / 2, (this.MAP_HEIGHT * 4) / 2));

		this._actors.push(this._player);


		for (var i: int = 0; i < 15; ++i) {
			var vp: Box2DT.b2Vec2 = new Box2D.b2Vec2((this.MAP_WIDTH * 4) / 2 - 30 + Math.random() * 60, (this.MAP_WIDTH * 4) / 2 - 30 + Math.random() * 60);

			this._actors.push(new Villager(vp));
			this._actors.push(new Hut(vp));
		}


		// @TODO
		/*
		this.addEventListener(EnterFrameEvent.ENTER_FRAME, rendering);
		this.addEventListener(TouchEvent.TOUCH, touch);
		Starling.current.stage.addEventListener(KeyboardEvent.KEY_UP, keyDown);

		this.addChild(_goldDisplay);
		_goldDisplay.y = 768 - 190 + 130;
		_goldDisplay.x = 20;
		_goldDisplay.hAlign = "left";
		_goldDisplay.touchable = false;

		_chargeBar.x = 20;
		_chargeBar.y = 768 - 190 + 80;
		_chargeBar.touchable = false;
		_chargeBarBackground.x = _chargeBar.x;
		_chargeBarBackground.y = _chargeBar.y;
		_chargeBarBackground.touchable = false;

		addChild(_chargeBarBackground);
		addChild(_chargeBar);

		_hpBar.x = 20;
		_hpBar.y = 768 - 190 + 30;
		_hpBar.touchable = false;
		_hpBarBackground.x = _hpBar.x;
		_hpBarBackground.y = _hpBar.y;
		_hpBarBackground.touchable = false;

		addChild(_hpBarBackground);
		addChild(_hpBar);



		_world.SetContactListener(new ContactListener());
		*/

		/*var waterEdgeShape:Box2D.b2EdgeChainDef = new b2EdgeChainDef();
		waterEdgeShape.vertices.push(new b2Vec2(6 * 24, 6 * 24));
		waterEdgeShape.vertices.push(new b2Vec2((MAP_WIDTH - 6) * 24, 6 * 24));
		waterEdgeShape.vertices.push(new b2Vec2((MAP_WIDTH - 6), (MAP_WIDTH - 6) * 24));
		waterEdgeShape.vertices.push(new b2Vec2(6 * 24, (MAP_WIDTH - 6) * 24));
		waterEdgeShape.isALoop = true;*/

		//_world.GetGroundBody().CreateShape(waterEdgeShape);

		//waterEdge.CreateFixture2(waterEdgeShape);

		// @TODO
		/*
		const CLEARANCE: number = 7.5;

		const UPPER_LEFT: Box2DT.b2Vec2 = new b2Vec2(CLEARANCE * 4, CLEARANCE * 4);
		const UPPER_RIGHT: Box2DT.b2Vec2 = new b2Vec2((MAP_WIDTH - CLEARANCE + 1) * 4, CLEARANCE * 4);
		const LOWER_LEFT: Box2DT.b2Vec2 = new b2Vec2(CLEARANCE * 4, (MAP_WIDTH - CLEARANCE + 1) * 4);
		const LOWER_RIGHT: Box2DT.b2Vec2 = new b2Vec2((MAP_WIDTH - CLEARANCE + 1) * 4, (MAP_HEIGHT - CLEARANCE + 1) * 4);

		createWorldEdge(UPPER_LEFT, UPPER_RIGHT);
		createWorldEdge(UPPER_LEFT, LOWER_LEFT);
		createWorldEdge(LOWER_RIGHT, UPPER_RIGHT);
		createWorldEdge(LOWER_RIGHT, LOWER_LEFT);

		_player.setMessage("First this island, then the WORLD!");
		_actors.push(new BigGateVisual(_player.position));

		_title = new Image(Assets.s.title);
		addChild(_title);

		_ambientSoundChannel = Assets.s.snd("ambient").play(0, 1000, new SoundTransform(0.5));
		*/

		//createWorldEdge(new b2Vec2(6 * 4, (MAP_HEIGHT / 2) * 4), new b2Vec2(4, MAP_HEIGHT));
	}

	private createWorldEdge(start: Box2DT.b2Vec2, end: Box2DT.b2Vec2): void {
		var shape: Box2DT.b2PolygonShape = new Box2D.b2PolygonShape();
		shape.SetAsEdge(start, end);
		this._world.GetGroundBody().CreateFixture2(shape);
	}

	public setCamera(pos: Box2DT.b2Vec2): void {
		const cam = this.scene.getCameraByName("MainCamera")!;
		const oldPos = cam.position;
		cam.position = new Vector3(
			pos.x,
			pos.y,
			oldPos.z
		)
	}

	public update(): void {
		this._msDone += 16;

		if (this._title || this._help || this._victory || this._lose) return;

		this._world.Step(0.016, 1, 1);

		this.setCamera(this._player.position);

		var enemiesAlive: Boolean = false;

		for (var i: int = 0; i < this._actors.length; ++i) {
			if (this._actors[i].keep()) {
				this._actors[i].update();
				if (this._actors[i] instanceof Knight || this._actors[i] instanceof Rogue || this._actors[i] instanceof Cleric) enemiesAlive = true;
			} else {
				this._actors[i].destroyed();
				this._actors.splice(i, 1);
				i--;
			}
		}

		// @TODO
		/*
		_goldDisplay.text = "Gold: " + _gold;

		_hpBar.scaleX = _player._health;
		_chargeBar.scaleX = Math.min(1, (_player._maxCooldown - _player._globalCooldown) / _player._maxCooldown);

		if (_player._healthPotionTimer > 0)
			_hpBar.alpha = 1;
		else
			_hpBar.alpha = 0.6;

		_chargeBar.alpha = 0.6;
		*/

		if (this._nextWave >= this.WAVES.length && !enemiesAlive) {
			// @TODO
			console.log("YOU WIN")
			// this._victory = new Image(Assets.s.victory);
			// addChild(_victory);
		}

		this._spawnTimer--;

		if (this._spawnTimer <= 0 && this._nextWave < this.WAVES.length) {
			this._player.setMessage("Accursed do-gooders!", "The knights of light! They won't foil me this time.", "I sense knights.", "It looks like someone cares about this miserable island after all!", "Knights are landing on the shore!", "Looks like someone thinks they're up to the challenge!", "The Dark Lord will crush these gnats!");

			var spawnPoint: Box2DT.b2Vec2 = new Box2D.b2Vec2((7 + Math.round(Math.random()) * (this.MAP_WIDTH - 7 - 7)) * 4, (7 + Math.round(Math.random()) * (this.MAP_WIDTH - 7 - 7)) * 4);

			if ("knight" in this.WAVES[this._nextWave]) for (i = 0; i < (this.WAVES[this._nextWave].knight ?? 0); ++i) this._actors.push(new Knight(spawnPoint));
			if ("rogue" in this.WAVES[this._nextWave]) for (i = 0; i < (this.WAVES[this._nextWave].rogue ?? 0); ++i) this._actors.push(new Rogue(spawnPoint));
			if ("cleric" in this.WAVES[this._nextWave]) for (i = 0; i < (this.WAVES[this._nextWave].cleric ?? 0); ++i) this._actors.push(new Cleric(spawnPoint));

			this._nextWave++;
			this._spawnTimer = 45 * 60;
		}

		if (this._moveToCursor) {
			this._player._dest.x = this._mouseWorldPosition.x;
			this._player._dest.y = this._mouseWorldPosition.y;
		}

		if (!this._player.keep()) {
			this._lose = new Sprite("", Assets.s.tex("lose"));
			//addChild(_lose);
		}

		// @TODO
		/*
		if (enemiesAlive && _ambientSoundChannel) {
			_ambientSoundChannel.stop();
			_ambientSoundChannel = null;

			_battleSoundChannel = Assets.s.snd("battle").play(0, 1000);
		}

		if (!enemiesAlive && _battleSoundChannel) {
			_battleSoundChannel.stop();
			_battleSoundChannel = null;

			_ambientSoundChannel = Assets.s.snd("ambient").play(0, 1000, new SoundTransform(0.5));
		}
		*/
	}

	// private _ambientSoundChannel: SoundChannel;
	// private _battleSoundChannel: SoundChannel;

	public touch(evt: PointerInfo): void {
		//console.log('touch', evt.event.type, evt.event.buttons)

		if (evt.event.type == "pointerdown") {
			if (this._title) {
				this._title.dispose();
				this._title = undefined;
			} else if (this._help) {
				this._help.dispose();
				this._help = undefined;
			} else {
				this._moveToCursor = true;
			}
		}

		if (evt.event.type == "pointerup") {
			this._moveToCursor = false;
		}

		const ray = this.scene.createPickingRay(evt.event.x, evt.event.y, Matrix.Identity(), this.scene.getCameraByName("MainCamera"));
		const intersection = ray.intersectsTriangle(
			new Vector3(-2000, -2000, 0),
			new Vector3(0, 2000, 0),
			new Vector3(2000, -2000, 0),
		)

		//console.log("RAY HIT", ray, intersection)

		if (intersection) {
			const hitPt = ray.origin.add(ray.direction.scale(intersection.distance));
			//console.log(hitPt)
			this._mouseWorldPosition.x = hitPt.x;
			this._mouseWorldPosition.y = hitPt.y;
		}

		//this._mouseWorldPosition.x = point.x;
		//this._mouseWorldPosition.y = point.y;

		/*var touch: Touch = evt.getTouch(this);
		var point: Point = touch.getLocation(_worldSurface);

		if (evt.event.type) {
			if (_title) {
				removeChild(_title);
				_title = null;
				_help = new Image(Assets.s.help);
				addChild(_help);
			} else if (_help) {
				removeChild(_help);
				_help = null;
			} else {
				_moveToCursor = true;
			}
		}
		if (touch.phase == TouchPhase.ENDED) _moveToCursor = false;

		_mouseWorldPosition.x = point.x;
		_mouseWorldPosition.y = point.y;*/
	}

	public keyDown(evtContainer: KeyboardInfo): void {
		const evt = evtContainer.event;
		console.log('keyDown', evt.keyCode);

		if (evt.keyCode == Keyboard.Q) this._player.useFlameLance(this._mouseWorldPosition);
		if (evt.keyCode == Keyboard.W) this._player.useBoltVolley(this._mouseWorldPosition);
		if (evt.keyCode == Keyboard.E) this._player.useGate(this._mouseWorldPosition);

		if (evt.keyCode == Keyboard.R) this._player.extortVillagers();

		if (evt.keyCode == Keyboard.NUMBER_1) this._player.placeSpikeTrap(this._mouseWorldPosition);
		if (evt.keyCode == Keyboard.NUMBER_2) this._player.placeFlamePedistal(this._mouseWorldPosition);
		if (evt.keyCode == Keyboard.NUMBER_3) this._player.placeDarkCrystal(this._mouseWorldPosition);
		if (evt.keyCode == Keyboard.NUMBER_4) this._player.drinkHealthPotion(this._mouseWorldPosition);

		//if (evt.keyCode == Keyboard.P) Starling.current.showStats = !Starling.current.showStats;

		if (evt.keyCode == Keyboard.F2) {
			// @TODO
			//this._help = new Image(Assets.s.help);
			//addChild(_help);
		}
	}

	private showHelpScreen() {
		// @TODO
		//this._help = new Image(Assets.s.help);
		//addChild(_help);
	}
}