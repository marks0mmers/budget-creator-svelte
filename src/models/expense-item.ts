export interface ExpenseItemContract {
    id: number;
    name: string;
    amount: number;
    dateTransacted: string;
    expenseSourceId: number;
    expenseSourceName: string;
    expenseCategoryName: string;
    expenseSubCategoryName?: string;
}

export type UpsertExpenseItemContract = Pick<
    ExpenseItemContract,
    "name" | "amount" | "dateTransacted" | "expenseSourceId"
>;

export class ExpenseItem implements ExpenseItemContract {
    id: number;
    name: string;
    amount: number;
    dateTransacted: string;
    expenseSourceId: number;
    expenseSourceName: string;
    expenseCategoryName: string;
    expenseSubCategoryName?: string;

    private constructor(
        id: number,
        name: string,
        amount: number,
        dateTransacted: string,
        expenseSourceId: number,
        expenseSourceName: string,
        expenseCategoryName: string,
        expenseSubCategoryName?: string,
    ) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.dateTransacted = dateTransacted;
        this.expenseSourceId = expenseSourceId;
        this.expenseSourceName = expenseSourceName;
        this.expenseCategoryName = expenseCategoryName;
        this.expenseSubCategoryName = expenseSubCategoryName;
    }

    public static readonly fromContract = (c: ExpenseItemContract) =>
        new ExpenseItem(
            c.id,
            c.name,
            c.amount,
            c.dateTransacted,
            c.expenseSourceId,
            c.expenseSourceName,
            c.expenseCategoryName,
            c.expenseSubCategoryName,
        );
}
