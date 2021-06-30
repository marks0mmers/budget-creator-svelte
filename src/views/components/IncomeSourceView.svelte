<script lang="ts">
    import type { IncomeSource } from "../../models/income-source";
    import IncomeSourceForm from "./forms/IncomeSourceForm.svelte";
    import CircleButton from "../shared/CircleButton.svelte";
    import { incomeSourceStore } from "../../store/income-source.store";

    export let index: number;
    export let budgetId: number;
    export let incomeSource: IncomeSource;

    let isEditing = false;
    let isMouseInIncomeSource = false;

    const deleteClick = async () => {
        await incomeSourceStore.deleteIncomeSource(budgetId, incomeSource.id);
    };
</script>

{#if !isEditing}
    <div
        id="income-source-{incomeSource.id}"
        class="income-source-view"
        style="background: {index % 2 === 1 ? 'rgb(245, 245, 245)' : 'white'}"
        on:mouseenter="{() => (isMouseInIncomeSource = true)}"
        on:mouseleave="{() => (isMouseInIncomeSource = false)}"
    >
        <span>{incomeSource.name}</span>
        <span class="green">${incomeSource.amount.toFixed(2)}</span>
        <CircleButton
            id="edit-income-source"
            icon="edit"
            visible="{isMouseInIncomeSource}"
            on:click="{() => (isEditing = true)}"
        />
        <CircleButton
            id="delete-income-source"
            icon="delete"
            visible="{isMouseInIncomeSource}"
            on:click="{deleteClick}"
        />
    </div>
{:else}
    <IncomeSourceForm
        budgetId="{budgetId}"
        incomeSourceId="{incomeSource.id}"
        initialValues="{{
            name: incomeSource.name,
            amount: incomeSource.amount,
        }}"
        on:hideForm="{() => (isEditing = false)}"
    />
{/if}

<style lang="scss">
    .income-source-view {
        padding: 10px;
        height: 20px;
        display: grid;
        grid-template-columns: 1fr auto 20px 20px;
        grid-column-gap: 4px;

        .green {
            font-weight: bold;
            color: rgb(32, 196, 32);
        }

        &:hover {
            background: rgb(240, 240, 240) !important;
        }
    }
</style>
