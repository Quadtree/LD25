package  
{
	import Box2D.Collision.b2Bound;
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2ContactListener;
	import Box2D.Dynamics.Contacts.b2Contact;
	
	/**
	 * ...
	 * @author admin@ironalloygames.com
	 */
	public class ContactListener extends b2ContactListener 
	{
		
		public function ContactListener() 
		{
			
		}
		
		override public function BeginContact(contact:b2Contact):void 
		{
			super.BeginContact(contact);
			
			var b1:b2Body = contact.GetFixtureA().GetBody();
			var b2:b2Body = contact.GetFixtureB().GetBody();
			
			if (b1.GetUserData() && b2.GetUserData())
			{
				(b1.GetUserData() as Actor).beginContact(b2.GetUserData() as Actor);
				(b2.GetUserData() as Actor).beginContact(b1.GetUserData() as Actor);
			}
		}
	}

}