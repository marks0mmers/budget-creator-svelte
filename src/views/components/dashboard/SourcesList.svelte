<script lang="ts">
    import type { IncomeSource } from "../../../models/income-source";
    import type { ExpenseSource } from "../../../models/expense-source";
    import CircleButton from "../../shared/CircleButton.svelte";
    import IncomeSourceView from "./IncomeSourceView.svelte";
    import IncomeSourceForm from "../forms/IncomeSourceForm.svelte";
    import Modal from "../../modal/Modal.svelte";
    import ModalHeader from "../../modal/ModalHeader.svelte";
    import ExpenseSourceForm from "../forms/ExpenseSourceForm.svelte";
    import ExpenseSourcesTree from "./ExpenseSourcesTree.svelte";
    import { ExpenseSourceTree } from "../../models/expense-source-tree";

    export let budgetId: number;
    export let incomeSources: Map<number, IncomeSource>;
    export let expenseSources: Map<number, ExpenseSource>;

    let mouseInIncomeLabel = false;
    let incomeFormShowing = false;
    let expenseFormShowing = false;
    let mouseInExpenseLabel = false;

    let incomeSourceValues: IncomeSource[];
    $: incomeSourceValues = [...incomeSources.values()].sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    let expenseSourceTree: ExpenseSourceTree;
    $: expenseSourceTree = new ExpenseSourceTree(expenseSources);

    let incomeTotals: number;
    $: incomeTotals = incomeSourceValues.reduce((total, i) => total + i.amount, 0);

    let expenseTotals: number;
    $: expenseTotals = [...expenseSources.values()].reduce((total, i) => total + i.amount, 0);

    let grandTotal: number;
    $: grandTotal = incomeTotals - expenseTotals;

    const openExpenseSourceModal = () => {
        expenseFormShowing = true;
    };

    const closeExpenseSourceModal = () => {
        expenseFormShowing = false;
    };

    const treeUpdate = (e: CustomEvent<ExpenseSourceTree>) => {
        expenseSourceTree = e.detail;
    };
</script>

<section class="sources">
    <h3
        class="income-sources-label"
        on:mouseenter="{() => (mouseInIncomeLabel = true)}"
        on:mouseleave="{() => (mouseInIncomeLabel = false)}"
    >
        Income Sources
        <CircleButton
            id="add-income-source"
            icon="add"
            visible="{mouseInIncomeLabel}"
            on:click="{() => (incomeFormShowing = true)}"
        />
    </h3>
    <div class="income-sources-container">
        {#each incomeSourceValues as incomeSource, index}
            <IncomeSourceView index="{index}" budgetId="{budgetId}" incomeSource="{incomeSource}" />
        {/each}
        {#if incomeFormShowing}
            <IncomeSourceForm
                budgetId="{budgetId}"
                on:hideForm="{() => (incomeFormShowing = false)}"
            />
        {/if}
    </div>
    <footer class="income-total">
        <span>Total</span>
        <span class="total">${incomeTotals.toFixed(2)}</span>
    </footer>

    <h3
        class="expense-sources-label"
        on:mouseenter="{() => (mouseInExpenseLabel = true)}"
        on:mouseleave="{() => (mouseInExpenseLabel = false)}"
    >
        Expense Sources
        <CircleButton
            id="expand-tree"
            icon="unfold_more"
            visible="{mouseInExpenseLabel}"
            on:click="{() => (expenseSourceTree = expenseSourceTree.expandAll())}"
        />
        <CircleButton
            id="collapse-tree"
            icon="unfold_less"
            visible="{mouseInExpenseLabel}"
            on:click="{() => (expenseSourceTree = expenseSourceTree.collapseAll())}"
        />
        <CircleButton
            id="add-expense-source"
            icon="add"
            visible="{mouseInExpenseLabel}"
            on:click="{openExpenseSourceModal}"
        />
    </h3>
    <ExpenseSourcesTree
        budgetId="{budgetId}"
        expenseSourceTree="{expenseSourceTree}"
        on:treeUpdate="{treeUpdate}"
    />
    <footer class="expense-total">
        <span>Total</span>
        <span class="total">${expenseTotals.toFixed(2)}</span>
    </footer>
    <footer class="grand-total">
        <span>Grand Total</span>
        <span class="total" class:red="{grandTotal < 0}" class:green="{grandTotal > 0}"
            >${grandTotal.toFixed(2)}</span
        >
    </footer>
</section>

{#if expenseFormShowing}
    <Modal on:exitModal="{closeExpenseSourceModal}">
        <ModalHeader title="Expense Source Form" on:exitModal="{closeExpenseSourceModal}" />
        <ExpenseSourceForm on:exitModal="{closeExpenseSourceModal}" />
    </Modal>
{/if}

<style lang="scss">
    .sources {
        background: white;
        grid-area: income-sources;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        display: grid;
        grid-template-rows: auto 1fr auto auto 3fr auto;

        .income-sources-label,
        .expense-sources-label {
            padding: 10px;
            display: grid;
            font-weight: normal;
            border-bottom: 1px solid lightgray;
        }

        .income-sources-label {
            grid-template-columns: 1fr auto;
        }

        .expense-sources-label {
            grid-template-columns: 1fr auto auto auto;
            column-gap: 5px;
            border-top: 1px solid lightgray;
        }

        .income-sources-container {
            overflow-y: scroll;
        }

        .income-total,
        .expense-total,
        .grand-total {
            padding: 10px;
            display: grid;
            grid-template-columns: 1fr auto 40px;
            grid-column-gap: 5px;
            border-top: 1px solid lightgray;
        }

        .income-total {
            .total {
                font-weight: bold;
                color: rgb(32, 196, 32);
            }
        }

        .expense-total {
            .total {
                font-weight: bold;
                color: rgb(196, 32, 32);
            }
        }

        .grand-total {
            .total {
                font-weight: bold;
            }

            .green {
                color: rgb(32, 196, 32);
            }

            .red {
                color: rgb(196, 32, 32);
            }
        }
    }
</style>
