package  
{
	import Box2D.Common.Math.b2Vec2;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class GoodGuy extends Unit 
	{
		override protected function get categoryBits():uint 
		{
			return 0x10000000;
		}
		
		override protected function get maskBits():uint 
		{
			return 0x10000000;
		}
		
		override public function get isGood():Boolean 
		{
			return true;
		}
		
		public function GoodGuy(pos:b2Vec2) 
		{
			super(pos);
		}
		
		override protected function get miniMapColor():uint 
		{
			return 0xFF00FFFF;
		}
		
		override public function beginContact(other:Actor):void 
		{
			super.beginContact(other);
			
			other.wreck(1);
		}
		
		override public function takeTrapDamage(amount:Number):void 
		{
			for each(var a:Actor in Game.s._actors)
			{
				if (a is Rogue)
				{
					var dist:Number = Math.pow(a.position.x - _body.GetPosition().x, 2) + Math.pow(a.position.y - _body.GetPosition().y, 2);
					
					if (dist < 20 * 20)
					{
						(a as Rogue).setMessage("Look out!", "It's a trap!", "Traaaaaap!", "Spike trap!");
						setMessage("Whoa!", "Close one!", "Thanks!", "Eeek!");
						amount *= 0.1;
						break;
					}
				}
			}
			
			super.takeTrapDamage(amount);
		}
	}

}