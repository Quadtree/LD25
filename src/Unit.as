package  
{
	import Box2D.Common.Math.b2Vec2;
	import starling.core.Starling;
	import starling.text.TextField;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class Unit extends Actor 
	{
		public var _dest:b2Vec2 = new b2Vec2();
		
		protected var _messageTimer:int;
		
		protected var _slideTime:int;
		public var _health:Number = 1;
		protected var _message:TextField;
		
		protected function get armor():Number { return 1; }
		
		protected function get movePower():Number { return 4; }
		
		override public function takeTrapDamage(amount:Number):void 
		{
			super.takeTrapDamage(amount);
			takeDamage(amount);
		}
		
		override public function get isInjured():Boolean 
		{
			return _health < 0.9;
		}
		
		override public function takeDamage(amount:Number):void 
		{
			super.takeDamage(amount);
			_health -= amount / armor;
			
			_bloodSparks += amount * 3;
			
			Assets.s.snd("hit" + Math.round(Math.random() + 1)).play();
		}
		
		override public function beginSlide():void 
		{
			super.beginSlide();
			
			_slideTime = 60;
			
			setMessage("Aieee!", "Help!", "Whaaag!", "Whoa!");
		}
		
		override protected function get drag():Number 
		{
			return 0.25;
		}
		
		public function Unit(startPos:b2Vec2) 
		{
			super(startPos);
			
			_dest = startPos.Copy();
			
			_message = new TextField(200, 100, "", "Verdana", 15, 0xFFFFFFFF);
			//_message.border = true;
			_message.touchable = false;
			Game.s._speechSurface.addChild(_message);
		}
		
		override public function update():void 
		{
			super.update();
			
			if (_slideTime <= 0)
			{
			
				var delta:b2Vec2 = _dest.Copy();
				delta.Subtract(_body.GetPosition().Copy());
				if (delta.Length() > 1)
				{
					delta.Normalize();
					delta.Multiply(movePower);
					_body.ApplyImpulse(delta, _body.GetWorldCenter());
				}
			
				var vel:b2Vec2 = new b2Vec2(-_body.GetLinearVelocity().x * drag, -_body.GetLinearVelocity().y * drag);
				_body.ApplyImpulse(vel, _body.GetWorldCenter());
				_body.SetFixedRotation(true);
				_body.SetAngle(0);
				_body.SetAngularVelocity(0);
			} else {
				_slideTime--;
				_body.SetFixedRotation(false);
			}
			
			_message.x = (_image.x - Game.s._camPos.x - 4) * 24 + (Starling.current.viewPort.width / 2);
			_message.y = (_image.y - Game.s._camPos.y - 3) * 24 + (Starling.current.viewPort.height / 2);
			
			_messageTimer--;
			if (_messageTimer == 0) _message.text = "";
		}
		
		public function setMessage(... msgs):void 
		{
			var msg:String = msgs[Math.floor(Math.random() * msgs.length)];
			_messageTimer = msg.length * 10 + 40;
			_message.text = msg;
		}
		
		override public function keep():Boolean 
		{
			return super.keep() && _health > 0;
		}
		
		override public function destroyed():void 
		{
			super.destroyed();
			
			Game.s._speechSurface.removeChild(_message);
		}
	}

}