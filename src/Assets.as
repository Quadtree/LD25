package  
{
	import flash.media.Sound;
	import starling.textures.Texture;
	import flash.utils.flash_proxy;
	import flash.utils.getDefinitionByName;
	import flash.utils.Proxy;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public dynamic class Assets extends Proxy
	{
		private static var _singleton:Assets = new Assets();
		
		private var _assets:Array = new Array();
		private var _assetHolder:AssetHolder = new AssetHolder();
		
		public static function get s():Assets { return _singleton; }
		
		override flash_proxy function getProperty(name:*):* 
		{
			if (!_assets[name])
			{
				if (name in _assetHolder)
				{
					var cls:Class = _assetHolder[name];
					trace("Creating new texture for " + name);
					_assets[name] = Texture.fromBitmap(new cls());
				} else {
					trace("Texture " + name + " not found");
				}
			}
			
			return _assets[name];
		}
		
		public function snd(name:String):Sound
		{
			name = "s_" + name;
			
			if (!_assets[name])
			{
				if (name in _assetHolder)
				{
					var cls:Class = _assetHolder[name];
					trace("Creating new sound for " + name);
					_assets[name] = new cls();
				} else {
					trace("Sound " + name + " not found");
				}
			}
			
			return _assets[name];
		}
		
		public function Assets() 
		{
			
		}
		
	}

}