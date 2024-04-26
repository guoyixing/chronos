import {Chronos} from "../main/chronos";
import * as data from './mock.json';
import {ChronosNodeEntryData} from "../main/component/node/operate/entry/node-entry.data";
import {ChronosLaneEntryData} from "../main/component/lane/entry/lane-entry.data";

const divElement: HTMLElement | null = document.getElementById('root');


if (!(divElement instanceof HTMLDivElement)) {
    throw new Error('不支持的标签类型，仅支持 DIV 标签');
}

try {

    let chronos = new Chronos(divElement as HTMLDivElement, data);
    chronos.callback.nodeDoubleClick = nodeDoubleClick
    chronos.callback.nodeReviseConfirm = nodeReviseConfirm
    chronos.callback.laneDoubleClick = laneDoubleClick
    chronos.callback.laneReviseConfirm = laneReviseConfirm

} catch (e) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    console.log(e)
    // @ts-expect-error
    window.open(`https://stackoverflow.com/search?q=js+${e.message}`, '_blank');
}

/**
 * 节点双击事件
 * @param node 节点数据
 */
function nodeDoubleClick(node: ChronosNodeEntryData) {
    let name = document.getElementById('nodeName') as HTMLInputElement;
    let startTime = document.getElementById('starTime') as HTMLInputElement;
    let finishTime = document.getElementById('endTime') as HTMLInputElement;
    let progress = document.getElementById('progress') as HTMLInputElement;
    name.value = node.name;
    startTime.value = formatLocalDate(node.startTime)
    if (node.finishTime) {
        finishTime.value = formatLocalDate(node.finishTime)
    }
    if (node.progress) {
        progress.value = node.progress * 100 + ''
    }
}

function laneDoubleClick(node: ChronosLaneEntryData) {
    let name = document.getElementById('laneName') as HTMLInputElement;
    name.value = node.name;
}

function formatLocalDate(date: Date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function nodeReviseConfirm(node: ChronosNodeEntryData) {
    let name = document.getElementById('nodeName') as HTMLInputElement;
    let startTime = document.getElementById('starTime') as HTMLInputElement;
    let finishTime = document.getElementById('endTime') as HTMLInputElement;
    let progress = document.getElementById('progress') as HTMLInputElement;
    node.name = name.value;
    node.startTime = new Date(startTime.value);
    node.finishTime = new Date(finishTime.value);
    node.progress = parseInt(progress.value) / 100;
}

function laneReviseConfirm(node: ChronosLaneEntryData) {
    let name = document.getElementById('laneName') as HTMLInputElement;
    node.name = name.value;
}



