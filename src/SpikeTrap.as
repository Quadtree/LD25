package  
{
	import Box2D.Common.Math.b2Vec2;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class SpikeTrap extends Actor 
	{
		protected var _charge:int = COOLDOWN;
		
		protected const COOLDOWN:int = 60 * 6;
		
		override protected function get texture():String 
		{
			return "spiketrap";
		}
		
		override protected function get isSensor():Boolean 
		{
			return true;
		}
		
		public function SpikeTrap(pos:b2Vec2) 
		{
			super(pos);
			
			Assets.s.snd("place").play();
		}
		
		override public function update():void 
		{
			super.update();
			
			_charge--;
			
			if (_charge <= 0)
				_image.texture = Assets.s.spiketrap_ready;
			else
				_image.texture = Assets.s.spiketrap;
		}
		
		override public function beginContact(other:Actor):void 
		{
			super.beginContact(other);
			
			if (_charge <= 0 && other.isGood)
			{
				other.takeTrapDamage(3);
				
				_charge = COOLDOWN;
			}
		}
		
		override protected function get miniMapColor():uint 
		{
			return 0xFF666666;
		}
	}

}