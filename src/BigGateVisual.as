package  
{
	import Box2D.Common.Math.b2Vec2;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class BigGateVisual extends Actor 
	{
		protected var _size:Number = 100;
		
		override protected function get imageSize():Number 
		{
			return _size;
		}
		
		override protected function get texture():String 
		{
			return "gate";
		}
		
		public function BigGateVisual(pos:b2Vec2) 
		{
			super(pos);
		}
		
		override public function update():void 
		{
			super.update();
			
			_size *= 0.975;
			_size -= 0.25;
			
			_image.width = _size;
			_image.height = _size;
			
			_image.rotation = Math.random() * Math.PI * 2;
		}
		
		override public function keep():Boolean 
		{
			return _size > 0;
		}
		
		override protected function get hasFixture():Boolean 
		{
			return false;
		}
	}

}