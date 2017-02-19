package  
{
	import Box2D.Common.Math.b2Vec2;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class RogueKnife extends Projectile 
	{
		protected var _thrower:Rogue;
		
		override protected function get categoryBits():uint 
		{
			return 0x20000000;
		}
		
		override protected function get maskBits():uint 
		{
			return 0x20000000;
		}
		
		override protected function get group():int 
		{
			return -2;
		}
		
		override protected function get texture():String 
		{
			return "rogueknife";
		}
		
		override protected function get projectileSpeed():Number 
		{
			return 17;
		}
		
		override protected function get density():Number 
		{
			return 0.15;
		}
		
		public function RogueKnife(pos:b2Vec2, target:b2Vec2, thrower:Rogue) 
		{
			super(pos, target);
			_thrower = thrower;
			_body.SetAngularVelocity(15);
			_body.SetFixedRotation(false);
		}
		
		override public function beginContact(other:Actor):void 
		{
			super.beginContact(other);
			
			if (other is Villager) _thrower.setMessage("Whoops!", "Uh, acceptable collateral damage.", "Wow, he's throwing knives now?", "Who threw that?!", "Did anybody see that?", "Sorry!");
			
			other.takeDamage(0.9);
			other.wreck(0.05);
		}
		
	}

}