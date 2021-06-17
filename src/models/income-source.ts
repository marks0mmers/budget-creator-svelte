export interface IncomeSourceContract {
    id: number;
    name: string;
    amount: number;
}

export type UpsertIncomeSourceContract = Omit<IncomeSourceContract, "id">;

export class IncomeSource implements IncomeSourceContract {
    id: number;
    name: string;
    amount: number;


    private constructor(id: number, name: string, amount: number) {
        this.id = id;
        this.name = name;
        this.amount = amount;
    }

    public static readonly fromContract = (i: IncomeSourceContract) => new IncomeSource(
        i.id,
        i.name,
        i.amount,
    )
}
