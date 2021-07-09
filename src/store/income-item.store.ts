import { writable } from "svelte/store";
import { UpsertIncomeItemContract, IncomeItem, IncomeItemContract } from "../models/income-item";
import { http } from "../util/fetch-utils";

const incomeItems = writable(new Map<number, IncomeItem>());

const getIncomeItems = async (budgetId: number) => {
    const res = await http(`/api/incomeItems?budgetId=${budgetId}`);
    const incomeItemContracts: IncomeItemContract[] = await res.json();
    incomeItems.set(new Map(incomeItemContracts.map(IncomeItem.fromContract).map(i => [i.id, i])));
};

const createIncomeItems = async (incomeItemContract: UpsertIncomeItemContract) => {
    const res = await http("/api/incomeItems", "POST", incomeItemContract);
    const incomeItem: IncomeItemContract = await res.json();
    incomeItems.update(oldIncomeItems =>
        oldIncomeItems.set(incomeItem.id, IncomeItem.fromContract(incomeItem)),
    );
};

const updateIncomeItems = async (
    incomeItemId: number,
    incomeItemContract: UpsertIncomeItemContract,
) => {
    const res = await http(`/api/incomeItems/${incomeItemId}`, "PUT", incomeItemContract);
    const incomeItem: IncomeItemContract = await res.json();
    incomeItems.update(oldIncomeItems =>
        oldIncomeItems.set(incomeItem.id, IncomeItem.fromContract(incomeItem)),
    );
};

const deleteIncomeItems = async (incomeItemId: number) => {
    const res = await http(`/api/incomeItems/${incomeItemId}`, "DELETE");
    const incomeItem: IncomeItemContract = await res.json();
    incomeItems.update(oldIncomeItems => {
        oldIncomeItems.delete(incomeItem.id);
        return oldIncomeItems;
    });
};

export const incomeItemStore = {
    incomeItems,
    getIncomeItems,
    createIncomeItems,
    updateIncomeItems,
    deleteIncomeItems,
};
