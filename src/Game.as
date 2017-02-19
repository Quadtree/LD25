package  
{
	import Box2D.Collision.b2Bound;
	import Box2D.Collision.Shapes.b2EdgeChainDef;
	import Box2D.Collision.Shapes.b2EdgeShape;
	import Box2D.Collision.Shapes.b2PolygonShape;
	import Box2D.Common.Math.b2Vec2;
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2BodyDef;
	import Box2D.Dynamics.b2ContactListener;
	import Box2D.Dynamics.b2World;
	import flash.events.IMEEvent;
	import flash.geom.Point;
	import flash.media.SoundChannel;
	import flash.media.SoundTransform;
	import flash.ui.Keyboard;
	import flash.utils.getTimer;
	import starling.core.Starling;
	import starling.display.Image;
	import starling.display.Quad;
	import starling.display.QuadBatch;
	import starling.display.Sprite;
	import starling.events.EnterFrameEvent;
	import starling.events.Touch;
	import starling.events.TouchEvent;
	import starling.events.TouchPhase;
	import starling.events.KeyboardEvent;
	import starling.text.TextField;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class Game extends Sprite
	{
		public var _worldSurface:Sprite = new Sprite();
		public var _speechSurface:Sprite = new Sprite();
		public var _world:b2World = new b2World(new b2Vec2(0, 0), false);
		public var _ground:Object = new Object();
		
		public var _actors:Array = new Array();
		
		public static var s:Game;
		
		private var _msDone:int;
		
		public var _player:Player;
		
		public const MAP_WIDTH:int = 48;
		public const MAP_HEIGHT:int = 48;
		
		public var _mouseWorldPosition:b2Vec2 = new b2Vec2();
		
		public var _camPos:b2Vec2 = new b2Vec2();
		
		public var _gold:int = 0;
		protected var _goldDisplay:TextField = new TextField(300, 30, "Gold", "Verdana", 20, 0xFFFFFF00);
		
		public var _hpBarBackground:Quad = new Quad(200, 30, 0xFF000000);
		public var _hpBar:Quad = new Quad(200, 30, 0xFFFF0000);
		public var _chargeBarBackground:Quad = new Quad(200, 30, 0xFF000000);
		public var _chargeBar:Quad = new Quad(200, 30, 0xFF0000FF);
		
		public var _minimapSprite:Sprite = new Sprite();
		public var _minimapBackground:Quad = new Quad(MAP_WIDTH*4, MAP_HEIGHT*4, 0xFF000000);
		
		private const WAVES:Array = [
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
		
		private var _spawnTimer:int = 10 * 60;
		private var _nextWave:int = 0;
		
		private var _moveToCursor:Boolean = false;
		
		private var _victory:Image;
		private var _lose:Image;
		private var _help:Image;
		private var _title:Image;
		
		public function Game() 
		{
			s = this;
			
			this.addChild(_worldSurface);
			this.addChild(_speechSurface);
			_worldSurface.scaleX = 24;
			_worldSurface.scaleY = 24;
			
			var x:int, y:int;
			
			for (x = 0; x < MAP_WIDTH; x++)
			{
				for (y = 0; y < MAP_HEIGHT; y++)
				{
					var textureName:String;
					
					var image:Image;
					
					if (x == 7)
					{
						if (y == 7)
						{
							textureName = "shore4";
						} else if (y == MAP_HEIGHT - 7) {
							textureName = "shore6";
						} else if (y > 7 && y < MAP_HEIGHT - 7){
							textureName = "shore5";
						} else {
							textureName = "water";
						}
					} else if (x == MAP_WIDTH - 7) {
						if (y == 7)
						{
							textureName = "shore2";
						} else if (y == MAP_HEIGHT - 7) {
							textureName = "shore8";
						} else if (y > 7 && y < MAP_HEIGHT - 7){
							textureName = "shore1";
						} else {
							textureName = "water";
						}
					} else if (y == 7 && x > 7 && x < MAP_WIDTH - 7) {
						textureName = "shore3";
					} else if (y == MAP_HEIGHT - 7 && x > 7 && x < MAP_WIDTH - 7) {
						textureName = "shore7";
					} else {
						if (x > 6 && y > 6 && x < MAP_WIDTH - 6 && y < MAP_HEIGHT - 6)
						{
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
					
					image = new Image(Assets.s[textureName]);
					image.x = x * 4;
					image.y = y * 4;
					image.width = 4.1;
					image.height = 4.1;
					
					if (!_ground[textureName])
					{
						_ground[textureName] = new QuadBatch();
						_worldSurface.addChild(_ground[textureName]);
					}
					
					_ground[textureName].addImage(image);
				}
			}
			
			for (var k:String in _ground)
			{
				trace(k, _ground[k]);
			}
			
			var hud:Image = new Image(Assets.s.hud);
			hud.touchable = false;
			addChild(hud);
			
			_minimapSprite.addChild(_minimapBackground);
			addChild(_minimapSprite);
			_minimapSprite.scaleX = 128 / _minimapBackground.width;
			_minimapSprite.scaleY = 128 / _minimapBackground.height;
			_minimapSprite.y = 768 - 148;
			_minimapSprite.x = 1024 - 148;
			_minimapSprite.touchable = false;
			
			_player = new Player(new b2Vec2((MAP_WIDTH * 4) / 2, (MAP_HEIGHT * 4) / 2));
			
			_actors.push(_player);
			
			for (var i:int = 0; i < 15;++i)
			{
				var vp:b2Vec2 = new b2Vec2((MAP_WIDTH * 4) / 2 - 30 + Math.random() * 60, (MAP_WIDTH * 4) / 2 - 30 + Math.random() * 60);
				
				_actors.push(new Villager(vp));
				_actors.push(new Hut(vp));
			}
			
			//for (i = 0; i < 2;++i)
			//	_actors.push(new Rogue(new b2Vec2(70,70)));
			
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
			
			/*var waterEdgeShape:b2EdgeChainDef = new b2EdgeChainDef();
			waterEdgeShape.vertices.push(new b2Vec2(6 * 24, 6 * 24));
			waterEdgeShape.vertices.push(new b2Vec2((MAP_WIDTH - 6) * 24, 6 * 24));
			waterEdgeShape.vertices.push(new b2Vec2((MAP_WIDTH - 6), (MAP_WIDTH - 6) * 24));
			waterEdgeShape.vertices.push(new b2Vec2(6 * 24, (MAP_WIDTH - 6) * 24));
			waterEdgeShape.isALoop = true;*/
			
			//_world.GetGroundBody().CreateShape(waterEdgeShape);
			
			//waterEdge.CreateFixture2(waterEdgeShape);
			
			const CLEARANCE:Number = 7.5;
			
			const UPPER_LEFT:b2Vec2 = new b2Vec2(CLEARANCE * 4, CLEARANCE * 4);
			const UPPER_RIGHT:b2Vec2 = new b2Vec2((MAP_WIDTH - CLEARANCE + 1) * 4, CLEARANCE * 4);
			const LOWER_LEFT:b2Vec2 = new b2Vec2(CLEARANCE * 4, (MAP_WIDTH - CLEARANCE + 1) * 4);
			const LOWER_RIGHT:b2Vec2 = new b2Vec2((MAP_WIDTH - CLEARANCE + 1) * 4, (MAP_HEIGHT - CLEARANCE + 1) * 4);
			
			createWorldEdge(UPPER_LEFT, UPPER_RIGHT);
			createWorldEdge(UPPER_LEFT, LOWER_LEFT);
			createWorldEdge(LOWER_RIGHT, UPPER_RIGHT);
			createWorldEdge(LOWER_RIGHT, LOWER_LEFT);
			
			_player.setMessage("First this island, then the WORLD!");
			_actors.push(new BigGateVisual(_player.position));
			
			_title = new Image(Assets.s.title);
			addChild(_title);
			
			_ambientSoundChannel = Assets.s.snd("ambient").play(0, 1000, new SoundTransform(0.5));
			
			//createWorldEdge(new b2Vec2(6 * 4, (MAP_HEIGHT / 2) * 4), new b2Vec2(4, MAP_HEIGHT));
		}
		
		private function createWorldEdge(start:b2Vec2, end:b2Vec2):void
		{
			var shape:b2PolygonShape = new b2PolygonShape();
			shape.SetAsEdge(start, end);
			_world.GetGroundBody().CreateFixture2(shape);
			
			//var bd:b2BodyDef = new b2BodyDef();
			
			//var body:b2Body = _world.CreateBody(bd);
			
			//var shape:b2PolygonShape = new b2PolygonShape();
			//shape.SetAsOrientedBox(halfsize.x, halfsize.y, center);
			//body.CreateFixture2(shape);
		}
		
		public function setCamera(pos:b2Vec2):void
		{
			_worldSurface.x = ( -pos.x * _worldSurface.scaleX) + (Starling.current.viewPort.width / 2);
			_worldSurface.y = ( -pos.y * _worldSurface.scaleY) + (Starling.current.viewPort.height / 2);
			
			_camPos.x = pos.x;
			_camPos.y = pos.y;
		}
		
		public function rendering():void
		{
			while (getTimer() > _msDone) update();
		}
		
		public function update():void
		{
			_msDone += 16;
			
			if (_title || _help || _victory || _lose) return;
			
			_world.Step(0.016, 1, 1);
			
			setCamera(_player.position);
			
			var enemiesAlive:Boolean = false;
			
			for (var i:int = 0; i < _actors.length;++i)
			{
				if (_actors[i].keep())
				{
					_actors[i].update();
					if (_actors[i] is Knight || _actors[i] is Rogue || _actors[i] is Cleric) enemiesAlive = true;
				} else {
					_actors[i].destroyed();
					_actors.splice(i, 1);
					i--;
				}
			}
			
			_goldDisplay.text = "Gold: " + _gold;
			
			_hpBar.scaleX = _player._health;
			_chargeBar.scaleX = Math.min(1, (_player._maxCooldown - _player._globalCooldown) / _player._maxCooldown);
			
			if (_player._healthPotionTimer > 0)
				_hpBar.alpha = 1;
			else
				_hpBar.alpha = 0.6;
				
			_chargeBar.alpha = 0.6;
			
			if (_nextWave >= WAVES.length && !enemiesAlive)
			{
				_victory = new Image(Assets.s.victory);
				addChild(_victory);
			}
			
			_spawnTimer--;
			
			if (_spawnTimer <= 0 && _nextWave < WAVES.length)
			{
				_player.setMessage("Accursed do-gooders!", "The knights of light! They won't foil me this time.", "I sense knights.", "It looks like someone cares about this miserable island after all!", "Knights are landing on the shore!", "Looks like someone thinks they're up to the challenge!", "The Dark Lord will crush these gnats!");
				
				var spawnPoint:b2Vec2 = new b2Vec2((7 + Math.round(Math.random()) * (MAP_WIDTH - 7 - 7)) * 4, (7 + Math.round(Math.random()) * (MAP_WIDTH - 7 - 7)) * 4);
				
				if("knight" in WAVES[_nextWave]) for (i = 0; i < WAVES[_nextWave].knight;++i) _actors.push(new Knight(spawnPoint));
				if("rogue" in WAVES[_nextWave]) for (i = 0; i < WAVES[_nextWave].rogue;++i) _actors.push(new Rogue(spawnPoint));
				if("cleric" in WAVES[_nextWave]) for (i = 0; i < WAVES[_nextWave].cleric;++i) _actors.push(new Cleric(spawnPoint));
				
				_nextWave++;
				_spawnTimer = 45 * 60;
			}
			
			if (_moveToCursor)
			{
				_player._dest.x = _mouseWorldPosition.x;
				_player._dest.y = _mouseWorldPosition.y;
			}
			
			if (!_player.keep())
			{
				_lose = new Image(Assets.s.lose);
				addChild(_lose);
			}
			
			if (enemiesAlive && _ambientSoundChannel)
			{
				_ambientSoundChannel.stop();
				_ambientSoundChannel = null;
				
				_battleSoundChannel = Assets.s.snd("battle").play(0, 1000);
			}
			
			if (!enemiesAlive && _battleSoundChannel)
			{
				_battleSoundChannel.stop();
				_battleSoundChannel = null;
				
				_ambientSoundChannel = Assets.s.snd("ambient").play(0, 1000, new SoundTransform(0.5));
			}
		}
		
		private var _ambientSoundChannel:SoundChannel;
		private var _battleSoundChannel:SoundChannel;
		
		public function touch(evt:TouchEvent):void
		{
			var touch:Touch = evt.getTouch(this);
			var point:Point = touch.getLocation(_worldSurface);
			
			if (touch.phase == TouchPhase.BEGAN)
			{
				if (_title)
				{
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
			_mouseWorldPosition.y = point.y;
		}
		
		public function keyDown(evt:KeyboardEvent):void
		{
			trace(evt.keyCode);
			
			if (evt.keyCode == Keyboard.Q) _player.useFlameLance(_mouseWorldPosition);
			if (evt.keyCode == Keyboard.W) _player.useBoltVolley(_mouseWorldPosition);
			if (evt.keyCode == Keyboard.E) _player.useGate(_mouseWorldPosition);
			
			if (evt.keyCode == Keyboard.R) _player.extortVillagers();
			
			if (evt.keyCode == Keyboard.NUMBER_1) _player.placeSpikeTrap(_mouseWorldPosition);
			if (evt.keyCode == Keyboard.NUMBER_2) _player.placeFlamePedistal(_mouseWorldPosition);
			if (evt.keyCode == Keyboard.NUMBER_3) _player.placeDarkCrystal(_mouseWorldPosition);
			if (evt.keyCode == Keyboard.NUMBER_4) _player.drinkHealthPotion(_mouseWorldPosition);
			
			if (evt.keyCode == Keyboard.P) Starling.current.showStats = !Starling.current.showStats;
			
			if (evt.keyCode == Keyboard.F1)
			{
				_help = new Image(Assets.s.help);
				addChild(_help);
			}
		}
	}

}