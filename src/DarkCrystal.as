package  
{
	import Box2D.Common.Math.b2Vec2;
	import Box2D.Dynamics.b2Body;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class DarkCrystal extends Actor 
	{
		public const BONUS:Number = 0.85;
		
		override protected function get texture():String 
		{
			return "dark_crystal";
		}
		
		override protected function get imageSize():Number 
		{
			return 2;
		}
		
		override protected function get radius():Number 
		{
			return 1;
		}
		
		public function DarkCrystal(pos:b2Vec2) 
		{
			super(pos);
			_body.SetType(b2Body.b2_staticBody);
			Game.s._player._maxCooldown *= BONUS;
			
			Assets.s.snd("place").play();
		}
		
		override protected function get miniMapColor():uint 
		{
			return 0xFFFF00FF;
		}
		
		override public function destroyed():void 
		{
			super.destroyed();
			
			Game.s._player._maxCooldown /= BONUS;
		}
		
		private var _alive:Boolean = true;
		
		override public function wreck(amount:Number):void 
		{
			super.wreck(amount);
			
			if (Math.random() < amount) _alive = false;
		}
		
		override public function keep():Boolean 
		{
			return super.keep() && _alive;
		}
	}

}