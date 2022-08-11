import "pixi-spine";
import packageInfo from "../package.json";
import { App } from "./App";

declare const __ENVIRONMENT__: string;

/**
 * Entry point of application
 */
function init() {
    document.getElementById("root")!.onmousedown = () => {
        return false;
    };

    const project_name = "PixiJS Boilerplate";
    const full_project_name = `${project_name} v${packageInfo.version} ${__ENVIRONMENT__}`;

    console.log(full_project_name);

    // Note, that the first (before loading) document title you will see is in the index.html file 
    document.title = full_project_name;

    new App();
}

if (document.readyState !== "loading") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
