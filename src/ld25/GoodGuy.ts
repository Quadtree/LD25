import { Actor } from "./Actor";
import { Box2DT } from "./Box2DT";
import { uint } from "./Common";
import { Game } from "./Game";
import { Rogue } from "./Rogue";
import { Unit } from "./Unit";

	export class GoodGuy extends Unit
	{
		protected override get categoryBits():uint
		{
			return 0x10000000;
		}

		protected override get maskBits():uint
		{
			return 0x10000000;
		}

		public override get isGood():Boolean
		{
			return true;
		}

		public constructor(pos:Box2DT.b2Vec2)
		{
			super(pos);
		}

		protected override get miniMapColor():uint
		{
			return 0xFF00FFFF;
		}

		public override beginContact(other:Actor):void
		{
			super.beginContact(other);

			other.wreck(1);
		}

		public override takeTrapDamage(amount: number):void
		{
			for(var a of Game.s._actors)
			{
				if (a instanceof Rogue)
				{
					var dist: number = Math.pow(a.position.x - this._body.GetPosition().x, 2) + Math.pow(a.position.y - this._body.GetPosition().y, 2);

					if (dist < 20 * 20)
					{
						(a as Rogue).setMessage("Look out!", "It's a trap!", "Traaaaaap!", "Spike trap!");
						this.setMessage("Whoa!", "Close one!", "Thanks!", "Eeek!");
						amount *= 0.1;
						break;
					}
				}
			}

			super.takeTrapDamage(amount);
		}
	}