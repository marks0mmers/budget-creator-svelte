<script lang="ts">
    import CircleButton from "../shared/CircleButton.svelte";
    import type { ExpenseSource } from "../../models/expense-source";
    import { expenseSourceStore } from "../../store/expense-source.store";
    import Modal from "../modal/Modal.svelte";
    import ModalHeader from "../modal/ModalHeader.svelte";
    import ExpenseSourceForm from "./forms/ExpenseSourceForm.svelte";
    import { incomeSourceStore } from "../../store/income-source.store";

    export let index: number;
    export let budgetId: number;
    export let expenseSource: ExpenseSource;

    const { selectedIncomeSourceId } = incomeSourceStore;
    const { selectedExpenseSourceId } = expenseSourceStore;

    let isEditing = false;
    let isMouseInExpenseSource = false;

    let styles: { [key: string]: string };
    $: styles = {
        background:
            $selectedExpenseSourceId === expenseSource.id
                ? "#ccedff"
                : index % 2 === 1
                ? "rgb(245, 245, 245)"
                : "white",
        padding: expenseSource.subCategory ? "60px" : "40px",
    };

    let cssVarStyles: string;
    $: cssVarStyles = Object.keys(styles)
        .map(key => `--${key}:${styles[key]}`)
        .join(";");

    const handleClick = (e: MouseEvent) => {
        if (e.ctrlKey) {
            selectedExpenseSourceId.set(undefined);
            selectedIncomeSourceId.set(undefined);
        } else {
            selectedExpenseSourceId.set(expenseSource.id);
            selectedIncomeSourceId.set(undefined);
        }
    };

    const editExpenseSourceClick = () => {
        isEditing = true;
    };

    const closeExpenseSourceModal = () => {
        isEditing = false;
    };

    const deleteClick = async () => {
        await expenseSourceStore.deleteExpenseSource(budgetId, expenseSource.id);
    };
</script>

<div
    id="expense-source-{expenseSource.id}"
    class="expense-source-view"
    style="{cssVarStyles}"
    on:click="{handleClick}"
    on:mouseenter="{() => (isMouseInExpenseSource = true)}"
    on:mouseleave="{() => (isMouseInExpenseSource = false)}"
>
    <span>{expenseSource.name}</span>
    <span class="red">${expenseSource.amount.toFixed(2)}</span>
    <CircleButton
        id="edit-expense-source"
        icon="edit"
        visible="{isMouseInExpenseSource}"
        on:click="{editExpenseSourceClick}"
    />
    <CircleButton
        id="delete-expense-source"
        icon="delete"
        visible="{isMouseInExpenseSource}"
        on:click="{deleteClick}"
    />
</div>

{#if isEditing}
    <Modal on:exitModal="{closeExpenseSourceModal}">
        <ModalHeader title="Expense Source Form" on:exitModal="{closeExpenseSourceModal}" />
        <ExpenseSourceForm
            initialValues="{expenseSource}"
            on:exitModal="{closeExpenseSourceModal}"
        />
    </Modal>
{/if}

<style lang="scss">
    .expense-source-view {
        display: grid;
        height: 20px;
        grid-template-columns: 1fr auto 20px 20px;
        border-bottom: 1px solid #fff0e1;
        grid-column-gap: 4px;
        background: var(--background);
        padding: 10px 10px 10px var(--padding);

        .red {
            font-weight: bold;
            color: rgb(196, 32, 32);
        }

        &:hover {
            background: rgb(240, 240, 240) !important;
        }
    }
</style>
