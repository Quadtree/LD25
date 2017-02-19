package  
{
	import Box2D.Common.Math.b2Vec2;
	import starling.display.Image;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class Villager extends Unit 
	{
		protected var _hasMoney:Boolean = true;
		protected var _coin:Image;
		protected var _coinPosition:Number = 0;
		
		override public function get isGood():Boolean 
		{
			return true;
		}
		
		public function Villager(pos:b2Vec2) 
		{
			super(pos);
			
			_coin = new Image(Assets.s.coin);
			_coin.pivotX = _image.texture.width / 2;
			_coin.pivotY = _image.texture.height / 2;
			_coin.width = this.imageSize * 0.75;
			_coin.height = this.imageSize * 0.75;
			Game.s._worldSurface.addChild(_coin);
		}
		
		override public function update():void 
		{
			super.update();
			
			if (Math.random() * 60 * 60 <= 1) _hasMoney = true;
			
			_coin.visible = _hasMoney;
			_coin.x = _image.x;
			_coin.y = _image.y - 1.35 + Math.sin(_coinPosition) * 0.25;
			
			_coinPosition += 0.1;
			
			if (_hasMoney)
				_minimapGraphic.color = 0xFFFFFF00;
			else
				_minimapGraphic.color = 0xFF00FF00;
		}
		
		override protected function get texture():String 
		{
			return "villager" + (Math.round(Math.random() + 1));
		}
		
		public function extort():void
		{
			if (_hasMoney)
			{
				setMessage("Take it!", "Don't hurt me! Just take it", "Here's all we have.", "You fiend! Here's our last gold.");
				Game.s._gold += 20;
				_hasMoney = false;
				Assets.s.snd("coin").play();
			} else {
				setMessage("I don't have any, dark lord!", "You've taken all we have!", "We have no money, lord!", "We have nothing!");
			}
		}
		
		override public function destroyed():void 
		{
			super.destroyed();
			
			Game.s._worldSurface.removeChild(_coin);
		}
		
		override protected function get miniMapColor():uint 
		{
			return 0xFF00FF00;
		}
	}

}