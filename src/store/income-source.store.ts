import type { UpsertIncomeSourceContract } from "../models/income-source";
import { http } from "../util/fetch-utils";
import type { BudgetContract } from "../models/budget";
import { budgetStore } from "./budget.store";
import { Budget } from "../models/budget";
import { derived, writable } from "svelte/store";

const selectedIncomeSourceId = writable<number | undefined>(undefined);
const selectedIncomeSource = derived(
    [selectedIncomeSourceId, budgetStore.selectedBudget],
    ([$selectedIncomeSourceId, $budget]) =>
        $selectedIncomeSourceId ? $budget?.incomeSources.get($selectedIncomeSourceId) : undefined,
);

const createIncomeSource = async (
    budgetId: number,
    incomeSourceContract: UpsertIncomeSourceContract,
) => {
    const res = await http(`/api/budgets/${budgetId}/incomeSource`, "POST", incomeSourceContract);
    const budget: BudgetContract = await res.json();
    budgetStore.budgets.update(budgets => budgets.set(budget.id, Budget.fromContract(budget)));
};

const updateIncomeSource = async (
    budgetId: number,
    incomeSourceId: number,
    incomeSourceContract: UpsertIncomeSourceContract,
) => {
    const res = await http(
        `/api/budgets/${budgetId}/incomeSource/${incomeSourceId}`,
        "PUT",
        incomeSourceContract,
    );
    const budget: BudgetContract = await res.json();
    budgetStore.budgets.update(budgets => budgets.set(budget.id, Budget.fromContract(budget)));
};

const deleteIncomeSource = async (budgetId: number, incomeSourceId: number) => {
    const res = await http(`/api/budgets/${budgetId}/incomeSource/${incomeSourceId}`, "DELETE");
    const budget: BudgetContract = await res.json();
    budgetStore.budgets.update(budgets => budgets.set(budget.id, Budget.fromContract(budget)));
};

export const incomeSourceStore = {
    selectedIncomeSourceId,
    selectedIncomeSource,
    createIncomeSource,
    updateIncomeSource,
    deleteIncomeSource,
};
