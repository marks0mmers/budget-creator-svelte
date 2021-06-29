import { Budget, BudgetContract, CreateBudgetContract } from "../models/budget";
import { derived, writable } from "svelte/store";
import { http } from "../util/fetch-utils";

const budgets = writable(new Map<number, Budget>());
const selectedBudgetId = writable<number | undefined>(
    Number(localStorage.getItem("selectedBudget")) || undefined,
);

const selectedBudget = derived([budgets, selectedBudgetId], ([$budgets, $selectedBudgetId]) =>
    $selectedBudgetId ? $budgets.get($selectedBudgetId) : undefined,
);

selectedBudgetId.subscribe(budgetId =>
    localStorage.setItem("selectedBudget", budgetId?.toString() ?? ""),
);

const getBudgets = async () => {
    const res = await http("/api/budgets");
    const budgetContracts: BudgetContract[] = await res.json();
    budgets.set(new Map(budgetContracts.map(Budget.fromContract).map(b => [b.id, b])));
};

const createBudget = async (budgetContract: CreateBudgetContract) => {
    const res = await http("/api/budgets", "POST", budgetContract);
    const budget: BudgetContract = await res.json();
    budgets.update(oldBudgets => oldBudgets.set(budget.id, Budget.fromContract(budget)));
};

const deleteBudget = async (budgetId: number) => {
    const res = await http(`/api/budgets/${budgetId}`, "DELETE");
    const budget: BudgetContract = await res.json();
    selectedBudgetId.set(undefined);
    budgets.update(oldBudgets => {
        oldBudgets.delete(budget.id);
        return oldBudgets;
    });
};

export const budgetStore = {
    budgets,
    selectedBudgetId,
    selectedBudget,
    getBudgets,
    createBudget,
    deleteBudget,
};
