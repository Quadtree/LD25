package  
{
	import Box2D.Common.Math.b2Vec2;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class FlameLance extends Projectile 
	{
		override protected function get group():int 
		{
			return -1;
		}
		
		override protected function get projectileSpeed():Number 
		{
			return 18;
		}
		
		public function FlameLance(startPos:b2Vec2, targetPos:b2Vec2) 
		{
			super(startPos, targetPos);
		}
		
		override protected function get texture():String 
		{
			return "firebolt";
		}
		
		override public function beginContact(other:Actor):void 
		{
			super.beginContact(other);
			if (!(other is RogueKnife))
			{
				other.takeDamage(2.5);
				_lifespan = 0;
			}
		}
		
		override public function update():void 
		{
			super.update();
			
			Game.s._actors.push(new Spark(position, 2, 0.6, 40, "flamespark"));
		}
		
		override public function destroyed():void 
		{
			super.destroyed();
			
			Assets.s.snd("firebolt_hit").play();
			
			for (var i:int = 0; i < 15;++i)
				Game.s._actors.push(new Spark(position, 10, 1.2, 40, "flamespark"));
		}
		
	}

}