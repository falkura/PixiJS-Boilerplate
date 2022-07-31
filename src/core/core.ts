/* eslint-disable @typescript-eslint/no-namespace */
import { Config } from "../Config";

export namespace core {
    export class Spine extends PIXI.spine.Spine {
        callback?: () => void;

        constructor(skeletonData: PIXI.spine.core.SkeletonData) {
            super(skeletonData);
        }

        setOnClick = (callback: () => void, once = true) => {
            if (!this.interactive) {
                this.interactive = true;
                this.cursor = "pointer";
                this.callback = once
                    ? () => {
                          callback();
                          this.removeOnClick();
                      }
                    : callback;
                this.addListener("pointerdown", this.callback);
            }
        };

        removeOnClick = () => {
            if (this.interactive) {
                this.interactive = false;
                this.cursor = "";
                this.removeListener("pointerdown", this.callback);
                this.callback = () => {};
            }
        };

        pause = () => {
            this.state.timeScale = 0;
        };

        play = () => {
            this.state.timeScale = 1;
        };

        finalize = () => {
            this.state.clearTracks();
            this.state.clearListeners();
            this.skeleton.setToSetupPose();

            //@ts-ignore
            this.lastTime = 0;
        };
    }

    export class Text extends PIXI.Text {
        constructor(
            text: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style?: any | PIXI.TextStyle,
            canvas?: HTMLCanvasElement | undefined
        ) {
            super(text, style, canvas);
        }
    }

    /**
     * The core.Sprite class extends the {@link PIXI.Sprite} with some useful function.
     *
     * A sprite can be created from resources that you added in Assets.
     *
     * Typical usage:
     *
     * ```ts
     * let sprite = ResourceController.getSprite('image.png');
     * ```
     *
     * @class
     * @extends PIXI.Sprite
     * @memberof core
     */
    export class Sprite extends PIXI.Sprite {
        __width!: number;
        __height!: number;

        constructor(texture?: PIXI.Texture | undefined) {
            super(texture);

            this.__width = this.width;
            this.__height = this.height;
        }

        getClone = (): core.Sprite => {
            return new core.Sprite(this.texture);
        };

        fillX = () => {
            this.width = Config.game_width;
        };

        changeTexture = (texture: PIXI.Texture) => {
            this.texture = texture;

            this.__width = texture.width;
            this.__height = texture.height;
        };

        setCircleHitArea = () => {
            this.hitArea = new PIXI.Circle(
                this.__width / 2 - this.__width * this.anchor.x,
                this.__height / 2 - this.__height * this.anchor.y,
                Math.max(this.__width, this.__height) / 2
            );
        };
    }
}
