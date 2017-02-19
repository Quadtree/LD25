package  
{
	import Box2D.Collision.Shapes.b2CircleShape;
	import Box2D.Common.Math.b2Vec2;
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2BodyDef;
	import Box2D.Dynamics.b2FixtureDef;
	import starling.display.Image;
	import starling.display.Quad;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class Actor 
	{
		protected var _body:b2Body;
		protected var _image:Image;
		protected var _minimapGraphic:Quad;
		
		protected function get radius():Number { return 0.5; }
		protected function get drag():Number { return 1; }
		protected function get maskBits():uint { return 0xFFFFFFFF; }
		protected function get categoryBits():uint { return 0xFFFFFFFF; }
		protected function get group():int { return 0; }
		protected function get texture():String { return "vil1"; }
		protected function get imageSize():Number { return 1; }
		protected function get hasFixture():Boolean { return true; }
		protected function get density():Number { return 1; }
		protected function get isSensor():Boolean { return false; }
		public function get isGood():Boolean { return false; }
		public function get isInjured():Boolean { return false; }
		public function get position():b2Vec2 { return _body.GetPosition().Copy(); }
		public function wreck(amount:Number):void { }
		
		public function beginSlide():void { }
		public function takeDamage(amount:Number):void { }
		public function takeTrapDamage(amount:Number):void { }
		
		protected function get miniMapColor():uint { return 0; }
		
		protected var _bloodSparks:int = 0;
		
		public function Actor(startPos:b2Vec2) 
		{
			var bd:b2BodyDef = new b2BodyDef();
			bd.position = startPos;
			bd.type = b2Body.b2_dynamicBody;
			bd.fixedRotation = true;
			bd.userData = this;
			
			_body = Game.s._world.CreateBody(bd);
			
			var fd:b2FixtureDef = new b2FixtureDef();
			fd.filter.categoryBits = this.categoryBits;
			fd.filter.maskBits = this.maskBits;
			fd.filter.groupIndex = this.group;
			fd.isSensor = isSensor;
			
			var cs:b2CircleShape = new b2CircleShape();
			cs.SetRadius(radius);
			
			fd.shape = cs;
			fd.density = density;
			
			if(hasFixture) _body.CreateFixture(fd);
			
			_image = new Image(Assets.s[texture]);
			_image.pivotX = _image.texture.width / 2;
			_image.pivotY = _image.texture.height / 2;
			_image.width = this.imageSize;
			_image.height = this.imageSize;
			_image.touchable = false;
			Game.s._worldSurface.addChild(_image);
			
			if (miniMapColor > 0)
			{
				_minimapGraphic = new Quad(3, 3, miniMapColor);
				Game.s._minimapSprite.addChild(_minimapGraphic);
			}
		}
		
		public function update():void
		{
			_image.x = _body.GetPosition().x;
			_image.y = _body.GetPosition().y;
			_image.rotation = _body.GetAngle();
			
			if (_minimapGraphic)
			{
				_minimapGraphic.x = _body.GetPosition().x;
				_minimapGraphic.y = _body.GetPosition().y;
			}
		}
		
		public function keep():Boolean
		{
			while (_bloodSparks > 0)
			{
				Game.s._actors.push(new Spark(position, 4, 1, 35, "blood"));
				_bloodSparks--;
			}
			
			return true;
		}
		
		public function destroyed():void
		{
			Game.s._worldSurface.removeChild(_image);
			Game.s._world.DestroyBody(_body);
			
			if (miniMapColor > 0)
			{
				Game.s._minimapSprite.removeChild(_minimapGraphic);
			}
		}
		
		public function beginContact(other:Actor):void {}
	}

}