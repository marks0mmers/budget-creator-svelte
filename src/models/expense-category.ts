import { ExpenseSubCategory, ExpenseSubCategoryContract } from "./expense-sub-category";

export interface ExpenseCategoryContract {
    id: number;
    name: string;
    subCategories: ExpenseSubCategoryContract[];
}

export type UpsertExpenseCategoryContract = Omit<ExpenseCategoryContract, "id" | "subCategories">;

export interface ExpenseCategoryRecord extends Omit<ExpenseCategoryContract, "subCategories"> {
    subCategories: Map<number, ExpenseSubCategory>;
}

export class ExpenseCategory implements ExpenseCategoryRecord {
    id: number;
    name: string;
    subCategories: Map<number, ExpenseSubCategory>;

    private constructor(id: number, name: string, subCategories: Map<number, ExpenseSubCategory>) {
        this.id = id;
        this.name = name;
        this.subCategories = subCategories;
    }

    public static readonly fromContract = (e: ExpenseCategoryContract) =>
        new ExpenseCategory(
            e.id,
            e.name,
            e.subCategories.reduce(
                (map, e) => map.set(e.id, ExpenseSubCategory.fromContract(e)),
                new Map<number, ExpenseSubCategory>(),
            ),
        );
}
