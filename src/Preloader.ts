import { ATLASES } from "./Assets";
import "./AudioManager";
import { Config } from "./Config";
import { EVENTS } from "./Events";
import { LogicState } from "./logic_state";
import { ResourceController } from "./ResourceLoader";

export class Preloader {
  readonly container: PIXI.Container;
  private readonly app: PIXI.Application;
  private bg!: PIXI.Sprite;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container();

    this.draw_loader();
    this.load_assets();
    this.resize();
  }

  draw_loader = () => {
    this.bg = ResourceController.getSprite("loader_bg");
    this.bg.anchor.set(0.5);
    this.container.addChild(this.bg);
  };

  load_assets = () => {
    ResourceController.addResources("main");

    ResourceController.loader.onProgress.add(() => {});

    ResourceController.loadResources(() => {
      for (const atlas of ATLASES["main"]) {
        Object.assign(
          ResourceController.resources,
          ResourceController.resources[atlas.key].textures
        );
      }
      document.dispatchEvent(new Event(EVENTS.events.game_loaded));
    });
  };

  resize = () => {
    this.bg.scale.set(
      Config.game_width / this.bg.texture.width >
        Config.game_height / this.bg.texture.height
        ? Config.game_width / this.bg.texture.width
        : Config.game_height / this.bg.texture.height
    );

    if (LogicState.is_mobile) {
      if (LogicState.is_landscape) {
      } else {
      }
    }
  };
}
