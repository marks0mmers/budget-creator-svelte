import { derived, writable } from "svelte/store";

const totalRequests = writable(0);
const shouldShow = derived(totalRequests, (total) => total > 0);

const show = () => totalRequests.update((num) => num + 1);
const hide = () => totalRequests.update((num) => num - 1);

export const loadingStore = {
    shouldShow,
    show,
    hide,
};
