package  
{
	import Box2D.Common.Math.b2Vec2;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class FrostBolt extends Projectile 
	{
		override protected function get group():int 
		{
			return -1;
		}
		
		override protected function get projectileSpeed():Number 
		{
			return 10;
		}
		
		public function FrostBolt(startPos:b2Vec2, targetPos:b2Vec2) 
		{
			super(startPos, targetPos);
		}
		
		override protected function get texture():String 
		{
			return "icebolt";
		}
		
		override protected function get density():Number 
		{
			return 10;
		}
		
		override public function beginContact(other:Actor):void 
		{
			super.beginContact(other);
			other.beginSlide();
		}
		
		override public function update():void 
		{
			super.update();
			
			if(Math.random() < 0.2)
				Game.s._actors.push(new Spark(position, 2, 0.8, 60, "frostspark"));
		}
	}

}