<script lang="ts">
    import type { ColDef } from "ag-grid-community";
    import AgGridSvelte from "../shared/AgGridSvelte.svelte";
    import { incomeSourceStore } from "../../store/income-source.store";
    import HeaderDivider from "../shared/header/HeaderDivider.svelte";
    import HeaderButton from "../shared/header/HeaderButton.svelte";
    import Modal from "../modal/Modal.svelte";
    import ModalHeader from "../modal/ModalHeader.svelte";
    import IncomeItemForm from "./forms/IncomeItemForm.svelte";
    import { incomeItemStore } from "../../store/income-item.store";
    import { IncomeItem } from "../../models/income-item";
    import { onMount } from "svelte";
    import { budgetStore } from "../../store/budget.store";
    import { expenseItemStore } from "../../store/expense-item.store";
    import { ExpenseItem } from "../../models/expense-item";
    import { expenseSourceStore } from "../../store/expense-source.store";
    import ExpenseItemForm from "./forms/ExpenseItemForm.svelte";

    const { incomeItems } = incomeItemStore;
    const { expenseItems } = expenseItemStore;
    const { selectedIncomeSourceId } = incomeSourceStore;
    const { selectedExpenseSourceId } = expenseSourceStore;
    const { selectedBudgetId } = budgetStore;

    let incomeItemModalShowing = false;
    let expenseItemModalShowing = false;

    let incomeItemValues: IncomeItem[];
    $: incomeItemValues = [...$incomeItems.values()];

    let expenseItemValues: ExpenseItem[];
    $: expenseItemValues = [...$expenseItems.values()];

    let data: (IncomeItem | ExpenseItem)[];
    $: data = [...incomeItemValues, ...expenseItemValues];

    $: totalRowData = [
        {
            name: "Total",
            amount: data.reduce((total, data) => {
                return total + (data instanceof IncomeItem ? data.amount : -data.amount);
            }, 0),
        },
    ];

    const addIncomeItemClick = () => {
        incomeItemModalShowing = true;
    };

    const closeIncomeItemModal = () => {
        incomeItemModalShowing = false;
    };

    const addExpenseItemClick = () => {
        expenseItemModalShowing = true;
    };

    const closeExpenseItemModal = () => {
        expenseItemModalShowing = false;
    };

    onMount(async () => {
        if ($selectedBudgetId) {
            await incomeItemStore.getIncomeItems($selectedBudgetId);
            await expenseItemStore.getExpenseItems($selectedBudgetId);
        }
    });

    const colDefs: ColDef[] = [
        {
            field: "name",
            headerName: "Name",
            minWidth: 150,
            pinnedRowCellRenderer: "CustomTotalRowRenderer",
            pinnedRowCellRendererParams: {
                style: { fontWeight: "bold" },
            },
        },
        {
            field: "expenseCategoryName",
            headerName: "Category",
            minWidth: 150,
        },
        {
            field: "expenseSubCategoryName",
            headerName: "Sub-Category",
            minWidth: 150,
        },
        {
            field: "amount",
            headerName: "Amount ($)",
            minWidth: 150,
            valueFormatter: params => `$${params.value.toFixed(2)}`,
            cellStyle: params => {
                if (params.data instanceof IncomeItem) {
                    return { color: "rgb(32, 196, 32)" };
                }
                if (params.data instanceof ExpenseItem) {
                    return { color: "rgb(196, 32, 32)" };
                }
            },
            pinnedRowCellRenderer: "CustomTotalRowRenderer",
            pinnedRowCellRendererParams: (params: any) => ({
                style: {
                    fontWeight: "bold",
                    color: params.value > 0 ? "rgb(32, 196, 32)" : "rgb(196, 32, 32)",
                },
            }),
        },
        {
            field: "dateTransacted",
            headerName: "Date Transacted",
            minWidth: 150,
        },
    ];
</script>

{#if $selectedIncomeSourceId}
    <HeaderDivider />
    <HeaderButton
        id="add-income-item"
        text="Add Income Item"
        icon="add"
        on:click="{addIncomeItemClick}"
    />
{/if}
{#if $selectedExpenseSourceId}
    <HeaderDivider />
    <HeaderButton
        id="add-expense-item"
        text="Add Expense Item"
        icon="add"
        on:click="{addExpenseItemClick}"
    />
{/if}
<div class="items-list">
    <AgGridSvelte
        gridArea="items-grid"
        data="{data}"
        columnDefs="{colDefs}"
        pinnedBottomRowData="{totalRowData}"
    />
</div>
{#if incomeItemModalShowing}
    <Modal on:exitModal="{closeIncomeItemModal}">
        <ModalHeader title="Income Item Form" on:exitModal="{closeIncomeItemModal}" />
        <IncomeItemForm on:exitModal="{closeIncomeItemModal}" />
    </Modal>
{/if}
{#if expenseItemModalShowing}
    <Modal on:exitModal="{closeExpenseItemModal}">
        <ModalHeader title="Expense Item Form" on:exitModal="{closeExpenseItemModal}" />
        <ExpenseItemForm on:exitModal="{closeExpenseItemModal}" />
    </Modal>
{/if}

<style lang="scss">
    .items-list {
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        height: 100%;
        grid-area: items;

        display: grid;
        grid-template-rows: 1fr;
        grid-template-areas: //"."
            "items-grid";
    }
</style>
