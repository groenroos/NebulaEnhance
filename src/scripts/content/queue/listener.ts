import { Message, getBrowserInstance, videoUrlMatch } from '../../helpers/sharedExt';
import type { Queue } from './index';

const confirmClear = getBrowserInstance().i18n.getMessage('pageQueueClearConfirm');

export function clickElements(this: Queue, e: MouseEvent) {
  const el = (e.target as HTMLElement).closest('.element');
  if (el === null)
    return;
  e.preventDefault();
  const i = Array.from(el.parentElement.children).findIndex(n => n.isSameNode(el));
  if (i === -1)
    return;
  const r = (e.target as HTMLElement).closest('.r');
  if (r !== null)
    return this.remove(i);
  const u = (e.target as HTMLElement).closest('.up');
  if (u !== null)
    return this.move(i, i - 1);
  const d = (e.target as HTMLElement).closest('.down');
  if (d !== null)
    return this.move(i, i + 1);
  this.goto(i);
}

export function clickTop(this: Queue, e: MouseEvent) {
  e.preventDefault();
  const c = (e.target as HTMLElement).closest('.close');
  if (c !== null)
    return confirm(confirmClear) ? this.clear() : null;
  const s = (e.target as HTMLElement).closest('.share');
  if (s !== null)
    return this.setShare();
  const r = (e.target as HTMLElement).closest('.reverse');
  if (r !== null)
    return this.reverse();
  const p = (e.target as HTMLElement).closest('.prev');
  if (p !== null)
    return this.gotoPrev();
  const n = (e.target as HTMLElement).closest('.next');
  if (n !== null)
    return this.gotoNext();
  this.toggle();
}

export function handleMessage(this: Queue, e: MessageEvent, msg: { type: string, [key: string]: any }): true {
  switch (msg.type) {
    case Message.QUEUE_NEXT:
      this.gotoNext();
      break;
    case Message.QUEUE_PREV:
      this.gotoPrev();
      break;
  }
  return true;
}

export function popState(this: Queue) {
  const match = window.location.pathname.match(videoUrlMatch);
  if (match === null) return this.goto(-1, false);
  this.goto(this.queue.indexOf(match[1]), false);
}