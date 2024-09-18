import mitt, { Emitter } from 'mitt';

export class EventEmitter<Events extends Record<string, unknown>> {
    protected emitter: Emitter<Events>;

    constructor() {
        this.emitter = mitt<Events>();
    }

    on<Key extends keyof Events>(type: Key, handler: (event: Events[Key]) => void) {
        this.emitter.on(type, handler);
    }

    off<Key extends keyof Events>(type: Key, handler: (event: Events[Key]) => void) {
        this.emitter.off(type, handler);
    }

    emit<Key extends keyof Events>(type: Key, event: Events[Key]) {
        this.emitter.emit(type, event);
    }
}

export default EventEmitter;