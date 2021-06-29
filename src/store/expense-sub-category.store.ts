import type { UpsertExpenseSubCategoryContract } from "../models/expense-sub-category";
import { http } from "../util/fetch-utils";
import type { ExpenseCategoryContract } from "../models/expense-category";
import { expenseCategoryStore } from "./expense-category.store";
import { ExpenseCategory } from "../models/expense-category";
import { writable } from "svelte/store";

const selectedSubCategoryId = writable<number | undefined>(undefined);

const createExpenseSubCategory = async (
    categoryId: number,
    subCategoryContract: UpsertExpenseSubCategoryContract,
) => {
    const res = await http(
        `/api/expenseCategories/${categoryId}/expenseSubCategory`,
        "POST",
        subCategoryContract,
    );
    const expenseCategory: ExpenseCategoryContract = await res.json();
    expenseCategoryStore.expenseCategories.update(expenseCategories =>
        expenseCategories.set(expenseCategory.id, ExpenseCategory.fromContract(expenseCategory)),
    );
};

const updateExpenseSubCategory = async (
    categoryId: number,
    subCategoryId: number,
    subCategoryContract: UpsertExpenseSubCategoryContract,
) => {
    const res = await http(
        `/api/expenseCategories/${categoryId}/expenseSubCategory/${subCategoryId}`,
        "PUT",
        subCategoryContract,
    );
    const expenseCategory: ExpenseCategoryContract = await res.json();
    expenseCategoryStore.expenseCategories.update(expenseCategories =>
        expenseCategories.set(expenseCategory.id, ExpenseCategory.fromContract(expenseCategory)),
    );
};

const deleteExpenseSubCategory = async (categoryId: number, subCategoryId: number) => {
    const res = await http(
        `/api/expenseCategories/${categoryId}/expenseSubCategory/${subCategoryId}`,
        "DELETE",
    );
    const expenseCategory: ExpenseCategoryContract = await res.json();
    expenseCategoryStore.expenseCategories.update(expenseCategories =>
        expenseCategories.set(expenseCategory.id, ExpenseCategory.fromContract(expenseCategory)),
    );
};

export const expenseSubCategoryStore = {
    selectedSubCategoryId,
    createExpenseSubCategory,
    updateExpenseSubCategory,
    deleteExpenseSubCategory,
};
