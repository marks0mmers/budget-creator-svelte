import {writable} from "svelte/store";

interface Modal {
    id: string;
    open(): void;
    close(): void;
}

const modals = writable<Modal[]>([]);

const add = (modal: Modal) => modals.update(prev => [...prev, modal]);

const remove = (id: string) => modals.update(prev => prev.filter(m => m.id !== id));

const open = (id: string) => {
    const unsubscribe = modals.subscribe(val => {
        const modal = val.find(x => x.id === id);
        modal?.open();
    });
    unsubscribe();
}

const close = (id: string) => {
    const unsubscribe = modals.subscribe(val => {
        const modal = val.find(x => x.id === id);
        modal?.close();
    });
    unsubscribe();
}

export const modalStore = {
    modals,
    add,
    remove,
    open,
    close,
}
