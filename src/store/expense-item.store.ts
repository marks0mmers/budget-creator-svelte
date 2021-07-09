import { writable } from "svelte/store";
import {
    ExpenseItem,
    ExpenseItemContract,
    UpsertExpenseItemContract,
} from "../models/expense-item";
import { http } from "../util/fetch-utils";
1;

const expenseItems = writable(new Map<number, ExpenseItem>());

const getExpenseItems = async (budgetId: number) => {
    const res = await http(`/api/expenseItems?budgetId=${budgetId}`);
    const expenseItemContracts: ExpenseItemContract[] = await res.json();
    expenseItems.set(
        new Map(expenseItemContracts.map(ExpenseItem.fromContract).map(e => [e.id, e])),
    );
};

const createExpenseItems = async (expenseItemContract: UpsertExpenseItemContract) => {
    const res = await http("/api/expenseItems", "POST", expenseItemContract);
    const expenseItem: ExpenseItemContract = await res.json();
    expenseItems.update(oldExpenseItems =>
        oldExpenseItems.set(expenseItem.id, ExpenseItem.fromContract(expenseItem)),
    );
};

const updateExpenseItems = async (
    expenseItemId: number,
    expenseItemContract: UpsertExpenseItemContract,
) => {
    const res = await http(`/api/expenseItems/${expenseItemId}`, "PUT", expenseItemContract);
    const expenseItem: ExpenseItemContract = await res.json();
    expenseItems.update(oldExpenseItems =>
        oldExpenseItems.set(expenseItem.id, ExpenseItem.fromContract(expenseItem)),
    );
};

const deleteExpenseItems = async (expenseItemId: number) => {
    const res = await http(`/api/expenseItems/${expenseItemId}`, "DELETE");
    const expenseItem: ExpenseItemContract = await res.json();
    expenseItems.update(oldExpenseItems => {
        oldExpenseItems.delete(expenseItem.id);
        return oldExpenseItems;
    });
};

export const expenseItemStore = {
    expenseItems,
    getExpenseItems,
    createExpenseItems,
    updateExpenseItems,
    deleteExpenseItems,
};
