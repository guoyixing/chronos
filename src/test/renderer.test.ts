import {Chronos} from "../main/chronos";

import mock from './mock.json';

const divElement: HTMLElement | null = document.getElementById('root');

if (!(divElement instanceof HTMLDivElement)) {
    throw new Error('不支持的标签类型，仅支持 DIV 标签');
}

try {
    new Chronos(divElement as HTMLDivElement,{});
} catch (e) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    console.log(e)
    // @ts-expect-error
    window.open(`https://stackoverflow.com/search?q=js+${e.message}`, '_blank');
}



