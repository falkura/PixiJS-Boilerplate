import { LogicState } from "./logic_state";
import { Config } from "./Config";
import { ResourceController } from "./ResourceLoader";
import { core } from "./core/core";

export class Game {
    app: PIXI.Application;
    container = new PIXI.Container();
    bg!: core.Sprite;

    constructor(app: PIXI.Application) {
        this.app = app;

        this.add_event_listeners();
        this.createBG();
        console.log("HI!");

        this.resize();
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
            Config.game_width / this.bg.__width >
                Config.game_height / this.bg.__height
                ? Config.game_width / this.bg.__width
                : Config.game_height / this.bg.__height
        );
    };
}
