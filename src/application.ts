import {Renderer} from "./engine/renderer";

let divElement: HTMLElement | null = document.getElementById('root');

if (divElement) {

    if (divElement.tagName !== 'DIV') {
        throw new Error('不支持的标签类型，仅支持 DIV 标签');
    }
    const windowManager = new Renderer(divElement as HTMLDivElement);
}
