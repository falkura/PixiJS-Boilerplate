import { SessionConfig } from "./Config";
import { EVENTS } from "./Events";
import { LogicState } from "./logic_state";
import { AUDIO_MANAGER } from "./AudioManager";
import { ResourceController } from "./ResourceLoader";

declare const __ENVIRONMENT__: string;

export class PrePreloader {
  readonly container: PIXI.Container;
  private readonly app: PIXI.Application;

  constructor(app: PIXI.Application) {
    this.app = app;

    this.container = new PIXI.Container();
    this.createLoader();
    this.load_fonts();

    this.update_state();

    this.load_assets().then(this.start_preloader);
  }

  createLoader = () => {
    const gr = new PIXI.Graphics()
      .lineStyle(15, 0x000000, 1)
      .arc(0, 0, 100, 0, Math.PI);

    gr.position.set(this.app.view.width / 2, this.app.view.height / 2);

    this.container.addChild(gr);

    const rotation = () => {
      gr.rotation += 0.1;
    };

    this.app.ticker.add(rotation);

    document.addEventListener(
      EVENTS.loading.preloader_loaded,
      () => {
        this.app.ticker.remove(rotation);
      },
      {
        once: true,
      }
    );
  };

  update_state = () => {
    const url = `${window.location.origin}${window.location.pathname}`.replace(
      "index.html",
      ""
    );

    SessionConfig.ASSETS_ADDRESS = `${url}assets/`;
    SessionConfig.API_ADDRESS = url;
  };

  load_fonts() {
    ResourceController.loadFonts();
  }

  load_assets() {
    return new Promise<void>((resolve) => {
      ResourceController.addResources("preload");
      ResourceController.loadResources(resolve);
    });
  }

  start_preloader() {
    document.dispatchEvent(new Event(EVENTS.loading.preloader_loaded));
    AUDIO_MANAGER.init();
  }

  resize() {}
}
