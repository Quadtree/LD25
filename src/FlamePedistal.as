package  
{
	import Box2D.Common.Math.b2Vec2;
	import Box2D.Dynamics.b2Body;
	
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class FlamePedistal extends Actor 
	{
		public var _cooldown:int = 60 * 5;
		
		override protected function get group():int 
		{
			return -3;
		}
		
		override protected function get texture():String 
		{
			return "flamepedistal";
		}
		
		public function FlamePedistal(startPos:b2Vec2) 
		{
			super(startPos);
			
			_body.SetType(b2Body.b2_staticBody);
			
			Assets.s.snd("place").play();
		}
		
		override protected function get miniMapColor():uint 
		{
			return 0xFFFF7700;
		}
		
		override public function update():void 
		{
			super.update();
			
			_cooldown--;
			
			if (_cooldown <= 0)
				_image.texture = Assets.s.flamepedistal_ready;
			else
				_image.texture = Assets.s.flamepedistal;
			
			if (_cooldown <= 0)
			{
				var target:Unit = null;
				var bestDist:Number = 30*30;
				
				for each(var a:Actor in Game.s._actors)
				{
					if (a is Unit && a.isGood && !(a is Villager))
					{
						var dist:Number = Math.pow(a.position.x - _body.GetPosition().x, 2) + Math.pow(a.position.y - _body.GetPosition().y, 2);
						
						if (dist < bestDist)
						{
							bestDist = dist;
							target = a as Unit;
						}
					}
				}
				
				if (target)
				{
					_cooldown = 40;
					
					//dist = Math.sqrt(Math.pow(target.position.x - position.x, 2) + Math.pow(target.position.y - position.y, 2));
					//var angle:Number = Math.atan2(target.position.y - position.y, target.position.x - position.x);
					
					//angle += (Math.random() - 0.5) * 0.35;
			
					Game.s._actors.push(new FireBolt(position, target));
					
					//Game.s._actors.push(new FireBolt(position, target.position));
				}
			}
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