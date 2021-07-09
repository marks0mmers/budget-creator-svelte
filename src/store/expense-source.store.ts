import type { UpsertExpenseSourceContract } from "../models/expense-source";
import { http } from "../util/fetch-utils";
import type { BudgetContract } from "../models/budget";
import { budgetStore } from "./budget.store";
import { Budget } from "../models/budget";
import { writable } from "svelte/store";

const selectedExpenseSourceId = writable<number | undefined>(undefined);

const createExpenseSource = async (
    budgetId: number,
    expenseSourceContract: UpsertExpenseSourceContract,
) => {
    const body = {
        ...expenseSourceContract,
        subCategoryId: expenseSourceContract.subCategoryId || null,
    };
    const res = await http(`/api/budgets/${budgetId}/expenseSource`, "POST", body);
    const budget: BudgetContract = await res.json();
    budgetStore.budgets.update(budgets => budgets.set(budget.id, Budget.fromContract(budget)));
};

const updateExpenseSource = async (
    budgetId: number,
    expenseSourceId: number,
    expenseSourceContract: UpsertExpenseSourceContract,
) => {
    const body = {
        ...expenseSourceContract,
        subCategoryId: expenseSourceContract.subCategoryId || null,
    };
    const res = await http(
        `/api/budgets/${budgetId}/expenseSource/${expenseSourceId}`,
        "PUT",
        body,
    );
    const budget: BudgetContract = await res.json();
    budgetStore.budgets.update(budgets => budgets.set(budget.id, Budget.fromContract(budget)));
};

const deleteExpenseSource = async (budgetId: number, expenseSourceId: number) => {
    const res = await http(`/api/budgets/${budgetId}/expenseSource/${expenseSourceId}`, "DELETE");
    const budget: BudgetContract = await res.json();
    budgetStore.budgets.update(budgets => budgets.set(budget.id, Budget.fromContract(budget)));
};

export const expenseSourceStore = {
    selectedExpenseSourceId,
    createExpenseSource,
    updateExpenseSource,
    deleteExpenseSource,
};
