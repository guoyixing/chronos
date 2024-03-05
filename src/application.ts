import {Renderer} from "./engine/renderer";
import Konva from 'konva';

let divElement: HTMLDivElement = document.getElementById('test');

if (divElement) {
    const windowManager = new Renderer(divElement);
}

let button = document.createElement('button');

button.textContent = "点击我";

button.addEventListener('click', () => {
    console.log('按钮被点击了');
});

document.body.appendChild(button);
