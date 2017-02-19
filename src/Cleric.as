package  
{
	import Box2D.Common.Math.b2Vec2;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class Cleric extends GoodGuy 
	{
		protected var _castTimer:int;
		
		override protected function get texture():String 
		{
			return "cleric";
		}
		
		override public function get isGood():Boolean 
		{
			return true;
		}
		
		public function Cleric(pos:b2Vec2) 
		{
			super(pos);
		}
		
		override protected function get armor():Number 
		{
			return 2.5;
		}
		
		override public function update():void 
		{
			super.update();
			
			var healTarget:Unit = null;
			var bestDist:Number = Number.MAX_VALUE;
			
			for each(var a:Actor in Game.s._actors)
			{
				if (a.isGood && a != this)
				{
					if (!a.isInjured && a is Cleric) continue;
					
					var dist:Number = Math.pow(a.position.x - _body.GetPosition().x, 2) + Math.pow(a.position.y - _body.GetPosition().y, 2);
					
					if (!a.isInjured) dist += 100000;
					
					if (dist < bestDist)
					{
						bestDist = dist;
						healTarget = a as Unit;
					}
				}
			}
			
			_castTimer--;
			
			if (healTarget)
			{
				bestDist = Math.pow(healTarget.position.x - _body.GetPosition().x, 2) + Math.pow(healTarget.position.y - _body.GetPosition().y, 2);
				
				if (bestDist < 10 * 10)
				{
					_dest = position;
					
					if (healTarget.isInjured && _castTimer <= 0)
					{
						_castTimer = 95;
						healTarget._health = 1;
						
						Assets.s.snd("heal").play();
						
						setMessage("Light mend your wounds!", "It's going to be alright.", "That looks bad, let me help.", "You'll be alright in a moment.", "What foul creature did this?");
						
						var steps:int = Math.sqrt(bestDist) + 2;
						var curPos:b2Vec2 = position;
						var move:b2Vec2 = new b2Vec2(healTarget.position.x - _body.GetPosition().x, healTarget.position.y - _body.GetPosition().y);
						move.Normalize();
						
						for (var i:int = 0; i < steps;++i)
						{
							Game.s._actors.push(new Spark(curPos, 0.5, 0.85, 90, "healbeam"));
							curPos.Add(move);
						}
					}
				} else {
					_dest = healTarget.position;
				}
			} else {
				_dest = position;
			}
		}
		
	}

}