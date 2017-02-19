package 
{
	import starling.core.Starling;
	import flash.display.Sprite;
	
	[SWF(width="1024", height="768", frameRate="60", backgroundColor="#ffffff")]
	public class Main extends Sprite
	{
		private var _starling:Starling;

		public function Main()
		{
			_starling = new Starling(Game, stage);
			_starling.start();
		}
	}
	
}