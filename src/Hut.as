package  
{
	import Box2D.Common.Math.b2Vec2;
	import Box2D.Dynamics.b2Body;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class Hut extends Actor 
	{
		override protected function get texture():String 
		{
			return "hut";
		}
		
		override protected function get imageSize():Number 
		{
			return 4;
		}
		
		override protected function get radius():Number 
		{
			return 2;
		}
		
		public function Hut(pos:b2Vec2) 
		{
			super(pos);
			
			_body.SetType(b2Body.b2_staticBody);
		}
		
	}

}