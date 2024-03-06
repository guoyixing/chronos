import {Chronos} from "../main/chronos";

const divElement: HTMLElement | null = document.getElementById('root');

if (!(divElement instanceof HTMLDivElement)) {
    throw new Error('不支持的标签类型，仅支持 DIV 标签');
}

const chronos = new Chronos(divElement as HTMLDivElement);
console.log("test:printer:chronos",chronos)


