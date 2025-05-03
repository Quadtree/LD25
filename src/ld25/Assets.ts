import { Scene, Sound, SpriteManager, Texture } from "@babylonjs/core";
import { loadSounds, loadTextures } from "./AssetHolder";

export class Assets {
	private static _singleton: Assets = new Assets();

	private _textures = new Map<string, SpriteManager>();
	private _spriteManagers = new Map<string, SpriteManager>();
	private _sounds = new Map<string, Sound>();

	public static get s(): Assets { return Assets._singleton; }

	async loadAll(scene: Scene) {
		if (!scene) throw new Error();

		this._textures = await loadTextures(scene);
		this._sounds = loadSounds(scene);
	}

	tex(name: string): SpriteManager {
		const ret = this._textures.get(name);
		if (!ret) throw new Error(`Texture ${name} not found`)
		return ret;
	}

	snd(name: string): Sound {
		const ret = this._sounds.get(name);
		if (!ret) throw new Error(`Sound ${name} not found`)
		return ret;
	}

}