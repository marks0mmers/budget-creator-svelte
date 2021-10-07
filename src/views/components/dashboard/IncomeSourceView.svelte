<script lang="ts">
    import type { IncomeSource } from "../../../models/income-source";
    import IncomeSourceForm from "../forms/IncomeSourceForm.svelte";
    import CircleButton from "../../shared/CircleButton.svelte";
    import { incomeSourceStore } from "../../../store/income-source.store";
    import { expenseSourceStore } from "../../../store/expense-source.store";
    import ProgressIndicator from "../../shared/ProgressIndicator.svelte";
    import { incomeItemStore } from "../../../store/income-item.store";
    import moment from "moment";
    import { itemFiltersStore } from "../../../store/item-filters.store";

    export let index: number;
    export let budgetId: number;
    export let incomeSource: IncomeSource;

    const { selectedIncomeSourceId } = incomeSourceStore;
    const { selectedExpenseSourceId } = expenseSourceStore;
    const { dateFilter } = itemFiltersStore;
    const { incomeItems } = incomeItemStore;

    let isEditing = false;
    let isMouseInIncomeSource = false;

    let background: string;
    $: background =
        $selectedIncomeSourceId === incomeSource.id
            ? "#ccedff"
            : index % 2 === 1
            ? "rgb(245, 245, 245)"
            : "white";

    let percentComplete: number;
    $: percentComplete =
        [...$incomeItems.values()]
            .filter(incomeItem => incomeItem.incomeSourceName === incomeSource.name)
            .filter(item => {
                const dateTransacted = moment(item.dateTransacted);
                return (
                    dateTransacted.month() === $dateFilter.month() &&
                    dateTransacted.year() === $dateFilter.year()
                );
            })
            .reduce((total, item) => total + item.amount, 0.0) / incomeSource.amount;

    const handleClick = (e: MouseEvent) => {
        if (e.ctrlKey) {
            selectedIncomeSourceId.set(undefined);
            selectedExpenseSourceId.set(undefined);
        } else {
            selectedIncomeSourceId.set(incomeSource.id);
            selectedExpenseSourceId.set(undefined);
        }
    };

    const deleteClick = async () => {
        await incomeSourceStore.deleteIncomeSource(budgetId, incomeSource.id);
    };
</script>

{#if !isEditing}
    <div
        id="income-source-{incomeSource.id}"
        class="income-source-view"
        style="background: {background}"
        on:click="{handleClick}"
        on:mouseenter="{() => (isMouseInIncomeSource = true)}"
        on:mouseleave="{() => (isMouseInIncomeSource = false)}"
    >
        <span>{incomeSource.name}</span>
        <ProgressIndicator percentComplete="{percentComplete}" />
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
        grid-template-columns: 1fr 50px 75px 20px 20px;
        grid-column-gap: 4px;

        span {
            display: inline-flex;
            align-items: center;
        }

        .green {
            font-weight: bold;
            color: rgb(32, 196, 32);
            justify-content: flex-end;
        }

        &:hover {
            background: rgb(240, 240, 240) !important;
        }
    }
</style>
