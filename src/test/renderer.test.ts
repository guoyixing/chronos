import {Chronos} from "../main/chronos";

import mock from './mock.json';
import {ChronosNodeDraw} from "../main/component/node/chronos.node.draw";
console.log(mock);

const divElement: HTMLElement | null = document.getElementById('root');
const nodeDrawDivElement: HTMLElement | null = document.getElementById('nodeDraw');

if (!(divElement instanceof HTMLDivElement)) {
    throw new Error('不支持的标签类型，仅支持 DIV 标签');
}

try {
    new Chronos(divElement as HTMLDivElement);
    new ChronosNodeDraw(nodeDrawDivElement as HTMLDivElement);
} catch (e) {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.open(`https://stackoverflow.com/search?q=js+${e.message}`, '_blank');
}



