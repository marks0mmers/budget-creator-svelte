<script lang="ts">
    import type { IncomeSource } from "../../models/income-source";
    import type { ExpenseSource } from "../../models/expense-source";
    import CircleButton from "../shared/CircleButton.svelte";
    import IncomeSourceView from "./IncomeSourceView.svelte";
    import IncomeSourceForm from "./forms/IncomeSourceForm.svelte";
    import Modal from "../modal/Modal.svelte";
    import ModalHeader from "../modal/ModalHeader.svelte";
    import { modalStore } from "../../store/modal.store";
    import ExpenseSourceForm from "./forms/ExpenseSourceForm.svelte";

    export let budgetId = 0;
    export let incomeSources = new Map<number, IncomeSource>();
    export let expenseSources = new Map<number, ExpenseSource>();

    let mouseInIncomeLabel = false;
    let incomeFormShowing = false;

    let mouseInExpenseLabel = false;

    let incomeSourceValues: IncomeSource[];
    $: incomeSourceValues = [...incomeSources.values()].sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    let expenseSourceValues: ExpenseSource[];
    $: expenseSourceValues = [...expenseSources.values()].sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    let incomeTotals: string;
    $: incomeTotals = incomeSourceValues.reduce((total, i) => total + i.amount, 0).toFixed(2);

    let expenseTotals: string;
    $: expenseTotals = expenseSourceValues.reduce((total, i) => total + i.amount, 0).toFixed(2);

    function openExpenseSourceModal() {
        modalStore.open("add-expense-source-modal");
    }

    function closeExpenseSourceModal() {
        modalStore.close("add-expense-source-modal");
    }
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
    <div id="income-sources-container">
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
        <span class="total">${incomeTotals}</span>
    </footer>

    <h3
        class="expense-sources-label"
        on:mouseenter="{() => (mouseInExpenseLabel = true)}"
        on:mouseleave="{() => (mouseInExpenseLabel = false)}"
    >
        Expense Sources
        <CircleButton
            id="add-expense-source"
            icon="add"
            visible="{mouseInExpenseLabel}"
            on:click="{openExpenseSourceModal}"
        />
    </h3>
    <div id="expense-sources-container"></div>
    <footer class="expense-total">
        <span>Total</span>
        <span class="total">${expenseTotals}</span>
    </footer>
</section>

<Modal id="add-expense-source-modal">
    <ModalHeader title="Expense Source Form" on:exitModal="{closeExpenseSourceModal}" />
    <ExpenseSourceForm on:exitModal="{closeExpenseSourceModal}" />
</Modal>

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
            grid-template-columns: 1fr auto;
            font-weight: normal;
            border-bottom: 1px solid lightgray;
        }

        .expense-sources-label {
            border-top: 1px solid lightgray;
        }

        .income-total,
        .expense-total {
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
    }
</style>
