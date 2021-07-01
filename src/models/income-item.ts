export interface IncomeItemContract {
    id: number;
    name: string;
    amount: number;
    dateTransacted: string;
    incomeSourceId: number;
    incomeSourceName: string;
}

export type UpsertIncomeItemContract = Pick<
    IncomeItemContract,
    "name" | "amount" | "dateTransacted" | "incomeSourceId"
>;

export class IncomeItem implements IncomeItemContract {
    id: number;
    name: string;
    amount: number;
    dateTransacted: string;
    incomeSourceId: number;
    incomeSourceName: string;

    private constructor(
        id: number,
        name: string,
        amount: number,
        dateTransacted: string,
        incomeSourceId: number,
        incomeSourceName: string,
    ) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.dateTransacted = dateTransacted;
        this.incomeSourceId = incomeSourceId;
        this.incomeSourceName = incomeSourceName;
    }

    public static readonly fromContract = (c: IncomeItemContract) =>
        new IncomeItem(
            c.id,
            c.name,
            c.amount,
            c.dateTransacted,
            c.incomeSourceId,
            c.incomeSourceName,
        );
}
