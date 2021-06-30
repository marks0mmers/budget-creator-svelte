<script lang="ts">
    import { budgetStore } from "../../store/budget.store";
    import Categories from "./categories/Categories.svelte";
    import SourcesList from "./SourcesList.svelte";
    import AgGridSvelte from "../shared/AgGridSvelte.svelte";

    const { selectedBudget } = budgetStore;
</script>

<main class="budget-dashboard">
    {#if $selectedBudget}
        <SourcesList
            budgetId="{$selectedBudget.id}"
            incomeSources="{$selectedBudget.incomeSources}"
            expenseSources="{$selectedBudget.expenseSources}"
        />
        <Categories />
        <AgGridSvelte
            gridArea="items"
            data="{[]}"
            columnDefs="{[
                {
                    field: 'name',
                    headerName: 'Name',
                },
                {
                    field: 'amount',
                    headerName: 'Amount ($)',
                },
            ]}"
        />
    {/if}
</main>

<style lang="scss">
    .budget-dashboard {
        height: calc(100% - 100px);
        background: rgb(250, 250, 250);
        padding: 20px;
        display: grid;
        row-gap: 10px;
        column-gap: 10px;
        grid-template-rows: auto 1fr;
        grid-template-columns: 1fr 3fr;
        grid-template-areas:
            "income-sources categories"
            "income-sources items";
    }
</style>
