import { Config } from "./Config";
import { ResourceController } from "./ResourceLoader";

export class Game {
    app: PIXI.Application;
    container = new PIXI.Container();
    bg!: PIXI.Sprite;

    constructor(app: PIXI.Application) {
        this.app = app;

        this.add_event_listeners();
        this.createBG();

        this.resize();

        console.log("Hello World!");
    }

    createBG = () => {
        this.bg = ResourceController.getSprite("project_bg");
        this.bg.anchor.set(0.5, 0.5);
        this.container.addChild(this.bg);
    };

    add_event_listeners = () => {};

    resize = () => {
        this.bg.position.set(Config.game_width / 2, Config.game_height / 2);

        this.bg.scale.set(
            Config.game_width / this.bg.texture.width >
                Config.game_height / this.bg.texture.height
                ? Config.game_width / this.bg.texture.width
                : Config.game_height / this.bg.texture.height
        );
    };
}
