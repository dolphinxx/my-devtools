import type {Emitter} from 'mitt';

declare global {
  interface Window {
    emitter: Emitter<EmitterEvent>;
  }
}
