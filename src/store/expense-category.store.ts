import { derived, writable } from "svelte/store";
import {
    ExpenseCategory,
    ExpenseCategoryContract,
    UpsertExpenseCategoryContract,
} from "../models/expense-category";
import { http } from "../util/fetch-utils";

const expenseCategories = writable(new Map<number, ExpenseCategory>());
const selectedCategoryId = writable<number | undefined>(undefined);

const selectedCategory = derived(
    [expenseCategories, selectedCategoryId],
    ([$expenseCategories, $selectedCategoryId]) =>
        $selectedCategoryId ? $expenseCategories.get($selectedCategoryId) : undefined,
);

const getExpenseCategories = async () => {
    const res = await http("/api/expenseCategories");
    const expenseCategoryContracts: ExpenseCategoryContract[] = await res.json();
    expenseCategories.set(
        new Map(expenseCategoryContracts.map(ExpenseCategory.fromContract).map((e) => [e.id, e])),
    );
};

const createExpenseCategory = async (expenseCategoryContract: UpsertExpenseCategoryContract) => {
    const res = await http("/api/expenseCategories", "POST", expenseCategoryContract);
    const expenseCategory: ExpenseCategoryContract = await res.json();
    expenseCategories.update((oldExpenseCategories) =>
        oldExpenseCategories.set(expenseCategory.id, ExpenseCategory.fromContract(expenseCategory)),
    );
};

const updateExpenseCategory = async (
    id: number,
    expenseCategoryContract: UpsertExpenseCategoryContract,
) => {
    const res = await http(`/api/expenseCategories/${id}`, "PUT", expenseCategoryContract);
    const expenseCategory: ExpenseCategoryContract = await res.json();
    expenseCategories.update((oldExpenseCategories) =>
        oldExpenseCategories.set(expenseCategory.id, ExpenseCategory.fromContract(expenseCategory)),
    );
};

const deleteExpenseCategory = async (id: number) => {
    const res = await http(`/api/expenseCategories/${id}`, "DELETE");
    const expenseCategory: ExpenseCategoryContract = await res.json();
    expenseCategories.update((oldExpenseCategories) => {
        oldExpenseCategories.delete(expenseCategory.id);
        return oldExpenseCategories;
    });
    selectedCategoryId.set(undefined);
};

export const expenseCategoryStore = {
    expenseCategories,
    selectedCategory,
    selectedCategoryId,
    getExpenseCategories,
    createExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
};
