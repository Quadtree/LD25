package  
{
	import Box2D.Common.Math.b2Vec2;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class GateVisual extends Actor 
	{
		override protected function get imageSize():Number 
		{
			return 2.2;
		}
		
		override protected function get texture():String 
		{
			return "gate";
		}
		
		public function GateVisual(pos:b2Vec2) 
		{
			super(pos);
		}
		
		override public function update():void 
		{
			super.update();
			
			_image.alpha -= 0.05;
			
			_image.rotation = Math.random() * Math.PI * 2;
		}
		
		override public function keep():Boolean 
		{
			return super.keep() && _image.alpha > 0;
		}
		
		override protected function get hasFixture():Boolean 
		{
			return false;
		}
		
	}

}