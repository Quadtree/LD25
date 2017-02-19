package  
{
	import Box2D.Common.Math.b2Vec2;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class Spark extends Actor 
	{
		protected var _texture:String;
		protected var _size:Number;
		protected var _lifetime:int;
		protected var _maxLifetime:int;
		
		override protected function get texture():String 
		{
			return _texture;
		}
		
		override protected function get imageSize():Number 
		{
			return _size;
		}
		
		override protected function get hasFixture():Boolean 
		{
			return false;
		}
		
		public function Spark(pos:b2Vec2, speed:Number, size:Number, lifetime:int, texture:String) 
		{
			_texture = texture;
			_size = size;
			_lifetime = lifetime;
			_maxLifetime = lifetime;
			
			super(pos);
			
			_body.SetLinearVelocity(new b2Vec2((Math.random() * 2 - 1) * speed, (Math.random() * 2 - 1) * speed));
			_body.SetFixedRotation(false);
			_body.SetAngle(Math.random() * Math.PI * 2);
			_body.SetAngularVelocity(Math.random());
		}
		
		override public function update():void 
		{
			super.update();
			
			_image.alpha = _lifetime / _maxLifetime;
			
			_lifetime--;
		}
		
		override public function keep():Boolean 
		{
			return _lifetime > 0;
		}
	}

}