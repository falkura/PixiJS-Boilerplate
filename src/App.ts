import * as PIXI from "pixi.js";
import { LogicState } from "./logic_state";
import { PrePreloader } from "./PrePreloader";
import { Preloader } from "./Preloader";
import { Game } from "./Game";
import { Config } from "./Config";
import { EVENTS } from "./Events";
import { get_platform } from "./Util";
import { ResourceController } from "./ResourceLoader";

declare const __ENVIRONMENT__: string;

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
    const style = this.canvas.style;
    let width: number;
    let height: number;
    let margin: number;

    if (LogicState.is_mobile && window.innerWidth < window.innerHeight) {
      const multiplier = window.innerWidth / 810;
      const target_height = window.innerHeight / multiplier;

      this.app.renderer.resize(810, target_height);

      LogicState.is_landscape = false;

      style.width = `100%`;
      style.height = `100%`;
      style.marginTop = `0`;
      style.marginLeft = `0`;
      Config.game_width = this.app.view.width;
      Config.game_height = this.app.view.height;
    } else {
      this.app.renderer.resize(Config.game_width, Config.game_height);
      LogicState.is_landscape = true;

      if (
        window.innerWidth >
        (window.innerHeight * Config.game_width) / Config.game_height
      ) {
        width = (window.innerHeight / Config.game_height) * Config.game_width;
        height = window.innerHeight;
        margin = (window.innerWidth - width) / 2;

        style.width = `${width}px`;
        style.height = `${height}px`;
        style.marginTop = `0`;
        style.marginLeft = `${margin}px`;
      } else {
        width = window.innerWidth;
        height = (window.innerWidth / Config.game_width) * Config.game_height;
        margin = (window.innerHeight - height) / 2;

        style.width = `${width}px`;
        style.height = `${height}px`;
        style.marginTop = `${margin}px`;
        style.marginLeft = `0`;
      }

      Config.game_width = LogicState.app_width;
      Config.game_height = LogicState.app_height;
    }

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
    Object.assign(window as any, {
      game: this.game,
      ls: LogicState,
      app: this,
      rc: ResourceController,
      Config: Config,
    });

    this.app.stage.addChildAt(this.game.container, 0);
    LogicState.app_state = "game";
    LogicState.notify_all();
  };

  setup_events = () => {
    document.addEventListener(
      EVENTS.events.preloader_loaded,
      this.on_preloader_loaded
    );
    document.addEventListener(EVENTS.events.game_loaded, this.on_game_loaded);
  };
}
