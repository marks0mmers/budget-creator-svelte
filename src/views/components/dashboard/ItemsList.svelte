<script lang="ts">
    import moment from "moment";
    import type { ColDef, GridReadyEvent, SelectionChangedEvent, GridApi } from "ag-grid-community";
    import AgGridSvelte from "../../shared/AgGridSvelte.svelte";
    import { incomeSourceStore } from "../../../store/income-source.store";
    import HeaderDivider from "../../shared/header/HeaderDivider.svelte";
    import HeaderButton from "../../shared/header/HeaderButton.svelte";
    import Modal from "../../modal/Modal.svelte";
    import ModalHeader from "../../modal/ModalHeader.svelte";
    import IncomeItemForm from "../forms/IncomeItemForm.svelte";
    import { incomeItemStore } from "../../../store/income-item.store";
    import { IncomeItem } from "../../../models/income-item";
    import { onMount } from "svelte";
    import { budgetStore } from "../../../store/budget.store";
    import { expenseItemStore } from "../../../store/expense-item.store";
    import { ExpenseItem } from "../../../models/expense-item";
    import { expenseSourceStore } from "../../../store/expense-source.store";
    import ExpenseItemForm from "../forms/ExpenseItemForm.svelte";
    import { itemFiltersStore } from "../../../store/item-filters.store";
    import { expenseCategoryStore } from "../../../store/expense-category.store";
    import { expenseSubCategoryStore } from "../../../store/expense-sub-category.store";

    const { incomeItems } = incomeItemStore;
    const { expenseItems } = expenseItemStore;
    const { selectedIncomeSourceId } = incomeSourceStore;
    const { selectedExpenseSourceId } = expenseSourceStore;
    const { selectedCategory } = expenseCategoryStore;
    const { selectedSubCategory } = expenseSubCategoryStore;
    const { selectedBudgetId } = budgetStore;
    const { dateFilter } = itemFiltersStore;

    let incomeItemModalShowing = false;
    let expenseItemModalShowing = false;
    let selectedItem: IncomeItem | ExpenseItem | undefined;
    let gridApi: GridApi | undefined = undefined;

    let incomeItemValues: IncomeItem[];
    $: incomeItemValues = [...$incomeItems.values()];

    let expenseItemValues: ExpenseItem[];
    $: expenseItemValues = [...$expenseItems.values()];

    let data: (IncomeItem | ExpenseItem)[];
    $: data = [...incomeItemValues, ...expenseItemValues].filter(data => {
        const dateTransacted = moment(data.dateTransacted);
        return (
            dateTransacted.month() === $dateFilter.month() &&
            dateTransacted.year() === $dateFilter.year()
        );
    });

    $: totalRowData = [
        {
            name: "Total",
            amount: data.reduce((total, data) => {
                return total + (data instanceof IncomeItem ? data.amount : -data.amount);
            }, 0),
        },
    ];

    const updateFilter = (api?: GridApi, field?: string, value?: string) => {
        if (field && value) {
            api?.setFilterModel({
                ...(api?.getFilterModel() ?? {}),
                [field]: {
                    filterType: "text",
                    type: "equals",
                    filter: value,
                },
            });
        } else if (field) {
            api?.destroyFilter(field);
        }
    };

    $: if ($selectedCategory) {
        updateFilter(gridApi, "expenseCategoryName", $selectedCategory.name);
    } else {
        updateFilter(gridApi, "expenseCategoryName");
    }

    $: if ($selectedSubCategory) {
        updateFilter(gridApi, "expenseSubCategoryName", $selectedSubCategory.name);
    } else {
        updateFilter(gridApi, "expenseSubCategoryName");
    }

    const showIncomeItemModal = () => {
        incomeItemModalShowing = true;
    };

    const closeIncomeItemModal = () => {
        incomeItemModalShowing = false;
    };

    const showExpenseItemModal = () => {
        expenseItemModalShowing = true;
    };

    const closeExpenseItemModal = () => {
        expenseItemModalShowing = false;
    };

    const deleteItem = () => {
        if (selectedItem instanceof IncomeItem) {
            incomeItemStore.deleteIncomeItem(selectedItem.id);
        }
        if (selectedItem instanceof ExpenseItem) {
            expenseItemStore.deleteExpenseItems(selectedItem.id);
        }
        selectedItem = undefined;
    };

    const onGridReady = (event: CustomEvent<GridReadyEvent>) => {
        gridApi = event.detail.api;
    };

    const onSelectionChanged = (event: CustomEvent<SelectionChangedEvent>) => {
        selectedItem = event.detail.api.getSelectedRows()[0];
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
            field: "source",
            headerName: "Source",
            valueGetter: params =>
                params.data instanceof IncomeItem
                    ? params.data.incomeSourceName
                    : params.data instanceof ExpenseItem
                    ? params.data.expenseSourceName
                    : "",
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
        on:click="{showIncomeItemModal}"
    />
{/if}
{#if selectedItem && selectedItem instanceof IncomeItem}
    <HeaderDivider />
    <HeaderButton
        id="delete-income-item"
        text="Delete Income Item"
        icon="delete"
        on:click="{deleteItem}"
    />
    <HeaderButton
        id="edit-income-item"
        text="Edit Income Item"
        icon="edit"
        on:click="{showIncomeItemModal}"
    />
{/if}
{#if $selectedExpenseSourceId}
    <HeaderDivider />
    <HeaderButton
        id="add-expense-item"
        text="Add Expense Item"
        icon="add"
        on:click="{showExpenseItemModal}"
    />
{/if}
{#if selectedItem && selectedItem instanceof ExpenseItem}
    <HeaderDivider />
    <HeaderButton
        id="delete-expense-item"
        text="Delete Expense Item"
        icon="delete"
        on:click="{deleteItem}"
    />
    <HeaderButton
        id="edit-expense-item"
        text="Edit Expense Item"
        icon="edit"
        on:click="{showExpenseItemModal}"
    />
{/if}
<div class="items-list">
    <AgGridSvelte
        gridArea="items-grid"
        data="{data}"
        columnDefs="{colDefs}"
        pinnedBottomRowData="{totalRowData}"
        on:gridReady="{onGridReady}"
        on:selectionChanged="{onSelectionChanged}"
    />
</div>
{#if incomeItemModalShowing}
    <Modal on:exitModal="{closeIncomeItemModal}">
        <ModalHeader title="Income Item Form" on:exitModal="{closeIncomeItemModal}" />
        <IncomeItemForm
            on:exitModal="{closeIncomeItemModal}"
            incomeSourceId="{selectedItem?.id}"
            initialValues="{selectedItem instanceof IncomeItem
                ? {
                      name: selectedItem.name,
                      amount: selectedItem.amount,
                      dateTransacted: selectedItem.dateTransacted,
                      incomeSourceId: selectedItem.incomeSourceId,
                  }
                : undefined}"
        />
    </Modal>
{/if}
{#if expenseItemModalShowing}
    <Modal on:exitModal="{closeExpenseItemModal}">
        <ModalHeader title="Expense Item Form" on:exitModal="{closeExpenseItemModal}" />
        <ExpenseItemForm
            on:exitModal="{closeExpenseItemModal}"
            expenseItemId="{selectedItem?.id}"
            initialValues="{selectedItem instanceof ExpenseItem
                ? {
                      name: selectedItem.name,
                      amount: selectedItem.amount,
                      dateTransacted: selectedItem.dateTransacted,
                      expenseSourceId: selectedItem.expenseSourceId,
                  }
                : undefined}"
        />
    </Modal>
{/if}

<style lang="scss">
    .items-list {
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        height: 100%;
        grid-area: main;

        display: grid;
        grid-template-rows: 1fr;
        grid-template-areas: //"."
            "items-grid";
    }
</style>
