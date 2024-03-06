import {Renderer} from "./engine/renderer";

let divElement: HTMLElement | null = document.getElementById('root');

if (divElement) {

    if (divElement.tagName !== 'DIV') {
        throw new Error('不支持的标签类型，仅支持 DIV 标签');
    }
    const windowManager = new Renderer(divElement as HTMLDivElement);
}

let button = document.createElement('button');

button.textContent = "点击我";

button.addEventListener('click', () => {
    console.log('按钮被点击了');
});

document.body.appendChild(button);
