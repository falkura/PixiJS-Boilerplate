import { Config } from "./Config";
import { AppState } from "./Models";
import { Subject } from "./Observer";

declare const __ENVIRONMENT__: string;
class LogicStateClass extends Subject {
  app_state: AppState = "pre_preloader";

  is_music_on = true;
  are_sound_fx_on = true;
  music_volume = 1;
  sound_fx_volume = 1;

  is_fullscreen = false;
  is_mobile = false;
  is_landscape = true;

  app_width = Config.game_width;
  app_height = Config.game_height;

  constructor() {
    super();
  }
}

export const LogicState = new LogicStateClass();

