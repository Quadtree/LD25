package  
{
	import Box2D.Common.Math.b2Vec2;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class Knight extends GoodGuy 
	{
		protected var _aggroed:Boolean = false;
		
		protected var _swingTimer:int = 0;
		
		override protected function get armor():Number 
		{
			return 4;
		}
		
		override protected function get movePower():Number 
		{
			return 4;
		}
		
		override protected function get texture():String 
		{
			return "knight";
		}
		
		public function Knight(pos:b2Vec2) 
		{
			super(pos);
		}
		
		override public function update():void 
		{
			super.update();
			
			_dest = Game.s._player.position;
			
			if (!_aggroed && Math.pow(_dest.x - position.x, 2) + Math.pow(_dest.y - position.y, 2) < (15 * 15))
			{
				setMessage("There he is!", "Get him!", "For the light!", "For puppies!", "Yaaaaaaaaa!", "Chaaarge!", "Attack!", "Prepare to die, tyrant!");
				_aggroed = true;
			}
			
			_swingTimer--;
			if (_swingTimer <= 0 && Math.pow(_dest.x - position.x, 2) + Math.pow(_dest.y - position.y, 2) < 2)
			{
				_swingTimer = 90;
				Game.s._player.takeDamage(0.8);
			}
		}
	}

}