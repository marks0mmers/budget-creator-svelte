export interface ExpenseSubCategoryContract {
    id: number;
    name: string;
}

export type UpsertExpenseSubCategoryContract = Omit<
    ExpenseSubCategoryContract,
    "id"
>;

export class ExpenseSubCategory implements ExpenseSubCategoryContract {
    id: number;
    name: string;

    private constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    public static readonly fromContract = (c: ExpenseSubCategoryContract) =>
        new ExpenseSubCategory(c.id, c.name);
}
