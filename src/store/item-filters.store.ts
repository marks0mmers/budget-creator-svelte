import { writable } from "svelte/store";
import moment from "moment";

const dateFilter = writable(moment().set("date", 1));

const addMonthToFilter = () => {
    dateFilter.update(old => old.add(1, "month"));
};

const subtractMonthToFilter = () => {
    dateFilter.update(old => old.subtract(1, "month"));
};

export const itemFiltersStore = {
    dateFilter,
    addMonthToFilter,
    subtractMonthToFilter,
};
