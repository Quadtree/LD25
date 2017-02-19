package  
{
	import Box2D.Common.Math.b2Vec2;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class Rogue extends GoodGuy 
	{
		protected var _throwTimer:int;
		
		protected var _aggroed:Boolean = false;
		
		override protected function get armor():Number 
		{
			return 3;
		}
		
		override protected function get texture():String 
		{
			return "rogue";
		}
		
		public function Rogue(pos:b2Vec2) 
		{
			super(pos);
		}
		
		override public function update():void 
		{
			super.update();
			
			_dest = Game.s._player.position;
			
			var range:Number = Math.pow(_dest.x - position.x, 2) + Math.pow(_dest.y - position.y, 2);
			
			if (!_aggroed && range < (15 * 15))
			{
				setMessage("Target spotted.", "Easy contract.", "Moving in.", "You distract him while I move in.", "I've got your back.");
				_aggroed = true;
			}
			
			if (range < (12 * 12))
			{
				_dest = position;
				_throwTimer--;
				
				if (_throwTimer <= 0)
				{
					var dist:Number = Math.sqrt(Math.pow(Game.s._player.position.x - position.x, 2) + Math.pow(Game.s._player.position.y - position.y, 2));
					var angle:Number = Math.atan2(Game.s._player.position.y - position.y, Game.s._player.position.x - position.x);
					
					angle += (Math.random() - 0.5) * 0.35;
			
					Game.s._actors.push(new RogueKnife(position, new b2Vec2(position.x + Math.cos(angle), position.y + Math.sin(angle)), this));
					
					_throwTimer = 40;
				}
			}
		}
		
		override public function takeTrapDamage(amount:Number):void 
		{
		}
	}

}