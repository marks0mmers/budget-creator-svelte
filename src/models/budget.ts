import { IncomeSource, IncomeSourceContract } from "./income-source";
import { ExpenseSource, ExpenseSourceContract } from "./expense-source";

export interface BudgetContract {
    id: number;
    title: string;
    primaryUserId: number;
    incomeSources: IncomeSourceContract[];
    expenseSources: ExpenseSourceContract[];
}

export type UpsertBudgetContract = Pick<BudgetContract, "title">;

interface BudgetRecordContract extends Omit<BudgetContract, "incomeSources" | "expenseSources"> {
    incomeSources: Map<number, IncomeSource>;
    expenseSources: Map<number, ExpenseSource>;
}

export class Budget implements BudgetRecordContract {
    id: number;
    title: string;
    primaryUserId: number;
    incomeSources: Map<number, IncomeSource>;
    expenseSources: Map<number, ExpenseSource>;

    private constructor(
        id: number,
        title: string,
        primaryUserId: number,
        incomeSources: Map<number, IncomeSource>,
        expenseSources: Map<number, ExpenseSource>,
    ) {
        this.id = id;
        this.title = title;
        this.primaryUserId = primaryUserId;
        this.incomeSources = incomeSources;
        this.expenseSources = expenseSources;
    }

    public static readonly fromContract = (c: BudgetContract) =>
        new Budget(
            c.id,
            c.title,
            c.primaryUserId,
            c.incomeSources.reduce(
                (map, i) => map.set(i.id, IncomeSource.fromContract(i)),
                new Map<number, IncomeSource>(),
            ),
            c.expenseSources.reduce(
                (map, e) => map.set(e.id, ExpenseSource.fromContract(e)),
                new Map<number, ExpenseSource>(),
            ),
        );
}
