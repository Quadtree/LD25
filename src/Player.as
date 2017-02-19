package  
{
	import Box2D.Common.Math.b2Vec2;
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class Player extends Unit 
	{
		public var _globalCooldown:int;
		public var _maxCooldown:Number = 60;
		
		public var _healthPotionTimer:int = 0;
		
		public const HEALTH_POTION_ACTION_TIME:int = 480;
		
		override protected function get group():int 
		{
			return -1;
		}
		
		override protected function get armor():Number 
		{
			return 8.5;
		}
		
		protected function resetCooldown():void
		{
			_globalCooldown = _maxCooldown;
		}
		
		public function Player(startPos:b2Vec2) 
		{
			super(startPos);
		}
		
		override public function update():void 
		{
			super.update();
			
			if (_healthPotionTimer > 0)
			{
				_health += 1 / HEALTH_POTION_ACTION_TIME;
				_health = Math.min(_health, 1);
				_healthPotionTimer--;
			}
			
			_globalCooldown--;
		}
		
		public function useBoltVolley(target:b2Vec2):void
		{
			if (_globalCooldown > 0) return;
			resetCooldown();
			
			var dist:Number = Math.sqrt(Math.pow(target.x - position.x, 2) + Math.pow(target.y - position.y, 2));
			var angle:Number = Math.atan2(target.y - position.y, target.x - position.x);
			
			for (var i:int = -2; i <= 2;++i)
			{
				var curAngle:Number = angle + i * 0.2;
				
				Game.s._actors.push(new FrostBolt(position, new b2Vec2(position.x + Math.cos(curAngle), position.y + Math.sin(curAngle))));
			}
		}
		
		public function useFlameLance(target:b2Vec2):void
		{
			if (_globalCooldown > 0) return;
			resetCooldown();
			
			Game.s._actors.push(new FlameLance(position, target));
		}
		
		public function useGate(target:b2Vec2):void
		{
			if (target.x < 7.5 * 4) return;
			if (target.y < 7.5 * 4) return;
			if (target.x > (Game.s.MAP_WIDTH - 7.5 + 1)*4) return;
			if (target.y > (Game.s.MAP_HEIGHT - 7.5 + 1)*4) return;
			
			if (_globalCooldown > 0) return;
			resetCooldown();
			
			Game.s._actors.push(new GateVisual(_body.GetPosition().Copy()));
			
			_body.SetPosition(target.Copy());
			_dest = target.Copy();
			
			Game.s._actors.push(new GateVisual(_body.GetPosition().Copy()));
			
			Assets.s.snd("gate").play();
		}
		
		public function extortVillagers():void
		{
			setMessage("The Dark Lord demands tribute!", "Give me all your money!", "Taxes are due!");
			
			for each(var a:Actor in Game.s._actors)
			{
				if (a is Villager)
				{
					var dist:Number = Math.sqrt(Math.pow(a.position.x - position.x, 2) + Math.pow(a.position.y - position.y, 2));
					if (dist < 10)
					{
						(a as Villager).extort();
					}
				}
			}
		}
		
		public const SPIKE_TRAP_GOLD:int = 60;
		public const DARK_CRYSTAL_GOLD:int = 150;
		public const FLAME_PEDISTAL_GOLD:int = 75;
		public const HEALTH_POTION_GOLD:int = 50;
		
		public function placeSpikeTrap(target:b2Vec2):void
		{
			if (Game.s._gold < SPIKE_TRAP_GOLD) return;
			Game.s._gold -= SPIKE_TRAP_GOLD;
			
			Game.s._actors.push(new SpikeTrap(target));
		}
		
		public function placeFlamePedistal(target:b2Vec2):void
		{
			if (Game.s._gold < FLAME_PEDISTAL_GOLD) return;
			Game.s._gold -= FLAME_PEDISTAL_GOLD;
			
			Game.s._actors.push(new FlamePedistal(target));
		}
		
		public function placeDarkCrystal(target:b2Vec2):void
		{
			if (Game.s._gold < DARK_CRYSTAL_GOLD) return;
			Game.s._gold -= DARK_CRYSTAL_GOLD;
			
			Game.s._actors.push(new DarkCrystal(target));
		}
		
		public function drinkHealthPotion(target:b2Vec2):void
		{
			if (Game.s._gold < HEALTH_POTION_GOLD) return;
			Game.s._gold -= HEALTH_POTION_GOLD;
			
			Assets.s.snd("potion").play();
			
			_healthPotionTimer = HEALTH_POTION_ACTION_TIME;
		}
		
		override protected function get miniMapColor():uint 
		{
			return 0xFFFF0000;
		}
	}

}