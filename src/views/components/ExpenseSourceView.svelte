<script lang="ts">
    import CircleButton from "../shared/CircleButton.svelte";
    import type { ExpenseSource } from "../../models/expense-source";
    import { expenseSourceStore } from "../../store/expense-source.store";
    import Modal from "../modal/Modal.svelte";
    import ModalHeader from "../modal/ModalHeader.svelte";
    import ExpenseSourceForm from "./forms/ExpenseSourceForm.svelte";

    export let index: number;
    export let budgetId: number;
    export let expenseSource: ExpenseSource;

    let isMouseInExpenseSource = false;
    let isEditing = false;

    let styles: { [key: string]: string };
    $: styles = {
        background: index % 2 === 1 ? "rgb(245, 245, 245)" : "white",
        padding: expenseSource.subCategory ? "60px" : "40px",
    };

    let cssVarStyles: string;
    $: cssVarStyles = Object.keys(styles)
        .map(key => `--${key}:${styles[key]}`)
        .join(";");

    function editExpenseSourceClick() {
        isEditing = true;
    }

    function closeExpenseSourceModal() {
        isEditing = false;
    }

    async function deleteClick() {
        await expenseSourceStore.deleteExpenseSource(budgetId, expenseSource.id);
    }
</script>

<div
    id="expense-source-{expenseSource.id}"
    class="expense-source-view"
    style="{cssVarStyles}"
    on:mouseenter="{() => (isMouseInExpenseSource = true)}"
    on:mouseleave="{() => (isMouseInExpenseSource = false)}"
>
    <span>{expenseSource.name}</span>
    <span class="green">${expenseSource.amount.toFixed(2)}</span>
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
        grid-template-columns: 1fr auto 20px 20px;
        border-bottom: 1px solid #fff0e1;
        grid-column-gap: 4px;
        background: var(--background);
        padding: 10px 10px 10px var(--padding);

        .green {
            font-weight: bold;
            color: rgb(196, 32, 32);
        }

        &:hover {
            background: rgb(240, 240, 240) !important;
        }
    }
</style>
