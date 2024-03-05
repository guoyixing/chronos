import {Renderer} from "./engine/renderer";

let divElement = document.getElementById('test');

if (divElement) {
    const windowManager = new Renderer(divElement);
}
