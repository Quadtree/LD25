package  
{
	import Box2D.Common.Math.b2Vec2;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class FireBolt extends Projectile 
	{
		protected var _target:Unit;
		
		override protected function get group():int 
		{
			return -3;
		}
		
		override protected function get projectileSpeed():Number 
		{
			return 25;
		}
		
		public function FireBolt(startPos:b2Vec2, target:Unit) 
		{
			super(startPos, target.position);
			_target = target;
		}
		
		override protected function get texture():String 
		{
			return "flamespark";
		}
		
		override public function beginContact(other:Actor):void 
		{
			super.beginContact(other);
			if (!(other is RogueKnife) && !(other is Player))
			{
				other.takeDamage(0.25);
				_lifespan = 0;
			}
		}
		
		override protected function get radius():Number 
		{
			return 0.3;
		}
		
		override protected function get imageSize():Number 
		{
			return 0.6;
		}
		
		override public function update():void 
		{
			super.update();
			
			if (!_target.keep()) _lifespan = 0;
			
			var delta:b2Vec2 = _target.position;
			delta.Subtract(position);
			delta.Normalize();
			delta.Multiply(projectileSpeed);
			
			_body.SetLinearVelocity(delta);
		}
		
		override public function destroyed():void 
		{
			super.destroyed();
			
			Assets.s.snd("firespark_hit").play();
			
			for (var i:int = 0; i < 3;++i)
				Game.s._actors.push(new Spark(position, 10, 0.5, 40, "flamespark"));
		}
		
	}

}