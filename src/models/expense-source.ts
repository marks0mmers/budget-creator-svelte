import {ExpenseCategory, ExpenseCategoryContract} from "./expense-category";
import {ExpenseSubCategory, ExpenseSubCategoryContract} from "./expense-sub-category";

export interface ExpenseSourceContract {
    id: number;
    name: string;
    amount: number;
    category: ExpenseCategoryContract;
    subCategory?: ExpenseSubCategoryContract;
}

export interface UpsertExpenseSourceContract extends Omit<ExpenseSourceContract, "id" | "category" | "subCategory"> {
    categoryId: number;
    subCategoryId: number;
}

export interface ExpenseSourceRecord extends Omit<ExpenseSourceContract, "category" | "subCategory"> {
    category: ExpenseCategory;
    subCategory?: ExpenseSubCategory;
}

export class ExpenseSource implements ExpenseSourceRecord {
    id: number;
    name: string;
    amount: number;
    category: ExpenseCategory;
    subCategory?: ExpenseSubCategory;

    private constructor(id: number, name: string, amount: number, category: ExpenseCategory, subCategory?: ExpenseSubCategory) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.category = category;
        this.subCategory = subCategory;
    }

    public static readonly fromContract = (e: ExpenseSourceContract) => new ExpenseSource(
        e.id,
        e.name,
        e.amount,
        ExpenseCategory.fromContract(e.category),
        e.subCategory && ExpenseSubCategory.fromContract(e.subCategory),
    )
}
