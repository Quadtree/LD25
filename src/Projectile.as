package  
{
	import Box2D.Common.Math.b2Vec2;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class Projectile extends Actor
	{
		protected function get projectileSpeed():Number { return 0; }
		
		protected var _lifespan:int = 180;
		
		public function Projectile(startPos:b2Vec2, targetPos:b2Vec2) 
		{
			super(startPos);
			
			var delta:b2Vec2 = targetPos.Copy();
			delta.Subtract(startPos);
			delta.Normalize();
			delta.Multiply(projectileSpeed * _body.GetMass());
			
			_body.ApplyImpulse(delta, _body.GetWorldCenter());
			
			_body.SetAngle(Math.atan2(targetPos.y - startPos.y, targetPos.x - startPos.x));
		}
		
		override public function update():void 
		{
			super.update();
			
			_lifespan--;
		}
		
		override public function keep():Boolean 
		{
			return super.keep() && _lifespan > 0;
		}
	}

}