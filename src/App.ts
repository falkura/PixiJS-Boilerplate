import * as PIXI from "pixi.js";
import { LogicState } from "./logic_state";
import { PrePreloader } from "./PrePreloader";
import { Preloader } from "./Preloader";
import { Game } from "./Game";
import { Config } from "./Config";
import { EVENTS } from "./Events";
import { get_platform } from "./Util";
import { ResourceController } from "./ResourceLoader";

export class App {
	readonly canvas: HTMLCanvasElement;
	readonly app: PIXI.Application;
	readonly is_landscape: boolean = true;
	pre_preloader?: PrePreloader;
	preloader?: Preloader;
	game?: Game;

	constructor() {
		LogicState.is_mobile = get_platform();
		this.canvas = document.getElementById("root") as HTMLCanvasElement;

		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";
		this.canvas.style.marginTop = "0";
		this.canvas.style.marginLeft = "0";

		this.app = this.get_pixi_app();

		this.setup_events();
		this.load_preloader();

		window.onresize = this.on_resize;
		this.on_resize();
	}

	get_pixi_app = () => {
		PIXI.settings.ROUND_PIXELS = true;
		PIXI.settings.SORTABLE_CHILDREN = true;

		return new PIXI.Application({
			width: Config.game_width,
			height: Config.game_height,
			view: this.canvas,
			sharedLoader: true,
			sharedTicker: true,
			transparent: true,
		});
	};

	on_resize = () => {
		if (window.innerWidth < window.innerHeight) {
			const multiplier = window.innerWidth / LogicState.app_width;
			const target_height = window.innerHeight / multiplier;

			this.app.renderer.resize(LogicState.app_width, target_height);

			LogicState.is_landscape = false;
		} else {
			const multiplier = window.innerHeight / LogicState.app_height;
			const target_width = window.innerWidth / multiplier;

			this.app.renderer.resize(target_width, LogicState.app_height);

			LogicState.is_landscape = true;
		}

		Config.game_width = this.app.view.width;
		Config.game_height = this.app.view.height;

		LogicState.notify_all();

		if (this.game) {
			this.game.resize();
		} else if (this.preloader) {
			this.preloader.resize();
		} else if (this.pre_preloader) {
			this.pre_preloader.resize();
		}
	};

	load_preloader = () => {
		this.pre_preloader = new PrePreloader(this.app);
		this.app.stage.addChild(this.pre_preloader.container);
	};

	on_preloader_loaded = () => {
		if (this.pre_preloader) {
			this.app.stage.removeChild(this.pre_preloader.container);
		}

		this.preloader = new Preloader(this.app);
		this.app.stage.addChild(this.preloader.container);
		LogicState.app_state = "preloader";
		LogicState.notify_all();
	};

	on_game_loaded = () => {
		this.app.stage.removeChild(this.preloader!.container);
		this.on_continue();

		LogicState.notify_all();
	};

	on_continue = () => {
		this.game = new Game(this.app);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Object.assign(globalThis, {
			Game: this.game,
			ls: LogicState,
			App: this,
			rc: ResourceController,
			Config: Config,
		});

		this.app.stage.addChildAt(this.game.container, 0);
		LogicState.app_state = "game";
		LogicState.notify_all();
	};

	setup_events = () => {
		document.addEventListener(
			EVENTS.loading.preloader_loaded,
			this.on_preloader_loaded
		);
		document.addEventListener(EVENTS.loading.game_loaded, this.on_game_loaded);
	};
}
