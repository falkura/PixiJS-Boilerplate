import { Config } from "./Config";
import { AppState } from "./Models";
import { Subject } from "./Observer";

declare const __ENVIRONMENT__: string;
class LogicStateClass extends Subject {
    app_state: AppState = "pre_preloader";

    is_music_on = true;
    are_sound_fx_on = true;

    is_mobile = false;
    is_landscape = true;

    constructor() {
        super();
    }
}

export const LogicState = new LogicStateClass();
