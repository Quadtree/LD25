import { Scene, Sound, SpriteManager, Texture } from "@babylonjs/core";

export async function loadTextures(scene: Scene) {
	const ret = new Map<string, SpriteManager>();

	function loadTexture(path: string, name: string) {
		return new Promise<void>((res, rej) => {
			const sm = new SpriteManager(
				name,
				path.replace("../lib", "assets/ld25"),
				8192,
				{
					width: 32,
					height: 32,
				}, scene
			);

			sm.texture.onLoadObservable.add(() => {
				console.log("onLoad", path, name)
				sm.cellWidth = sm.texture.getSize().width;
				sm.cellHeight = sm.texture.getSize().height;
				res();
			})

			ret.set(name, sm);
		})
	}

	await Promise.all([
		loadTexture("../lib/grass1.png", "grass1"),
		loadTexture("../lib/grass2.png", "grass2"),
		loadTexture("../lib/grass3.png", "grass3"),
		loadTexture("../lib/grass4.png", "grass4"),
		loadTexture("../lib/vil2.png", "vil1"),
		loadTexture("../lib/water.png", "water"),
		loadTexture("../lib/firebolt.png", "firebolt"),
		loadTexture("../lib/icebolt.png", "icebolt"),
		loadTexture("../lib/gate.png", "gate"),
		loadTexture("../lib/villager1.png", "villager1"),
		loadTexture("../lib/villager2.png", "villager2"),
		loadTexture("../lib/flamespark.png", "flamespark"),
		loadTexture("../lib/frostspark.png", "frostspark"),
		loadTexture("../lib/coin.png", "coin"),
		loadTexture("../lib/hut.png", "hut"),
		loadTexture("../lib/rogue.png", "rogue"),
		loadTexture("../lib/knight.png", "knight"),
		loadTexture("../lib/cleric.png", "cleric"),
		loadTexture("../lib/healbeam.png", "healbeam"),
		loadTexture("../lib/rogueknife.png", "rogueknife"),
		loadTexture("../lib/spiketrap.png", "spiketrap"),
		loadTexture("../lib/spiketrap_ready.png", "spiketrap_ready"),
		loadTexture("../lib/blood.png", "blood"),
		loadTexture("../lib/flamepedistal.png", "flamepedistal"),
		loadTexture("../lib/flamepedistal_ready.png", "flamepedistal_ready"),
		loadTexture("../lib/dark_crystal.png", "dark_crystal"),
		loadTexture("../lib/hud.png", "hud"),
		loadTexture("../lib/shore1.png", "shore1"),
		loadTexture("../lib/shore2.png", "shore2"),
		loadTexture("../lib/shore3.png", "shore3"),
		loadTexture("../lib/shore4.png", "shore4"),
		loadTexture("../lib/shore5.png", "shore5"),
		loadTexture("../lib/shore6.png", "shore6"),
		loadTexture("../lib/shore7.png", "shore7"),
		loadTexture("../lib/shore8.png", "shore8"),
		loadTexture("../lib/title.png", "title"),
		loadTexture("../lib/help.png", "help"),
		loadTexture("../lib/victory.png", "victory"),
		loadTexture("../lib/lose.png", "lose"),
	]);

	return ret;
}

export function loadSounds(scene: Scene) {
	const ret = new Map<string, Sound>();

	function loadSound(path: string, name: string) {
		path = path.replace("../lib", "assets/ld25");
		//console.log(`loadSound(${path}, ${name})`)
		ret.set(name, new Sound(
			name,
			path,
			scene
		));
	}

	loadSound("../lib/coin.wav.mp3", "coin");
	loadSound("../lib/firebolt_hit.wav.mp3", "firebolt_hit");
	loadSound("../lib/firespark_hit.wav.mp3", "firespark_hit");
	loadSound("../lib/gate.wav.mp3", "gate");
	loadSound("../lib/hit1.wav.mp3", "hit1");
	loadSound("../lib/hit2.wav.mp3", "hit2");
	loadSound("../lib/place.wav.mp3", "place");
	loadSound("../lib/heal.wav.mp3", "heal");
	loadSound("../lib/potion.wav.mp3", "potion");

	loadSound("../lib/ambient.mp3", "ambient");
	loadSound("../lib/battle.mp3", "battle");

	return ret;
}